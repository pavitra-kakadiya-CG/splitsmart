# 🎬 3-Minute Video Demo Script: SplitSmart

> **Target Duration:** 2 minutes 45 seconds (strictly under the 3-minute hackathon limit).  
> **Platform:** YouTube (Public or Unlisted).  
> **Tools:** Loom / OBS Studio / Screen Studio + Microphone.

---

### **Scene 1: Introduction & The Problem (0:00 – 0:30)**
* **On Screen:** SplitSmart Dashboard on localhost or hosted URL, showing the Tokyo Trip 2026 group, member balances, and the dynamic financial avatar in the header.
* **Voiceover:**  
  *"Hi everyone, this is SplitSmart—an autonomous agentic finance platform combining real-time dynamic financial avatars, multimodal AI receipt parsing, and real PayPal Sandbox settlements.*  
  *We all know the pain of group trips: tracking expenses is messy, but settling up is even worse. Most apps just give you a static balance—they don't actually move money, leaving friends in an awkward web of circular debts.*  
  *With SplitSmart and the PayPal Developer Platform, group settlements become completely autonomous. Let's dive in!"*

---

### **Scene 2: Multimodal AI Receipt Scanner (0:30 – 1:15)**
* **On Screen:** Click the **📸 AI Receipt Scanner** tab. Click **"Sample: Tokyo Izakaya"** (or upload a receipt image).
* **Action:** The loading spinner runs for a second, then reveals the parsed receipt breakdown with the green **"✓ Math Verified"** badge.
* **Voiceover:**  
  *"First, adding expenses is effortless. Our receipt scanner uses Google Gemini multimodal vision. You simply upload a photo of any restaurant or grocery receipt.*  
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

### **Scene 4: Dynamic Financial Persona Studio & PayPal Collectibles (2:10 – 2:35)**
* **On Screen:** Click the **👤 Persona** button to open the **SplitSmart Dynamic Financial Persona Studio**.
* **Action:** Notice how the avatar's expression dynamically reflects the user's financial standing (from debt stress to settled victory). Show the customizer tabs (Vibes, Hairstyle, Outfits, Badges) and click **"✨ Ask AI Stylist"** to generate personalized advice. Then switch to the **"💎 PayPal Badges"** tab and preview the PayPal Sandbox Collectibles.
* **Voiceover:**  
  *"To make social finance engaging, we built the Dynamic Financial Persona Studio. Unlike static profile pictures, your avatar's mood and aura dynamically react to your financial standing in real time—celebrating when your debts are cleared or nudging you when you owe friends.*  
  *Users can customize hairstyles, outfits, and color palettes, get personalized recommendations from our Gemini AI Persona Stylist, and unlock verified digital badges in the PayPal Sandbox Collectibles store."*

---

### **Scene 5: Conclusion & GitHub Repository (2:35 – 2:45)**
* **On Screen:** Switch back to the dashboard showing the settled balance, then show the GitHub repository with the MIT License and README.
* **Voiceover:**  
  *"SplitSmart bridges multimodal AI reasoning directly with PayPal's developer platform to create genuine agentic commerce.*  
  *Our code is completely open-source under the MIT license on GitHub, with zero-dependency local setup and 1-click Vercel deployment.*  
  *Thank you, and see you on Devpost!"*

