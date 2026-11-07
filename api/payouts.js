// api/payouts.js
// Vercel Serverless Function: POST /api/payouts
// PayPal Payouts API v1 for direct peer-to-peer friend disbursements in Sandbox

const { getPayPalBaseUrl, getPayPalAccessToken } = require('./paypal-auth');

module.exports = async function handler(req, res) {
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
    const { receiverEmail, amount, currency = 'USD', note = 'SplitSmart Settlement', settlementId } = req.body || {};

    if (!receiverEmail || !amount) {
      return res.status(400).json({ error: 'Missing required parameters: receiverEmail, amount' });
    }

    const formattedAmount = parseFloat(amount).toFixed(2);
    const batchId = `SplitSmart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // If sandbox credentials not set, return realistic demo payout receipt
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return res.status(200).json({
        success: true,
        payoutBatchId: 'DEMO-BATCH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        batchStatus: 'SUCCESS',
        receiver: receiverEmail,
        amount: formattedAmount,
        currency,
        demoNotice: 'Simulated Payout. Configure PAYPAL_CLIENT_ID & SECRET in .env for live Sandbox Payouts API.'
      });
    }

    const accessToken = await getPayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v1/payments/payouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: batchId,
          email_subject: 'SplitSmart Group Settlement Payout',
          email_message: `You received a settlement of ${currency} ${formattedAmount} via SplitSmart!`
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: formattedAmount,
              currency: currency
            },
            receiver: receiverEmail,
            note: note.substring(0, 255),
            sender_item_id: settlementId || `item_${Date.now()}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('PayPal Payouts API error:', data);
      return res.status(response.status).json({
        error: 'PayPal Payout request failed',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      payoutBatchId: data.batch_header?.payout_batch_id,
      batchStatus: data.batch_header?.batch_status || 'PENDING',
      receiver: receiverEmail,
      amount: formattedAmount,
      currency
    });
  } catch (error) {
    console.error('Server error in /api/payouts:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};
