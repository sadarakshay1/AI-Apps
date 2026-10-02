import type { GoldRate, ShowroomOffer, JewelleryItem, CampaignInfo, LeadRecord, ShowroomAppointment } from '../types/index.ts';

export const SHOWROOM_DETAILS = {
  name: 'Vishwakarma Jewellers Daryapur',
  nameMr: 'विश्वकर्मा ज्वेलर्स दर्यापूर',
  receptionistNameMr: 'राधिका (विश्वकर्मा ज्वेलर्स व्हर्च्युअल असिस्टंट)',
  receptionistNameEn: 'Radhika (AI Showroom Executive)',
  taglineMr: 'शुद्धतेची परंपरा, विश्वासाचे नाव • BIS 916 हॉलमार्क ज्वेलरी',
  taglineEn: 'Tradition of Purity & Trust • BIS 916 Hallmarked Jewellery',
  address: 'Gandhinagar, Daryapur Banosa, Maharashtra 444803',
  addressMr: 'गांधीनगर, दर्यापूर बनोसा, अमरावती जिल्हा, महाराष्ट्र ४४४८०३',
  googleMapsCode: 'W8GC+57 Daryapur Banosa, Maharashtra',
  googleMapsUrl: 'https://maps.google.com/?q=Vishwakarma+Jewellers+Gandhinagar+Daryapur+Banosa+Maharashtra+444803',
  googleRating: 4.1,
  reviewCount: 91,
  businessHours: 'सकाळी १०:३० वाजल्यापासून पुढे (10:30 AM – 8:30 PM)',
  businessHoursShort: '10:30 AM onward',
  phoneNumber: '+91 97673 26228',
  whatsappNumber: '+919767326228',
  email: 'vishwakarmajewellers.daryapur@gmail.com',
  features: [
    '100% BIS 916 Hallmark Certified Gold',
    'Custom Bridal & Wedding Sets',
    'Old Gold Exchange with 0% Deduction Guarantee',
    'Certified Diamond & Solitaire Rings',
    'Traditional Maharashtrian Ornaments (Kolhapuri Saaj, Tushi, Nath, Thushi, Patlya)',
    'Cordial, respectful family service',
    'Special Silver Pooja & Baby Gifting Articles'
  ]
};

export const INITIAL_GOLD_RATE: GoldRate = {
  karat24: 89400,
  karat22: 81950,
  karat18: 67050,
  silverPerGram: 98.5,
  silverPerKg: 98500,
  lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' 10:30 AM',
  marketTrend: 'up'
};

export const INITIAL_OFFERS: ShowroomOffer[] = [
  {
    id: 'off_making_25',
    title: 'Gudi Padwa & Festival Special - 25% Off on Making Charges',
    titleMr: 'गुढीपाडवा व सणानिमित्त घडणावळीवर २५% थेट सूट',
    description: 'Flat 25% discount on making charges for all gold necklaces, mangalsutras and bridal sets.',
    descriptionMr: 'सर्व सोन्याच्या हार, मंगळसूत्र व ब्रायडल सेट्सच्या घडणावळीवर (Making Charges) २५% थेट सवलत उपलब्ध.',
    category: 'making_charge',
    validUntil: '१५ एप्रिल पर्यंत वैध',
    isActive: true,
    code: 'FESTIVE25',
    discountSummary: '२५% घडणावळ सूट'
  },
  {
    id: 'off_wedding_combo',
    title: 'Grand Wedding Season Bridal Combo Gift',
    titleMr: 'लग्नसराई विशेष ब्रायडल कॉम्बो व मोफत चांदीचे नाणे',
    description: 'On bridal gold purchases above ₹1,50,000, receive a complimentary 10g pure 999 Silver coin and VIP bridal consultation.',
    descriptionMr: '₹१,५०,००० च्या वर खरेदीवर १० ग्रॅम शुद्ध चांदीचे नाणे मोफत व खास व्हीआयपी ब्रायडल काउन्सिलिंग.',
    category: 'wedding',
    validUntil: 'चालू महिन्याअखेर पर्यंत',
    isActive: true,
    code: 'VIVAH10G',
    discountSummary: 'मोफत १० ग्रॅम चांदी नाणे'
  },
  {
    id: 'off_old_gold_exchange',
    title: '100% Transparency Old Gold Exchange Value',
    titleMr: 'जुने सोने बदला १००% योग्य मूल्यावर (Zero Deduction)',
    description: 'Bring any old gold jewellery and get maximum value as per today live 22K rate with zero hidden wastage deductions.',
    descriptionMr: 'तुमचे जुने सोने आणा आणि आजच्या बाजारभावानुसार पूर्ण मूल्य मिळवा. कोणत्याही अवाजवी कपातीशिवाय.',
    category: 'exchange',
    validUntil: 'नेहमी उपलब्ध',
    isActive: true,
    code: 'EXCHANGE100',
    discountSummary: 'शून्य कपात सोने बदल'
  }
];

export const INITIAL_CATALOGUE: JewelleryItem[] = [
  {
    id: 'jewel_1',
    name: 'Traditional Royal Kolhapuri Saaj (22K)',
    nameMr: 'पारंपारिक शाही कोल्हापुरी साज (२२ कॅरेट)',
    category: 'necklace',
    metalType: 'gold',
    purity: '22K',
    approxWeightGrams: 28.5,
    estimatedPrice: 248000,
    description: 'Authentic handcrafted Kolhapuri Saaj with 21 traditional paan/tike emblems and Javmani beads.',
    descriptionMr: '२१ पारंपारिक पाने, मणी व मध्यभागी सुंदर पान असलेला अस्सल कारागिरीचा कोल्हापुरी साज.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  },
  {
    id: 'jewel_2',
    name: 'Maharashtrian Bridal Choker & Jhumka Set',
    nameMr: 'मराठमोळा ब्रायडल चोकर हार व झुमके सेट',
    category: 'wedding',
    metalType: 'gold',
    purity: '22K',
    approxWeightGrams: 42.0,
    estimatedPrice: 362000,
    description: 'Exquisite antique gold finish bridal necklace with matching peacock carved jhumkas.',
    descriptionMr: 'लग्नसराईसाठी खास मोर नक्षीकाम असलेला अँटिक फिनिश चोकर व झुमक्यांची सुंदर जोडी.',
    imageUrl: 'https://images.unsplash.com/photo-1611591475155-426477a1f062?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  },
  {
    id: 'jewel_3',
    name: 'Short Designer Gold Mangalsutra with Wati',
    nameMr: 'नक्षीदार डिझायनर सोन्याचे मंगळसूत्र (२ वाटी)',
    category: 'mangalsutra',
    metalType: 'gold',
    purity: '22K',
    approxWeightGrams: 16.2,
    estimatedPrice: 142000,
    description: 'Daily & festive wear double wati traditional Maharashtrian gold mangalsutra with black beads chain.',
    descriptionMr: 'पारंपारिक दोन वाट्यांचे शुद्ध २२ कॅरेट सोन्याचे नाजूक व मजबूत मंगळसूत्र.',
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  },
  {
    id: 'jewel_4',
    name: 'Handcrafted Gold Patlya & Tode Bangles (Pair)',
    nameMr: 'हस्तनिर्मित सोन्याच्या पाटल्या व तोडे (जोडी)',
    category: 'bangles',
    metalType: 'gold',
    purity: '22K',
    approxWeightGrams: 35.0,
    estimatedPrice: 304000,
    description: 'Classic Maharashtrian wedding bangles with intricate floral filigree carving.',
    descriptionMr: 'पारंपारिक नाजूक फुलांच्या नक्षीकामाने सजवलेल्या अस्सल २२ कॅरेट पाटल्यांची जोडी.',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  },
  {
    id: 'jewel_5',
    name: 'Solitaire Diamond Engagement Ring',
    nameMr: 'डायमंड सोलिटेअर एंगेजमेंट अंगठी (१८ कॅरेट)',
    category: 'ring',
    metalType: 'diamond',
    purity: '18K',
    approxWeightGrams: 4.8,
    estimatedPrice: 85000,
    description: 'IGI certified brilliant cut natural diamond studded in 18K yellow & white gold.',
    descriptionMr: 'विशेष साखरपुड्यासाठी आयजीआय प्रमाणित लखलखता हिरा व १८ कॅरेट गोल्ड रिंग.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  },
  {
    id: 'jewel_6',
    name: 'Pure Silver Pooja Thali Set (925)',
    nameMr: 'शुद्ध चांदीचा पूजा थाळी सेट (९२५ हॉलमार्क)',
    category: 'silver_pooja',
    metalType: 'silver',
    purity: '925 Silver',
    approxWeightGrams: 320.0,
    estimatedPrice: 34500,
    description: 'Complete 7-piece auspicious Silver Pooja plate set including Diya, Bell, Kalash, Agarbatti stand & bowls.',
    descriptionMr: 'दिवा, घंटा, कलश, वाट्यांसह संपूर्ण ७ वस्तूंचा शुद्ध चांदीचा शुभ पूजा संच.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    hallmark: true
  }
];

export const CAMPAIGNS: CampaignInfo[] = [
  {
    id: 'campaign_new_collection',
    title: 'New Jewellery Collection Campaign',
    titleMr: 'नवीन डिझाईन्स व कलेक्शन मोहीम',
    description: 'Outbound calls inviting customers to explore our newly arrived lightweight necklaces, bridal sets and modern mangalsutras.',
    openingPitchMr: 'नमस्कार! मी विश्वकर्मा ज्वेलर्स, दर्यापूरकडून बोलत आहे. आपणास दोन मिनिटे बोलण्यासाठी वेळ आहे का? आमच्या शोरूममध्ये नवीन गोल्ड आणि ज्वेलरी कलेक्शन आले आहे. आपणास त्याबद्दल माहिती WhatsApp वर पाठवू का?',
    openingPitchEn: 'Hello! Calling from Vishwakarma Jewellers Daryapur. Do you have two minutes to speak? We have received fresh festive gold jewellery designs. May I share the catalogue on WhatsApp?'
  },
  {
    id: 'campaign_festival_offer',
    title: 'Festival & Wedding Season Offer Campaign',
    titleMr: 'सण व लग्नसराई विशेष ऑफर्स मोहीम',
    description: 'Informing customers about active verified offers (25% off on making charges + complimentary silver gift). Strictly uses admin verified offers.',
    activeOfferId: 'off_making_25',
    openingPitchMr: 'नमस्कार! विश्वकर्मा ज्वेलर्स दर्यापूरकडून बोलत आहे. आपणास दोन मिनिटे बोलण्यासाठी वेळ आहे का? सणानिमित्त आमच्या शोरूममध्ये घडणावळीवर २५% सवलत आणि विशेष ऑफर्स सुरू आहेत. आपण शोरूमला भेट देण्याचा विचार करत आहात का?',
    openingPitchEn: 'Namaskar! Calling from Vishwakarma Jewellers Daryapur. With the upcoming festive season, we have 25% off on making charges and special bridal gifts. Are you planning a showroom visit?'
  },
  {
    id: 'campaign_follow_up',
    title: 'Customer Enquiry Follow-up Campaign',
    titleMr: 'ग्राहक चौकशी पाठपुरावा (Follow-up)',
    description: 'Polite follow-up for customers who enquired about bridal or festive designs in previous days.',
    openingPitchMr: 'नमस्कार! मी विश्वकर्मा ज्वेलर्स दर्यापूरकडून बोलत आहे. आपण काही दिवसांपूर्वी आमच्या ज्वेलरीबद्दल चौकशी केली होती. आपल्या पसंतीनुसार काही नवीन डिझाईन्स शोरूममध्ये उपलब्ध आहेत. आपणास फोटो WhatsApp वर पाठवू का?',
    openingPitchEn: 'Hello! Calling from Vishwakarma Jewellers Daryapur. You had enquired regarding jewellery recently. We have received new designs matching your preference. May I send photos on WhatsApp?'
  }
];

export const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead_101',
    customerName: 'सुनीताताई देशमुख',
    phone: '+91 98230 45678',
    preferredLanguage: 'mr',
    interestedJewellery: ['कोल्हापुरी साज', 'पाटल्या'],
    metalType: 'gold',
    approxBudget: '₹२,५०,००० ते ₹३,००,०००',
    purchaseTimeline: 'पुढील आठवड्यात लग्नासाठी',
    preferredVisitDate: 'रविवार, दुपारी ४:०० वाजता',
    status: 'visit_scheduled',
    lastInteractionDate: 'आज सकाळी ११:२०',
    channel: 'both',
    notes: ['मुलीच्या लग्नासाठी कोल्हापुरी साज व २ पाटल्या हव्या आहेत.', 'WhatsApp वर कॅटलॉग पाठवला आहे.'],
    callSummary: 'कॉलवर समाधानकारक संवाद झाला. रविवार ४ वाजता भेट निश्चित झाली आहे.',
    whatsappSent: true
  },
  {
    id: 'lead_102',
    customerName: 'राजेशभाऊ वानखडे',
    phone: '+91 94231 12349',
    preferredLanguage: 'mr',
    interestedJewellery: ['डायमंड रिंग', 'सोन्याची चेन'],
    metalType: 'gold',
    approxBudget: '₹६०,००० ते ₹८०,०००',
    purchaseTimeline: 'साखरपुड्यासाठी',
    preferredCallbackTime: 'संध्याकाळी ७ नंतर',
    status: 'contacted',
    lastInteractionDate: 'काल दुपारी ३:१५',
    channel: 'call',
    notes: ['ऑफिस वेळेत व्यस्त होते, संध्याकाळी ७ वाजता WhatsApp वर डिझाईन मागितल्या.'],
    callSummary: 'व्यस्त होते. संध्याकाळी पुन्हा संपर्क करण्यास सांगितले.',
    whatsappSent: true
  },
  {
    id: 'lead_103',
    customerName: 'अमित पाटील',
    phone: '+91 97654 89210',
    preferredLanguage: 'mr',
    interestedJewellery: ['जुने सोने बदल', 'मंगळसूत्र'],
    metalType: 'gold',
    approxBudget: '₹१,००,०००',
    purchaseTimeline: 'अक्षय्य तृतीया',
    status: 'interested',
    lastInteractionDate: 'काल संध्याकाळी',
    channel: 'whatsapp',
    notes: ['जुने सोने बदलून नवीन २ वाटी डिझायनर मंगळसूत्र घ्यायचे आहे.'],
    whatsappSent: true
  }
];

export const INITIAL_APPOINTMENTS: ShowroomAppointment[] = [
  {
    id: 'apt_1',
    customerName: 'सुनीताताई देशमुख',
    phone: '+91 98230 45678',
    date: 'रविवार (उद्या)',
    time: 'सायंकाळी ४:०० वाजता',
    jewelleryInterest: 'ब्रायडल कोल्हापुरी साज व पाटल्या',
    status: 'confirmed',
    notes: 'स्पेशल व्हीआयपी लाउंजमध्ये नवीन डिझाईन्स दाखवायच्या आहेत.'
  }
];
