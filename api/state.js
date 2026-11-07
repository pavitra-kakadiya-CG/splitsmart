// api/state.js
// Vercel Serverless Function: GET/POST /api/state
// Persistent State Storage for Groups, Expenses, and Settlements

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// In-memory fallback cache for serverless environments with read-only root filesystems
let memoryStore = null;

function getInitialState() {
  return {
    groups: [
      { id: 'g1', name: 'Tokyo Trip 2026', flag: '🇯🇵', members: ['u1', 'u2', 'u3', 'u4'], budget: 3000 },
      { id: 'g2', name: 'Apartment Roommates', flag: '🏠', members: ['u1', 'u2', 'u3'], budget: 2000 },
      { id: 'g3', name: 'Friday Pizza Club', flag: '🍕', members: ['u1', 'u2', 'u4'], budget: 500 }
    ],
    expenses: [
      {
        id: 'e1',
        groupId: 'g1',
        payerId: 'u1',
        amount: 84.00,
        description: 'Shinjuku Izakaya Banquet 🍶',
        category: 'DINING',
        splitType: 'EQUAL',
        date: '2026-11-06',
        splits: [
          { userId: 'u1', amount: 21.00 },
          { userId: 'u2', amount: 21.00 },
          { userId: 'u3', amount: 21.00 },
          { userId: 'u4', amount: 21.00 }
        ]
      },
      {
        id: 'e2',
        groupId: 'g1',
        payerId: 'u2',
        amount: 48.00,
        description: 'Tokyo Metro 72hr Passes 🚅',
        category: 'TRAVEL',
        splitType: 'EQUAL',
        date: '2026-11-05',
        splits: [
          { userId: 'u1', amount: 12.00 },
          { userId: 'u2', amount: 12.00 },
          { userId: 'u3', amount: 12.00 },
          { userId: 'u4', amount: 12.00 }
        ]
      }
    ],
    settlements: [
      {
        id: 's-initial-1',
        groupId: 'g1',
        payerId: 'u3',
        payeeId: 'u1',
        amount: 25.00,
        status: 'COMPLETED',
        method: 'PAYPAL_SANDBOX',
        txId: 'PP-SANDBOX-INIT892',
        date: '2026-11-05T14:30:00.000Z'
      }
    ],
    paypalBalance: 2450.00,
    lastUpdated: new Date().toISOString()
  };
}

function loadState() {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      memoryStore = JSON.parse(content);
      return memoryStore;
    }
  } catch (e) {
    console.warn('Could not read db.json, using in-memory default:', e.message);
  }

  memoryStore = getInitialState();
  return memoryStore;
}

function saveState(data) {
  memoryStore = {
    ...loadState(),
    ...data,
    lastUpdated: new Date().toISOString()
  };

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    // In serverless environments (like AWS Lambda / Vercel), /tmp is writable but project root might be read-only
    console.warn('Could not write db.json to filesystem, saved in-memory:', e.message);
  }

  return memoryStore;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const currentState = loadState();
    return res.status(200).json(currentState);
  }

  if (req.method === 'POST') {
    const updated = saveState(req.body || {});
    return res.status(200).json({ success: true, state: updated });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};

