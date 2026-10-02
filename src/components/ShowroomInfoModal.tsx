import React from 'react';
import { X, MapPin, Star, Clock, Phone, ShieldCheck, ExternalLink, Heart, Sparkles, Award } from 'lucide-react';
import { SHOWROOM_DETAILS } from '../data/showroomData';

interface ShowroomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowroomInfoModal: React.FC<ShowroomInfoModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#420d16] to-[#5a1320] text-amber-50 p-6 flex items-center justify-between border-b border-amber-600/40">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-lg font-marathi">
                {SHOWROOM_DETAILS.nameMr}
              </h3>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {SHOWROOM_DETAILS.taglineMr}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-stone-800 text-xs leading-relaxed">
          {/* Rating & Badge Bar */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-300/40 text-amber-400" />
              </div>
              <span className="font-bold text-stone-900 text-sm">{SHOWROOM_DETAILS.googleRating} / ५.०</span>
              <span className="text-stone-500">({SHOWROOM_DETAILS.reviewCount} Google Reviews)</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
              उत्कृष्ट सेवा व विश्वास
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block text-xs">पत्ता व लोकेशन:</span>
                <p className="text-stone-600 mt-0.5">{SHOWROOM_DETAILS.addressMr}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                    Plus Code: {SHOWROOM_DETAILS.googleMapsCode}
                  </span>
                  <a
                    href={SHOWROOM_DETAILS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Google Maps वर नेव्हिगेट करा</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block text-xs">दुकान उघडण्याची वेळ:</span>
                <p className="text-stone-600 mt-0.5">{SHOWROOM_DETAILS.businessHours}</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  ✓ रविवारी (Sunday) देखील सकाळी १०:३० वाजल्यापासून ग्राहकांच्या सेवेसाठी उघडे असते.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block text-xs">संपर्क क्रमांक:</span>
                <p className="text-stone-600 mt-0.5 font-mono">
                  {SHOWROOM_DETAILS.phoneNumber} / {SHOWROOM_DETAILS.whatsappNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Showroom Key Strengths */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-stone-900 text-xs font-marathi">
              विश्वकर्मा ज्वेलर्स दर्यापूरची वैशिष्ट्ये:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600">
              {SHOWROOM_DETAILS.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-1.5 bg-amber-50/50 p-2 rounded-xl border border-amber-200/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <a
            href={`tel:${SHOWROOM_DETAILS.phoneNumber}`}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>थेट फोन करा</span>
          </a>

          <a
            href={SHOWROOM_DETAILS.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps दिशा</span>
          </a>
        </div>
      </div>
    </div>
  );
};
