export type Language = 'mr' | 'hi' | 'en';

export interface JewelleryItem {
  id: string;
  name: string;
  nameMr: string;
  category: 'necklace' | 'ring' | 'earrings' | 'bracelet' | 'mangalsutra' | 'chain' | 'bangles' | 'wedding' | 'daily_wear' | 'gift' | 'silver_pooja';
  metalType: 'gold' | 'silver' | 'diamond' | 'platinum';
  purity: '24K' | '22K' | '18K' | '925 Silver';
  approxWeightGrams: number;
  estimatedPrice: number;
  description: string;
  descriptionMr: string;
  imageUrl: string;
  inStock: boolean;
  hallmark: boolean; // BIS 916 Hallmarked
}

export interface GoldRate {
  karat24: number; // per 10g
  karat22: number; // per 10g
  karat18: number; // per 10g
  silverPerGram: number;
  silverPerKg: number;
  lastUpdated: string;
  marketTrend: 'up' | 'down' | 'stable';
}

export interface ShowroomOffer {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  category: 'festival' | 'making_charge' | 'exchange' | 'wedding' | 'special';
  validUntil: string;
  isActive: boolean;
  code: string;
  discountSummary: string;
}

export interface LeadQualification {
  customerName?: string;
  phone?: string;
  preferredLanguage?: Language;
  interestedJewellery?: string[];
  metalType?: 'gold' | 'silver' | 'diamond' | 'other';
  approxBudget?: string;
  purchaseTimeline?: string;
  preferredVisitDate?: string;
  preferredCallbackTime?: string;
  isBusyOrDeclined?: boolean;
  appointmentBooked?: boolean;
  requiresHumanHandover?: boolean;
}

export interface LeadRecord {
  id: string;
  customerName: string;
  phone: string;
  preferredLanguage: Language;
  interestedJewellery: string[];
  metalType: string;
  approxBudget?: string;
  purchaseTimeline?: string;
  preferredVisitDate?: string;
  preferredCallbackTime?: string;
  status: 'new' | 'contacted' | 'interested' | 'visit_scheduled' | 'visited' | 'transferred_to_human' | 'not_interested';
  lastInteractionDate: string;
  channel: 'call' | 'whatsapp' | 'both';
  notes: string[];
  callSummary?: string;
  whatsappSent: boolean;
}

export interface ShowroomAppointment {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  jewelleryInterest: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'customer' | 'ai' | 'human_agent';
  text: string;
  timestamp: string;
  mediaType?: 'text' | 'image' | 'catalogue' | 'rate_card' | 'location' | 'appointment' | 'audio' | 'offers_card' | 'catalogue_preview' | 'location_card' | 'appointment_card';
  mediaUrl?: string;
  metadata?: any;
}

export interface CampaignInfo {
  id: 'campaign_new_collection' | 'campaign_festival_offer' | 'campaign_follow_up';
  title: string;
  titleMr: string;
  description: string;
  openingPitchMr: string;
  openingPitchEn: string;
  activeOfferId?: string;
}
