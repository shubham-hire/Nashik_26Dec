import React from 'react';
import RiskBadge from './RiskBadge';

const HistoryPanel = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="empty-state glass-panel">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                <h3>No Scans Yet</h3>
                <p>Your analysis history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="history-list">
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            {history.map((item, index) => (
                <div key={index} className="history-item glass-panel">
                    <div className="history-header">
                        <span className="history-date">
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <RiskBadge level={item.result.riskLevel} />
                    </div>
                    <div className="history-preview">
                        {item.text ? `"${item.text.substring(0, 50)}..."` : 'File Analysis'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPanel;
