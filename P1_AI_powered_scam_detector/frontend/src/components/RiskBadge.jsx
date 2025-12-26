import React from 'react';

const RiskBadge = ({ level }) => {
    let className = 'risk-badge ';
    let text = '';
    let icon = '';

    switch (level) {
        case 'safe':
            className += 'badge-safe';
            text = 'Safe';
            icon = '🟢';
            break;
        case 'suspicious':
            className += 'badge-suspicious';
            text = 'Suspicious';
            icon = '🟡';
            break;
        case 'high-risk':
            className += 'badge-danger';
            text = 'High Risk'; // Removed "Scam" to be more professional
            icon = '🛡️'; // Shield icon is more professional than red circle
            break;
        default:
            className += 'badge-safe';
            text = 'Unknown';
    }

    return (
        <div className={className}>
            <span style={{ marginRight: '10px' }}>{icon}</span>
            {text}
        </div>
    );
};

export default RiskBadge;
