import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { client } from "../lib/openai.js";
import {
  qdrant,
  Trivago_COLLECTION,
  EMBEDDING_DIM,
  EMBEDDING_MODEL,
} from "../lib/qdrant.js";

const CSV_PATH = "data/trivago20260918.csv";
const BATCH_SIZE = 100;

// 將真實 CSV 欄位轉化為富含語意的文字供 OpenAI 生成向量
function rowToText(row) {
  return [
    `飯店名稱: ${row.hotel_name || "未知"}`,
    `城市: ${row.city || "未知"}`,
    `國家: ${row.country || ""}`,
    `星級: ${row.star_rating || "暫無"}星`,
    `用戶評分: ${row.user_rating || "暫無"}分`,
    `位置資訊: ${row.distance_info || ""}`,
    `亮點特色: ${row.highlights || ""}`
  ]
    .filter((text) => text && !text.includes("undefined"))
    .join(" | ");
}

async function recreateCollection() {
  const exists = await qdrant.collectionExists(Trivago_COLLECTION);
  if (exists.exists) {
    await qdrant.deleteCollection(Trivago_COLLECTION);
  }
  await qdrant.createCollection(Trivago_COLLECTION, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
}

async function embedBatch(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// 安全轉換數字的輔助函式，避免產生 NaN 導致 Qdrant 報錯
function safeParseInt(val) {
  if (!val || val.trim() === "") return null;
  const parsed = parseInt(val, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function safeParseFloat(val) {
  if (!val || val.trim() === "") return null;
  const parsed = parseFloat(val);
  return Number.isNaN(parsed) ? null : parsed;
}

async function main() {
  const csv = await readFile(CSV_PATH, "utf8");
  // columns: true 會自動將 CSV 的第一行當作物件的 key
  const rows = parse(csv, { columns: true, skip_empty_lines: true, bom: true });
  console.log(`讀到 ${rows.length} 筆資料`);

  await recreateCollection();
  console.log(`已建立 collection: ${Trivago_COLLECTION}`);

  let processed = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const texts = batch.map(rowToText);
    const vectors = await embedBatch(texts);

    const points = batch.map((row, idx) => ({
      id: i + idx + 1, 
      vector: vectors[idx],
      // 這裡的 key 名稱全部完美對齊 CSV 標頭字串
      payload: {
        advertiser_id: row.advertiser_id || null,
        advertiser_name: row.advertiser_name || null,
        city: row.city || null,
        country: row.country || null,
        hotel_id: row.hotel_id || null,
        hotel_name: row.hotel_name || null,
        highlights: row.highlights || null,
        distance_info: row.distance_info || null,
        arrival: row.arrival || null,
        departure: row.departure || null,
        // 使用安全防錯轉換，將空字串轉為 null，非空字串轉為正確的數字型態
        star_rating: safeParseInt(row.star_rating),
        review_count: safeParseInt(row.review_count),
        user_rating: safeParseFloat(row.user_rating),
        construction_year: safeParseInt(row.construction_year),
        forecasted_price_amount: safeParseInt(row.forecasted_price_amount),
        forecasted_price_eurocents: safeParseInt(row.forecasted_price_eurocents),
        longitude: safeParseFloat(row.longitude),
        latitude: safeParseFloat(row.latitude),
      },
    }));

    await qdrant.upsert(Trivago_COLLECTION, { wait: true, points });
    processed += batch.length;
    console.log(`進度：${processed} / ${rows.length}`);
  }

  console.log("全部資料已成功且精準對齊地灌入 Qdrant 資料庫！");
}

main().catch((err) => {
  console.error("執行過程中發生錯誤:", err);
  process.exit(1);
});