import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

const ChatStream = ({ messages }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-stream">
            {messages.length === 0 && (
                <div className="empty-chat-state">
                    <h1>ScamGuard Pro</h1>
                    <p>Type a message or upload a file to start scanning.</p>
                </div>
            )}

            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} style={{ height: '150px' }} /> {/* Spacer for bottom input */}
        </div>
    );
};

export default ChatStream;
