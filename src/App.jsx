import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            TradeArena
          </h1>
          <p className="hero-subtitle">
            The world's most intense tournament trading platform
          </p>
          <p className="hero-description">
            Compete, trade, and win massive prizes in real-time trading competitions
          </p>
          <button className="cta-button" onClick={() => setCount((count) => count + 1)}>
            Get Started (Clicks: {count})
          </button>
        </div>
      </div>
      
      <section className="features">
        <div className="feature-card">
          <h3>Live Trading</h3>
          <p>Real-time trading experience with live market data</p>
        </div>
        <div className="feature-card">
          <h3>Tournaments</h3>
          <p>Compete with traders worldwide in exciting tournaments</p>
        </div>
        <div className="feature-card">
          <h3>Leaderboards</h3>
          <p>Track your ranking and compete for prizes</p>
        </div>
        <div className="feature-card">
          <h3>Security</h3>
          <p>Bank-level security for your trading account</p>
        </div>
      </section>
    </>
  )
}

export default App
