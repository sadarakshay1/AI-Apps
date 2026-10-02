import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  LayoutDashboard,
  Gem,
  Info,
  Download
} from 'lucide-react';
import { SHOWROOM_DETAILS } from '../data/showroomData';
import { GoldRate } from '../types';

interface HeaderProps {
  activeTab: 'whatsapp' | 'caller' | 'admin';
  setActiveTab: (tab: 'whatsapp' | 'caller' | 'admin') => void;
  goldRates: GoldRate;
  onOpenCatalogue: () => void;
  onOpenShowroomInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  goldRates,
  onOpenCatalogue,
  onOpenShowroomInfo
}) => {
  return (
    <header className="bg-gradient-to-r from-[#3b0a11] via-[#52101c] to-[#3b0a11] text-amber-50 border-b border-amber-600/30 shadow-xl sticky top-0 z-30">
      {/* Top micro ticker */}
      <div className="bg-amber-950/80 px-4 py-1.5 text-xs border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {SHOWROOM_DETAILS.businessHoursShort} • दुकान चालू आहे
          </span>
          <span className="hidden sm:inline-block text-amber-200/40">|</span>
          <a 
            href={SHOWROOM_DETAILS.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-200/90 hover:text-amber-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-marathi">{SHOWROOM_DETAILS.addressMr}</span>
            <span className="text-[11px] bg-amber-900/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">
              W8GC+57
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-900/60 border border-amber-500/30 px-2 py-0.5 rounded-full text-amber-200 text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-amber-100">{SHOWROOM_DETAILS.googleRating}</span>
            <span className="text-amber-300/70">({SHOWROOM_DETAILS.reviewCount} Reviews on Google)</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-amber-300 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            १००% BIS ९१६ हॉलमार्क
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gold-gradient p-0.5 shadow-lg shadow-amber-950/50 flex-shrink-0">
              <div className="w-full h-full bg-[#420d16] rounded-[10px] flex items-center justify-center border border-amber-400/40">
                <Sparkles className="w-6 h-6 text-amber-300 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-marathi text-amber-100">
                  {SHOWROOM_DETAILS.nameMr}
                </h1>
                <span className="bg-emerald-600/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  AI Verified
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-heading tracking-wider">
                {SHOWROOM_DETAILS.name.toUpperCase()} • DARYAPUR BANOSA
              </p>
            </div>
          </div>

          {/* Quick Info buttons on mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCatalogue}
              className="p-2 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200"
              title="Catalogue"
            >
              <Gem className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={onOpenShowroomInfo}
              className="p-2 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200"
              title="Showroom Details"
            >
              <Info className="w-4 h-4 text-amber-300" />
            </button>
            <a
              href="/api/download-zip"
              download="vishwakarma-jewellers-daryapur.zip"
              className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 border border-amber-400 text-white"
              title="Download Source ZIP"
            >
              <Download className="w-4 h-4 text-amber-100" />
            </a>
          </div>
        </div>

        {/* Live Gold Rate Chip */}
        <div className="hidden lg:flex items-center gap-3 bg-black/30 border border-amber-500/30 rounded-xl px-3 py-1.5 backdrop-blur-sm">
          <div className="text-right border-r border-amber-500/30 pr-3">
            <span className="text-[10px] uppercase text-amber-300/80 font-bold block">२२K सोने दर (916)</span>
            <span className="text-sm font-bold text-amber-200 font-mono">
              ₹{goldRates.karat22.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-amber-300/70">/10g</span>
            </span>
          </div>
          <div className="text-right border-r border-amber-500/30 pr-3">
            <span className="text-[10px] uppercase text-amber-300/80 font-bold block">२४K शुद्ध सोने</span>
            <span className="text-sm font-bold text-amber-100 font-mono">
              ₹{goldRates.karat24.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-amber-300/70">/10g</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-stone-300/80 font-bold block">चांदी दर</span>
            <span className="text-sm font-bold text-stone-200 font-mono">
              ₹{goldRates.silverPerGram}<span className="text-[10px] font-normal text-stone-400">/g</span>
            </span>
          </div>
        </div>

        {/* Mode Navigation Switches */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-amber-500/30 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Receptionist</span>
          </button>

          <button
            onClick={() => setActiveTab('caller')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'caller'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-950/40'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>AI Voice Caller</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-stone-700 text-amber-200 shadow-md border border-amber-400/40'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>CRM & Control</span>
          </button>
        </div>

        {/* Action icons desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenCatalogue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/40 text-amber-200 text-xs font-medium transition-all"
          >
            <Gem className="w-3.5 h-3.5 text-amber-300" />
            <span>कॅटलॉग</span>
          </button>

          <button
            onClick={onOpenShowroomInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/40 text-amber-200 text-xs font-medium transition-all"
          >
            <Info className="w-3.5 h-3.5 text-amber-300" />
            <span>दुकान माहिती</span>
          </button>

          <a
            href="/api/download-zip"
            download="vishwakarma-jewellers-daryapur.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-sm transition-all"
            title="Download full project code as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>
        </div>
      </div>
    </header>
  );
};
