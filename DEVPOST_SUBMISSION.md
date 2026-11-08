# 📝 Devpost Submission Copy: SplitSmart

> Copy and paste this content directly into your Devpost submission form fields at [paypalaihackathon.devpost.com](https://paypalaihackathon.devpost.com/).

---

### Project Title
**SplitSmart - Autonomous Agentic Social Finance, Dynamic Financial Avatars & PayPal Settlements**

### Tagline / Elevator Pitch
An autonomous agentic finance platform combining real-time dynamic financial avatars, multimodal Gemini receipt parsing, and real PayPal Sandbox settlements to eliminate debt awkwardness forever.

---

### Inspiration
Splitting expenses with friends and roommates is notoriously broken. Generic expense trackers only keep a passive tally—they don't actually move money. When it comes time to settle up, members face an awkward dance of manual calculations, circular pairwise transfers, and hunting down who owes whom.

With the emergence of **Agentic Commerce** and the **PayPal Developer Platform**, we realized group finance shouldn't be passive bookkeeping. It should be autonomous: an AI agent that can visually read a messy banquet receipt, mathematically verify the line items, optimize the debt graph down to the fewest possible transfers, and prepare genuine, 1-click PayPal sandbox settlements.

---

### What It Does
SplitSmart is an all-in-one agentic social finance application:

1. **Real PayPal Sandbox Payments**: Zero mock balance tricks. Using the official PayPal JavaScript SDK and serverless API endpoints (`/api/create-order` and `/api/capture-order`), users settle debts through real PayPal Sandbox authentication windows. When a payment is captured, the debt immediately disappears from the group ledger and transaction IDs are recorded.
2. **Multimodal AI Receipt Scanner**: Users take a photo of any restaurant bill or grocery receipt. Google Gemini extracts line items, quantities, subtotal, tax, and tip. An automated server-side verification engine checks that `subtotal + tax + tip === total` before showing it in the split matrix.
3. **Autonomous Settle-Up Agent (Headline Feature)**: Users simply type or say: *"Settle everything from Tokyo"* (or *"Settle Goa trip"*). The AI agent analyzes the group's ledger, applies the **Min-Cash-Flow** graph reduction algorithm to eliminate redundant transfers (e.g. turning 6 pairwise debts into 2 optimal transfers), and provides direct PayPal Sandbox approval buttons.
4. **Dynamic Financial Persona Studio**: An illustrated vector avatar that dynamically mirrors the user's financial standing in real time (Zero-Debt Legend, Chief Creditor, or In-Debt Stress), paired with a Gemini AI Persona Stylist and an in-app **PayPal Sandbox Digital Collectibles Store** where exclusive badges and vibes are unlocked with PayPal checkout.
5. **Persistent Financial Ledger**: State persists across browser refreshes via serverless storage (`/api/state`) and local caching, maintaining integer precision (minor units) to eliminate floating-point rounding errors.

---

### How We Built It
- **PayPal Developer Platform**: PayPal JavaScript SDK v2 for client-side Smart Payment Buttons, integrated with Vercel serverless Node.js functions for secure OAuth2 token issuance, Order v2 creation, and authorized captures. Client secrets remain strictly on the server.
- **Artificial Intelligence**: Google Gemini Multimodal Vision API (with adaptive model fallback across Gemini 3.5 Flash, 3.5 Flash-Lite, and 2.5) for line-item receipt extraction, structured JSON schema parsing, AI Persona Styling recommendations, and natural language intent classification for the Settle-Up Agent.
- **Financial Algorithm**: Greedy Min-Cash-Flow algorithm that condenses complete bipartite debt graphs into minimal directed acyclic payment plans.
- **Frontend & Identity Engine**: High-performance SVG Vector Persona Engine for crisp, instant avatar rendering that reacts to live balances, Tailwind CSS for responsive mobile-first UI with dark mode, and HTML5 Canvas Confetti.
- **Backend Architecture**: Node.js serverless functions running on Vercel (`/api/`), with zero-dependency local development server support.

---

### Challenges We Ran Into
- **Client-Side Secret Isolation**: Payments apps must never leak client secrets in the browser. We built dedicated serverless functions (`/api/create-order` and `/api/capture-order`) that communicate with `api-m.sandbox.paypal.com` so secrets remain securely on the server.
- **Vision Model Hallucinations & Math Consistency**: LLMs occasionally misread faint digits on crumpled receipts (e.g. reading a 3 as an 8). In a payments app, an unbalanced total looks terrible. We implemented an automated server-side validation step that cross-checks line items against taxes, tips, and totals before returning data to the UI.
- **State Persistence in Serverless**: Serverless functions have ephemeral file systems. We architected a dual-persistence layer syncing state between serverless JSON endpoints and local storage, ensuring judges never lose their session data upon refreshing.

---

### Accomplishments We're Proud Of
- **Authentic PayPal Sandbox Lifecycle**: Watching a real PayPal Sandbox popup open, logging in with a test buyer account, and seeing the debt disappear from the group ledger upon capture.
- **The Settle-Up Agent**: Allowing users to settle an entire international trip by typing a single sentence, with the AI computing the mathematical minimum transactions and preparing PayPal orders.
- **The Dynamic Financial Persona Studio**: Developing an interactive vector avatar engine that directly reflects financial health, transforming mundane debt settlements into an emotionally rewarding experience when users watch their avatar transition from debt stress to settled victory upon PayPal payment.

---

### What We Learned
- How to implement the latest PayPal Orders v2 REST API and PayPal JavaScript SDK Smart Buttons.
- Prompt engineering for multimodal structured financial data extraction with strict JSON schemas in Google Gemini.
- Applying graph theory algorithms (Min-Cash-Flow) to real-world peer-to-peer financial settlements.

---

### What's Next for SplitSmart
- **PayPal Payouts API & Invoicing**: Expanding beyond single merchant sandbox captures to automate batch 1-to-many Payouts directly to individual group members' sandbox emails.
- **Voice Commerce**: Integrating the Web Speech API so users can execute their entire expense settlement hands-free via voice while driving or traveling.
- **Real-Time WebSockets**: Live group settlement syncing across multiple devices simultaneously.

