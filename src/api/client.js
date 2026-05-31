// API Client for TradeArena Backend
const API_BASE_URL = 'http://localhost:3001/api';
const WS_URL = 'ws://localhost:3001';

export const apiClient = {
  // Health check
  async getHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  // Authentication
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      // Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Tournaments
  async getTournaments() {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments`);
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      return await response.json();
    } catch (error) {
      console.error('Tournaments fetch error:', error);
      throw error;
    }
  },

  // Leaderboard
  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      throw error;
    }
  },

  // OTP Management
  async sendOtp(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      return await response.json();
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  async verifyOtp(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      if (!response.ok) throw new Error('Invalid OTP');
      return await response.json();
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  // Email Validation
  async validateEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Email validation failed');
      return await response.json();
    } catch (error) {
      console.error('Email validation error:', error);
      throw error;
    }
  }
};

// WebSocket Client
export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(url = WS_URL) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve(this.ws);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(url);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  attemptReconnect(url) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect(url).catch(() => {});
      }, this.reconnectDelay);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
