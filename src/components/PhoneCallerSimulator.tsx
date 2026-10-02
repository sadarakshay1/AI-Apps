import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Share2, 
  User, 
  Calendar,
  Tag,
  ArrowRight,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { SHOWROOM_DETAILS, CAMPAIGNS } from '../data/showroomData';
import { CampaignInfo, LeadQualification, LeadRecord } from '../types';
import { voiceAssistant } from '../utils/audioPlayer';

interface PhoneCallerSimulatorProps {
  onCallCompleted?: (lead: Partial<LeadRecord>) => void;
  onOpenWhatsAppView?: () => void;
}

export const PhoneCallerSimulator: React.FC<PhoneCallerSimulatorProps> = ({
  onCallCompleted,
  onOpenWhatsAppView
}) => {
  // Campaign & Caller setup
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(CAMPAIGNS[0].id);
  const [callType, setCallType] = useState<'outbound' | 'inbound'>('outbound');
  const [customerName, setCustomerName] = useState('प्रदीप देशमुख');
  const [customerPhone, setCustomerPhone] = useState('+91 94228 76543');

  // Call lifecycle states
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'ringing' | 'connected' | 'completed'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<{ speaker: 'ai' | 'customer'; text: string; time: string }[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);

  // Extracted qualification in real time
  const [qualification, setQualification] = useState<LeadQualification>({
    interestedJewellery: [],
    approxBudget: undefined,
    purchaseTimeline: undefined,
    preferredVisitDate: undefined,
    preferredCallbackTime: undefined,
  });

  // Post-call WhatsApp notification trigger
  const [postCallWhatsApp, setPostCallWhatsApp] = useState<{
    triggered: boolean;
    text: string;
    sent: boolean;
  }>({
    triggered: false,
    text: '',
    sent: false
  });

  const [customSpeechInput, setCustomSpeechInput] = useState('');
  const [callSummary, setCallSummary] = useState<string>('');

  const timerRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Call duration counter
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isAiSpeaking]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Start Call
  const handleStartCall = async () => {
    setCallDuration(0);
    setTranscript([]);
    setCurrentTurn(0);
    setCallSummary('');
    setPostCallWhatsApp({ triggered: false, text: '', sent: false });
    setQualification({ interestedJewellery: [] });

    setCallState('dialing');

    // Simulate dialing/ringing delay
    setTimeout(() => {
      setCallState('ringing');
      setTimeout(async () => {
        setCallState('connected');
        // Initial Turn 0 from AI
        await triggerAiCallTurn('', 0);
      }, 1600);
    }, 1200);
  };

  // Trigger AI Turn via backend
  const triggerAiCallTurn = async (customerSpokenWords: string, turnNum: number) => {
    setIsAiSpeaking(true);

    try {
      const res = await fetch('/api/ai/call-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaignId,
          customerName,
          customerPhone,
          callType,
          turnNumber: turnNum,
          customerSpeech: customerSpokenWords,
          transcriptHistory: transcript,
          currentQualification: qualification
        })
      });

      const data = await res.json();

      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Add to transcript
      setTranscript(prev => [
        ...prev,
        { speaker: 'ai', text: data.speechText, time: timeStr }
      ]);

      // Update qualification
      if (data.qualification) {
        setQualification(prev => ({
          ...prev,
          interestedJewellery: Array.from(new Set([...(prev.interestedJewellery || []), ...(data.qualification.interestedJewellery || [])])),
          approxBudget: data.qualification.approxBudget || prev.approxBudget,
          purchaseTimeline: data.qualification.purchaseTimeline || prev.purchaseTimeline,
          preferredVisitDate: data.qualification.preferredVisitDate || prev.preferredVisitDate,
          preferredCallbackTime: data.qualification.preferredCallbackTime || prev.preferredCallbackTime,
          isBusyOrDeclined: data.qualification.isBusyOrDeclined || prev.isBusyOrDeclined,
          appointmentBooked: data.qualification.appointmentBooked || prev.appointmentBooked,
          requiresHumanHandover: data.qualification.requiresHumanHandover || prev.requiresHumanHandover
        }));
      }

      if (data.callSummary) {
        setCallSummary(data.callSummary);
      }

      if (data.triggerWhatsAppMessage && data.whatsAppFollowUpText) {
        setPostCallWhatsApp({
          triggered: true,
          text: data.whatsAppFollowUpText,
          sent: false
        });
      }

      // Voice synthesis
      voiceAssistant.speakText(
        data.speechText,
        data.language || 'mr',
        () => setIsAiSpeaking(true),
        () => setIsAiSpeaking(false)
      );

      setCurrentTurn(turnNum + 1);

      if (data.callStatus === 'completed' || data.callStatus === 'busy_rescheduled' || data.callStatus === 'declined') {
        // End call naturally after speech finishes
        setTimeout(() => {
          handleEndCall(false);
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      setIsAiSpeaking(false);
    }
  };

  // Handle Customer Spoken response
  const handleCustomerResponse = async (responseText: string) => {
    if (!responseText.trim() || isAiSpeaking) return;

    voiceAssistant.stop();
    setIsAiSpeaking(false);

    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [
      ...prev,
      { speaker: 'customer', text: responseText, time: timeStr }
    ]);
    setCustomSpeechInput('');

    // Trigger AI response to customer input
    await triggerAiCallTurn(responseText, currentTurn);
  };

  // End Call
  const handleEndCall = (manual: boolean = true) => {
    voiceAssistant.stop();
    setIsAiSpeaking(false);
    setCallState('completed');

    if (onCallCompleted) {
      onCallCompleted({
        customerName,
        phone: customerPhone,
        interestedJewellery: qualification.interestedJewellery || ['कॉल चौकशी'],
        approxBudget: qualification.approxBudget,
        preferredVisitDate: qualification.preferredVisitDate,
        preferredCallbackTime: qualification.preferredCallbackTime,
        status: qualification.appointmentBooked ? 'visit_scheduled' : (qualification.isBusyOrDeclined ? 'contacted' : 'interested'),
        callSummary: callSummary || 'कॉल संपन्न झाला.',
        whatsappSent: postCallWhatsApp.triggered
      });
    }
  };

  // Browser speech recognition (Customer talking via Mic)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the quick customer replies below.');
      return;
    }

    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setIsListeningMic(false);
        handleCustomerResponse(spoken);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  // Quick Customer Responses aligned with prompt scenarios
  const quickCustomerReplies = [
    { label: 'होय, वेळ आहे (Yes, I have time)', text: 'होय, नमस्कार. माझ्याकडे दोन मिनिटे वेळ आहे, सांगा.' },
    { label: 'नाही, सध्या व्यस्त आहे (Busy, call later)', text: 'नाही, मी सध्या कामात व्यस्त आहे. मला नंतर फोन करा.' },
    { label: 'संध्याकाळी ७ वाजता कॉल करा', text: 'मला आज संध्याकाळी ७:०० वाजता कॉल करा, त्यावेळी मी मोकळा असेन.' },
    { label: 'नेकलेस व मंगळसूत्र पाहायचे आहे', text: 'आम्हाला २२ कॅरेट सोन्याचा नेकलेस आणि २ वाटी मंगळसूत्र खरेदी करायचे आहे.' },
    { label: 'बजेट ₹१ ते २ लाख आहे', text: 'आमचा अंदाजे बजेट ₹१ लाख ते २ लाखांच्या दरम्यान आहे.' },
    { label: 'रविवारी दर्यापूर शोरूमला भेट देईन', text: 'मी येत्या रविवारी दुपारी ४ वाजता तुमच्या दर्यापूर शोरूमला स्वतः भेट देईन.' },
    { label: 'फोटो WhatsApp वर पाठवा', text: 'नक्की, नवीन डिझाईन्सचे फोटो व कॅटलॉग माझ्या या नंबरवर WhatsApp करा.' }
  ];

  const activeCampaign = CAMPAIGNS.find(c => c.id === selectedCampaignId) || CAMPAIGNS[0];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Banner explaining AI caller capability */}
      <div className="bg-gradient-to-r from-amber-900/90 via-[#420d16] to-amber-950 text-white rounded-3xl p-6 mb-6 shadow-lg border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full">
              AI Voice Engine • मराठी / Hindi / English
            </span>
            <span className="text-amber-200/80 text-xs flex items-center gap-1 font-marathi">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              सौम्य, आदरार्थी व व्यावसायिक टोन
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-marathi text-amber-100">
            विश्वकर्मा ज्वेलर्स AI ऑटो-कॉलर व रिसेप्शनिस्ट
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl font-sans">
            ग्राहक संपर्क मोहीम, नवीन कलेक्शन माहिती, सणासुदीच्या ऑफर्स आणि चौकशी पाठपुरावा (Follow-up) साठी वास्तविक मानवी संभाषणासारखा AI व्हॉईस कॉल.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="bg-black/30 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-3 text-center w-full md:w-auto">
            <span className="text-[10px] text-amber-300 uppercase block font-bold">व्हर्च्युअल असिस्टंट</span>
            <span className="text-sm font-bold text-white font-marathi">राधिका (सेल्स एक्झिक्युटिव्ह)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Campaign Control & Qualification (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Campaign Selector */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-700" />
              <span>कॉलिंग मोहीम निवडा (Select Campaign)</span>
            </h3>

            <div className="space-y-2">
              {CAMPAIGNS.map(camp => (
                <label
                  key={camp.id}
                  className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCampaignId === camp.id
                      ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="campaign"
                        value={camp.id}
                        checked={selectedCampaignId === camp.id}
                        onChange={() => setSelectedCampaignId(camp.id)}
                        disabled={callState !== 'idle' && callState !== 'completed'}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-bold text-xs text-stone-900 font-marathi">
                        {camp.titleMr}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 pl-6 leading-relaxed">
                    {camp.description}
                  </p>
                </label>
              ))}
            </div>

            {/* Target customer settings */}
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-stone-500 font-medium block mb-1">ग्राहकाचे नाव:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={callState !== 'idle' && callState !== 'completed'}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-medium block mb-1">फोन नंबर:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  disabled={callState !== 'idle' && callState !== 'completed'}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Real-time Customer Qualification Board */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 font-marathi">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>संभाषणातून निष्पन्न माहिती (Qualification)</span>
              </h3>
              {callState === 'connected' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Live Extraction
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-stone-500 text-[11px]">दागिने पसंती:</span>
                <span className="font-bold text-stone-900 text-right">
                  {qualification.interestedJewellery && qualification.interestedJewellery.length > 0
                    ? qualification.interestedJewellery.join(', ')
                    : 'संभाषण सुरू झाल्यावर स्पष्ट होईल'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-stone-500 text-[11px]">अंदाजे बजेट:</span>
                <span className="font-bold text-amber-900">
                  {qualification.approxBudget || 'नोंद झालेली नाही'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-stone-500 text-[11px]">शोरूम भेट तारीख:</span>
                <span className="font-bold text-emerald-800">
                  {qualification.preferredVisitDate || 'प्रलंबित'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-stone-500 text-[11px]">पुन्हा कॉल करण्याची वेळ:</span>
                <span className="font-bold text-stone-800">
                  {qualification.preferredCallbackTime || 'आवश्यकता नाही'}
                </span>
              </div>

              {callSummary && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                  <strong>CRM नोट:</strong> {callSummary}
                </div>
              )}
            </div>
          </div>

          {/* Post-Call WhatsApp Follow-up Trigger Card */}
          {postCallWhatsApp.triggered && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm animate-fade-in space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>ऑटोमॅटिक पोस्ट-कॉल WhatsApp संदेश</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {postCallWhatsApp.sent ? 'पाठवला गेला ✓' : 'तयार आहे'}
                </span>
              </div>

              <p className="text-[11px] text-stone-700 bg-white p-2.5 rounded-xl border border-emerald-200 font-sans leading-relaxed whitespace-pre-line">
                {postCallWhatsApp.text}
              </p>

              <div className="flex gap-2 pt-1">
                <a
                  href={`https://wa.me/919767326228?text=${encodeURIComponent(postCallWhatsApp.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setPostCallWhatsApp(prev => ({ ...prev, sent: true }))}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp वर पाठवा (वास्तवात)</span>
                </a>

                {onOpenWhatsAppView && (
                  <button
                    onClick={onOpenWhatsAppView}
                    className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold py-2 px-3 rounded-xl transition-all"
                  >
                    चॅट पाहा
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Interactive Phone Simulator (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-stone-900 rounded-[36px] p-4 sm:p-6 shadow-2xl border-4 border-stone-800 text-white flex flex-col h-[740px] max-w-md mx-auto relative overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-950 rounded-full flex items-center justify-center gap-2">
              <span className="w-10 h-1 bg-stone-800 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-stone-800 rounded-full"></span>
            </div>

            {/* Calling Screen States */}
            {callState === 'idle' || callState === 'completed' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-24 h-24 rounded-full gold-gradient p-1 shadow-xl">
                  <div className="w-full h-full bg-[#3b0a11] rounded-full flex items-center justify-center border-2 border-amber-300/40">
                    <PhoneCall className="w-10 h-10 text-amber-300" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-marathi text-amber-100">
                    {SHOWROOM_DETAILS.nameMr}
                  </h3>
                  <p className="text-xs text-stone-400">
                    AI आउटबाउंड कॉलर • {activeCampaign.titleMr}
                  </p>
                  <p className="text-sm font-mono text-amber-300 mt-2">
                    {customerName} ({customerPhone})
                  </p>
                </div>

                {callState === 'completed' && (
                  <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-3 text-xs text-stone-300 w-full space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>कॉल यशस्वीरित्या पूर्ण झाला</span>
                    </div>
                    <p className="text-[11px] text-stone-400">कालावधी: {formatDuration(callDuration)}</p>
                  </div>
                )}

                <button
                  onClick={handleStartCall}
                  className="w-full py-3.5 px-6 rounded-2xl gold-gradient text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/60 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>{callState === 'completed' ? 'पुन्हा कॉल सुरू करा' : 'AI व्हॉईस कॉल सुरू करा (Call Now)'}</span>
                </button>
              </div>
            ) : (
              /* Active In-Call Screen */
              <div className="flex-1 flex flex-col justify-between pt-6">
                {/* Caller Top Info */}
                <div className="text-center space-y-1">
                  <span className="text-[11px] text-amber-400/90 font-mono tracking-wider uppercase">
                    {callState === 'dialing' && 'डायल होत आहे...'}
                    {callState === 'ringing' && 'रिंग वाजत आहे...'}
                    {callState === 'connected' && `कॉल सुरू आहे • ${formatDuration(callDuration)}`}
                  </span>
                  <h4 className="text-lg font-bold font-marathi text-white">
                    {SHOWROOM_DETAILS.receptionistNameMr}
                  </h4>
                  <p className="text-xs text-stone-400">
                    विश्वकर्मा ज्वेलर्स दर्यापूर • {SHOWROOM_DETAILS.phoneNumber}
                  </p>

                  {/* Audio Waveform animation while AI speaks */}
                  <div className="h-10 flex items-center justify-center gap-1 my-2">
                    {isAiSpeaking ? (
                      <>
                        <span className="w-1 bg-amber-400 rounded-full h-4 animate-pulse"></span>
                        <span className="w-1 bg-amber-400 rounded-full h-8 animate-pulse [animation-delay:0.1s]"></span>
                        <span className="w-1 bg-amber-300 rounded-full h-6 animate-pulse [animation-delay:0.2s]"></span>
                        <span className="w-1 bg-amber-400 rounded-full h-10 animate-pulse [animation-delay:0.3s]"></span>
                        <span className="w-1 bg-amber-300 rounded-full h-5 animate-pulse [animation-delay:0.15s]"></span>
                        <span className="w-1 bg-amber-400 rounded-full h-7 animate-pulse [animation-delay:0.25s]"></span>
                      </>
                    ) : (
                      <span className="text-[11px] text-stone-500 font-mono">
                        (आपल्या उत्तराची वाट पाहत आहे...)
                      </span>
                    )}
                  </div>
                </div>

                {/* Call Transcript scrollable area */}
                <div className="flex-1 overflow-y-auto bg-stone-950/70 rounded-2xl p-3 my-2 space-y-2.5 border border-stone-800 text-xs">
                  {transcript.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${item.speaker === 'customer' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-stone-500 mb-0.5">
                        {item.speaker === 'ai' ? 'राधिका (AI Receptionist)' : `${customerName} (तुम्ही)`} • {item.time}
                      </span>
                      <div
                        className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                          item.speaker === 'customer'
                            ? 'bg-amber-600 text-white rounded-tr-xs'
                            : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-tl-xs'
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>

                {/* Interactive Customer Response Options during Call */}
                <div className="space-y-2 py-2">
                  <div className="text-[10px] text-stone-400 uppercase font-bold flex items-center justify-between">
                    <span>ग्राहकाचे संभाषण पर्याय (Speak / Reply):</span>
                    {isListeningMic && (
                      <span className="text-rose-400 font-mono flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> ऐकत आहे...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {quickCustomerReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleCustomerResponse(reply.text)}
                        disabled={isAiSpeaking}
                        className="bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-[11px] p-2 rounded-xl text-left text-stone-200 border border-stone-700 transition-colors truncate"
                        title={reply.text}
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>

                  {/* Free text speech input */}
                  <div className="flex gap-1.5 items-center mt-1">
                    <input
                      type="text"
                      value={customSpeechInput}
                      onChange={(e) => setCustomSpeechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCustomerResponse(customSpeechInput)}
                      placeholder="आपले उत्तर टाईप करा किंवा खालील पर्याय निवडा..."
                      disabled={isAiSpeaking}
                      className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleCustomerResponse(customSpeechInput)}
                      disabled={!customSpeechInput.trim() || isAiSpeaking}
                      className="bg-amber-600 disabled:bg-stone-800 text-white p-2 rounded-xl"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Call Control Buttons (Mute, Mic Speak, End) */}
                <div className="flex items-center justify-around pt-3 border-t border-stone-800">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      isMuted ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleSpeechRecognition}
                    className={`w-13 h-13 rounded-full flex items-center justify-center transition-all ${
                      isListeningMic
                        ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    }`}
                    title="माईकद्वारे बोला (Microphone)"
                  >
                    {isListeningMic ? <Mic className="w-6 h-6" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleEndCall(true)}
                    className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all"
                    title="कॉल समाप्त करा (End Call)"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
