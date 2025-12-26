import React, { useState } from 'react';
import MessageInput from './components/MessageInput';
import AnalysisResult from './components/AnalysisResult';
import { analyzeMessage } from './utils/mockAi';

function App() {
  const [screen, setScreen] = useState('input'); // input, analyzing, result
  const [result, setResult] = useState(null);

  const handleAnalyze = async (text, files) => {
    setScreen('analyzing');
    // Using mock logic
    const data = await analyzeMessage(text, files);
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
        marginBottom: '2.5rem',
        opacity: screen === 'analyzing' ? 0.3 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        {/* Logo/Icon placeholder if needed, for now typography */}
        <h1 style={{
          margin: 0,
          fontSize: '2rem',
          fontWeight: 700,
          background: 'linear-gradient(to bottom right, #f8fafc, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>
          ScamGuard
        </h1>
        <p style={{
          marginTop: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          fontWeight: 400
        }}>
          Professional Fraud Detection System
        </p>
      </header>

      <main>
        {screen === 'input' || screen === 'analyzing' ? (
          <MessageInput onAnalyze={handleAnalyze} isAnalyzing={screen === 'analyzing'} />
        ) : (
          <AnalysisResult result={result} onReset={handleReset} />
        )}
      </main>

      {/* Background Decor - Refined for Professional look (Subtle Glows) */}
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
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
    </div>
  );
}

export default App;
