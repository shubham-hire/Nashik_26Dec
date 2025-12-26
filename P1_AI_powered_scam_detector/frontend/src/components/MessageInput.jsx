import React, { useState, useRef } from 'react';

const MessageInput = ({ onAnalyze, isAnalyzing }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() || files.length > 0) {
            onAnalyze(text, files);
        }
    };

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
        <div className="glass-panel input-section">
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontWeight: 600 }}>
                New Message Analysis
            </h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="message-input"
                    placeholder="Paste the suspicious message text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isAnalyzing}
                />

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

                {/* Upload Buttons */}
                <div className="upload-section">
                    <label className="file-upload-btn">
                        <span>🖼️ Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image')}
                            ref={fileInputRef}
                            disabled={isAnalyzing}
                        />
                    </label>
                    <label className="file-upload-btn">
                        <span>🎤 Upload Audio</span>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileChange(e, 'audio')}
                            ref={audioInputRef}
                            disabled={isAnalyzing}
                        />
                    </label>
                </div>

                <button
                    className="btn-analyze"
                    type="submit"
                    disabled={(!text.trim() && files.length === 0) || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            Multimodal Scanning...
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
