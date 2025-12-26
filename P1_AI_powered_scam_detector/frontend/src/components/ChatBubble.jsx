import React from 'react';
import AnalysisResult from './AnalysisResult';

const ChatBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`chat-bubble-container ${isUser ? 'user-container' : 'ai-container'}`}>
            <div className={`chat-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
                {isUser ? '👤' : '🛡️'}
            </div>

            <div className={`chat-content ${isUser ? 'user-content' : 'ai-content'}`}>
                {isUser ? (
                    <div className="user-message-text">
                        {message.content}
                        {message.files && message.files.length > 0 && (
                            <div className="message-files">
                                {message.files.map((f, i) => (
                                    <span key={i} className="file-chip-static">📎 {f.name}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="ai-response">
                        {message.isLoading ? (
                            <div className="typing-indicator">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        ) : (
                            <AnalysisResult result={message.result} onReset={() => { }} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
