import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const Trivago_COLLECTION = "trivago";
export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embed(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

export async function searchtrivago(query, limit = 5) {
  const vector = await embed(query);

  const results = await qdrant.search(Trivago_COLLECTION, {
    vector,
    limit,
    with_payload: true, // 明確要求附帶資料
  });

  // 【🔥 核心修正】將原本的 Netflix 欄位結構，全部更換為對齊 Trivago 的飯店結構！
  return results.map((r) => ({
    score: r.score,
    payload: {
      hotel_name: r.payload?.hotel_name,
      city: r.payload?.city,
      star_rating: r.payload?.star_rating,
      user_rating: r.payload?.user_rating,
      distance_info: r.payload?.distance_info,
      highlights: r.payload?.highlights,
    }
  }));
}
