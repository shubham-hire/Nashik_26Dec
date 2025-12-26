import React, { useState } from 'react';

const MessageInput = ({ onAnalyze, isAnalyzing }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="glass-panel input-section">
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontWeight: 600 }}>
                New Message Analysis
            </h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="message-input"
                    placeholder="Paste the suspicious message here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isAnalyzing}
                />
                <button
                    className="btn-analyze"
                    type="submit"
                    disabled={!text.trim() || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            Scanning System...
                        </span>
                    ) : (
                        'Analyze Risk'
                    )}
                    {isAnalyzing && <div className="scanning-overlay" />}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
