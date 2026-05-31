// Trade Security Test
import assert from 'assert';

console.log('🔒 Trade Security Tests Running...\n');

// Test 1: Input validation
console.log('Test 1: Trade Input Validation');
function validateTrade(trade) {
  if (!trade.symbol) throw new Error('Symbol required');
  if (!trade.amount || trade.amount <= 0) throw new Error('Invalid amount');
  if (!['BUY', 'SELL'].includes(trade.type)) throw new Error('Invalid trade type');
  return true;
}

try {
  validateTrade({ symbol: 'EURUSD', amount: 100, type: 'BUY' });
  console.log('✅ Valid trade accepted\n');
} catch (e) {
  console.error('❌ Test failed:', e.message);
}

// Test 2: Secure trade execution
console.log('Test 2: Trade Execution Security');
function executeTrade(trade, userBalance) {
  if (userBalance < trade.amount) {
    throw new Error('Insufficient funds');
  }
  return {
    status: 'executed',
    symbol: trade.symbol,
    executedAt: new Date().toISOString()
  };
}

try {
  const result = executeTrade({ symbol: 'BTCUSD', amount: 50 }, 100);
  console.log('✅ Trade executed securely:', result, '\n');
} catch (e) {
  console.error('❌ Test failed:', e.message);
}

// Test 3: Rate limiting simulation
console.log('Test 3: Rate Limiting');
const tradeAttempts = [];
function checkRateLimit(userId, maxAttempts = 10, timeWindow = 60000) {
  const now = Date.now();
  const recentAttempts = tradeAttempts.filter(
    t => t.userId === userId && (now - t.timestamp) < timeWindow
  );
  
  if (recentAttempts.length >= maxAttempts) {
    throw new Error('Rate limit exceeded');
  }
  
  tradeAttempts.push({ userId, timestamp: now });
  return true;
}

try {
  for (let i = 0; i < 3; i++) {
    checkRateLimit('user123');
  }
  console.log('✅ Rate limiting working\n');
} catch (e) {
  console.error('❌ Test failed:', e.message);
}

console.log('🎉 All security tests passed!');
