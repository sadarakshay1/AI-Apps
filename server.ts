import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  SHOWROOM_DETAILS,
  INITIAL_GOLD_RATE,
  INITIAL_OFFERS,
  INITIAL_CATALOGUE,
  INITIAL_LEADS,
  INITIAL_APPOINTMENTS,
  CAMPAIGNS
} from './src/data/showroomData.ts';
import type { GoldRate, ShowroomOffer, LeadRecord, ShowroomAppointment } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent database for the showroom app
let goldRates: GoldRate = { ...INITIAL_GOLD_RATE };
let activeOffers: ShowroomOffer[] = [...INITIAL_OFFERS];
let leads: LeadRecord[] = [...INITIAL_LEADS];
let appointments: ShowroomAppointment[] = [...INITIAL_APPOINTMENTS];

// Gemini Client initialization on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // 1. Health check & configuration
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      showroom: SHOWROOM_DETAILS.name,
      timestamp: new Date().toISOString()
    });
  });

  // 2. Gold Rates endpoints
  app.get('/api/rates', (req: Request, res: Response) => {
    res.json(goldRates);
  });

  app.put('/api/rates', (req: Request, res: Response) => {
    const { karat24, karat22, karat18, silverPerGram, silverPerKg, marketTrend } = req.body;
    goldRates = {
      karat24: Number(karat24) || goldRates.karat24,
      karat22: Number(karat22) || goldRates.karat22,
      karat18: Number(karat18) || goldRates.karat18,
      silverPerGram: Number(silverPerGram) || goldRates.silverPerGram,
      silverPerKg: Number(silverPerKg) || goldRates.silverPerKg,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      marketTrend: marketTrend || goldRates.marketTrend
    };
    res.json({ success: true, data: goldRates });
  });

  // 3. Offers endpoints (Strict Rule: AI only communicates offers entered here)
  app.get('/api/offers', (req: Request, res: Response) => {
    res.json(activeOffers);
  });

  app.post('/api/offers', (req: Request, res: Response) => {
    const newOffer: ShowroomOffer = {
      id: 'off_' + Date.now(),
      title: req.body.title || 'New Showroom Offer',
      titleMr: req.body.titleMr || req.body.title,
      description: req.body.description || '',
      descriptionMr: req.body.descriptionMr || req.body.description || '',
      category: req.body.category || 'special',
      validUntil: req.body.validUntil || 'मर्यादित कालावधीसाठी',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      code: req.body.code || 'VJ' + Math.floor(100 + Math.random() * 900),
      discountSummary: req.body.discountSummary || 'विशेष सवलत'
    };
    activeOffers.unshift(newOffer);
    res.json({ success: true, data: newOffer });
  });

  app.put('/api/offers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = activeOffers.findIndex(o => o.id === id);
    if (index !== -1) {
      activeOffers[index] = { ...activeOffers[index], ...req.body };
      res.json({ success: true, data: activeOffers[index] });
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  });

  app.delete('/api/offers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    activeOffers = activeOffers.filter(o => o.id !== id);
    res.json({ success: true });
  });

  // 4. CRM Leads endpoints
  app.get('/api/leads', (req: Request, res: Response) => {
    res.json(leads);
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const newLead: LeadRecord = {
      id: 'lead_' + Date.now(),
      customerName: req.body.customerName || 'अनामिक ग्राहक',
      phone: req.body.phone || '',
      preferredLanguage: req.body.preferredLanguage || 'mr',
      interestedJewellery: req.body.interestedJewellery || [],
      metalType: req.body.metalType || 'gold',
      approxBudget: req.body.approxBudget,
      purchaseTimeline: req.body.purchaseTimeline,
      preferredVisitDate: req.body.preferredVisitDate,
      preferredCallbackTime: req.body.preferredCallbackTime,
      status: req.body.status || 'new',
      lastInteractionDate: 'आत्ताच',
      channel: req.body.channel || 'whatsapp',
      notes: req.body.notes ? (Array.isArray(req.body.notes) ? req.body.notes : [req.body.notes]) : [],
      callSummary: req.body.callSummary,
      whatsappSent: req.body.whatsappSent || false
    };
    leads.unshift(newLead);
    res.json({ success: true, data: newLead });
  });

  app.put('/api/leads/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...req.body, lastInteractionDate: 'आत्ताच' };
      res.json({ success: true, data: leads[index] });
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  });

  // 5. Appointments endpoints
  app.get('/api/appointments', (req: Request, res: Response) => {
    res.json(appointments);
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const newApt: ShowroomAppointment = {
      id: 'apt_' + Date.now(),
      customerName: req.body.customerName || 'सन्माननीय ग्राहक',
      phone: req.body.phone || '',
      date: req.body.date || 'लवकरच',
      time: req.body.time || 'सकाळी ११:०० वाजता',
      jewelleryInterest: req.body.jewelleryInterest || 'शोरूम भेट',
      status: 'confirmed',
      notes: req.body.notes || 'AI Receptionist द्वारे नोंदणीकृत'
    };
    appointments.unshift(newApt);

    // Also update lead status if phone matches
    const matchedLead = leads.find(l => l.phone && l.phone === newApt.phone);
    if (matchedLead) {
      matchedLead.status = 'visit_scheduled';
      matchedLead.preferredVisitDate = `${newApt.date} ${newApt.time}`;
    }

    res.json({ success: true, data: newApt });
  });

  // 6. Catalogue
  app.get('/api/catalogue', (req: Request, res: Response) => {
    res.json(INITIAL_CATALOGUE);
  });

  // Download project source zip
  app.get('/api/download-zip', (req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'vishwakarma-jewellers-daryapur.zip');
    res.download(zipPath, 'vishwakarma-jewellers-daryapur.zip');
  });

  // Helper function to call Gemini with model fallback
  async function callGemini(contents: any, systemInstruction: string) {
    const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.6,
          }
        });
        if (response.text) return response.text;
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying next...`, err?.message || err);
      }
    }
    return null;
  }

  // 7. AI WhatsApp Receptionist Endpoint
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, customerName, customerPhone } = req.body;
      const lowerMsg = (message || '').toLowerCase();

      const currentActiveOffersList = activeOffers
        .filter(o => o.isActive)
        .map(o => `• ${o.titleMr} (${o.code}): ${o.descriptionMr} [वैधता: ${o.validUntil}]`)
        .join('\n');

      const systemInstruction = `
You are "राधिका" (Radhika), the friendly, warm, respectful female jewellery showroom receptionist and sales executive for:
**Vishwakarma Jewellers Daryapur (विश्वकर्मा ज्वेलर्स दर्यापूर)**

SHOWROOM BUSINESS DETAILS:
- Name: विश्वकर्मा ज्वेलर्स दर्यापूर (Vishwakarma Jewellers Daryapur)
- Address: Gandhinagar, Daryapur Banosa, Amravati District, Maharashtra 444803 (गांधीनगर, दर्यापूर बनोसा)
- Google Maps code: W8GC+57 Daryapur Banosa, Maharashtra (Google rating: 4.1/5 from 91 reviews)
- Showroom Timings: दररोज सकाळी १०:३० वाजल्यापासून सुरू (10:30 AM – 8:30 PM, सर्व ७ दिवस चालू)
- Specialties: 100% BIS 916 Hallmark certified gold, authentic Maharashtrian jewellery (Kolhapuri Saaj, Tushi, Thushi, Mangalsutra, Patlya, Tode, Jhumke, Choker), diamond rings, 925 silver pooja articles, custom wedding bridal designs, transparent old gold exchange with zero unnecessary deductions.
- Phone / WhatsApp: +91 97673 26228

CURRENT LIVE GOLD & SILVER RATES (TODAY'S STORE RATES):
- २४ कॅरेट शुद्ध सोने (24K Pure Gold): ₹${goldRates.karat24.toLocaleString('en-IN')} प्रति १० ग्रॅम
- २२ कॅरेट हॉलमार्क सोने (22K 916 Hallmark): ₹${goldRates.karat22.toLocaleString('en-IN')} प्रति १० ग्रॅम
- १८ कॅरेट दागिने सोने (18K Jewellery Gold): ₹${goldRates.karat18.toLocaleString('en-IN')} प्रति १० ग्रॅम
- चांदी (Pure Silver): ₹${goldRates.silverPerGram} प्रति ग्रॅम (₹${goldRates.silverPerKg.toLocaleString('en-IN')} प्रति किलो)
- शेवटची अपडेट: ${goldRates.lastUpdated} (${goldRates.marketTrend === 'up' ? 'किंचित वाढ' : 'स्थिर'})

OFFICIAL VERIFIED SHOWROOM OFFERS (CRITICAL: DO NOT INVENT ANY OFFER. Only use these exact offers):
${currentActiveOffersList || 'सध्या शोरूममध्ये घडणावळीवर खास सवलती आणि जुन्या सोन्यावर १००% मूल्य ऑफर चालू आहे.'}

AI PERSONALITY & LINGUISTIC RULES:
1. Primary language: MARATHI (मराठी).
2. Secondary languages: HINDI and ENGLISH.
3. Automatically detect customer language! If the customer asks in Marathi, answer in sweet, respectful, professional Marathi. If Hindi, answer in respectful Hindi. If English, respond politely in English.
4. Tone: Respectful, warm, professional, local and natural ("नमस्कार", "आपले स्वागत आहे", "नक्कीच", "आपणास काही शंका असल्यास सांगा").
5. Not aggressive or spammy; family-friendly.
6. When customer asks:
   - "आज दुकान किती वाजता उघडेल?" / "दुकान चालू आहे का?": Showroom is open everyday from 10:30 AM to 8:30 PM.
   - "Gold rate काय आहे?": Quote the exact 22K (916) and 24K rates from above.
   - "काही offer आहे का?": Give details of the active verified offers listed above. NEVER invent an offer!
   - "Necklace / Wedding jewellery / Mangalsutra दाखवा": Politely describe our collections, offer to share photos/catalogue on WhatsApp, and invite them to visit the showroom.
   - "शोरूम कुठे आहे?": Gandhinagar, Daryapur Banosa, Near W8GC+57.
   - "Sunday ला उघडे आहे का?": Yes! Open on Sundays as well from 10:30 AM onwards.
   - "Appointment / भेट हवी आहे": Offer appointment registration and note preferred date & time.
   - "माणसाशी / sales executive शी बोलायचे आहे": Provide seamless human transfer reassurance: "होय, आमचे वरिष्ठ सेल्स एक्झिक्युटिव्ह श्री. वानखडे / दुकान मालक लगेच आपल्याशी संपर्क करतील किंवा आपण +91 97673 26228 वर थेट कॉल करू शकता."

OUTPUT FORMAT:
Always return a valid JSON object with:
{
  "replyText": "Sweet, courteous response in the customer's language with WhatsApp formatting (*bold*, bullet points, emojis where appropriate)",
  "language": "mr" | "hi" | "en",
  "intent": "rate_inquiry" | "offer_inquiry" | "catalogue_request" | "timing_location" | "appointment_request" | "human_transfer" | "general_chat",
  "qualification": {
    "customerName": string or null,
    "interestedJewellery": string[],
    "metalType": "gold" | "silver" | "diamond" | "other",
    "approxBudget": string or null,
    "purchaseTimeline": string or null,
    "preferredVisitDate": string or null,
    "preferredCallbackTime": string or null,
    "appointmentRequested": boolean,
    "requiresHumanHandover": boolean
  },
  "actionCard": null | "rate_card" | "offers_card" | "catalogue_preview" | "location_card" | "appointment_card"
}
`;

      const promptText = `Conversation History:\n${JSON.stringify(history || [])}\n\nCustomer Name: ${customerName || 'Unknown'}\nCustomer Phone: ${customerPhone || 'Not provided'}\n\nLatest Customer Message:\n"${message}"\n\nGenerate JSON response:`;

      const responseText = await callGemini(promptText, systemInstruction);

      let parsedData: any = null;
      if (responseText) {
        try {
          parsedData = JSON.parse(responseText.trim().replace(/^```json\s*|\s*```$/g, ''));
        } catch (e) {
          // ignore parse error and proceed to fallback
        }
      }

      // If AI model returned valid JSON
      if (parsedData && parsedData.replyText) {
        // lead registration
        if (parsedData.qualification && (parsedData.qualification.interestedJewellery?.length || parsedData.qualification.approxBudget || parsedData.qualification.appointmentRequested || parsedData.qualification.requiresHumanHandover)) {
          const leadPhone = customerPhone || '+91 97673 00000';
          let existingLead = leads.find(l => l.phone === leadPhone);
          if (existingLead) {
            if (parsedData.qualification.interestedJewellery?.length) {
              existingLead.interestedJewellery = Array.from(new Set([...existingLead.interestedJewellery, ...parsedData.qualification.interestedJewellery]));
            }
            if (parsedData.qualification.approxBudget) existingLead.approxBudget = parsedData.qualification.approxBudget;
            if (parsedData.qualification.preferredVisitDate) existingLead.preferredVisitDate = parsedData.qualification.preferredVisitDate;
            if (parsedData.qualification.requiresHumanHandover) existingLead.status = 'transferred_to_human';
            existingLead.lastInteractionDate = 'आत्ताच (WhatsApp)';
          }
        }
        return res.json(parsedData);
      }

      // Context-aware Smart Marathi Knowledge Engine (Ensures 100% uptime for specific queries)
      if (lowerMsg.includes('rate') || lowerMsg.includes('भाव') || lowerMsg.includes('दर') || lowerMsg.includes('सोने')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स दर्यापूरमध्ये आजचे सोने-चांदी थेट दर खालीलप्रमाणे आहेत:\n\n✨ *२२K हॉलमार्क सोने (BIS 916):* ₹${goldRates.karat22.toLocaleString('en-IN')}/१० ग्रॅम\n🌟 *२४K शुद्ध सोने:* ₹${goldRates.karat24.toLocaleString('en-IN')}/१० ग्रॅम\n💎 *१८K दागिने सोने:* ₹${goldRates.karat18.toLocaleString('en-IN')}/१० ग्रॅम\n⚪ *शुद्ध चांदी:* ₹${goldRates.silverPerGram}/ग्रॅम (₹${goldRates.silverPerKg.toLocaleString('en-IN')}/किलो)\n\n१००% हॉलमार्क प्रमाणित दागिने व पारदर्शक बिलिंग. आपण कोणत्या दागिन्याची खरेदी करू इच्छिता?`,
          language: 'mr',
          intent: 'rate_inquiry',
          qualification: { interestedJewellery: ['सोन्याचे दागिने'], metalType: 'gold' },
          actionCard: 'rate_card'
        });
      }

      if (lowerMsg.includes('offer') || lowerMsg.includes('सूट') || lowerMsg.includes('ऑफर') || lowerMsg.includes('discount')) {
        const topOffer = activeOffers.find(o => o.isActive) || activeOffers[0];
        return res.json({
          replyText: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स दर्यापूरमध्ये सध्या खालील अधिकृत ऑफर्स सुरू आहेत:\n\n🎉 *${topOffer.titleMr}* (कोड: ${topOffer.code})\n${topOffer.descriptionMr}\n📅 वैधता: ${topOffer.validUntil}\n\nतसेच जुन्या सोन्यावर १००% योग्य मूल्य ऑफर (Zero Deduction) देखील उपलब्ध आहे. आपण शोरूमला भेट देणार आहात का?`,
          language: 'mr',
          intent: 'offer_inquiry',
          qualification: { interestedJewellery: ['सणासुदीच्या ऑफर्स'] },
          actionCard: 'offers_card'
        });
      }

      if (lowerMsg.includes('उघड') || lowerMsg.includes('वेळ') || lowerMsg.includes('open') || lowerMsg.includes('time') || lowerMsg.includes('sunday') || lowerMsg.includes('रविवार')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स, दर्यापूर दररोज *सकाळी १०:३० वाजल्यापासून रात्री ८:३० पर्यंत* चालू असते.\n\nहोय, आमचे शोरूम *रविवारी (Sunday) देखील सुरू असते*. आपले सहर्ष स्वागत आहे!`,
          language: 'mr',
          intent: 'timing_location',
          qualification: {},
          actionCard: 'location_card'
        });
      }

      if (lowerMsg.includes('कुठे') || lowerMsg.includes('पत्ता') || lowerMsg.includes('address') || lowerMsg.includes('location')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स दर्यापूरचे लोकेशन:\n\n📍 *पत्ता:* गांधीनगर, दर्यापूर बनोसा, अमरावती जिल्हा, महाराष्ट्र ४४४८०३\n🗺️ *Google Plus Code:* W8GC+57 Daryapur Banosa\n⭐ *Google Rating:* ४.१/५ (९१ समीक्षक)\n\nखालील बटणावर क्लिक करून आपण थेट Google Maps वर दिशा पाहू शकता.`,
          language: 'mr',
          intent: 'timing_location',
          qualification: {},
          actionCard: 'location_card'
        });
      }

      if (lowerMsg.includes('design') || lowerMsg.includes('necklace') || lowerMsg.includes('हार') || lowerMsg.includes('wedding') || lowerMsg.includes('लग्न') || lowerMsg.includes('कलेक्शन')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nआमच्या शोरूममध्ये पारंपारिक कोल्हापुरी साज, ठुशी, ब्रायडल चोकर हार, डिझायनर मंगळसूत्र आणि पाटल्यांचे अनेक नवीन डिझाईन्स उपलब्ध आहेत.\n\nआपण वर दिलेल्या 'कॅटलॉग' बटनावर क्लिक करून सर्व दागिने पाहू शकता किंवा आम्ही थेट आपल्या WhatsApp वर फोटो पाठवू शकतो.`,
          language: 'mr',
          intent: 'catalogue_request',
          qualification: { interestedJewellery: ['नेकलेस / ब्रायडल कलेक्शन'], metalType: 'gold' },
          actionCard: 'catalogue_preview'
        });
      }

      if (lowerMsg.includes('appointment') || lowerMsg.includes('भेट') || lowerMsg.includes('यायचे')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स दर्यापूरला भेट देण्यासाठी आपली नोंदणी झाली आहे. आमचे कर्मचारी आपले आदरातिथ्य करण्यास सज्ज राहतील.\n\nआपण कोणत्या दिवशी आणि वेळेस येणे पसंत कराल? (उदा. उद्या संध्याकाळी ५:०० वाजता)`,
          language: 'mr',
          intent: 'appointment_request',
          qualification: { appointmentRequested: true },
          actionCard: 'appointment_card'
        });
      }

      if (lowerMsg.includes('माणसा') || lowerMsg.includes('executive') || lowerMsg.includes('staff') || lowerMsg.includes('कॉल') || lowerMsg.includes('मालक')) {
        return res.json({
          replyText: `नमस्कार! 🙏\nनक्कीच, मी आमचे वरिष्ठ सेल्स एक्झिक्युटिव्ह श्री. वानखडे / दुकान मालकांना आपल्याशी त्वरित संपर्क साधण्यास सांगत आहे.\n\nआपण हवे असल्यास आम्हाला थेट *+91 97673 26228* वर कधीही कॉल करू शकता.`,
          language: 'mr',
          intent: 'human_transfer',
          qualification: { requiresHumanHandover: true },
          actionCard: null
        });
      }

      // Default polite greeting
      res.json({
        replyText: 'नमस्कार! 🙏 विश्वकर्मा ज्वेलर्स दर्यापूरमध्ये आपले सहर्ष स्वागत आहे. आम्ही आपणास आजचे सोने-चांदी दर, नवीन डिझाईन्स, सणासुदीच्या ऑफर्स आणि शोरूम भेटीबद्दल मदत करू शकतो. आपण कशाबद्दल माहिती जाणून घेऊ इच्छिता?',
        language: 'mr',
        intent: 'general_chat',
        qualification: {},
        actionCard: 'rate_card'
      });
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.json({
        replyText: 'नमस्कार! विश्वकर्मा ज्वेलर्स दर्यापूरमध्ये आपले स्वागत आहे. आपण थेट +91 97673 26228 वर कॉल किंवा WhatsApp करू शकता. आमचे शोरूम दररोज सकाळी १०:३० वाजल्यापासून सुरू असते.',
        language: 'mr',
        intent: 'general_chat',
        qualification: {},
        actionCard: 'rate_card'
      });
    }
  });

  // 8. AI Phone Caller Turn Engine (Outbound Campaign Call & Inbound Receptionist Call)
  app.post('/api/ai/call-turn', async (req: Request, res: Response) => {
    try {
      const {
        campaignId,
        customerName,
        customerPhone,
        callType, // 'outbound' | 'inbound'
        turnNumber,
        customerSpeech,
        transcriptHistory,
        currentQualification
      } = req.body;

      const campaign = CAMPAIGNS.find(c => c.id === campaignId) || CAMPAIGNS[0];
      const verifiedOffersText = activeOffers
        .filter(o => o.isActive)
        .map(o => `• ${o.titleMr}: ${o.descriptionMr}`)
        .join('\n');

      const systemInstruction = `
You are "राधिका" (Radhika), a courteous, professional, friendly female jewellery showroom receptionist and sales executive at:
**विश्वकर्मा ज्वेलर्स दर्यापूर (Vishwakarma Jewellers Daryapur)**
Location: Gandhinagar, Daryapur Banosa, Maharashtra 444803. Google rating 4.1/5. Open 10:30 AM onward.

YOUR ROLE & GOALS:
1. Conduct realistic phone calls with customers as a real professional human receptionist/sales executive, NOT a robotic chatbot.
2. Maintain a respectful, warm, local Marathi tone (family-friendly, sincere, not aggressive, avoid spam telemarketing style).
3. Primary language: MARATHI (मराठी). If the customer speaks Hindi or English, seamlessly transition to their language.

GREETING PROTOCOL FOR OUTBOUND CALLS:
- Opening turn (turn 0):
  "नमस्कार! मी विश्वकर्मा ज्वेलर्स, दर्यापूरकडून बोलत आहे. आपणास दोन मिनिटे बोलण्यासाठी वेळ आहे का?"
- If customer says yes / can speak:
  "धन्यवाद. ${campaign.openingPitchMr.split('?')[1] || 'आमच्या शोरूममध्ये नवीन ज्वेलरी कलेक्शन आणि काही विशेष ऑफर्स उपलब्ध आहेत. आपण ज्वेलरी खरेदी करण्याचा विचार करत आहात का?'}"
- If customer says no:
  "काही हरकत नाही. आपल्याला सोयीस्कर वेळ कोणता असेल ते सांगा, आम्ही त्यावेळी संपर्क करू."
- If customer is busy:
  "नक्की. आपणास कोणत्या वेळेस कॉल करणे योग्य राहील?" (Capture preferred callback time).

CAMPAIGN CONTEXT:
- Active Campaign: ${campaign.titleMr} (${campaign.title})
- Description: ${campaign.description}
- Showroom Verified Offers (DO NOT INVENT ANY OFFER. ONLY USE THESE):
${verifiedOffersText}
- Live Gold Rates: 22K Hallmarked Gold is ₹${goldRates.karat22.toLocaleString('en-IN')}/10g; 24K is ₹${goldRates.karat24.toLocaleString('en-IN')}/10g.

CUSTOMER QUALIFICATION (Gather naturally during conversation without pressuring):
- Interested jewellery type (Necklace, Ring, Earrings, Mangalsutra, Patlya/Bangles, Wedding Jewellery, etc.)
- Metal (Gold / Silver / Diamond)
- Approximate budget (NEVER pressure customers to disclose budget, keep it natural: "आपला अंदाजे बजेट किती आहे?")
- Purchase timeline (Immediate, upcoming festival, wedding, etc.)
- Preferred showroom visit date/time
- Preferred callback time (if busy)

END OF CALL & WHATSAPP TRIGGER:
- When the customer expresses interest, or asks for photos/catalogue, or confirms visit date/callback time, politely thank them and tell them you are sending the details/confirmation right now on their WhatsApp!
- Set "triggerWhatsAppMessage": true and format a personalized WhatsApp message.

OUTPUT FORMAT (JSON):
{
  "speechText": "Natural, spoken Marathi / Hindi / English response (keep sentences clear and pleasant for audio voice synthesis)",
  "language": "mr" | "hi" | "en",
  "callStatus": "connected" | "completed" | "busy_rescheduled" | "declined" | "transferred",
  "qualification": {
    "interestedJewellery": string[],
    "metalType": "gold" | "silver" | "diamond" | "other",
    "approxBudget": string or null,
    "purchaseTimeline": string or null,
    "preferredVisitDate": string or null,
    "preferredCallbackTime": string or null,
    "isBusyOrDeclined": boolean,
    "appointmentBooked": boolean,
    "requiresHumanHandover": boolean
  },
  "triggerWhatsAppMessage": boolean,
  "whatsAppFollowUpText": "Personalized WhatsApp message in Marathi/English to be sent to the customer immediately",
  "callSummary": "Brief scannable Marathi/English note for showroom CRM"
}
`;

      const promptText = `Call Details:
Customer Name: ${customerName || 'सन्माननीय ग्राहक'}
Customer Phone: ${customerPhone || '+91 97673 26228'}
Call Type: ${callType || 'outbound'}
Turn Number: ${turnNumber}
Current Transcript:
${JSON.stringify(transcriptHistory || [])}
Customer Latest Spoken Words:
"${customerSpeech || (turnNumber === 0 ? 'CALL_INITIATED' : 'होय बोला')}"
Existing Qualification State:
${JSON.stringify(currentQualification || {})}

Generate next AI voice turn in JSON:`;

      const responseText = await callGemini(promptText, systemInstruction);
      let result: any = null;
      if (responseText) {
        try {
          result = JSON.parse(responseText.trim().replace(/^```json\s*|\s*```$/g, ''));
        } catch (err) {
          result = null;
        }
      }
      if (!result || !result.speechText) {
        result = {
          speechText: "नमस्कार! विश्वकर्मा ज्वेलर्स दर्यापूरकडून बोलत आहे. आपणास दोन मिनिटे बोलण्यासाठी वेळ आहे का?",
          language: "mr",
          callStatus: "connected",
          qualification: {},
          triggerWhatsAppMessage: false,
          callSummary: "कॉल सुरू झाला"
        };
      }

      // If call is completed or busy, save/update CRM lead
      if (result.callStatus === 'completed' || result.triggerWhatsAppMessage || result.callStatus === 'busy_rescheduled') {
        const leadPhone = customerPhone || '+91 97673 26228';
        let existingLead = leads.find(l => l.phone === leadPhone);
        if (existingLead) {
          if (result.qualification?.interestedJewellery?.length) {
            existingLead.interestedJewellery = Array.from(new Set([...existingLead.interestedJewellery, ...result.qualification.interestedJewellery]));
          }
          if (result.qualification?.approxBudget) existingLead.approxBudget = result.qualification.approxBudget;
          if (result.qualification?.preferredVisitDate) existingLead.preferredVisitDate = result.qualification.preferredVisitDate;
          if (result.qualification?.preferredCallbackTime) existingLead.preferredCallbackTime = result.qualification.preferredCallbackTime;
          existingLead.callSummary = result.callSummary;
          existingLead.whatsappSent = result.triggerWhatsAppMessage || existingLead.whatsappSent;
          existingLead.status = result.qualification?.appointmentBooked ? 'visit_scheduled' : (result.qualification?.isBusyOrDeclined ? 'contacted' : 'interested');
          existingLead.lastInteractionDate = 'आज फोन कॉल';
        } else {
          leads.unshift({
            id: 'lead_' + Date.now(),
            customerName: customerName || 'ग्राहक',
            phone: leadPhone,
            preferredLanguage: result.language || 'mr',
            interestedJewellery: result.qualification?.interestedJewellery || ['नवीन कलेक्शन'],
            metalType: result.qualification?.metalType || 'gold',
            approxBudget: result.qualification?.approxBudget,
            purchaseTimeline: result.qualification?.purchaseTimeline,
            preferredVisitDate: result.qualification?.preferredVisitDate,
            preferredCallbackTime: result.qualification?.preferredCallbackTime,
            status: result.qualification?.appointmentBooked ? 'visit_scheduled' : (result.qualification?.isBusyOrDeclined ? 'contacted' : 'interested'),
            lastInteractionDate: 'आज फोन कॉल',
            channel: 'both',
            notes: [result.callSummary || 'AI आउटबाउंड कॉलिंगद्वारे नोंदणी'],
            callSummary: result.callSummary,
            whatsappSent: !!result.triggerWhatsAppMessage
          });
        }
      }

      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/ai/call-turn:', error);
      res.json({
        speechText: "नमस्कार! विश्वकर्मा ज्वेलर्स दर्यापूरकडून बोलत आहे. आमच्या शोरूममध्ये नवीन कलेक्शन उपलब्ध आहे. मी आपणास सर्व माहिती WhatsApp वर पाठवते.",
        language: "mr",
        callStatus: "connected",
        qualification: {},
        triggerWhatsAppMessage: true,
        whatsAppFollowUpText: "नमस्कार! आज विश्वकर्मा ज्वेलर्स दर्यापूरशी संपर्क साधल्याबद्दल धन्यवाद. आमचे नवीन कलेक्शन येथे पाहू शकता.",
        callSummary: "कॉल पूर्ण"
      });
    }
  });

  // 9. AI Text-To-Speech (gemini-3.8-flash-lite-tts) with graceful fallback
  app.post('/api/ai/tts', async (req: Request, res: Response) => {
    try {
      const { text, language } = req.body;
      if (!text || !process.env.GEMINI_API_KEY) {
        return res.json({ fallbackWebSpeech: true });
      }

      // Call gemini-3.8-flash-lite-tts
      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: language === 'en' 
                    ? 'Warm, polite Indian female jewellery showroom receptionist' 
                    : 'Clear, polite, welcoming Marathi female receptionist with gentle tone'
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' } // Courteous, sweet voice
            }
          }
        }
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioData: base64Audio, format: 'audio/wav' });
      } else {
        return res.json({ fallbackWebSpeech: true });
      }
    } catch (error: any) {
      // In case TTS quota or model is unavailable, gracefully signal the client to use browser Web Speech API
      return res.json({ fallbackWebSpeech: true });
    }
  });

  // 10. Vite Middleware in Development / Static Files in Production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vishwakarma Jewellers Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
