# AI Agent 實作工作坊 v8（JavaScript 版）

by eddie@5xcampus.com

這個 repo 以 Git 分支保存每一個教學進度。切到教材對應的
分支後，開啟 GitHub Codespaces 即可直接使用 Node.js 22。

@itchen2010-collab ➜ /workspaces/1105370_homework1 (homework3) $ node scripts/embed-Trivago.js 
讀到 499 筆資料
已建立 collection: trivago
進度：100 / 499
進度：200 / 499
進度：300 / 499
進度：400 / 499
進度：499 / 499
全部資料已成功且精準對齊地灌入 Qdrant 資料庫！
@itchen2010-collab ➜ /workspaces/1105370_homework1 (homework3) $ node main.js 
✔ 請輸入要搜尋的飯店內容： 最貴飯店

1. The Goring [London]
   相似度分數：0.481
   星級 / 評分：5 星 | 用戶評分：9.5 分
   位置資訊　：0.3 miles to Buckingham Palace
   特色標籤　：Michelin-starred British dining, Last family-owned luxury hotel

2. 1 Hotel Mayfair [London]
   相似度分數：0.466
   星級 / 評分：5 星 | 用戶評分：9.3 分
   位置資訊　：0.6 miles to Buckingham Palace
   特色標籤　：Bamford Wellness Spa, Eco-luxury guest quarters

3. Brown's Hotel [London]
   相似度分數：0.466
   星級 / 評分：5 星 | 用戶評分：9.4 分
   位置資訊　：0.6 miles to Buckingham Palace
   特色標籤　：Michelin-starred British cuisine, Historic Mayfair elegance

4. Guild Hotel Marble Arch [London]
   相似度分數：0.463
   星級 / 評分：4 星 | 用戶評分：7.6 分
   位置資訊　：0.7 miles to Hyde Park
   特色標籤　：Steak & Lobster restaurant, In-room spa treatments

5. Flemings Mayfair - Small Luxury Hotel of the World [London]
   相似度分數：0.462
   星級 / 評分：5 星 | 用戶評分：8.8 分
   位置資訊　：0.4 miles to Buckingham Palace
   特色標籤　：Michelin-starred Ormer Mayfair dining, Curated celebrity photography collection

✔ 請輸入要搜尋的飯店內容： 評分最高飯店

1. Brown's Hotel [London]
   相似度分數：0.499
   星級 / 評分：5 星 | 用戶評分：9.4 分
   位置資訊　：0.6 miles to Buckingham Palace
   特色標籤　：Michelin-starred British cuisine, Historic Mayfair elegance

2. The Connaught [London]
   相似度分數：0.492
   星級 / 評分：5 星 | 用戶評分：9.6 分
   位置資訊　：0.7 miles to Buckingham Palace
   特色標籤　：Michelin-starred dining, Art collection and grand staircase

3. Millennium Hotel London Knightsbridge [London]
   相似度分數：0.489
   星級 / 評分：4 星 | 用戶評分：7.7 分
   位置資訊　：0.8 miles to Buckingham Palace
   特色標籤　：Upper floor panoramic city views, Authentic Chinese culinary experience

4. The Goring [London]
   相似度分數：0.488
   星級 / 評分：5 星 | 用戶評分：9.5 分
   位置資訊　：0.3 miles to Buckingham Palace
   特色標籤　：Michelin-starred British dining, Last family-owned luxury hotel

5. Henrietta Experimental [London]
   相似度分數：0.486
   星級 / 評分：4 星 | 用戶評分：9.3 分
   位置資訊　：0.3 miles to City centre
   特色標籤　：Rooms with St Paul's Churchyard views, Henri restaurant and bar

✔ 請輸入要搜尋的飯店內容： 最多人喜歡飯店

1. Hotel Saint [London]
   相似度分數：0.442
   星級 / 評分：4 星 | 用戶評分：8.7 分
   位置資訊　：2.3 miles to City centre
   特色標籤　：Jin Bo Law rooftop bar, The Cardinal Bar & Kitchen

2. Bertrand's Townhouse [London]
   相似度分數：0.440
   星級 / 評分：4 星 | 用戶評分：9.8 分
   位置資訊　：0.9 miles to City centre
   特色標籤　：暫無資料

3. Guild Hotel Marble Arch [London]
   相似度分數：0.436
   星級 / 評分：4 星 | 用戶評分：7.6 分
   位置資訊　：0.7 miles to Hyde Park
   特色標籤　：Steak & Lobster restaurant, In-room spa treatments

4. The Goring [London]
   相似度分數：0.433
   星級 / 評分：5 星 | 用戶評分：9.5 分
   位置資訊　：0.3 miles to Buckingham Palace
   特色標籤　：Michelin-starred British dining, Last family-owned luxury hotel

5. Althoff St. James's Hotel & Club [London]
   相似度分數：0.431
   星級 / 評分：5 星 | 用戶評分：8.9 分
   位置資訊　：0.6 miles to City centre
   特色標籤　：Victorian elegance and contemporary chic, Private rooftop terrace suites

? 請輸入要搜尋的飯店內容：
[4]+  Stopped                 node main.js
