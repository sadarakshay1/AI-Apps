import React, { useState } from 'react';
import { 
  DollarSign, 
  Tag, 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Share2, 
  PhoneCall, 
  Sparkles, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { GoldRate, ShowroomOffer, LeadRecord, ShowroomAppointment } from '../types';
import { SHOWROOM_DETAILS } from '../data/showroomData';

interface AdminCrmDashboardProps {
  goldRates: GoldRate;
  onUpdateRates: (rates: GoldRate) => Promise<void>;
  activeOffers: ShowroomOffer[];
  onAddOffer: (offer: Partial<ShowroomOffer>) => Promise<void>;
  onToggleOffer: (id: string, currentStatus: boolean) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
  leads: LeadRecord[];
  onUpdateLeadStatus: (id: string, newStatus: LeadRecord['status']) => Promise<void>;
  appointments: ShowroomAppointment[];
  onAddAppointment: (apt: Partial<ShowroomAppointment>) => Promise<void>;
  onInitiateCallForLead?: (lead: LeadRecord) => void;
}

export const AdminCrmDashboard: React.FC<AdminCrmDashboardProps> = ({
  goldRates,
  onUpdateRates,
  activeOffers,
  onAddOffer,
  onToggleOffer,
  onDeleteOffer,
  leads,
  onUpdateLeadStatus,
  appointments,
  onAddAppointment,
  onInitiateCallForLead
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'rates' | 'offers' | 'appointments'>('leads');

  // Rate edit states
  const [editingRates, setEditingRates] = useState<GoldRate>({ ...goldRates });
  const [rateSaveSuccess, setRateSaveSuccess] = useState(false);

  // New offer form modal state
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferTitleMr, setNewOfferTitleMr] = useState('');
  const [newOfferDescMr, setNewOfferDescMr] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferCategory, setNewOfferCategory] = useState<ShowroomOffer['category']>('festival');
  const [newOfferValidity, setNewOfferValidity] = useState('या आठवड्यापुरती मर्यादित');

  // Lead search & filter
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  // Save rates
  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateRates(editingRates);
    setRateSaveSuccess(true);
    setTimeout(() => setRateSaveSuccess(false), 3000);
  };

  // Add offer
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitleMr.trim()) return;

    await onAddOffer({
      title: newOfferTitle || newOfferTitleMr,
      titleMr: newOfferTitleMr,
      description: newOfferDescMr,
      descriptionMr: newOfferDescMr,
      category: newOfferCategory,
      code: newOfferCode || 'VJ' + Math.floor(100 + Math.random() * 900),
      validUntil: newOfferValidity,
      isActive: true,
      discountSummary: newOfferTitleMr
    });

    setNewOfferTitle('');
    setNewOfferTitleMr('');
    setNewOfferDescMr('');
    setNewOfferCode('');
    setShowAddOfferModal(false);
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(leadSearch.toLowerCase()) ||
                          lead.phone.includes(leadSearch) ||
                          lead.interestedJewellery.some(j => j.toLowerCase().includes(leadSearch.toLowerCase()));
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadRecord['status']) => {
    switch (status) {
      case 'visit_scheduled':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">भेट निश्चित (Visit Booked)</span>;
      case 'transferred_to_human':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">स्टाफ संपर्क आवश्यक</span>;
      case 'interested':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">इच्छुक (Interested)</span>;
      case 'contacted':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">संपर्क केला</span>;
      case 'visited':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">भेट दिली (Visited)</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">नवीन चौकशी</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header stats */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 font-marathi">
              शोरूम कमांड सेंटर व CRM (Showroom Hub)
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
              दर्यापूर शाखा
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            दर अपडेट, सणासुदीच्या अधिकृत ऑफर्स, AI कॉलर लीड्स आणि ग्राहकांच्या भेटींचे व्यवस्थापन.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'leads' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>ग्राहक लीड्स ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'rates' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-700" />
            <span>सोने-चांदी थेट दर</span>
          </button>

          <button
            onClick={() => setActiveSubTab('offers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'offers' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>अधिकृत ऑफर्स ({activeOffers.filter(o => o.isActive).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'appointments' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>शोरूम भेटी ({appointments.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Leads CRM */}
      {activeSubTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-5">
          {/* Controls: Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="ग्राहक नाव, फोन किंवा दागिन्यांचा प्रकार शोधा..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">सर्व स्थिती (All Statuses)</option>
                <option value="visit_scheduled">भेट निश्चित (Visit Scheduled)</option>
                <option value="interested">इच्छुक (Interested)</option>
                <option value="transferred_to_human">स्टाफ संपर्क आवश्यक (Human Handover)</option>
                <option value="contacted">संपर्क केला (Contacted)</option>
                <option value="new">नवीन चौकशी (New)</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3">ग्राहक माहिती</th>
                  <th className="py-3 px-3">पसंतीचे दागिने</th>
                  <th className="py-3 px-3">अंदाजे बजेट</th>
                  <th className="py-3 px-3">शोरूम भेट / वेळ</th>
                  <th className="py-3 px-3">स्थिती</th>
                  <th className="py-3 px-3 text-right">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900 text-sm font-marathi">
                        {lead.customerName}
                      </div>
                      <div className="font-mono text-stone-500 text-[11px]">
                        {lead.phone}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {lead.channel === 'both' ? 'कॉल + WhatsApp' : lead.channel} • {lead.lastInteractionDate}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {lead.interestedJewellery.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-100/80 text-amber-950 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {lead.callSummary && (
                        <p className="text-[10px] text-stone-500 mt-1 italic line-clamp-1">
                          "{lead.callSummary}"
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-amber-900 text-xs">
                        {lead.approxBudget || 'स्पष्ट नाही'}
                      </span>
                      {lead.purchaseTimeline && (
                        <span className="block text-[10px] text-stone-500">
                          {lead.purchaseTimeline}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {lead.preferredVisitDate ? (
                        <div className="text-emerald-800 font-bold text-xs flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lead.preferredVisitDate}</span>
                        </div>
                      ) : lead.preferredCallbackTime ? (
                        <div className="text-stone-600 text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>पुन्हा कॉल: {lead.preferredCallbackTime}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {getStatusBadge(lead.status)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct WhatsApp Chat */}
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्कार ${lead.customerName}जी, विश्वकर्मा ज्वेलर्स दर्यापूरकडून संपर्क करत आहोत. आपल्या पसंतीनुसार नवीन दागिने शोरूममध्ये उपलब्ध आहेत.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="WhatsApp वर मेसेज करा"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>

                        {/* Call Launcher */}
                        {onInitiateCallForLead && (
                          <button
                            onClick={() => onInitiateCallForLead(lead)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                            title="AI व्हॉईस कॉल करा"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Status dropdown */}
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="text-[10px] bg-stone-50 border border-stone-200 rounded-lg px-2 py-1"
                        >
                          <option value="new">नवीन</option>
                          <option value="contacted">संपर्क झाला</option>
                          <option value="interested">इच्छुक</option>
                          <option value="visit_scheduled">भेट निश्चित</option>
                          <option value="visited">भेट दिली</option>
                          <option value="transferred_to_human">स्टाफकडे हस्तांतरित</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Live Gold Rates Editor */}
      {activeSubTab === 'rates' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-marathi">
                दुकान सोने-चांदी थेट दर नियंत्रक (Live Gold Rate Controller)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                येथे बदल केलेले दर तत्काळ AI WhatsApp रिसेप्शनिस्ट व AI कॉलर संभाषणात लागू होतात.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              शेवटची अपडेट: {goldRates.lastUpdated}
            </span>
          </div>

          <form onSubmit={handleSaveRates} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <label className="text-xs font-bold text-amber-950 block mb-1">
                २२K सोने दर (BIS ९१६ हॉलमार्क):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                <input
                  type="number"
                  value={editingRates.karat22}
                  onChange={(e) => setEditingRates({ ...editingRates, karat22: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-amber-300 rounded-xl font-bold text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">प्रति १० ग्रॅम (Per 10g)</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-stone-900 block mb-1">
                २४K शुद्ध सोने दर (999 Pure):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                <input
                  type="number"
                  value={editingRates.karat24}
                  onChange={(e) => setEditingRates({ ...editingRates, karat24: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">प्रति १० ग्रॅम (Per 10g)</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-stone-900 block mb-1">
                १८K दागिने सोने दर:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                <input
                  type="number"
                  value={editingRates.karat18}
                  onChange={(e) => setEditingRates({ ...editingRates, karat18: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">प्रति १० ग्रॅम (Per 10g)</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-stone-900 block mb-1">
                शुद्ध चांदी दर (Silver Rate):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                <input
                  type="number"
                  step="0.1"
                  value={editingRates.silverPerGram}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditingRates({ ...editingRates, silverPerGram: val, silverPerKg: val * 1000 });
                  }}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">प्रति ग्रॅम (₹{editingRates.silverPerKg}/kg)</span>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <label className="text-xs text-stone-600 font-medium">बाजार कल:</label>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="trend"
                      value="up"
                      checked={editingRates.marketTrend === 'up'}
                      onChange={() => setEditingRates({ ...editingRates, marketTrend: 'up' })}
                      className="text-amber-600"
                    />
                    <span>किंचित वाढ (Up)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="trend"
                      value="stable"
                      checked={editingRates.marketTrend === 'stable'}
                      onChange={() => setEditingRates({ ...editingRates, marketTrend: 'stable' })}
                      className="text-amber-600"
                    />
                    <span>स्थिर (Stable)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>दर सेव्ह करा (Save Rates)</span>
              </button>
            </div>
          </form>

          {rateSaveSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>नवीन सोने-चांदी दर यशस्वीरीत्या सेव्ह झाले आहेत आणि AI सिस्टीममध्ये अपडेट झाले आहेत!</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Verified Offers Manager */}
      {activeSubTab === 'offers' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-marathi">
                अधिकृत ऑफर्स व डिस्काउंट व्यवस्थापन
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                नियम: AI फक्त येथे सक्रिय असलेल्या अधिकृत ऑफर्स ग्राहकांना सांगते (कदापि स्वतःहून ऑफर तयार करत नाही).
              </p>
            </div>

            <button
              onClick={() => setShowAddOfferModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन ऑफर जोडा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOffers.map((offer) => (
              <div
                key={offer.id}
                className={`p-4 rounded-2xl border transition-all ${
                  offer.isActive
                    ? 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded">
                    {offer.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleOffer(offer.id, offer.isActive)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        offer.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {offer.isActive ? 'चालू (Active)' : 'बंद (Inactive)'}
                    </button>
                    <button
                      onClick={() => onDeleteOffer(offer.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="हटवा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-stone-900 text-sm mt-2 font-marathi">
                  {offer.titleMr}
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {offer.descriptionMr}
                </p>

                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span>वैधता: {offer.validUntil}</span>
                  <span className="capitalize font-semibold text-amber-900">{offer.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to add new offer */}
          {showAddOfferModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
                <h3 className="font-bold text-stone-900 text-base font-marathi">
                  नवीन शोरूम ऑफर जोडा (Add New Offer)
                </h3>

                <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">ऑफर शीर्षक (मराठीत):</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. अक्षय्य तृतीया विशेष - घडणावळीवर ३०% सूट"
                      value={newOfferTitleMr}
                      onChange={(e) => setNewOfferTitleMr(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">तपशील व अटी (मराठीत):</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="उदा. सर्व ब्रायडल नेकलेस व मंगळसूत्रांवर उपलब्ध. ₹१ लाखावरील खरेदीवर मोफत चांदीचे नाणे."
                      value={newOfferDescMr}
                      onChange={(e) => setNewOfferDescMr(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">प्रोमो कोड:</label>
                      <input
                        type="text"
                        placeholder="उदा. AKSHAYA30"
                        value={newOfferCode}
                        onChange={(e) => setNewOfferCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">प्रकार (Category):</label>
                      <select
                        value={newOfferCategory}
                        onChange={(e) => setNewOfferCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      >
                        <option value="festival">सण विशेष (Festival)</option>
                        <option value="making_charge">घडणावळ सूट (Making Charge)</option>
                        <option value="wedding">लग्नसराई (Wedding)</option>
                        <option value="exchange">जुने सोने बदल (Exchange)</option>
                        <option value="special">विशेष योजना (Special)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">वैधता कालावधी:</label>
                    <input
                      type="text"
                      value={newOfferValidity}
                      onChange={(e) => setNewOfferValidity(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAddOfferModal(false)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                    >
                      रद्द करा
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      ऑफर जोडा
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Showroom Appointments Calendar */}
      {activeSubTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-marathi">
                नोंदवलेल्या शोरूम भेटी (Confirmed Visits)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                AI रिसेप्शनिस्ट किंवा फोन कॉलरद्वारे नोंदवलेल्या भेटींचे वेळापत्रक.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {apt.status === 'confirmed' ? 'निश्चित भेट' : apt.status}
                  </span>
                  <span className="text-xs font-mono text-stone-500">{apt.phone}</span>
                </div>

                <h4 className="font-bold text-stone-900 text-sm font-marathi">
                  {apt.customerName}
                </h4>

                <div className="space-y-1 text-xs text-stone-700 pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-900">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{apt.date} • {apt.time}</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    <strong>दागिने आवड:</strong> {apt.jewelleryInterest}
                  </p>
                  {apt.notes && (
                    <p className="text-[10px] text-stone-500 italic">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्कार ${apt.customerName}जी, विश्वकर्मा ज्वेलर्स दर्यापूर येथे आपली भेट ${apt.date} रोजी ${apt.time} वाजता नोंदवली आहे. आपले स्वागत करण्यास आम्ही सज्ज आहोत.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>WhatsApp स्मरणपत्र पाठवा</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
