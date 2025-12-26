import React, { useState } from 'react';
import MessageInput from './components/MessageInput';
import AnalysisResult from './components/AnalysisResult';
import { analyzeMessage } from './utils/mockAi';


function App() {
  const [screen, setScreen] = useState('input'); // input, analyzing, result
  const [result, setResult] = useState(null);

  const handleAnalyze = async (text) => {
    setScreen('analyzing');
    // Using mock logic
    const data = await analyzeMessage(text);
    setResult(data);
    setScreen('result');
  };

  const handleReset = () => {
    setResult(null);
    setScreen('input');
  };

  return (
    <div className="app-container">
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        opacity: screen === 'analyzing' ? 0.5 : 1,
        transition: 'opacity 0.5s'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>
          ScamGuard Lite
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
          AI-Powered Financial Fraud Detection
        </p>
      </header>

      <main>
        {screen === 'input' || screen === 'analyzing' ? (
          <MessageInput onAnalyze={handleAnalyze} isAnalyzing={screen === 'analyzing'} />
        ) : (
          <AnalysisResult result={result} onReset={handleReset} />
        )}
      </main>

      {/* Background Decor */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
    </div>
  );
}

export default App;
