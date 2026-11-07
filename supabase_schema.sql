-- Supabase Schema for SplitSmart Persistent Cloud Storage
-- Run this in your Supabase SQL Editor if you want to connect a free Supabase PostgreSQL database!

CREATE TABLE IF NOT EXISTS splitsmart_state (
  id TEXT PRIMARY KEY DEFAULT 'default',
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default starter state
INSERT INTO splitsmart_state (id, state)
VALUES ('default', '{
  "groups": [
    { "id": "g1", "name": "Tokyo Trip 2026", "flag": "🇯🇵", "members": ["u1", "u2", "u3", "u4"], "budget": 3000 },
    { "id": "g2", "name": "Apartment Roommates", "flag": "🏠", "members": ["u1", "u2", "u3"], "budget": 2000 },
    { "id": "g3", "name": "Friday Pizza Club", "flag": "🍕", "members": ["u1", "u2", "u4"], "budget": 500 }
  ],
  "expenses": [
    {
      "id": "e1",
      "groupId": "g1",
      "payerId": "u1",
      "amount": 84.00,
      "description": "Shinjuku Izakaya Banquet 🍶",
      "category": "DINING",
      "splitType": "EQUAL",
      "date": "2026-11-06",
      "splits": [
        { "userId": "u1", "amount": 21.00 },
        { "userId": "u2", "amount": 21.00 },
        { "userId": "u3", "amount": 21.00 },
        { "userId": "u4", "amount": 21.00 }
      ]
    }
  ],
  "settlements": [],
  "paypalBalance": 2450.00
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) with open read/write for demo simplicity
ALTER TABLE splitsmart_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on splitsmart_state"
  ON splitsmart_state FOR SELECT
  USING (true);

CREATE POLICY "Allow public update on splitsmart_state"
  ON splitsmart_state FOR ALL
  USING (true);

