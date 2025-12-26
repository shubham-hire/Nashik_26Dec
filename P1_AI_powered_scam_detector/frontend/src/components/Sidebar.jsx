import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'scan', label: 'New Scan', icon: '🔍' },
        { id: 'history', label: 'History', icon: '📜' },
        { id: 'tips', label: 'Security Tips', icon: '💡' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">🛡️</div>
                <div className="brand-text">ScamGuard</div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => onTabChange(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    System Online
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
