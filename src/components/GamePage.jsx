import { useState, useEffect } from 'react';

export default function GamePage({ userId, questions, bossAvatars, onFinish }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentBoss, setCurrentBoss] = useState(null);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // 每一關隨機選擇關主
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * bossAvatars.length);
        setCurrentBoss(bossAvatars[randomIndex]);
    }, [currentQuestionIndex, bossAvatars]);

    const handleSelectAnswer = (option) => {
        setSelectedAnswer(option);
    };

    const handleNextQuestion = () => {
        if (!selectedAnswer) {
            alert('請選擇一個答案！');
            return;
        }

        // 記錄答案
        const newAnswers = [...userAnswers, {
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            answer: selectedAnswer,
        }];
        setUserAnswers(newAnswers);

        // 檢查是否為最後一題
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        } else {
            // 遊戲結束
            onFinish(newAnswers);
        }
    };

    if (!currentBoss) {
        return <div className="loading">載入中...</div>;
    }

    return (
        <div className="game-container">
            <h1>闖關挑戰</h1>

            {/* 進度條 */}
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            {/* 關主 */}
            <div className="boss-container">
                <div className="boss-avatar">
                    <img src={currentBoss.url} alt={currentBoss.name} />
                </div>
                <div className="boss-name">{currentBoss.name}</div>
            </div>

            {/* 題目 */}
            <div className="screen">
                <div className="question-container">
                    <div className="question-header">
                        <span>第 {currentQuestionIndex + 1} 題</span>
                        <span>{currentQuestionIndex + 1} / {questions.length}</span>
                    </div>

                    <div className="question-text">
                        {currentQuestion.question}
                    </div>

                    {/* 選項 */}
                    <div className="options">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <button
                                key={key}
                                className={`option ${selectedAnswer === key ? 'selected' : ''}`}
                                onClick={() => handleSelectAnswer(key)}
                            >
                                {key}. {value}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="btn btn-full btn-secondary"
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    style={{ opacity: selectedAnswer ? 1 : 0.5 }}
                >
                    {currentQuestionIndex < questions.length - 1 ? '下一題' : '完成挑戰'}
                </button>
            </div>
        </div>
    );
}
