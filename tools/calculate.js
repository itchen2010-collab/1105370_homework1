import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

async function calculate({ expression }) {
  try {
    if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
      return {
        error: "只允許輸入數字與基本數學運算符號",
      };
    }

    const result = Function(
      `"use strict"; return (${expression})`
    )();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      return {
        error: "無法計算這個算式",
      };
    }

    return {
      expression,
      result,
    };
  } catch (error) {
    return {
      error: "計算式格式錯誤，無法計算",
    };
  }
}

export const calculatorTool = defineTool({
  name: "calculator",
  description: "數學計算機，可以計算加減乘除、百分比與括號運算。",
  fn: calculate,
  parameters: z.object({
    expression: z
      .string()
      .describe("數學算式，例如 100+200、50*3、(100+50)/2"),
  }),
});