// api/create-order.js
// Vercel Serverless Function: POST /api/create-order

const { getPayPalBaseUrl, getPayPalAccessToken } = require('./paypal-auth');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { amount, currency = 'USD', description = 'SplitSmart Settlement', settlementId } = req.body || {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid or missing amount parameter.' });
    }

    const formattedAmount = parseFloat(amount).toFixed(2);

    // Check if PayPal credentials are configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      // In local demo mode without env set, provide a transparent fallback notice
      return res.status(200).json({
        id: 'DEMO-ORDER-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        status: 'CREATED',
        demoNotice: 'PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET not set in .env. Configure them for live sandbox OAuth.'
      });
    }

    const accessToken = await getPayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: settlementId || `settle-${Date.now()}`,
            description: description.substring(0, 127),
            amount: {
              currency_code: currency,
              value: formattedAmount
            }
          }
        ],
        application_context: {
          brand_name: 'SplitSmart',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal Create Order Error:', data);
      return res.status(response.status).json({
        error: 'Failed to create PayPal order',
        details: data
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status
    });
  } catch (error) {
    console.error('Server error creating PayPal order:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};
