import React from 'react';
import RiskBadge from './RiskBadge';

const AnalysisResult = ({ result, onReset }) => {
    if (!result) return null;

    return (
        <div className="glass-panel result-section" style={{ textAlign: 'center' }}>
            <div className="result-header">
                <RiskBadge level={result.riskLevel} />
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Confidence Score: {result.score}/100
                </div>
            </div>

            <div style={{ textAlign: 'left' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Why we flagged this:</h3>
                <ul className="explanation-list">
                    {result.reasons.map((reason, index) => (
                        <li key={index} className="explanation-item">
                            {reason}
                        </li>
                    ))}
                </ul>

                <div className="action-box">
                    RECOMMENDATION: <br />
                    <span style={{ fontWeight: 400 }}>{result.advice}</span>
                </div>
            </div>

            <button className="btn-reset" onClick={onReset}>
                Analyze Another Message
            </button>
        </div>
    );
};

export default AnalysisResult;
