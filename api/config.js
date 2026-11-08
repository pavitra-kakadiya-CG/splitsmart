// api/config.js
// Vercel Serverless Function: GET /api/config
// Exposes public client configuration (e.g. PayPal Sandbox Client ID) securely

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Only expose the public client-side ID (never the secret)
  const paypalClientId = process.env.PAYPAL_CLIENT_ID || 'test';

  return res.status(200).json({
    paypalClientId,
    hasServerGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
  });
};
