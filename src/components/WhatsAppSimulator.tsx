import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Calendar, 
  PhoneCall, 
  UserCheck, 
  CheckCheck, 
  Clock, 
  Share2, 
  Volume2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Gem,
  Tag,
  Store,
  Phone
} from 'lucide-react';
import { SHOWROOM_DETAILS } from '../data/showroomData';
import { GoldRate, ShowroomOffer, WhatsAppMessage, JewelleryItem } from '../types';
import { voiceAssistant } from '../utils/audioPlayer';

interface WhatsAppSimulatorProps {
  goldRates: GoldRate;
  activeOffers: ShowroomOffer[];
  catalogue: JewelleryItem[];
  onOpenCatalogue: () => void;
  onOpenAppointmentModal?: () => void;
  onRefreshLeads?: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  goldRates,
  activeOffers,
  catalogue,
  onOpenCatalogue,
  onRefreshLeads
}) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `नमस्कार! 🙏\nविश्वकर्मा ज्वेलर्स, दर्यापूरमध्ये आपले सहर्ष स्वागत आहे. ✨\n\nमी *राधिका*, आपली ज्वेलरी रिसेप्शनिस्ट व सेल्स असिस्टंट. मी आपणास कशी मदत करू शकते?\n\n📍 *पत्ता:* गांधीनगर, दर्यापूर बनोसा (W8GC+57)\n🕒 *वेळ:* दररोज सकाळी १०:३० वाजल्यापासून पुढे चालू\n⭐ *Google Rating:* ४.१/५ (९१ समीक्षक)\n\nखालील पर्यायांवर क्लिक करून आपण त्वरित माहिती मिळवू शकता:`,
      timestamp: '१०:३० AM',
      mediaType: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customerName, setCustomerName] = useState('अनिल कदम');
  const [customerPhone, setCustomerPhone] = useState('+91 98221 44556');
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: 'आज दुकान किती वाजता उघडेल?', text: 'आज दुकान किती वाजता उघडेल?' },
    { label: 'Gold rate काय आहे?', text: 'Gold rate काय आहे?' },
    { label: 'आज काही offer आहे का?', text: 'आज काही offer आहे का?' },
    { label: 'Necklace चे नवीन designs आहेत का?', text: 'Necklace चे नवीन designs आहेत का?' },
    { label: 'Wedding jewellery दाखवा', text: 'Wedding jewellery दाखवा' },
    { label: 'शोरूम कुठे आहे?', text: 'शोरूम कुठे आहे आणि संपर्क क्रमांक काय आहे?' },
    { label: 'Sunday ला दुकान उघडे आहे का?', text: 'Sunday ला दुकान उघडे आहे का?' },
    { label: 'Appointment हवी आहे', text: 'मला दुकानात यायचे आहे, appointment कशी बुक करावी?' },
    { label: 'Sales Executive शी बोलायचे आहे', text: 'मला माणसाशी / sales executive शी थेट बोलायचे आहे' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent) return;

    const userMessageId = 'msg_' + Date.now();
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: WhatsAppMessage = {
      id: userMessageId,
      sender: 'customer',
      text: messageContent,
      timestamp: currentTime,
      mediaType: 'text'
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: messages.slice(-6).map(m => ({
            role: m.sender === 'customer' ? 'user' : 'assistant',
            text: m.text
          })),
          customerName,
          customerPhone
        })
      });

      const data = await response.json();
      setIsTyping(false);

      const aiResponseTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      const newAiMsg: WhatsAppMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: data.qualification?.requiresHumanHandover ? 'human_agent' : 'ai',
        text: data.replyText,
        timestamp: aiResponseTime,
        mediaType: data.actionCard || 'text',
        metadata: {
          intent: data.intent,
          qualification: data.qualification,
          language: data.language
        }
      };

      setMessages(prev => [...prev, newAiMsg]);

      // Automatically speak greeting or reply if audio is enabled
      if (isPlayingAudio) {
        voiceAssistant.speakText(data.replyText.replace(/[*_#]/g, ''), data.language || 'mr');
      }

      if (onRefreshLeads) onRefreshLeads();
    } catch (err) {
      setIsTyping(false);
      const fallbackMsg: WhatsAppMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'ai',
        text: `नमस्कार! विश्वकर्मा ज्वेलर्स दर्यापूरमध्ये आपले स्वागत आहे. आपण थेट ${SHOWROOM_DETAILS.phoneNumber} वर कॉल किंवा WhatsApp करू शकता. आमचे शोरूम दररोज सकाळी १०:३० वाजता उघडते.`,
        timestamp: currentTime,
        mediaType: 'text'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handlePlayVoiceGreeting = () => {
    setIsPlayingAudio(true);
    const textToSpeak = "नमस्कार! मी विश्वकर्मा ज्वेलर्स, दर्यापूरकडून राधिका बोलत आहे. आपले आमच्या शोरूममध्ये मनःपूर्वक स्वागत. आम्ही आपणास दागिन्यांचे डिझाईन्स, आजचे सोने दर आणि विशेष सणासुदीच्या ऑफर्सबद्दल सर्व माहिती देऊ शकतो. आपण कशाबद्दल माहिती जाणून घेऊ इच्छिता?";
    voiceAssistant.speakText(textToSpeak, 'mr', undefined, () => setIsPlayingAudio(false));
  };

  const createRealWhatsAppUrl = (customText?: string) => {
    const text = customText || `नमस्कार विश्वकर्मा ज्वेलर्स दर्यापूर! मला दागिन्यांबद्दल चौकशी करायची आहे.`;
    return `https://wa.me/919767326228?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4 sm:p-6 items-start">
      {/* Left panel: Context & Profile */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#420d16] flex items-center justify-center text-amber-200 font-bold text-xl border border-amber-300/40">
                  VJ
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-stone-900 text-sm font-marathi">विश्वकर्मा ज्वेलर्स</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Official
                </span>
              </div>
              <p className="text-xs text-stone-500 font-marathi">राधिका • व्हर्च्युअल रिसेप्शनिस्ट</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ऑनलाइन (Online)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
            <div className="flex items-start gap-2">
              <Store className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">शोरूम पत्ता:</span>
                <p className="text-stone-500 text-[11px] leading-relaxed">गांधीनगर, दर्यापूर बनोसा, अमरावती जिल्हा (W8GC+57)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-stone-800">वेळ:</span>
                <span className="text-stone-500 ml-1">सकाळी १०:३० वाजल्यापासून सुरू</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-stone-800">थेट संपर्क:</span>
                <a href={`tel:${SHOWROOM_DETAILS.phoneNumber.replace(/\s+/g, '')}`} className="text-amber-700 font-mono ml-1 hover:underline">
                  {SHOWROOM_DETAILS.phoneNumber}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
            <button
              onClick={handlePlayVoiceGreeting}
              disabled={isPlayingAudio}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>{isPlayingAudio ? 'आवाज सुरू आहे...' : 'राधिकाचा व्हॉईस ऐका'}</span>
            </button>
          </div>
        </div>

        {/* Customer simulation persona setting */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
              ग्राहक प्रोफाईल (Customer Info)
            </span>
            <button
              onClick={() => setShowLeadDetails(!showLeadDetails)}
              className="text-amber-700 hover:underline text-[11px]"
            >
              {showLeadDetails ? 'लपवा' : 'बदला'}
            </button>
          </div>

          {showLeadDetails ? (
            <div className="space-y-2 mt-2">
              <div>
                <label className="text-[10px] text-stone-500 block mb-0.5">ग्राहकाचे नाव:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-0.5">मोबाईल नंबर:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-stone-600 bg-white p-2 rounded-xl border border-stone-200">
              <span className="font-medium text-stone-900">{customerName}</span>
              <span className="font-mono text-stone-500">{customerPhone}</span>
            </div>
          )}
        </div>

        {/* Live Active Offers summary box */}
        <div className="bg-amber-900/5 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-2">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>सध्याच्या अधिकृत ऑफर्स (Verified Offers)</span>
          </div>
          <div className="space-y-2">
            {activeOffers.filter(o => o.isActive).map(offer => (
              <div key={offer.id} className="bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  {offer.code}
                </span>
                <h4 className="font-bold text-stone-900 text-xs mt-1 font-marathi">{offer.titleMr}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{offer.descriptionMr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main WhatsApp Phone Frame */}
      <div className="flex-1 w-full bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col h-[740px]">
        {/* WhatsApp Chat Header */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-900 border border-amber-300">
                VJ
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border border-white"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm tracking-wide font-marathi">
                  {SHOWROOM_DETAILS.nameMr}
                </h2>
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#075E54] flex items-center justify-center text-[9px] font-black">
                  ✓
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>{SHOWROOM_DETAILS.receptionistNameMr}</span>
                <span>• ऑनलाइन</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={createRealWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              title="Open in Real WhatsApp Web/App"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp वर उघडा</span>
            </a>
          </div>
        </div>

        {/* Quick prompt chips bar */}
        <div className="bg-stone-100/90 border-b border-stone-200 px-3 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] text-stone-500 font-bold uppercase whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            त्वरित प्रश्न:
          </span>
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.text)}
              disabled={isTyping}
              className="bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-300 hover:border-amber-400 px-3 py-1 rounded-full text-xs text-stone-700 whitespace-nowrap transition-colors shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* WhatsApp Chat Body */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]/30 bg-blend-soft-light"
          style={{
            backgroundImage: `radial-gradient(#d1c7bc 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Security / Encryption Notice */}
          <div className="text-center my-2">
            <span className="bg-[#ffeecd] text-[#54656f] text-[10px] px-3 py-1 rounded-lg inline-flex items-center gap-1 border border-amber-200/60 shadow-xs">
              🔒 विश्वकर्मा ज्वेलर्स दर्यापूर अधिकृत AI रिसेप्शनिस्ट सेवा. संदेश सुरक्षित आहेत.
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm relative ${
                    isUser
                      ? 'bg-[#d9fdd3] text-stone-900 rounded-tr-xs'
                      : 'bg-white text-stone-900 rounded-tl-xs border border-stone-200/60'
                  }`}
                >
                  {/* Sender label if AI or Human Agent */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-100">
                      <span className="text-[10px] font-bold text-[#075E54] flex items-center gap-1">
                        {msg.sender === 'human_agent' ? (
                          <>
                            <UserCheck className="w-3 h-3 text-amber-700" />
                            <span>वरिष्ठ सेल्स एक्झिक्युटिव्ह (Human Staff)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>विश्वकर्मा ज्वेलर्स असिस्टंट (राधिका)</span>
                          </>
                        )}
                      </span>
                      <button
                        onClick={() => voiceAssistant.speakText(msg.text.replace(/[*_#]/g, ''), 'mr')}
                        className="text-stone-400 hover:text-amber-700 p-0.5 rounded"
                        title="संदेश ऐका"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Message Text with simple markdown formatting */}
                  <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line text-stone-800 font-sans">
                    {msg.text.split('\n').map((line, i) => {
                      // Basic bold parsing *text*
                      const formatted = line.replace(/\*(.*?)\*/g, '<strong class="font-bold text-stone-950">$1</strong>');
                      return (
                        <p 
                          key={i} 
                          className="min-h-[1.2em]" 
                          dangerouslySetInnerHTML={{ __html: formatted }} 
                        />
                      );
                    })}
                  </div>

                  {/* Embedded Rich Card (Action Cards) */}
                  {msg.mediaType === 'rate_card' && (
                    <div className="mt-3 bg-gradient-to-br from-amber-500/10 to-amber-700/15 border border-amber-300 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1 font-marathi">
                          <Gem className="w-3.5 h-3.5 text-amber-700" />
                          आजचे थेट दर (Live Showroom Rates)
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                          {goldRates.lastUpdated}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">२२K सोने (BIS ९१६)</span>
                          <span className="font-bold text-amber-900 text-sm font-mono">
                            ₹{goldRates.karat22.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-500 block">प्रति १० ग्रॅम</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">२४K शुद्ध सोने</span>
                          <span className="font-bold text-stone-900 text-sm font-mono">
                            ₹{goldRates.karat24.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-500 block">प्रति १० ग्रॅम</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">१८K ज्वेलरी सोने</span>
                          <span className="font-bold text-stone-900 text-sm font-mono">
                            ₹{goldRates.karat18.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-500 block">प्रति १० ग्रॅम</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">चांदी दर</span>
                          <span className="font-bold text-stone-900 text-sm font-mono">
                            ₹{goldRates.silverPerGram}/g
                          </span>
                          <span className="text-[10px] text-stone-500 block">₹{goldRates.silverPerKg.toLocaleString('en-IN')}/kg</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-amber-900/80 mt-2 text-center font-medium">
                        ✓ १००% हॉलमार्क प्रमाणित • पारदर्शक वजन व बिलिंग
                      </p>
                    </div>
                  )}

                  {msg.mediaType === 'offers_card' && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1 font-marathi">
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        सध्या चालू असलेल्या विशेष ऑफर्स:
                      </div>
                      {activeOffers.filter(o => o.isActive).map(offer => (
                        <div key={offer.id} className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-2.5">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-amber-950 text-xs font-marathi">{offer.titleMr}</h5>
                            <span className="text-[10px] bg-amber-600 text-white font-mono px-1.5 py-0.5 rounded">
                              {offer.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-1">{offer.descriptionMr}</p>
                          <span className="text-[10px] text-amber-800 font-medium block mt-1">
                            📅 {offer.validUntil}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.mediaType === 'catalogue_preview' && (
                    <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-900 font-marathi">आमचे लोकप्रिय डिझाईन्स</span>
                        <button
                          onClick={onOpenCatalogue}
                          className="text-[11px] text-amber-700 font-bold hover:underline flex items-center"
                        >
                          संपूर्ण कॅटलॉग <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {catalogue.slice(0, 2).map(item => (
                          <div key={item.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-20 object-cover" />
                            <div className="p-1.5">
                              <h6 className="font-bold text-[11px] truncate text-stone-900">{item.nameMr}</h6>
                              <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                                <span>{item.purity}</span>
                                <span className="font-bold text-amber-800">₹{item.estimatedPrice.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.mediaType === 'location_card' && (
                    <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-xs text-stone-900">{SHOWROOM_DETAILS.nameMr}</h5>
                          <p className="text-[11px] text-stone-600 mt-0.5">{SHOWROOM_DETAILS.addressMr}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5 font-mono">Google Code: {SHOWROOM_DETAILS.googleMapsCode}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-[10px] text-amber-800 font-semibold">⭐ ४.१/५ (९१ समीक्षक)</span>
                        <a
                          href={SHOWROOM_DETAILS.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
                        >
                          <span>Google Maps उघडा</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {msg.mediaType === 'appointment_card' && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-300 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span>शोरूम भेट नोंदणी (Appointment Booked)</span>
                      </div>
                      <p className="text-[11px] text-stone-700 mt-1">
                        आपली भेट <strong>विश्वकर्मा ज्वेलर्स दर्यापूर</strong> येथे नोंदवली गेली आहे. आमचे कर्मचारी आपले स्वागत करण्यास सज्ज राहतील.
                      </p>
                      <div className="mt-2 bg-white p-2 rounded-lg border border-emerald-200 text-[11px] text-stone-800 space-y-0.5">
                        <p>👤 <strong>नाव:</strong> {customerName}</p>
                        <p>📍 <strong>स्थळ:</strong> गांधीनगर, दर्यापूर बनोसा</p>
                        <p>🕒 <strong>वेळ:</strong> सकाळी १०:३० ते रात्री ८:३० दरम्यान</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & double ticks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-stone-400">
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl rounded-tl-xs w-28 border border-stone-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Chat Input Footer */}
        <div className="bg-[#f0f2f5] p-3 border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="मराठी किंवा इंग्रजीत विचारा (उदा. आजचा सोने दर काय आहे?)..."
            className="flex-1 bg-white border border-stone-300 rounded-full px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#075E54]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-[#00a884] text-white shadow-md hover:bg-[#009475]'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
            title="Send"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
