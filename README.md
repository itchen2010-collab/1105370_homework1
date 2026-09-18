# AI Agent 實作工作坊 v8（JavaScript 版）

by eddie@5xcampus.com

JavaScript / Node.js 版的 AI Agent 教學課程，用 OpenAI Node SDK v6
（Responses API）、`@openai/agents`、Qdrant 與 MCP 實作。

## 章節進度（分支）

| 分支 | 主題 |
|------|------|
| `0.1-hello-world` | 起步 |
| `1.1-setup-env` | dotenv 環境變數 |
| `1.2-openai-api` | 第一次 Responses API 呼叫 |
| `1.3-openai-api-loop` | 對話迴圈 |
| `1.4-openai-api-with-memory` | lowdb 對話記憶 |
| `2.1-tool-calling-1` | tool calling 概念 |
| `2.2-tool-calling-2` | 真實 OpenWeather tool |
| `2.3-tool-calling-3` | 多 tool + 有上限的多輪 loop |
| `2.4-tool-calling-youbike` | YouBike API + Haversine |
| `2.5-tool-calling-current-time` | Zod schema 與執行期驗證 |
| `3.1-rag-text-to-vector` | Qdrant + Netflix embedding |
| `3.2-rag-search-text` | 語意搜尋 |
| `3.3-rag-tool` | RAG 包成 tool |
| `3.4-rag-for-pdf` | PDF RAG + recursive splitting |
| `4.1-agents-sdk` | Agents SDK 多 agent + handoff |

## 開發環境

GitHub Codespaces 會依 `.devcontainer/devcontainer.json` 建立 Node.js 22
環境。也可以在本機使用 Node.js 22+。

```bash
npm install
cp .env.example .env
npm start
```

章節 3 起另需 Qdrant；天氣工具另需 OpenWeather API key。金鑰只放在
`.env` 或 Codespaces secrets，不要提交到 Git。

@itchen2010-collab ➜ /workspaces/1105370_homework1 (homework5) $ npm start

> ai-agent-js-v8@0.1.0 start
> node main.js

[AGENTS.md] 已載入 /workspaces/1105370_homework1/AGENTS.md
[tenlong-tools MCP server] running on stdio
✔ 請輸入你的問題： python不會怎麼辦

[由 Python 老師 回答]
如果你現在「Python 不會」，其實很正常，不用慌。建議你這樣開始：

1. **先學最基本的語法**
   - 變數
   - 資料型別（字串、整數、列表、字典）
   - if / else
   - for / while 迴圈
   - 函式

2. **每天練一點點**
   - 不用一次學很多
   - 每天 20～30 分鐘，效果通常比一次硬學 3 小時好

3. **邊學邊寫**
   - Python 一定要實際打程式
   - 只看影片或文章，通常很快就忘了

4. **從小題目開始**
   - 印出文字
   - 計算成績平均
   - 判斷奇偶數
   - 做簡單猜數字遊戲

5. **遇到不懂先拆小步驟**
   - 不要想一次看懂整段
   - 先搞懂每一行在做什麼

6. **可以先找一個明確目標**
   - 想做網站
   - 想做資料分析
   - 想寫自動化
   - 想做爬蟲  
   有目標比較不容易亂學

如果你願意，我可以直接幫你安排一個：
- **Python 新手 7 天入門計畫**
- 或者直接從 **最基礎開始教你**

你只要回我一句：**「從零開始教我」** 就可以。

✔ 請輸入你的問題： 好累喔，不想學習想出去玩

[由 班導師 回答]
可以啊，先休息一下也沒關係。一直逼自己學，反而更容易累壞。

你現在比較適合：
- 出去走走
- 吃個喜歡的東西
- 找朋友聊聊
- 看個影片放空
- 乾脆先睡一覺

如果你想，我也可以幫你想：
1. **現在適合去哪裡散心**
2. **附近有什麼好吃的**
3. **找個簡單不花腦的放鬆行程**

你跟我說你在哪個城市，或想要「吃飯 / 逛街 / 看電影 / 去走走」，我幫你安排。

✔ 請輸入你的問題： 我想去吃東西有推薦刺激的吃東西地方嗎?

[由 我很正常 老師 回答]
有啊，如果你想要「**刺激一點、吃了會有爽感**」的地方，我會推薦這幾種：

### 1. **麻辣火鍋／麻辣燙**
- 很適合想要有「辣到很過癮」的感覺
- 可以選小辣、中辣、大辣，刺激度很夠
- 吃完通常會很有滿足感

### 2. **燒肉吃到飽**
- 自己烤肉很有參與感
- 香味、油脂、醬料都很刺激食慾
- 很適合心情想放鬆又想大吃的人

### 3. **夜市美食**
- 一次可以吃很多種
- 鹹酥雞、臭豆腐、烤玉米、雞排、地瓜球
- 很有「邊逛邊吃」的多巴胺感

### 4. **韓式炸雞／美式漢堡店**
- 炸雞配醬、漢堡加起司，口感很爽
- 很適合想吃重口味的人

### 5. **超浮誇甜點店**
- 巨大鬆餅、冰淇淋、聖代、蛋糕塔
- 視覺很刺激，拍照也很有成就感

### 6. **特色異國料理**
- 像泰式、墨西哥、印度咖哩
- 香料味重，吃起來比較有新鮮感

如果你要的是「**最刺激、最有爽感**」的，我會先推：
**麻辣火鍋、夜市、燒肉吃到飽、炸雞店。**

你如果願意，我可以直接幫你做一個：
- **台北刺激吃東西推薦**
- **台中刺激吃東西推薦**
- **高雄刺激吃東西推薦**
- 或直接幫你排一個 **「吃到爽的一日行程」**

你只要回我你的城市就行。

✔ 請輸入你的問題： PHP有問題了，救命!

[由 PHP 老師 回答]
可以，先別慌。把 **PHP 錯誤訊息** 貼給我，我幫你看。

你可以直接傳這些其中一種：
1. **完整錯誤訊息**
2. **出問題的程式碼**
3. **你用的是 Laravel 還是純 PHP**
4. **你預期結果是什麼、實際發生什麼**

如果你不知道怎麼貼，至少給我：
- 錯誤內容
- 哪一行報錯
- 相關程式片段

例如這樣貼最有效：
```php
// 你的程式碼
```

我可以幫你快速判斷是：
- 語法錯誤
- 變數沒定義
- SQL 問題
- Laravel 路由 / Controller / Model 問題
- API 回傳問題

把錯誤貼上來，我直接幫你抓。

? 請輸入你的問題： ^C^Z
[1]+  Stopped                 npm start
@itchen2010-collab ➜ /workspaces/1105370_homework1 (homework5) $ 
