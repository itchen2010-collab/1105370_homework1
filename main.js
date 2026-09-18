import { input } from "@inquirer/prompts";
import { searchtrivago } from "./lib/qdrant.js";
import { spinner } from "./utils/spinner.js";

try {
  while (true) {
    const query = (
      await input({ message: "請輸入要搜尋的飯店內容：" })
    ).trim();

    if (query === "") continue;
    if (query.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("搜尋中...").start();
    const results = await searchtrivago(query, 5);
    spin.stop();

    // 已經將這裡修正為 Trivago 的飯店欄位結構
    for (const [i, r] of results.entries()) {
      const payload = r.payload || {}; // 安全地取出 payload 內容
      
      console.log(`\n${i + 1}. ${payload.hotel_name || "未知飯店"} [${payload.city || "未知城市"}]`);
      console.log(`   相似度分數：${r.score.toFixed(3)}`);
      console.log(`   星級 / 評分：${payload.star_rating ? payload.star_rating + " 星" : "暫無資料"} | 用戶評分：${payload.user_rating ? payload.user_rating + " 分" : "暫無資料"}`);
      console.log(`   位置資訊　：${payload.distance_info || "暫無資料"}`);
      console.log(`   特色標籤　：${payload.highlights || "暫無資料"}`);
    }
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}