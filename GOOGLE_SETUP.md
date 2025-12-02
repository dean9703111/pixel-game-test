# Google Sheets 與 Apps Script 設定指南

本文件提供詳細步驟來設定 Google Sheets 題庫與 Google Apps Script 後端。

## 步驟 1：建立 Google Sheet

### 1.1 建立新的 Google Sheet

前往 [Google Sheets](https://sheets.google.com) 並建立一個新的試算表。

### 1.2 建立三個工作表

#### 工作表 1：題目（公開）

| 題號 | 題目 | A | B | C | D |
|------|------|---|---|---|---|
| 1 | 什麼是 Generative AI？ | 一種圖像編輯軟體 | 能夠產生新內容的 AI 系統 | 一種遊戲引擎 | 一種資料庫 |
| 2 | 下列哪個是 LLM 的代表？ | Photoshop | Excel | ChatGPT | AutoCAD |
| 3 | Prompt Engineering 主要用於什麼？ | 資料庫優化 | 引導 AI 生成更準確的回應 | 網頁設計 | 硬體測試 |
| 4 | 下列哪個不是 Generative AI 的應用？ | 文字生成 | 圖像生成 | 音樂創作 | 病毒掃描 |
| 5 | Transformer 架構最初用於哪個領域？ | 圖像識別 | 自然語言處理 | 語音合成 | 遊戲開發 |
| 6 | 下列哪個是文字轉圖像的 AI 模型？ | GPT-4 | BERT | Stable Diffusion | AlphaGo |
| 7 | Few-shot Learning 是什麼意思？ | 需要大量訓練資料 | 只需少量範例就能學習 | 完全不需要訓練 | 只能處理圖像 |
| 8 | Token 在 LLM 中指的是什麼？ | 加密貨幣 | 文字處理的基本單位 | 用戶帳號 | 遊戲點數 |
| 9 | 下列哪個是 Google 開發的 LLM？ | ChatGPT | Claude | Gemini | Llama |
| 10 | Hallucination 在 AI 中指的是什麼？ | 視覺效果 | AI 產生不正確或虛構的資訊 | 3D 渲染 | 音效處理 |

#### 工作表 2：解答（私密）

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | 什麼是 Generative AI？ | 一種圖像編輯軟體 | 能夠產生新內容的 AI 系統 | 一種遊戲引擎 | 一種資料庫 | B |
| 2 | 下列哪個是 LLM 的代表？ | Photoshop | Excel | ChatGPT | AutoCAD | C |
| 3 | Prompt Engineering 主要用於什麼？ | 資料庫優化 | 引導 AI 生成更準確的回應 | 網頁設計 | 硬體測試 | B |
| 4 | 下列哪個不是 Generative AI 的應用？ | 文字生成 | 圖像生成 | 音樂創作 | 病毒掃描 | D |
| 5 | Transformer 架構最初用於哪個領域？ | 圖像識別 | 自然語言處理 | 語音合成 | 遊戲開發 | B |
| 6 | 下列哪個是文字轉圖像的 AI 模型？ | GPT-4 | BERT | Stable Diffusion | AlphaGo | C |
| 7 | Few-shot Learning 是什麼意思？ | 需要大量訓練資料 | 只需少量範例就能學習 | 完全不需要訓練 | 只能處理圖像 | B |
| 8 | Token 在 LLM 中指的是什麼？ | 加密貨幣 | 文字處理的基本單位 | 用戶帳號 | 遊戲點數 | B |
| 9 | 下列哪個是 Google 開發的 LLM？ | ChatGPT | Claude | Gemini | Llama | C |
| 10 | Hallucination 在 AI 中指的是什麼？ | 視覺效果 | AI 產生不正確或虛構的資訊 | 3D 渲染 | 音效處理 | B |

#### 工作表 3：回答（Apps Script 寫入）

| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |
|----|---------|------|--------|---------------|-------------|-------------|
|    |         |      |        |               |             |             |

**欄位說明**：
- `ID`：玩家識別碼
- `闖關次數`：該玩家遊玩的總次數
- `總分`：本次遊戲得分
- `最高分`：歷史最高分
- `第一次通關分數`：首次達到通關門檻時的分數（只記錄一次）
- `花了幾次通關`：達到首次通關時已經玩了幾次（只記錄一次）
- `最近遊玩時間`：最後一次遊玩的時間戳

## 步驟 2：發布「題目」工作表為公開 CSV

1. 點選「檔案」→「共用」→「發佈至網路」
2. 在「連結」分頁中：
   - 下拉選單選擇「題目」工作表
   - 格式選擇「逗號分隔值 (.csv)」
3. 點選「發佈」
4. 複製產生的 URL

URL 格式應該類似：
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=題目
```

將此 URL 設定到 `.env` 的 `VITE_GOOGLE_SHEET_QUESTION_URL`

## 步驟 3：建立 Google Apps Script

### 3.1 開啟 Apps Script 編輯器

1. 在 Google Sheet 中，點選「擴充功能」→「Apps Script」
2. 刪除預設的 `myFunction()` 程式碼

### 3.2 貼上以下程式碼

```javascript
/**
 * 像素闖關問答遊戲 - Google Apps Script 後端
 * 
 * 此 Script 不需要手動設定，所有參數由前端傳入
 */

// 工作表名稱
const SHEET_NAMES = {
  QUESTIONS: '題目',
  ANSWERS: '解答',
  RECORDS: '回答'
};

/**
 * Web App POST 處理函數
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = processGameResult(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理遊戲結果
 */
function processGameResult(data) {
  const { spreadsheetId, passThreshold, userId, answers, totalQuestions, timestamp } = data;
  
  // 計算得分與詳細結果
  const { score, results } = calculateScore(spreadsheetId, answers);
  
  // 更新回答記錄
  updatePlayerRecord(spreadsheetId, passThreshold, userId, score, totalQuestions, timestamp);
  
  return {
    success: true,
    userId,
    score,
    totalQuestions,
    passed: score >= passThreshold,
    results  // 每題的答題狀況
  };
}

/**
 * 計算得分
 */
function calculateScore(spreadsheetId, userAnswers) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const answerSheet = ss.getSheetByName(SHEET_NAMES.ANSWERS);
  const answerData = answerSheet.getDataRange().getValues();
  
  // 建立題號與正確答案的對應表
  const correctAnswers = {};
  for (let i = 1; i < answerData.length; i++) {
    const questionId = answerData[i][0].toString();
    const correctAnswer = answerData[i][6]; // 第 7 欄是解答
    correctAnswers[questionId] = correctAnswer;
  }
  
  // 計算正確答案數量與詳細結果
  let score = 0;
  const results = [];
  
  userAnswers.forEach(answer => {
    const questionId = answer.questionId.toString();
    const correctAnswer = correctAnswers[questionId];
    const isCorrect = correctAnswer === answer.answer;
    
    if (isCorrect) {
      score++;
    }
    
    results.push({
      questionId,
      question: answer.question,
      userAnswer: answer.answer,
      correctAnswer,
      isCorrect
    });
  });
  
  return { score, results };
}

/**
 * 更新玩家記錄
 */
function updatePlayerRecord(spreadsheetId, passThreshold, userId, score, totalQuestions, timestamp) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const recordSheet = ss.getSheetByName(SHEET_NAMES.RECORDS);
  const recordData = recordSheet.getDataRange().getValues();
  
  // 尋找該玩家的記錄
  let playerRow = -1;
  for (let i = 1; i < recordData.length; i++) {
    if (recordData[i][0] === userId) {
      playerRow = i + 1; // Sheets 的列從 1 開始
      break;
    }
  }
  
  const isPassed = score >= passThreshold;
  
  if (playerRow === -1) {
    // 新玩家，新增記錄
    const newRow = [
      userId,                                    // ID
      1,                                         // 闖關次數
      score,                                     // 總分
      score,                                     // 最高分
      isPassed ? score : '',                     // 第一次通關分數
      isPassed ? 1 : '',                         // 花了幾次通關
      timestamp                                  // 最近遊玩時間
    ];
    recordSheet.appendRow(newRow);
  } else {
    // 現有玩家，更新記錄
    const currentAttempts = recordData[playerRow - 1][1];
    const currentHighScore = recordData[playerRow - 1][3];
    const firstPassScore = recordData[playerRow - 1][4];
    const attemptsToPass = recordData[playerRow - 1][5];
    
    const newAttempts = currentAttempts + 1;
    const newHighScore = Math.max(currentHighScore, score);
    
    // 如果之前沒有通關記錄，且這次通關了，記錄首次通關資訊
    let newFirstPassScore = firstPassScore;
    let newAttemptsToPass = attemptsToPass;
    if (!firstPassScore && isPassed) {
      newFirstPassScore = score;
      newAttemptsToPass = newAttempts;
    }
    
    // 更新記錄
    recordSheet.getRange(playerRow, 2).setValue(newAttempts);        // 闖關次數
    recordSheet.getRange(playerRow, 3).setValue(score);              // 總分
    recordSheet.getRange(playerRow, 4).setValue(newHighScore);       // 最高分
    recordSheet.getRange(playerRow, 5).setValue(newFirstPassScore);  // 第一次通關分數
    recordSheet.getRange(playerRow, 6).setValue(newAttemptsToPass);  // 花了幾次通關
    recordSheet.getRange(playerRow, 7).setValue(timestamp);          // 最近遊玩時間
  }
}

/**
 * 測試函數（可在 Apps Script 編輯器中執行）
 * 使用前請填入正確的 SPREADSHEET_ID
 */
function testProcessGameResult() {
  const testData = {
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',  // 請替換成你的 Sheet ID
    passThreshold: 7,
    userId: 'test_user_123',
    answers: [
      { questionId: '1', question: '測試題目 1', answer: 'B' },
      { questionId: '2', question: '測試題目 2', answer: 'C' }
    ],
    totalQuestions: 2,
    timestamp: new Date().toISOString()
  };
  
  const result = processGameResult(testData);
  Logger.log(result);
}
```

### 3.3 部署為 Web App

1. 點選「部署」→「新增部署作業」
2. 類型選擇「網頁應用程式」
3. 設定：
   - **執行身分**：我（你的 Google 帳號）
   - **具有存取權的使用者**：所有人
4. 點選「部署」
5. 授權應用程式（首次需要授權）
6. 複製「網頁應用程式 URL」

URL 格式應該類似：
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

將此 URL 設定到 `.env` 的 `VITE_GOOGLE_APP_SCRIPT_URL`

## 步驟 4：設定前端環境變數

在專案根目錄的 `.env` 檔案中設定以下參數：

```bash
# Google Sheet ID（從網址列取得）
VITE_GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE

# Google Sheet 題目工作表的公開 CSV URL
VITE_GOOGLE_SHEET_QUESTION_URL=YOUR_CSV_URL_HERE

# Google Apps Script Web App URL
VITE_GOOGLE_APP_SCRIPT_URL=YOUR_SCRIPT_URL_HERE

# 通關門檻
VITE_PASS_THRESHOLD=7

# 每次遊戲的題目數量
VITE_QUESTION_COUNT=10
```

## 步驟 5：測試設定

### 5.1 測試 Apps Script（可選）

在 Apps Script 編輯器中：
1. 修改 `testProcessGameResult` 函數中的 `spreadsheetId`
2. 選擇函數 `testProcessGameResult`
3. 點選「執行」
4. 檢查「回答」工作表是否有新增記錄

### 5.2 測試前端整合

1. 確保 `.env` 設定正確（特別是 `VITE_GOOGLE_SHEET_ID`）
2. 啟動開發伺服器：`npm run dev`
3. 完成一次遊戲流程
4. 檢查 Google Sheets「回答」工作表是否正確記錄

## 安全性建議

1. **解答工作表**應該維持私密，不要公開發布
2. **回答工作表**的權限應該只有 Apps Script 可以寫入
3. 定期備份你的 Google Sheets 資料
4. 如果要重新部署 Apps Script，記得更新前端的 URL
5. **不要把 `.env` 檔案提交到 Git**（已加入 `.gitignore`）

## 疑難排解

### 問題：提交結果失敗

**可能原因**：
- Apps Script URL 設定錯誤
- Google Sheet ID 設定錯誤或未設定
- Apps Script 未授權

**解決方法**：
1. 確認 `.env` 中的 URL 正確
2. 重新部署 Apps Script
3. 檢查 Apps Script 執行記錄

### 問題：計分不正確

**可能原因**：
- 「解答」工作表格式錯誤
- 題號不匹配

**解決方法**：
1. 確認「解答」工作表的題號與「題目」工作表一致
2. 確認解答欄位是第 7 欄（G 欄）
3. 確認解答值為 A、B、C 或 D

### 問題：無法載入題目

**可能原因**：
- CSV URL 錯誤
- 「題目」工作表未公開發布
- CSV 格式錯誤

**解決方法**：
1. 確認已正確發布「題目」工作表
2. 測試 CSV URL 是否可在瀏覽器開啟
3. 檢查工作表欄位格式
