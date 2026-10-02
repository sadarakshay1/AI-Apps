# Vishwakarma Jewellers Daryapur — AI WhatsApp Caller & Receptionist
# विश्वकर्मा ज्वेलर्स दर्यापूर — AI व्हॉट्सॲप कॉलर व रिसेप्शनिस्ट

An AI-powered WhatsApp receptionist, voice outbound caller, and showroom CRM for **Vishwakarma Jewellers Daryapur (विश्वकर्मा ज्वेलर्स दर्यापूर)**.

- **Location:** Gandhinagar, Daryapur Banosa, Maharashtra 444803
- **Google Plus Code:** W8GC+57 Daryapur Banosa, Maharashtra
- **Google Rating:** 4.1 / 5.0 (91 Reviews)
- **Business Hours:** 10:30 AM onward (Everyday, including Sundays)
- **Official Contact & WhatsApp:** +91 97673 26228

---

## 🌟 Key Features

1. **Virtual Jewellery Receptionist ("राधिका")**
   - Natural Marathi, Hindi, and English multilingual conversation with automatic language detection.
   - Answers showroom queries regarding live gold rates, verified offers, showroom hours, location navigation, catalogue designs, and appointment bookings.
   - Seamless human staff handover when customer requests to talk to a human employee.

2. **WhatsApp Receptionist Simulator**
   - Verified business profile interface with online indicators.
   - Interactive quick inquiry chips (*"Gold rate काय आहे?"*, *"आज काही offer आहे का?"*, *"Necklace चे नवीन designs आहेत का?"*, *"दुकान कुठे आहे?"*, etc.).
   - Dynamic interactive message cards for Live Rates (22K BIS 916, 24K, 18K, Silver), Active Showroom Offers, Catalogue Previews, and Location.
   - Real-world WhatsApp redirection: direct deep-links (`https://wa.me/919767326228`) to open chats in genuine WhatsApp Web/App.
   - Marathi audio voice note playback.

3. **AI Voice Caller & Outbound Campaigns**
   - Interactive call simulator supporting:
     - **Campaign A:** New Gold & Jewellery Collection
     - **Campaign B:** Festival & Wedding Season Offers
     - **Campaign C:** Enquiry Follow-up
   - Professional conversational protocol handling permissions (*"आपणास दोन मिनिटे बोलण्यासाठी वेळ आहे का?"*), callback time capturing if busy, and low-pressure customer qualification (jewellery interest, budget, timeline, and showroom visit date).
   - Real-time speech synthesis, audio waveforms, live transcript, and automatic post-call WhatsApp template dispatch.

4. **Showroom Command Center & CRM**
   - **Live Rates Controller:** Real-time updates to 24K, 22K (BIS 916), 18K, and Silver rates.
   - **Verified Offers Manager:** Add, edit, and toggle active promotions (ensuring the AI strictly never invents an offer).
   - **CRM Lead Pipeline:** Tracks qualified leads, customer preferences, budget, visit dates, and callback times.
   - **Appointments Calendar:** Showroom visit bookings.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Gemini API Key from Google AI Studio

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   cd <YOUR_REPO_NAME>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend:** Node.js, Express, tsx
- **AI Models:** `@google/genai` (Gemini 3.1 Flash Lite / Gemini 3.8 Flash, Gemini TTS)
- **Audio Engine:** Gemini Speech Synthesis & Browser Web Speech API fallback
- **Tooling:** Vite, ESLint, TypeScript
