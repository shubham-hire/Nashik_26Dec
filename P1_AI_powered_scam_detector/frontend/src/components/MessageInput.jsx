import React, { useState, useRef } from 'react';

const MessageInput = ({ onAnalyze, isAnalyzing }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((text.trim() || files.length > 0) && !isAnalyzing) {
            onAnalyze(text, files);
            setText('');
            setFiles([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    const handleFileChange = (e, type) => {
        const newFiles = Array.from(e.target.files);
        const processedFiles = newFiles.map(f => ({
            name: f.name,
            type: f.type || (type === 'image' ? 'image/png' : 'audio/mp3'),
            originalFile: f
        }));
        setFiles(prev => [...prev, ...processedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="bottom-input-wrapper">
            <form className="floating-input" onSubmit={handleSubmit}>
                {/* File Chips */}
                {files.length > 0 && (
                    <div className="file-chips">
                        {files.map((file, idx) => (
                            <div key={idx} className="file-chip">
                                <span>{file.type.startsWith('image') ? '🖼️' : '🎵'} {file.name}</span>
                                <span
                                    className="file-chip-remove"
                                    onClick={() => removeFile(idx)}
                                >
                                    ✕
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <textarea
                    className="floating-textarea"
                    placeholder="Message ScamGuard or Upload Evidence..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isAnalyzing}
                    rows={1}
                    style={{ height: 'auto', minHeight: '2rem' }}
                />

                <div className="input-actions">
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button type="button" className="chat-upload-btn" onClick={() => fileInputRef.current?.click()} title="Upload Image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </button>
                        <button type="button" className="chat-upload-btn" onClick={() => audioInputRef.current?.click()} title="Upload Audio">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e, 'image')}
                        />
                        <input
                            type="file"
                            accept="audio/*"
                            style={{ display: 'none' }}
                            ref={audioInputRef}
                            onChange={(e) => handleFileChange(e, 'audio')}
                        />
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: 'auto', paddingLeft: '1rem' }}>
                        {isAnalyzing ? "Analyzing..." : "AI can make mistakes. Verify important info."}
                    </div>

                    <button
                        className="input-btn-send"
                        type="submit"
                        disabled={(!text.trim() && files.length === 0) || isAnalyzing}
                    >
                        ➤
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
