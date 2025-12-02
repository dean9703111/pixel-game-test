# 像素闖關問答遊戲

一個具有 2000 年代街機風格的像素風問答遊戲，整合 Google Sheets 作為題庫與成績記錄系統。

## 特色

- 🎮 **復古街機風格**：Press Start 2P 字體、CRT 螢幕效果、霓虹配色
- 🎯 **動態關主系統**：每一關隨機產生不同的像素風格關主（使用 DiceBear API）
- 📊 **Google Sheets 整合**：題庫管理、自動計分、成績追蹤
- 📱 **響應式設計**：支援各種裝置尺寸

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設定

複製 `.env.example` 為 `.env` 並填入設定：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# Google Sheet 題目工作表的公開 CSV URL
VITE_GOOGLE_SHEET_QUESTION_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=題目

# Google Apps Script Web App URL
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 通關門檻（需要答對幾題才算通過）
VITE_PASS_THRESHOLD=7

# 每次遊戲的題目數量
VITE_QUESTION_COUNT=10
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

### 4. 建立生產版本

```bash
npm run build
npm run preview
```

## Google Sheets 設定

詳細設定步驟請參考 [GOOGLE_SETUP.md](./GOOGLE_SETUP.md)

### 快速摘要

1. **建立 Google Sheet** 包含三個工作表：
   - `題目`：題號、題目、A、B、C、D
   - `解答`：題號、題目、A、B、C、D、解答
   - `回答`：ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間

2. **發布題目工作表**：
   - 檔案 → 共用 → 發佈至網路
   - 選擇「題目」工作表
   - 格式選擇「CSV」
   - 複製 URL 到 `VITE_GOOGLE_SHEET_QUESTION_URL`

3. **建立 Google Apps Script**：
   - 詳見 [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) 中的完整程式碼
   - 部署為 Web App
   - 複製 URL 到 `VITE_GOOGLE_APP_SCRIPT_URL`

## 專案結構

```
pixel-game/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx      # 登入頁面
│   │   ├── GamePage.jsx       # 遊戲頁面
│   │   └── ResultPage.jsx     # 結果頁面
│   ├── utils/
│   │   ├── googleSheets.js    # Google Sheets 工具
│   │   ├── api.js             # API 呼叫
│   │   └── dicebear.js        # 頭像產生
│   ├── App.jsx                # 主應用程式
│   ├── main.jsx               # 進入點
│   └── index.css              # 全域樣式
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## 技術棧

- **前端框架**：React 18
- **建置工具**：Vite 5
- **樣式**：原生 CSS（Pixel Art 風格）
- **字體**：Press Start 2P (Google Fonts)
- **頭像 API**：DiceBear
- **後端整合**：Google Apps Script + Google Sheets

## 遊戲流程

1. **登入**：輸入玩家 ID
2. **載入題目**：從 Google Sheets 隨機撈取指定數量的題目
3. **闖關**：每一關顯示不同的關主與題目
4. **計分**：選擇答案並自動計分
5. **結果**：顯示總分與通關狀態，提交到 Google Sheets

## 環境變數說明

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| `VITE_GOOGLE_SHEET_QUESTION_URL` | 題庫 CSV URL | - |
| `VITE_GOOGLE_APP_SCRIPT_URL` | Apps Script URL | - |
| `VITE_PASS_THRESHOLD` | 通關門檻 | 7 |
| `VITE_QUESTION_COUNT` | 題目數量 | 10 |

## 常見問題

### Q: 如何更改題目？
A: 直接編輯 Google Sheets 中的「題目」和「解答」工作表即可。

### Q: 如何調整難度？
A: 修改 `.env` 中的 `VITE_PASS_THRESHOLD` 來調整通關門檻。

### Q: 可以自訂關主圖片嗎？
A: 目前使用 DiceBear API 自動產生。如需自訂，請修改 `src/utils/dicebear.js`。

## 授權

MIT License
