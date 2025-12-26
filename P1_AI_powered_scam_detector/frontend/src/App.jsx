import React, { useState, useEffect } from 'react';
import MessageInput from './components/MessageInput';
import ChatStream from './components/ChatStream';
import Sidebar from './components/Sidebar';
import LiveAlerts from './components/LiveAlerts';
import SafetyTips from './components/SafetyTips';
import HistoryPanel from './components/HistoryPanel';
import { analyzeMessage } from './utils/mockAi';

function App() {
  const [activeTab, setActiveTab] = useState('scan'); // scan, history, tips
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scamGuardHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (data, text) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      result: data,
      text: text || "File Attachment"
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('scamGuardHistory', JSON.stringify(updatedHistory));
  };

  const handleAnalyze = async (text, files) => {
    setIsAnalyzing(true);

    // Add User Message
    const userMsgId = Date.now();
    const newMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      files: files
    };

    // Add Placeholder AI Message
    const aiMsgId = userMsgId + 1;
    const loadingMessage = {
      id: aiMsgId,
      role: 'ai',
      isLoading: true
    };

    setMessages(prev => [...prev, newMessage, loadingMessage]);

    // Process
    const data = await analyzeMessage(text, files);

    // Update AI Message
    setMessages(prev => prev.map(msg =>
      msg.id === aiMsgId
        ? { ...msg, isLoading: false, result: data }
        : msg
    ));

    saveToHistory(data, text);
    setIsAnalyzing(false);
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <HistoryPanel history={history} />
        </div>
      );
    }

    if (activeTab === 'tips') {
      return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', animation: 'fadeInUp 0.4s ease-out' }}>
          <h2 style={{ marginBottom: '2rem' }}>Security Knowledge Base</h2>
          <SafetyTips />
        </div>
      );
    }

    // Default: Chat Interface
    return (
      <div className="chat-layout-main">
        <ChatStream messages={messages} />
        <MessageInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        {activeTab !== 'scan' && <LiveAlerts />} {/* Only show ticker on non-chat pages to keep chat clean? Or keep it? keeping it clean for chat is better */}
        {renderContent()}
      </main>

      {/* Background Decor */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 60%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
    </div>
  );
}

export default App;
