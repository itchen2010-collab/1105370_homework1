import { input } from "@inquirer/prompts";
import { Agent, run, MCPServerStdio } from "@openai/agents";
import { spinner } from "./utils/spinner.js";
import { toAgentTool } from "./utils/agent-tool.js";
import { loadAgentsMd, withAgentsMd } from "./lib/agents-md.js";
import {
  weatherTool,
  youbikeTool,
  currentTimeTool,
  netflixTool,
  pythonBookTool,
} from "./tools/index.js";

const MODEL = "gpt-5.4-mini";
const MODEL_SETTINGS = { reasoning: { effort: "low" } };

const agentsMd = loadAgentsMd();
console.log(
  agentsMd
    ? `[AGENTS.md] 已載入 ${agentsMd.path}`
    : "[AGENTS.md] 找不到，班導師只有程式裡的基本指令",
);

const tenlongMcp = new MCPServerStdio({
  fullCommand: "node mcp-server.js",
  name: "tenlong",
  cacheToolsList: true,
});

await tenlongMcp.connect();

const phpTeacher = new Agent({
  name: "PHP 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 PHP 老師，專門回答 PHP、Laravel 相關問題。請用繁體中文回答。",
  handoffDescription: "PHP 或 Laravel 相關問題",
});

const vueTeacher = new Agent({
  name: "Vue 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 Vue 老師，專門回答 Vue.js、Nuxt 相關問題。請用繁體中文回答。",
  handoffDescription: "Vue.js 或 Nuxt 相關問題",
});

const pythonTeacher = new Agent({
  name: "Python 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 Python 老師，請用繁體中文回答 Python 相關問題。",
  handoffDescription: "Python 語法、函式庫，或《為你自己學 Python》這本書的相關問題",
  tools: [toAgentTool(pythonBookTool)],
});

const pythonTeacher = new Agent({
  name: "我很正常 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 我很正常 老師，請用繁體中文回答吃喝玩樂、逛街、以及所有刺激大腦多巴胺的問題",
  handoffDescription: "Python 語法、函式庫，或《為你自己學 Python》這本書的相關問題",
  tools: [toAgentTool(pythonBookTool)],
});

const homeroom = Agent.create({
  name: "班導師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions: withAgentsMd(
    "你是班導師，協助學生回答各種問題。請用繁體中文回答。",
    agentsMd,
  ),
  tools: [
    toAgentTool(currentTimeTool),
    toAgentTool(weatherTool),
    toAgentTool(youbikeTool),
    toAgentTool(netflixTool),
  ],
  handoffs: [phpTeacher, vueTeacher, pythonTeacher],
  mcpServers: [tenlongMcp],
});

let thread = [];

try {
  while (true) {
    const userInput = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userInput === "") continue;
    if (userInput.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("處理中...").start();
    let result;

    try {
      result = await run(
        homeroom,
        thread.concat({ role: "user", content: userInput }),
        { maxTurns: 8 },
      );
    } finally {
      spin.stop();
    }

    thread = result.history;

    console.log(`\n[由 ${result.lastAgent?.name ?? "班導師"} 回答]`);
    console.log(result.finalOutput);
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
} finally {
  await tenlongMcp.close();
}
