import React, { useState } from 'react';
import RiskBadge from './RiskBadge';

const AnalysisResult = ({ result, onReset }) => {
    const [simpleMode, setSimpleMode] = useState(false);
    const [feedback, setFeedback] = useState(null);

    if (!result) return null;

    return (
        <div className="analysis-result-card">
            {/* 1. Header & Scam Type */}
            <div className="result-header-chat">
                <RiskBadge level={result.riskLevel} />
                <div className="scam-type-chip">
                    <span className="scam-type-label">Detected Pattern:</span>
                    <span className="scam-type-value">{result.scamType}</span>
                </div>
            </div>

            <div className="result-body">

                {/* 2. Visual Risk Breakdown */}
                {result.riskIndicators && result.riskIndicators.length > 0 && (
                    <div className="risk-breakdown-panel">
                        <div className="panel-title">⚠️ Why this looks risky</div>
                        <div className="risk-checklist">
                            {result.riskIndicators.map((indicator, idx) => (
                                <div key={idx} className="risk-item">
                                    <span className="risk-check">✔</span>
                                    {indicator}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Explanation & Simplifier */}
                <div className="explanation-section">
                    <div className="explanation-header">
                        <h4>Analysis</h4>
                        <div
                            className={`simplifier-toggle ${simpleMode ? 'active' : ''}`}
                            onClick={() => setSimpleMode(!simpleMode)}
                            title="Toggle simple language"
                        >
                            🔄 Simple
                        </div>
                    </div>
                    <p className="explanation-text">
                        {simpleMode ? result.simplifiedExplanation : result.reasons[0]}
                        {!simpleMode && " This pattern matches known fraud techniques targeting financial credentials."}
                    </p>
                </div>

                {/* 4. Similarity Score */}
                <div className="similarity-section">
                    <div className="sim-label">
                        <span>⚡ Similarity to known scams</span>
                        <span className={`sim-value ${result.similarity.toLowerCase()}`}>{result.similarity}</span>
                    </div>
                    <div className="sim-bar-bg">
                        <div className={`sim-bar-fill ${result.similarity.toLowerCase()}`} style={{ width: result.similarity === 'High' ? '90%' : result.similarity === 'Medium' ? '50%' : '20%' }}></div>
                    </div>
                </div>

                {/* 5. Action Box */}
                <div className="action-box-chat">
                    <strong>🛡️ Recommended Action</strong>
                    {result.advice}
                    <div className="action-buttons-mini">
                        {result.riskLevel !== 'safe' && <button className="action-btn-danger">Block Sender</button>}
                        <button className="action-btn-safe">Report</button>
                    </div>
                </div>

                {/* 6. Feedback & Share */}
                <div className="feedback-section">
                    {!feedback ? (
                        <>
                            <span className="feedback-text">Was this helpful?</span>
                            <button className="fb-btn" onClick={() => setFeedback('up')}>👍</button>
                            <button className="fb-btn" onClick={() => setFeedback('down')}>👎</button>
                        </>
                    ) : (
                        <span className="feedback-thanks">Thanks for improving ScamGuard!</span>
                    )}
                    <button className="share-warning-btn">📤 Share Warning</button>
                </div>

            </div>
        </div>
    );
};

export default AnalysisResult;
