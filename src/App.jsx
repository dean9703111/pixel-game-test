import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import GamePage from './components/GamePage';
import ResultPage from './components/ResultPage';
import { fetchQuestions } from './utils/googleSheets';
import { generateBossAvatars } from './utils/dicebear';
import './index.css';

const GAME_STATE = {
    LOGIN: 'login',
    LOADING: 'loading',
    PLAYING: 'playing',
    RESULT: 'result',
    ERROR: 'error',
};

export default function App() {
    const [gameState, setGameState] = useState(GAME_STATE.LOGIN);
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [bossAvatars, setBossAvatars] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [error, setError] = useState(null);

    const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || '10');
    const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '7');

    // 初始化關主頭像
    useEffect(() => {
        const avatars = generateBossAvatars(100);
        setBossAvatars(avatars);
    }, []);

    const handleStart = async (id) => {
        setUserId(id);
        setGameState(GAME_STATE.LOADING);
        setError(null);

        try {
            const csvUrl = import.meta.env.VITE_GOOGLE_SHEET_QUESTION_URL;

            if (!csvUrl) {
                throw new Error('請先設定 VITE_GOOGLE_SHEET_QUESTION_URL 環境變數');
            }

            const fetchedQuestions = await fetchQuestions(csvUrl, questionCount);

            if (fetchedQuestions.length === 0) {
                throw new Error('沒有可用的題目');
            }

            setQuestions(fetchedQuestions);
            setGameState(GAME_STATE.PLAYING);
        } catch (err) {
            setError(err.message);
            setGameState(GAME_STATE.ERROR);
        }
    };

    const handleFinish = (answers) => {
        setUserAnswers(answers);
        setGameState(GAME_STATE.RESULT);
    };

    const handleRestart = () => {
        setGameState(GAME_STATE.LOGIN);
        setUserId('');
        setQuestions([]);
        setUserAnswers([]);
        setError(null);
    };

    if (gameState === GAME_STATE.LOADING) {
        return (
            <div className="game-container">
                <div className="loading">載入題目中...</div>
            </div>
        );
    }

    if (gameState === GAME_STATE.ERROR) {
        return (
            <div className="game-container">
                <h1>發生錯誤</h1>
                <div className="screen">
                    <div className="error">{error}</div>
                    <button className="btn btn-full" onClick={handleRestart}>
                        返回首頁
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === GAME_STATE.PLAYING) {
        return (
            <GamePage
                userId={userId}
                questions={questions}
                bossAvatars={bossAvatars}
                onFinish={handleFinish}
            />
        );
    }

    if (gameState === GAME_STATE.RESULT) {
        return (
            <ResultPage
                userId={userId}
                userAnswers={userAnswers}
                passThreshold={passThreshold}
                onRestart={handleRestart}
            />
        );
    }

    return <LoginPage onStart={handleStart} />;
}
