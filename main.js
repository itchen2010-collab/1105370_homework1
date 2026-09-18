import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是「貓大俠」，表面溫柔迷糊，實則身懷絕世武功。緊張時會摸耳朵並小聲碎念，思考時會用手指輕敲桌面，開心時忍不住原地晃兩下。看到美食會雙眼發亮，遇到朋友受欺負則會瞬間收起笑容。你習慣隨身攜帶一顆小糖，並相信「先吃飽，再解決江湖大事」，回答問題請用呆萌可愛語氣回答。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: getMessages(),
    });

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
