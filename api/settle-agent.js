// api/settle-agent.js
// Vercel Serverless Function: POST /api/settle-agent
// Autonomous Settle-Up Agent: Resolves natural language commands ("settle everything from Tokyo"),
// computes Min-Cash-Flow optimal transactions, and prepares PayPal Sandbox payments.

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
    let { query = '', currentUserId = 'u1', groups = [], expenses = [], settlements = [] } = req.body || {};

    if (!groups.length) {
      // Graceful fallback to default demo state if not provided in payload
      groups = [
        { id: 'g1', name: 'Tokyo Trip 2026', flag: '🇯🇵', members: ['u1', 'u2', 'u3', 'u4'], budget: 3000 },
        { id: 'g2', name: 'Apartment Roommates', flag: '🏠', members: ['u1', 'u2', 'u3'], budget: 2000 },
        { id: 'g3', name: 'Friday Pizza Club', flag: '🍕', members: ['u1', 'u2', 'u4'], budget: 500 }
      ];
      expenses = [
        { id: 'e1', groupId: 'g1', payerId: 'u1', amount: 84.00, splits: [{ userId: 'u1', amount: 21 }, { userId: 'u2', amount: 21 }, { userId: 'u3', amount: 21 }, { userId: 'u4', amount: 21 }] },
        { id: 'e2', groupId: 'g1', payerId: 'u2', amount: 48.00, splits: [{ userId: 'u1', amount: 12 }, { userId: 'u2', amount: 12 }, { userId: 'u3', amount: 12 }, { userId: 'u4', amount: 12 }] }
      ];
    }

    // 1. Identify Target Group from User Query
    const normalizedQuery = query.toLowerCase();
    let targetGroup = groups.find(g => normalizedQuery.includes(g.name.toLowerCase()));
    
    // Fuzzy matching for trip names (e.g. "tokyo", "roommates", "pizza", "goa")
    if (!targetGroup) {
      if (normalizedQuery.includes('tokyo') || normalizedQuery.includes('japan')) {
        targetGroup = groups.find(g => g.name.toLowerCase().includes('tokyo'));
      } else if (normalizedQuery.includes('roommate') || normalizedQuery.includes('apt') || normalizedQuery.includes('apartment')) {
        targetGroup = groups.find(g => g.name.toLowerCase().includes('apartment'));
      } else if (normalizedQuery.includes('pizza') || normalizedQuery.includes('friday')) {
        targetGroup = groups.find(g => g.name.toLowerCase().includes('pizza'));
      } else if (normalizedQuery.includes('goa')) {
        // If user says Goa, dynamically match or adapt
        targetGroup = groups[0];
      }
    }

    if (!targetGroup) {
      targetGroup = groups[0]; // default to first active group
    }

    // 2. Filter expenses & completed settlements for target group
    const groupExpenses = expenses.filter(e => e.groupId === targetGroup.id);
    const groupSettlements = settlements.filter(s => s.groupId === targetGroup.id && s.status === 'COMPLETED');

    // 3. Compute Net Balance for Each Member (in cents to avoid float errors)
    const netMap = {};
    targetGroup.members.forEach(mId => {
      netMap[mId] = 0;
    });

    groupExpenses.forEach(exp => {
      const payerId = exp.payerId;
      let expAmt = parseFloat(exp.amount || 0);
      let expCents = expAmt > 500 ? Math.round(expAmt) : Math.round(expAmt * 100);
      netMap[payerId] = (netMap[payerId] || 0) + expCents;

      (exp.splits || []).forEach(sp => {
        let spAmt = parseFloat(sp.amount || 0);
        let spCents = spAmt > 500 ? Math.round(spAmt) : Math.round(spAmt * 100);
        netMap[sp.userId] = (netMap[sp.userId] || 0) - spCents;
      });
    });

    groupSettlements.forEach(st => {
      let stAmt = parseFloat(st.amount || 0);
      let amtCents = stAmt > 500 ? Math.round(stAmt) : Math.round(stAmt * 100);
      if (st.payerId) netMap[st.payerId] = (netMap[st.payerId] || 0) + amtCents;
      if (st.payeeId) netMap[st.payeeId] = (netMap[st.payeeId] || 0) - amtCents;
    });

    // 4. Greedy Min-Cash-Flow Graph Optimization
    const debtors = [];
    const creditors = [];

    for (const [userId, netCents] of Object.entries(netMap)) {
      if (netCents < -50) { // owes more than 50 cents
        debtors.push({ userId, amountCents: Math.abs(netCents) });
      } else if (netCents > 50) { // is owed more than 50 cents
        creditors.push({ userId, amountCents: netCents });
      }
    }

    debtors.sort((a, b) => b.amountCents - a.amountCents);
    creditors.sort((a, b) => b.amountCents - a.amountCents);

    const optimalTransactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settledCents = Math.min(debtor.amountCents, creditor.amountCents);

      if (settledCents > 0) {
        optimalTransactions.push({
          id: `opt-${Date.now()}-${i}-${j}`,
          groupId: targetGroup.id,
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amountCents: settledCents,
          amount: Math.round(settledCents) / 100,
          currency: 'USD',
          isCurrentUserPayer: debtor.userId === currentUserId,
          isCurrentUserPayee: creditor.userId === currentUserId,
          status: 'PENDING_APPROVAL'
        });
      }

      debtor.amountCents -= settledCents;
      creditor.amountCents -= settledCents;

      if (debtor.amountCents === 0) i++;
      if (creditor.amountCents === 0) j++;
    }

    // 5. Generate Natural Language Agent Explanation
    const rawTxCount = groupExpenses.length;
    const reducedTxCount = optimalTransactions.length;
    let explanation = '';

    if (reducedTxCount === 0) {
      explanation = `All members in ${targetGroup.name} are already 100% squared away! Zero pending transfers required.`;
    } else {
      explanation = `I analyzed all active transactions in "${targetGroup.name}". Through the Min-Cash-Flow reduction algorithm, I condensed cross-member debts down to just ${reducedTxCount} optimal payment${reducedTxCount > 1 ? 's' : ''}. You can approve each transfer directly via PayPal below.`;
    }

    return res.status(200).json({
      success: true,
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      explanation,
      transactionsReduced: Math.max(0, rawTxCount - reducedTxCount),
      optimalTransactions
    });

  } catch (error) {
    console.error('Server error in /api/settle-agent:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};

