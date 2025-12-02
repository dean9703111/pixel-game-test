import { useState } from 'react';

export default function LoginPage({ onStart }) {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userId.trim()) {
            setError('請輸入您的 ID');
            return;
        }

        onStart(userId.trim());
    };

    return (
        <div className="game-container">
            <h1>像素闖關問答</h1>

            <div className="screen">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="userId">輸入您的 ID 開始遊戲</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => {
                                setUserId(e.target.value);
                                setError('');
                            }}
                            placeholder="請輸入 ID"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button type="submit" className="btn btn-full">
                        開始挑戰
                    </button>
                </form>
            </div>

            <p style={{ textAlign: 'center', fontSize: '10px', marginTop: '20px', color: 'var(--text-dim)' }}>
                INSERT COIN TO CONTINUE
            </p>
        </div>
    );
}
