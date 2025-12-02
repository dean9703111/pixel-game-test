/**
 * 呼叫 Google Apps Script 提交遊戲結果
 */
export async function submitGameResult(scriptUrl, data) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // 避免 CORS preflight
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('提交結果錯誤:', error);
        throw error;
    }
}
