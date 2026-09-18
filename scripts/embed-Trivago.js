import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { client } from "../lib/openai.js";
import {
  qdrant,
  //NETFLIX_COLLECTION,
  Trivago_COLLECTION,
  EMBEDDING_DIM,
  EMBEDDING_MODEL,
} from "../lib/qdrant.js";

const CSV_PATH = "data/trivago20260918.csv";
const BATCH_SIZE = 100;

function rowToText(row) {
  return [
    row.title,
    row.type,
    row.director,
    row.cast,
    row.country,
    row.listed_in,
    row.description,
  ]
    .filter(Boolean)
    .join(" | ");
}

async function recreateCollection() {
  //const exists = await qdrant.collectionExists(NETFLIX_COLLECTION);
  const exists = await qdrant.collectionExists(Trivago_COLLECTION);
  if (exists.exists) {
    //await qdrant.deleteCollection(NETFLIX_COLLECTION);
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
  //const rows = parse(csv, { columns: true, skip_empty_lines: true });
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
      id: i + idx,
      vector: vectors[idx],
      payload: {
        hotel_name: row.hotel_name,
        star_rating: row.star_rating,
        review_count: row.review_count,
        user_rating: row.user_rating,
        city: row.city,
        highlights: row.highlights,
        distance_info: row.distance_info,
        forecasted_price_eurocents: row.forecasted_price_eurocents,
        forecasted_price_amount: row.forecasted_price_amount,
        longitude: row.longitude,
        latitude: row.latitude,
      },
    }));

    await qdrant.upsert(Trivago_COLLECTION, { wait: true, points });
    processed += batch.length;
    console.log(`進度：${processed} / ${rows.length}`);
  }

  console.log("完成！");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
