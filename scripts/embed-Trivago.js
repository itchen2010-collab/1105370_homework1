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

// 【修正重點 1】調整為 Trivago 飯店資料的欄位組合，以利轉化為富含語意特徵的文字
function rowToText(row) {
  return [
    `飯店名稱: ${row.hotel_name}`,
    `城市: ${row.city}`,
    `星級: ${row.star_rating}`,
    `評分: ${row.user_rating}`,
    `位置資訊: ${row.distance_info}`,
    `特色標籤: ${row.highlights}`
  ]
    .filter(Boolean)
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

async function main() {
  const csv = await readFile(CSV_PATH, "utf8");
  // 使用 bom: true 避免 Windows 平台產生的 CSV 檔首帶有不可見字元
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
      // Qdrant 的整數 ID 需要大於 0。這裡使用 i + idx + 1
      id: i + idx + 1, 
      vector: vectors[idx],
      payload: {
        hotel_id: row.hotel_id, // 【修正重點 2】順便把原始 hotel_id 存入方便未來比對
        hotel_name: row.hotel_name,
        star_rating: row.star_rating ? parseInt(row.star_rating, 10) : null,
        review_count: row.review_count ? parseInt(row.review_count, 10) : null,
        user_rating: row.user_rating ? parseFloat(row.user_rating) : null,
        city: row.city,
        highlights: row.highlights,
        distance_info: row.distance_info,
        forecasted_price_eurocents: row.forecasted_price_eurocents ? parseInt(row.forecasted_price_eurocents, 10) : null,
        forecasted_price_amount: row.forecasted_price_amount ? parseInt(row.forecasted_price_amount, 10) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
      },
    }));

    await qdrant.upsert(Trivago_COLLECTION, { wait: true, points });
    processed += batch.length;
    console.log(`進度：${processed} / ${rows.length}`);
  }

  console.log("全部資料已成功灌入 Qdrant 資料庫！");
}

main().catch((err) => {
  console.error("執行過程中發生錯誤:", err);
  process.exit(1);
});
