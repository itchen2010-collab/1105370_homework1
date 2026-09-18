import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const TOOLS_BY_NAME = Object.fromEntries(toolList.map((tool) => [tool.name, tool]));
const MAX_TOOL_ROUNDS = 8;

// 【修正重點 1】建立空的對話歷史紀錄，改用動態一問一答的方式推進
const history = [];

// 【修正重點 2】定義好要測試的三個問題清單
const testQuestions = [
  "現在幾點？",
  "台北天氣如何？",
  "現在幾點？台北天氣好嗎？"
];

// 【修正重點 3】外層用一個迴圈依序抽出問題來問 AI
for (let i = 0; i < testQuestions.length; i += 1) {
  const currentQuestion = testQuestions[i];
  console.log(`\n========================================`);
  console.log(`🙋 使用者提問 [${i + 1}/3]：${currentQuestion}`);
  console.log(`========================================`);

  // 將新問題塞入對話歷史中
  history.push({
    role: "user",
    content: currentQuestion,
  });

  let completed = false;

  // 內層迴圈：負責處理「這一次提問」背後可能產生的多輪 Tool Calling
  for (let round = 1; round <= MAX_TOOL_ROUNDS; round += 1) {
    const spin = spinner("思考中...").start();

    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: history,
      tools,
      tool_choice: "auto",
    });

    spin.stop();

    // 紀錄 AI 的思考歷程到歷史中
    history.push(...response.output);

    // 檢查這次回應中有沒有包含要呼叫 tool 的請求
    const functionCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    // 情況 A：如果 AI 沒有要叫 tool 了，代表這題它已經有最終答案，印出答案並結束內層迴圈
    if (functionCalls.length === 0) {
      console.log(`🤖 貓大俠回答：\n${response.output_text}`);
      completed = true;
      break;
    }

    // 情況 B：如果有 tool 請求，依序執行這些工具，並把結果加進歷史，繼續讓內層迴圈跑下一輪
    for (const functionCall of functionCalls) {
      const fnName = functionCall.name;
      const tool = TOOLS_BY_NAME[fnName];
      if (!tool) {
        throw new Error(`模型要求了未註冊的工具：${fnName}`);
      }

      const args = tool.parameters.parse(JSON.parse(functionCall.arguments));
      console.log(`   [呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

      const result = await tool.fn(args);

      history.push({
        type: "function_call_output",
        call_id: functionCall.call_id,
        output: JSON.stringify(result),
      });
    }
  }

  // 防錯機制：如果一題呼叫了 8 次 tool 還回答不出來，就拋出異常
  if (!completed) {
    throw new Error(`單次提問的 Tool calling 超過 ${MAX_TOOL_ROUNDS} 輪，已停止執行`);
  }
}

console.log(`\n🎉 測試結束，成功完成三輪多輪對話測試！`);
