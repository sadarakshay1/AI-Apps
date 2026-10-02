import React, { useState } from 'react';
import { X, Gem, ShieldCheck, Share2, Sparkles, Filter, Check } from 'lucide-react';
import { JewelleryItem, GoldRate } from '../types';
import { SHOWROOM_DETAILS } from '../data/showroomData';

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogue: JewelleryItem[];
  goldRates: GoldRate;
}

export const CatalogueModal: React.FC<CatalogueModalProps> = ({
  isOpen,
  onClose,
  catalogue,
  goldRates
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'सर्व दागिने (All)' },
    { id: 'necklace', label: 'हार व साज (Necklace)' },
    { id: 'wedding', label: 'ब्रायडल सेट्स (Bridal)' },
    { id: 'mangalsutra', label: 'मंगळसूत्र (Mangalsutra)' },
    { id: 'bangles', label: 'पाटल्या व तोडे (Bangles)' },
    { id: 'ring', label: 'अंगठ्या व डायमंड (Rings)' },
    { id: 'silver_pooja', label: 'चांदी पूजा वस्तू (Silver)' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? catalogue
    : catalogue.filter(item => item.category === selectedCategory);

  const getWhatsAppEnquiryLink = (item: JewelleryItem) => {
    const text = `नमस्कार विश्वकर्मा ज्वेलर्स दर्यापूर! मला आपल्या कॅटलॉगमधील "${item.nameMr} (${item.name})" बद्दल माहिती व कोटेशन हवे आहे.`;
    return `https://wa.me/919767326228?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#420d16] to-[#5a1320] text-amber-50 p-5 flex items-center justify-between border-b border-amber-600/40">
          <div>
            <div className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-lg font-marathi">
                विश्वकर्मा ज्वेलर्स खास ज्वेलरी कॅटलॉग
              </h3>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              १००% BIS ९१६ हॉलमार्क शुद्ध सोने • पारंपारिक व आधुनिक डिझाईन्स
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{item.purity} BIS ९१६</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/95 text-stone-900 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    वजन: ~{item.approxWeightGrams}g
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm font-marathi">
                    {item.nameMr}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {item.descriptionMr}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">अंदाजे मूल्य</span>
                      <span className="text-base font-bold text-amber-900 font-mono">
                        ₹{item.estimatedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      स्टॉकमध्ये उपलब्ध
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={getWhatsAppEnquiryLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp वर चौकशी करा</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            * दर आजच्या २२K/२४K बाजारभावानुसार अंदाजित आहेत. अचूक वजन व घडणावळीसाठी शोरूमला भेट द्या.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};
