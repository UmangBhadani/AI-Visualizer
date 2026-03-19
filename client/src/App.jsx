import { useState } from 'react';
import DiagramViewer from './components/DiagramViewer';
import './App.css';

const API_URL = 'http://localhost:3001/api/visualize';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [diagram, setDiagram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVisualize = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setDiagram(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      setDiagram(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleVisualize();
  };

  return (
    <div className="app">
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      <header className="header">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="url(#grad)" strokeWidth="2" />
            <circle cx="8" cy="11" r="2.5" fill="#818cf8" />
            <circle cx="18" cy="9" r="2.5" fill="#a78bfa" />
            <circle cx="14" cy="18" r="2.5" fill="#c084fc" />
            <line x1="10" y1="11" x2="16" y2="9.5" stroke="#6366f1" strokeWidth="1.2" />
            <line x1="9" y1="13" x2="13" y2="17" stroke="#6366f1" strokeWidth="1.2" />
            <line x1="17" y1="11" x2="15" y2="17" stroke="#6366f1" strokeWidth="1.2" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <h1>AI Visualizer</h1>
        </div>
        <p className="subtitle">
          Turn any concept into an interactive diagram with AI
        </p>
      </header>

      <div className="input-area">
        <div className="input-wrapper">
          <input
            id="prompt-input"
            type="text"
            placeholder="e.g. how does the water cycle work"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            id="visualize-btn"
            onClick={handleVisualize}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Generating…
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 8h12M10 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Visualize
              </>
            )}
          </button>
        </div>

        {/* Suggestion chips */}
        {!diagram && !loading && (
          <div className="suggestions">
            {[
              'How does photosynthesis work',
              'Explain the software development lifecycle',
              'How does a neural network learn',
              'The process of making coffee',
            ].map((s) => (
              <button
                key={s}
                className="chip"
                onClick={() => setPrompt(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#f87171" strokeWidth="1.5" />
            <line x1="9" y1="5" x2="9" y2="10" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="13" r="1" fill="#f87171" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && !diagram && (
        <div className="loading-state">
          <div className="pulse-ring" />
          <p>Analyzing concept and generating diagram…</p>
        </div>
      )}

      {diagram && <DiagramViewer diagram={diagram} />}
    </div>
  );
}
