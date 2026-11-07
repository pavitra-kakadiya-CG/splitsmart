# 🎬 3-Minute Video Demo Script: SplitSmart

> **Target Duration:** 2 minutes 45 seconds (strictly under the 3-minute hackathon limit).  
> **Platform:** YouTube (Public or Unlisted).  
> **Tools:** Loom / OBS Studio / Screen Studio + Microphone.

---

### **Scene 1: Introduction & The Problem (0:00 – 0:30)**
* **On Screen:** SplitSmart Dashboard on localhost or hosted URL, showing the Tokyo Trip 2026 group, member balances, and 3D Bitmoji in the corner.
* **Voiceover:**  
  *"Hi everyone, this is SplitSmart—an autonomous agentic finance platform combining 3D WebGL Bitmojis, multimodal AI receipt parsing, and real PayPal Sandbox settlements.*  
  *We all know the pain of group trips: tracking expenses is messy, but settling up is even worse. Most apps just give you a static balance—they don't actually move money, leaving friends in an awkward web of circular debts.*  
  *With SplitSmart and the PayPal Developer Platform, group settlements become completely autonomous. Let's dive in!"*

---

### **Scene 2: Multimodal AI Receipt Scanner (0:30 – 1:15)**
* **On Screen:** Click the **📸 AI Receipt Scanner** tab. Click **"Sample: Tokyo Izakaya"** (or upload a receipt image).
* **Action:** The loading spinner runs for a second, then reveals the parsed receipt breakdown with the green **"✓ Math Verified"** badge.
* **Voiceover:**  
  *"First, adding expenses is effortless. Our receipt scanner uses Google Gemini 1.5 Flash Vision. You simply upload a photo of any restaurant or grocery receipt.*  
  *Notice this green badge: '✓ Math Verified'. Our serverless backend validates that line items, taxes, and tips mathematically equal the grand total before rendering—preventing the number misreads common in standard vision models.*  
  *We can toggle which friend ordered what, and SplitSmart prorates taxes and tips automatically. When we click 'Commit to Ledger', it immediately updates our persistent group balance!"*

---

### **Scene 3: The Headline Feature — Autonomous Settle-Up Agent (1:15 – 2:10)**
* **On Screen:** Click the **🤖 Settle-Up Agent** tab.
* **Action:** Click the quick prompt **"settle everything from Tokyo"** and click **⚡ Run Agent**.
* **On Screen:** The agent analyzes the ledger, explains the Min-Cash-Flow graph reduction, and renders the proposed optimal payments with live **PayPal Smart Payment Buttons**.
* **Voiceover:**  
  *"Now for our headline feature: The Autonomous Settle-Up Agent.*  
  *Instead of forcing friends to calculate who owes whom, I simply tell the agent: 'settle everything from Tokyo'.*  
  *The agent analyzes our group's debt graph, executes the Min-Cash-Flow reduction algorithm, and eliminates redundant transactions—reducing 6 complex debts down to just 2 optimal payments!*  
  *Best of all, this isn't a mock button. The PayPal JavaScript SDK is embedded directly into the transaction card. The client secret lives securely on our serverless backend.*  
  *Let's click 'Pay with PayPal'. The authentic PayPal Sandbox popup appears. We log in with our sandbox test buyer account, click 'Pay Now', and look at what happens:*  
  *The order is captured via `/api/capture-order`, confetti fires, and that debt is instantly eliminated from our group ledger! When I refresh the page, the state persists."*

---

### **Scene 4: 3D Bitmoji Studio & PayPal Drip (2:10 – 2:35)**
* **On Screen:** Click the 3D avatar button to open the **Snapchat 3D Bitmoji Studio**.
* **Action:** Drag to rotate the 3D avatar 360°. Click the **"⚡ PayPal Drip"** tab. Click **"⚡ Buy with PayPal"** on the PayPal Blue Hoodie.
* **Voiceover:**  
  *"To make social finance fun, we built an interactive 3D WebGL Bitmoji studio directly in Three.js with realistic lighting, blinking eye physics, and outfit customization.*  
  *In our PayPal Sandbox Wardrobe store, users can even purchase digital drip for their avatars using verified PayPal sandbox checkout."*

---

### **Scene 5: Conclusion & GitHub Repository (2:35 – 2:45)**
* **On Screen:** Switch back to the dashboard showing the settled balance, then show the GitHub repository with the MIT License and README.
* **Voiceover:**  
  *"SplitSmart bridges multimodal AI reasoning directly with PayPal's developer platform to create genuine agentic commerce.*  
  *Our code is completely open-source under the MIT license on GitHub, with zero-dependency local setup and 1-click Vercel deployment.*  
  *Thank you, and see you on Devpost!"*
