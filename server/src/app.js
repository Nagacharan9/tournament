import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/tournaments', (req, res) => {
  res.json({
    tournaments: [
      {
        id: 1,
        name: 'Weekly Trading Cup',
        status: 'active',
        prize: '$10,000',
        participants: 1250
      },
      {
        id: 2,
        name: 'Monthly Championship',
        status: 'upcoming',
        prize: '$50,000',
        participants: 0
      },
      {
        id: 3,
        name: 'Daily Battle',
        status: 'active',
        prize: '$5,000',
        participants: 850
      }
    ]
  });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, username: 'TraderPro', balance: '$125,430', winRate: '68%' },
      { rank: 2, username: 'CryptoKing', balance: '$98,750', winRate: '65%' },
      { rank: 3, username: 'FxNinja', balance: '$87,920', winRate: '62%' },
      { rank: 4, username: 'StockMaster', balance: '$76,540', winRate: '59%' },
      { rank: 5, username: 'OptionSmith', balance: '$65,320', winRate: '56%' }
    ]
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  res.status(201).json({
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    message: 'Registration successful'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  res.json({
    token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
    user: {
      id: 'user_123',
      username: 'trader',
      email
    }
  });
});

// OTP Endpoints
const otpStore = new Map(); // Store OTPs in memory (use Redis in production)

app.post('/api/auth/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with 10-minute expiry
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });

  console.log(`📧 OTP sent to ${email}: ${otp}`);
  
  // In production, send via email service (SendGrid, AWS SES, etc.)
  // await emailService.sendOTP(email, otp);

  res.json({
    success: true,
    message: 'OTP sent successfully',
    email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email for security
    expiresIn: 600 // 10 minutes in seconds
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const storedOTP = otpStore.get(email);

  if (!storedOTP) {
    return res.status(400).json({ error: 'OTP not found or expired. Request a new OTP.' });
  }

  // Check expiry
  if (Date.now() > storedOTP.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Request a new one.' });
  }

  // Check attempts (max 5)
  if (storedOTP.attempts >= 5) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Too many attempts. Request a new OTP.' });
  }

  // Verify OTP
  if (storedOTP.otp !== otp) {
    storedOTP.attempts++;
    return res.status(400).json({ 
      error: 'Invalid OTP',
      attemptsRemaining: 5 - storedOTP.attempts 
    });
  }

  // OTP verified successfully
  otpStore.delete(email);

  console.log(`✅ OTP verified for ${email}`);

  res.json({
    success: true,
    message: 'Email verified successfully',
    verified: true
  });
});

// Email Validation
app.post('/api/auth/validate-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  res.json({
    valid: isValid,
    message: isValid ? 'Email format is valid' : 'Invalid email format'
  });
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send initial data
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to TradeArena server',
    timestamp: new Date().toISOString()
  }));

  // Simulate market data updates
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'marketUpdate',
        data: {
          EURUSD: (Math.random() * 1.2).toFixed(5),
          GBPUSD: (Math.random() * 1.3).toFixed(5),
          USDJPY: (Math.random() * 150).toFixed(2),
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, 2000);

  ws.on('message', (message) => {
    console.log('Received message:', message);
    
    // Echo back to client
    ws.send(JSON.stringify({
      type: 'echo',
      originalMessage: message,
      timestamp: new Date().toISOString()
    }));
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`✅ TradeArena server running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket server ready on ws://localhost:${PORT}`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/api/health`);
});

export default app;
