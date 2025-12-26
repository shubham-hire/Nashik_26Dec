import React, { useEffect, useState } from 'react';

const threats = [
    "Phishing Link detected in New York...",
    "Fake Lottery scam blocked in London...",
    "Suspicious KYC request flagged in Mumbai...",
    "Crypto wallet drainer identified in Tokyo...",
    "Impersonation attack stopped in Berlin...",
    "Fake courier SMS blocked in Sydney...",
    "Bank account freeze scam detected in Toronto..."
];

const LiveAlerts = () => {
    const [currentThreat, setCurrentThreat] = useState(threats[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % threats.length;
            setCurrentThreat(threats[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="live-alerts glass-panel">
            <div className="alert-header">
                <span className="live-dot"></span>
                Global Threat Stream
            </div>
            <div className="alert-content">
                <div className="threat-text" key={currentThreat}>
                    🚫 {currentThreat}
                </div>
            </div>
        </div>
    );
};

export default LiveAlerts;
