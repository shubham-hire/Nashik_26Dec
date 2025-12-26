import React from 'react';

const tips = [
    {
        title: "Verify the Sender",
        text: "Banks never ask for OTPs or passwords via SMS. Always check the official app.",
        icon: "🏦"
    },
    {
        title: "Don't Click Links",
        text: "Avoid clicking shortened URLs (bit.ly, etc.) in unsolicited messages.",
        icon: "🔗"
    },
    {
        title: "Urgency is a Trap",
        text: "Scammers create panic (e.g., 'Account Blocked'). Stay calm and verify manually.",
        icon: "🚨"
    }
];

const SafetyTips = () => {
    return (
        <div className="tips-grid">
            {tips.map((tip, index) => (
                <div key={index} className="tip-card glass-panel">
                    <div className="tip-icon">{tip.icon}</div>
                    <h3 className="tip-title">{tip.title}</h3>
                    <p className="tip-text">{tip.text}</p>
                </div>
            ))}
        </div>
    );
};

export default SafetyTips;
