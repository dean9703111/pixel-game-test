/**
 * 從 Google Sheets 公開 CSV URL 撈取題目
 */
export async function fetchQuestions(csvUrl, count) {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error('無法取得題目資料');
        }

        const csvText = await response.text();
        const questions = parseCSV(csvText);

        // 隨機選取並打亂題目
        return getRandomQuestions(questions, count);
    } catch (error) {
        console.error('撈取題目錯誤:', error);
        throw error;
    }
}

/**
 * 解析 CSV 文字為題目陣列
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const questions = [];

    // 跳過標題列
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // 解析 CSV（處理引號包含的逗號）
        const values = parseCSVLine(line);

        if (values.length >= 6) {
            questions.push({
                id: values[0],
                question: values[1],
                options: {
                    A: values[2],
                    B: values[3],
                    C: values[4],
                    D: values[5],
                },
            });
        }
    }

    return questions;
}

/**
 * 解析單行 CSV（處理雙引號）
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            // 處理雙引號
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current.trim());
    return values;
}

/**
 * 隨機選取指定數量的題目並打亂順序
 */
function getRandomQuestions(questions, count) {
    // Fisher-Yates 洗牌演算法
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
}
