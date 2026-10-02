import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { PhoneCallerSimulator } from './components/PhoneCallerSimulator';
import { AdminCrmDashboard } from './components/AdminCrmDashboard';
import { CatalogueModal } from './components/CatalogueModal';
import { ShowroomInfoModal } from './components/ShowroomInfoModal';
import { 
  INITIAL_GOLD_RATE, 
  INITIAL_OFFERS, 
  INITIAL_CATALOGUE, 
  INITIAL_LEADS, 
  INITIAL_APPOINTMENTS,
  SHOWROOM_DETAILS
} from './data/showroomData';
import { GoldRate, ShowroomOffer, LeadRecord, ShowroomAppointment, JewelleryItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'caller' | 'admin'>('whatsapp');
  
  // Data state with robust defaults
  const [goldRates, setGoldRates] = useState<GoldRate>(INITIAL_GOLD_RATE);
  const [activeOffers, setActiveOffers] = useState<ShowroomOffer[]>(INITIAL_OFFERS);
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [appointments, setAppointments] = useState<ShowroomAppointment[]>(INITIAL_APPOINTMENTS);
  const [catalogue, setCatalogue] = useState<JewelleryItem[]>(INITIAL_CATALOGUE);

  // Modals
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isShowroomInfoOpen, setIsShowroomInfoOpen] = useState(false);

  // Load latest state from server
  const fetchAllData = async () => {
    try {
      const [ratesRes, offersRes, leadsRes, aptsRes, catRes] = await Promise.allSettled([
        fetch('/api/rates').then(r => r.json()),
        fetch('/api/offers').then(r => r.json()),
        fetch('/api/leads').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/catalogue').then(r => r.json()),
      ]);

      if (ratesRes.status === 'fulfilled' && ratesRes.value) setGoldRates(ratesRes.value);
      if (offersRes.status === 'fulfilled' && offersRes.value) setActiveOffers(offersRes.value);
      if (leadsRes.status === 'fulfilled' && leadsRes.value) setLeads(leadsRes.value);
      if (aptsRes.status === 'fulfilled' && aptsRes.value) setAppointments(aptsRes.value);
      if (catRes.status === 'fulfilled' && catRes.value) setCatalogue(catRes.value);
    } catch (e) {
      console.warn('Backend API sync using local state cache');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update rates
  const handleUpdateRates = async (updatedRates: GoldRate) => {
    try {
      const res = await fetch('/api/rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGoldRates(data.data);
      } else {
        setGoldRates(updatedRates);
      }
    } catch (err) {
      setGoldRates(updatedRates);
    }
  };

  // Add offer
  const handleAddOffer = async (newOfferData: Partial<ShowroomOffer>) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfferData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveOffers(prev => [data.data, ...prev]);
      }
    } catch (err) {
      const localOffer: ShowroomOffer = {
        id: 'off_' + Date.now(),
        title: newOfferData.title || '',
        titleMr: newOfferData.titleMr || '',
        description: newOfferData.description || '',
        descriptionMr: newOfferData.descriptionMr || '',
        category: newOfferData.category || 'special',
        validUntil: newOfferData.validUntil || 'मर्यादित',
        isActive: true,
        code: newOfferData.code || 'VJ100',
        discountSummary: newOfferData.discountSummary || ''
      };
      setActiveOffers(prev => [localOffer, ...prev]);
    }
  };

  // Toggle offer active state
  const handleToggleOffer = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      setActiveOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: !currentStatus } : o));
    } catch (err) {
      setActiveOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: !currentStatus } : o));
    }
  };

  // Delete offer
  const handleDeleteOffer = async (id: string) => {
    try {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      setActiveOffers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      setActiveOffers(prev => prev.filter(o => o.id !== id));
    }
  };

  // Update lead status
  const handleUpdateLeadStatus = async (id: string, newStatus: LeadRecord['status']) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  // Add appointment
  const handleAddAppointment = async (apt: Partial<ShowroomAppointment>) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppointments(prev => [data.data, ...prev]);
        fetchAllData();
      }
    } catch (err) {
      const localApt: ShowroomAppointment = {
        id: 'apt_' + Date.now(),
        customerName: apt.customerName || 'ग्राहक',
        phone: apt.phone || '',
        date: apt.date || 'उद्या',
        time: apt.time || 'सकाळी ११:००',
        jewelleryInterest: apt.jewelleryInterest || 'दागिने पाहणे',
        status: 'confirmed'
      };
      setAppointments(prev => [localApt, ...prev]);
    }
  };

  // Trigger call from CRM lead row
  const handleInitiateCallForLead = (lead: LeadRecord) => {
    setActiveTab('caller');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Showroom Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        goldRates={goldRates}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        onOpenShowroomInfo={() => setIsShowroomInfoOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 py-4">
        {activeTab === 'whatsapp' && (
          <WhatsAppSimulator
            goldRates={goldRates}
            activeOffers={activeOffers}
            catalogue={catalogue}
            onOpenCatalogue={() => setIsCatalogueOpen(true)}
            onRefreshLeads={fetchAllData}
          />
        )}

        {activeTab === 'caller' && (
          <PhoneCallerSimulator
            onCallCompleted={() => fetchAllData()}
            onOpenWhatsAppView={() => setActiveTab('whatsapp')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminCrmDashboard
            goldRates={goldRates}
            onUpdateRates={handleUpdateRates}
            activeOffers={activeOffers}
            onAddOffer={handleAddOffer}
            onToggleOffer={handleToggleOffer}
            onDeleteOffer={handleDeleteOffer}
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onInitiateCallForLead={handleInitiateCallForLead}
          />
        )}
      </main>

      {/* Modals */}
      <CatalogueModal
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
        catalogue={catalogue}
        goldRates={goldRates}
      />

      <ShowroomInfoModal
        isOpen={isShowroomInfoOpen}
        onClose={() => setIsShowroomInfoOpen(false)}
      />

      {/* Global Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-200 font-marathi">
              {SHOWROOM_DETAILS.nameMr} • {SHOWROOM_DETAILS.name}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {SHOWROOM_DETAILS.addressMr} • Google Maps: {SHOWROOM_DETAILS.googleMapsCode} • ⭐ {SHOWROOM_DETAILS.googleRating} ({SHOWROOM_DETAILS.reviewCount} Reviews)
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-medium">✓ १००% BIS ९१६ हॉलमार्क शुद्ध सोने</span>
            <span>वेळ: {SHOWROOM_DETAILS.businessHoursShort}</span>
            <a href={`tel:${SHOWROOM_DETAILS.phoneNumber}`} className="text-amber-300 font-mono hover:underline">
              {SHOWROOM_DETAILS.phoneNumber}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
