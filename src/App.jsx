import { useState, useEffect } from 'react'
import './App.css'
import { apiClient, WebSocketClient } from './api/client'

function App() {
  const [tournaments, setTournaments] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const wsClient = new WebSocketClient()

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Check backend health
        await apiClient.getHealth()
        console.log('✅ Backend is healthy')
        
        // Fetch tournaments
        const tournamentsData = await apiClient.getTournaments()
        setTournaments(tournamentsData.tournaments || [])
        console.log('✅ Tournaments loaded:', tournamentsData.tournaments)
        
        // Fetch leaderboard
        const leaderboardData = await apiClient.getLeaderboard()
        setLeaderboard(leaderboardData.leaderboard || [])
        console.log('✅ Leaderboard loaded:', leaderboardData.leaderboard)
        
        setError(null)
      } catch (err) {
        console.error('❌ Error fetching data:', err)
        setError(err.message || 'Failed to connect to backend')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await wsClient.connect()
        setWsConnected(true)
        console.log('✅ WebSocket connected')
        
        // Listen for market updates
        wsClient.onMessage((data) => {
          if (data.type === 'marketUpdate') {
            setMarketData(data.data)
          }
        })
      } catch (err) {
        console.error('❌ WebSocket connection error:', err)
        setWsConnected(false)
      }
    }

    connectWebSocket()

    // Cleanup
    return () => {
      wsClient.close()
    }
  }, [])

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
          
          {/* Status Indicators */}
          <div className="status-bar">
            <span className={`status ${loading ? 'loading' : 'ready'}`}>
              {loading ? '⏳ Loading...' : '✅ Ready'}
            </span>
            <span className={`status ${wsConnected ? 'connected' : 'disconnected'}`}>
              {wsConnected ? '🔗 WebSocket Connected' : '❌ WebSocket Disconnected'}
            </span>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
      
      <section className="features">
        <div className="feature-card">
          <h3>Live Trading</h3>
          <p>Real-time trading experience with live market data</p>
          {marketData && (
            <div className="market-data">
              <small>EUR/USD: {marketData.EURUSD}</small>
              <small>GBP/USD: {marketData.GBPUSD}</small>
            </div>
          )}
        </div>
        <div className="feature-card">
          <h3>Tournaments</h3>
          <p>Compete with traders worldwide in exciting tournaments</p>
          {tournaments.length > 0 && (
            <div className="tournament-list">
              {tournaments.map((t) => (
                <div key={t.id} className="tournament-item">
                  <strong>{t.name}</strong> - {t.participants} participants
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="feature-card">
          <h3>Leaderboards</h3>
          <p>Track your ranking and compete for prizes</p>
          {leaderboard.length > 0 && (
            <div className="leaderboard-list">
              {leaderboard.slice(0, 3).map((user) => (
                <div key={user.rank} className="leaderboard-item">
                  #{user.rank} {user.username} - {user.balance}
                </div>
              ))}
            </div>
          )}
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
