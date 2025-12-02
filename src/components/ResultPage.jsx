import { useState, useEffect, useRef } from 'react';
import { submitGameResult } from '../utils/api';

export default function ResultPage({ userId, userAnswers, passThreshold, onRestart }) {
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [showReview, setShowReview] = useState(false);
    const hasSubmitted = useRef(false);

    const totalQuestions = userAnswers.length;

    useEffect(() => {
        // 防止重複提交（避免 React StrictMode 造成雙重提交）
        if (hasSubmitted.current) return;
        hasSubmitted.current = true;

        // 提交結果到 Google Apps Script
        const submitResult = async () => {
            const scriptUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
            const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;

            if (!scriptUrl) {
                setIsSubmitting(false);
                setSubmitError('未設定 Google Apps Script URL');
                return;
            }

            if (!spreadsheetId) {
                setIsSubmitting(false);
                setSubmitError('未設定 Google Sheet ID');
                return;
            }

            // 檢查 ID 格式（避免使用者填入完整網址）
            if (spreadsheetId.includes('http') || spreadsheetId.includes('google.com') || spreadsheetId.includes('/')) {
                console.error('Google Sheet ID 格式錯誤:', spreadsheetId);
                setIsSubmitting(false);
                setSubmitError('Google Sheet ID 格式錯誤：請只填寫 ID (例如 1ABC...)，不要填寫完整網址');
                return;
            }

            console.log('正在提交結果，Sheet ID:', spreadsheetId);

            try {
                const result = await submitGameResult(scriptUrl, {
                    spreadsheetId,
                    passThreshold,
                    userId,
                    answers: userAnswers,
                    totalQuestions,
                    timestamp: new Date().toISOString(),
                });
                setGameResult(result);
                setIsSubmitting(false);
            } catch (error) {
                setIsSubmitting(false);
                setSubmitError('提交結果時發生錯誤');
                console.error(error);
            }
        };

        submitResult();
    }, [userId, userAnswers, totalQuestions, passThreshold]);

    if (isSubmitting) {
        return (
            <div className="game-container">
                <div className="loading">正在計算成績...</div>
            </div>
        );
    }

    const score = gameResult?.score ?? 0;
    const isPassed = gameResult?.passed ?? false;
    const results = gameResult?.results ?? [];

    return (
        <div className="game-container">
            <h1>挑戰結果</h1>

            <div className="screen">
                <div className="score-container">
                    <h2>玩家：{userId}</h2>

                    <div className="score-big">
                        {score} / {totalQuestions}
                    </div>

                    <div className={`result-message ${isPassed ? 'pass' : 'fail'}`}>
                        {isPassed ? '🎉 恭喜通關！' : '💪 再接再厲！'}
                    </div>

                    {submitError && (
                        <div className="error" style={{ marginTop: '20px' }}>
                            {submitError}
                        </div>
                    )}

                    <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '20px' }}>
                        通關門檻：{passThreshold} 題
                    </p>
                </div>

                <button
                    className="btn btn-full btn-secondary"
                    onClick={() => setShowReview(!showReview)}
                    style={{ marginBottom: '10px' }}
                >
                    {showReview ? '收起解答' : '📖 查看解答'}
                </button>

                {showReview && results.length > 0 && (
                    <div className="review-section" style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        marginBottom: '15px',
                        padding: '15px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'left'
                    }}>
                        {results.map((result, index) => (
                            <div
                                key={result.questionId}
                                style={{
                                    marginBottom: '15px',
                                    paddingBottom: '15px',
                                    borderBottom: index < results.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}>
                                        {result.isCorrect ? '✅' : '❌'}
                                    </span>
                                    <span style={{
                                        fontSize: '14px',
                                        color: 'var(--text-dim)'
                                    }}>
                                        第 {result.questionId} 題
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '15px',
                                    marginBottom: '8px',
                                    lineHeight: '1.5'
                                }}>
                                    {result.question}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                                    你的答案：
                                    <span style={{
                                        color: result.isCorrect ? 'var(--success)' : 'var(--danger)',
                                        fontWeight: 'bold',
                                        marginLeft: '5px'
                                    }}>
                                        {result.userAnswer}
                                    </span>
                                </div>
                                {!result.isCorrect && (
                                    <div style={{ fontSize: '13px', color: 'var(--success)' }}>
                                        正確答案：
                                        <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                                            {result.correctAnswer}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn btn-full btn-success" onClick={onRestart}>
                    再玩一次
                </button>
            </div>
        </div>
    );
}
