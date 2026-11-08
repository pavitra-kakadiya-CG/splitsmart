// api/capture-order.js
// Vercel Serverless Function: POST /api/capture-order

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
    const { orderId, settlementId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ error: 'Missing required parameter: orderId' });
    }

    // Check if PayPal credentials are configured or demo order requested
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET || orderId.startsWith('DEMO-')) {
      return res.status(200).json({
        success: true,
        id: 'DEMO-CAPTURE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        orderId: orderId,
        status: 'COMPLETED',
        payer: {
          name: { given_name: 'Demo Buyer (Sandbox)' },
          email_address: 'sb-buyer@personal.example.com'
        },
        demoNotice: 'Captured in local demo mode. Configure PAYPAL_CLIENT_ID & SECRET in .env for live sandbox API.'
      });
    }

    const accessToken = await getPayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal Capture Order Error:', data);
      return res.status(response.status).json({
        error: 'Failed to capture PayPal order',
        details: data
      });
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0] || {};

    return res.status(200).json({
      success: true,
      id: capture.id || data.id,
      orderId: data.id,
      status: data.status,
      payer: data.payer || {},
      amount: capture.amount || {}
    });
  } catch (error) {
    console.error('Server error capturing PayPal order:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};

