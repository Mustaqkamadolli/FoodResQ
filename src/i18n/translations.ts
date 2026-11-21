import { SupportedLanguage } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  donateFood: string;
  findFood: string;
  bookFood: string;
  howItWorks: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  liveImpactTitle: string;
  mealsSaved: string;
  kgRescued: string;
  co2Avoided: string;
  activeDonors: string;
  activeNgos: string;
  urgentFoodNearYou: string;
  exploreAll: string;
  viewMap: string;
  viewList: string;
  filters: string;
  all: string;
  vegOnly: string;
  nonVegOnly: string;
  expiringSoon: string;
  within5km: string;
  plates: string;
  safeUntil: string;
  pickupLocation: string;
  contactDonor: string;
  pickupCode: string;
  enterPickupCode: string;
  confirmHandover: string;
  statusAvailable: string;
  statusBooked: string;
  statusCollected: string;
  statusExpired: string;
  safetyChecklistTitle: string;
  safetyCheck1: string;
  safetyCheck2: string;
  safetyCheck3: string;
  safetyCheck4: string;
  safetyCheckWarning: string;
  eventModeTitle: string;
  eventModeSub: string;
  scheduleEvent: string;
  volunteerDelivery: string;
  volunteerHeadline: string;
  acceptDelivery: string;
  markedPickedUp: string;
  markedDelivered: string;
  foodHeroTitle: string;
  downloadCertificate: string;
  verifiedBadge: string;
  pendingApproval: string;
  voiceInputTooltip: string;
  voiceListening: string;
  aiAnalyzing: string;
  aiDetected: string;
  loginSignup: string;
  selectRole: string;
  donorRole: string;
  receiverRole: string;
  volunteerRole: string;
  adminRole: string;
  adminDashboard: string;
  verifyNgo: string;
  wasteHotspots: string;
  speechLang: string;
  rateExperience: string;
  submitRating: string;
  congratsImpact: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: "FoodResQ",
    tagline: "Don't waste it. Share it.",
    heroHeadline: "Don't waste it. Share it.",
    heroSubheadline: "Connect surplus food from weddings, colleges, caterers, and messes with verified NGOs and people in need. Feed souls, not landfills.",
    donateFood: "Donate Food",
    findFood: "Find Food",
    bookFood: "Book this food",
    howItWorks: "How FoodResQ Works",
    step1Title: "1. Snap & Auto-Analyze",
    step1Desc: "Upload a photo. FoodResQ AI auto-identifies dishes, plate count, and veg/non-veg status in seconds.",
    step2Title: "2. Verified Receiver Match",
    step2Desc: "Instant push notification to nearby verified NGOs. One-tap booking locks the food atomically.",
    step3Title: "3. Secure Handover & Impact",
    step3Desc: "Handover confirmed using a 4-digit security code. Real-time meals and CO2 counters update instantly.",
    liveImpactTitle: "Real-Time Bengaluru Community Impact",
    mealsSaved: "Meals Saved",
    kgRescued: "kg Food Rescued",
    co2Avoided: "kg CO₂ Avoided",
    activeDonors: "Active Donors",
    activeNgos: "Verified NGOs",
    urgentFoodNearYou: "Urgent Surplus Food Near You",
    exploreAll: "Explore All Listings",
    viewMap: "Map View",
    viewList: "List View",
    filters: "Filters",
    all: "All",
    vegOnly: "Veg Only",
    nonVegOnly: "Non-Veg Only",
    expiringSoon: "Expiring Soon (<2h)",
    within5km: "Within 5 km",
    plates: "plates",
    safeUntil: "Safe to eat until",
    pickupLocation: "Pickup Location",
    contactDonor: "Contact Donor",
    pickupCode: "Pickup Code",
    enterPickupCode: "Enter 4-digit Handover Code",
    confirmHandover: "Confirm Handover",
    statusAvailable: "Available",
    statusBooked: "Booked - Awaiting Pickup",
    statusCollected: "Collected & Rescued",
    statusExpired: "Expired",
    safetyChecklistTitle: "Mandatory Food Safety Checklist",
    safetyCheck1: "Food was freshly prepared within recommended hours.",
    safetyCheck2: "Food was stored in covered, temperature-safe containers.",
    safetyCheck3: "Food was untouched by diners after serving/buffet.",
    safetyCheck4: "Packed in hygienic, food-grade disposable containers.",
    safetyCheckWarning: "All 4 safety checklist items must be verified before listing can go live.",
    eventModeTitle: "Event Mode: Schedule Future Banquet Surplus",
    eventModeSub: "Hosting a wedding, college fest, or corporate dinner? Schedule ahead so NGOs can mobilize vans.",
    scheduleEvent: "Schedule Upcoming Event",
    volunteerDelivery: "Volunteer Delivery Hub",
    volunteerHeadline: "Deliver hope across Bengaluru. Transport food when receivers lack vehicles.",
    acceptDelivery: "Accept Delivery Task",
    markedPickedUp: "Mark as Picked Up",
    markedDelivered: "Confirm Delivered to Receiver",
    foodHeroTitle: "Food Hero Recognition",
    downloadCertificate: "Download Food Hero Certificate",
    verifiedBadge: "Verified NGO",
    pendingApproval: "Pending Admin Approval",
    voiceInputTooltip: "Speak food description (English, Hindi, Kannada)",
    voiceListening: "Listening... speak now",
    aiAnalyzing: "AI analyzing food photo...",
    aiDetected: "Food recognized by AI with 98% confidence",
    loginSignup: "Sign In / Register",
    selectRole: "Choose your primary role",
    donorRole: "Food Donor (Caterer / Mess / Individual)",
    receiverRole: "Receiver (NGO / Ashram / In Need)",
    volunteerRole: "Volunteer Driver (Van / Bike)",
    adminRole: "City Coordinator / Admin",
    adminDashboard: "Admin & Verification Hub",
    verifyNgo: "Approve Verified Badge",
    wasteHotspots: "City Waste Hotspot Map",
    speechLang: "en-IN",
    rateExperience: "Rate Handover Experience",
    submitRating: "Submit Rating & Review",
    congratsImpact: "You just rescued surplus food and fed hungry souls!"
  },
  hi: {
    appName: "FoodResQ",
    tagline: "इसे फेंके नहीं, सांझा करें।",
    heroHeadline: "इसे फेंके नहीं, सांझा करें।",
    heroSubheadline: "शादियों, कॉलेज मेस, कैटरर्स और पार्टियों के बचे हुए भोजन को सीधे निकटतम जरूरतमंदों और आश्रमों तक पहुंचाएं।",
    donateFood: "भोजन दान करें",
    findFood: "भोजन खोजें",
    bookFood: "यह भोजन बुक करें",
    howItWorks: "FoodResQ कैसे काम करता है",
    step1Title: "1. फोटो लें और AI विश्लेषण",
    step1Desc: "फोटो अपलोड करें। AI सेकंडों में भोजन का नाम, प्लेटों की संख्या और शाकाहारी/मांसाहारी पहचान लेता है।",
    step2Title: "2. सत्यापित NGO से मिलान",
    step2Desc: "आसपास के प्रमाणित आश्रमों को त्वरित अलर्ट मिलता है। एक क्लिक में बुकिंग सुरक्षित हो जाती है।",
    step3Title: "3. सुरक्षित कोड और हैंडओवर",
    step3Desc: "4-अंकों के सुरक्षा कोड से भोजन प्राप्त करें। तत्काल भोजन और पर्यावरण सुरक्षा स्कोर बढ़ता है।",
    liveImpactTitle: "बेंगलुरु समुदाय का लाइव प्रभाव",
    mealsSaved: "भोजन बचाए गए",
    kgRescued: "किग्रा भोजन बचाया",
    co2Avoided: "किग्रा CO₂ रोकथाम",
    activeDonors: "सक्रिय अन्नदाता",
    activeNgos: "सत्यापित NGO",
    urgentFoodNearYou: "आपके निकट तत्काल उपलब्ध भोजन",
    exploreAll: "सभी सूचियां देखें",
    viewMap: "मानचित्र देखें",
    viewList: "सूची दृश्य",
    filters: "फिल्टर",
    all: "सभी",
    vegOnly: "केवल शाकाहारी",
    nonVegOnly: "केवल मांसाहारी",
    expiringSoon: "जल्द समाप्त होने वाला (<2 घंटे)",
    within5km: "5 किमी के अंदर",
    plates: "प्लेटें",
    safeUntil: "खाने योग्य समय",
    pickupLocation: "पिकअप स्थान",
    contactDonor: "दानदाता से संपर्क करें",
    pickupCode: "पिकअप कोड",
    enterPickupCode: "4-अंकों का पिकअप कोड दर्ज करें",
    confirmHandover: "हैंडओवर की पुष्टि करें",
    statusAvailable: "उपलब्ध",
    statusBooked: "बुक किया गया",
    statusCollected: "प्राप्त व वितरित",
    statusExpired: "समाप्त",
    safetyChecklistTitle: "अनिवार्य खाद्य सुरक्षा चेकलिस्ट",
    safetyCheck1: "भोजन हाल ही में ताजा पकाया गया है।",
    safetyCheck2: "भोजन उचित तापमान और ढके बर्तनों में रखा गया था।",
    safetyCheck3: "परोसने के बाद किसी ने इसे छुआ नहीं है।",
    safetyCheck4: "स्वच्छ, फ़ूड-ग्रेड कंटेनर में पैक किया गया है।",
    safetyCheckWarning: "सूची लाइव करने से पहले सभी 4 सुरक्षा मानकों की पुष्टि अनिवार्य है।",
    eventModeTitle: "इवेंट मोड: भविष्य के समारोहों का भोजन शेड्यूल करें",
    eventModeSub: "शादी या पार्टी के लिए पहले से शेड्यूल करें ताकि NGO वाहन की योजना बना सकें।",
    scheduleEvent: "आगामी कार्यक्रम शेड्यूल करें",
    volunteerDelivery: "स्वयंसेवक डिलीवरी हब",
    volunteerHeadline: "जब संस्था के पास वाहन न हो, तो आप भोजन पहुंचाकर मदद करें।",
    acceptDelivery: "डिलीवरी स्वीकार करें",
    markedPickedUp: "उठाया गया",
    markedDelivered: "सफलतापूर्वक पहुंचाया गया",
    foodHeroTitle: "फूड हीरो सम्मान",
    downloadCertificate: "फूड हीरो प्रमाणपत्र डाउनलोड करें",
    verifiedBadge: "सत्यापित NGO",
    pendingApproval: "प्रशासक अनुमोदन प्रतीक्षित",
    voiceInputTooltip: "भोजन विवरण बोलकर दर्ज करें",
    voiceListening: "सुन रहा हूँ... अब बोलें",
    aiAnalyzing: "AI भोजन का विश्लेषण कर रहा है...",
    aiDetected: "AI द्वारा 98% सटीकता से पहचान",
    loginSignup: "साइन इन / पंजीकरण",
    selectRole: "अपनी प्राथमिक भूमिका चुनें",
    donorRole: "अन्नदाता (कैटरर / मेस / होटल / व्यक्ति)",
    receiverRole: "स्वीकर्ता (NGO / अनाथालय / जरूरतमंद)",
    volunteerRole: "स्वयंसेवक चालक (वाहन उपलब्ध)",
    adminRole: "शहर समन्वयक / एडमिन",
    adminDashboard: "एडमिन और सत्यापन हब",
    verifyNgo: "सत्यापित बैज स्वीकृत करें",
    wasteHotspots: "खाद्य अपशिष्ट हॉटस्पॉट मानचित्र",
    speechLang: "hi-IN",
    rateExperience: "हैंडओवर अनुभव रेटिंग",
    submitRating: "रेटिंग सबमिट करें",
    congratsImpact: "आपने भोजन बचाकर भूखों को भोजन कराया!"
  },
  kn: {
    appName: "FoodResQ",
    tagline: "ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ, ಹಂಚಿಕೊಳ್ಳಿ.",
    heroHeadline: "ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ, ಹಂಚಿಕೊಳ್ಳಿ.",
    heroSubheadline: "ಮದುವೆ, ಕಾಲೇಜು ಮೆಸ್, ಕ್ಯಾಟರಿಂಗ್ ಮತ್ತು ಸಮಾರಂಭಗಳ ಉಳಿದ ಆಹಾರವನ್ನು ಹತ್ತಿರದ ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಎನ್ಜಿಒಗಳಿಗೆ ತಲುಪಿಸಿ.",
    donateFood: "ಆಹಾರ ದಾನ ಮಾಡಿ",
    findFood: "ಆಹಾರ ಹುಡುಕಿ",
    bookFood: "ಈ ಆಹಾರವನ್ನು ಬುಕ್ ಮಾಡಿ",
    howItWorks: "FoodResQ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    step1Title: "1. ಫೋಟೋ ತೆಗೆದು AI ವಿಶ್ಲೇಷಣೆ",
    step1Desc: "ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ. AI ತಕ್ಷಣವೇ ಆಹಾರದ ಹೆಸರು, ಪ್ಲೇಟ್‌ಗಳ ಪ್ರಮಾಣ ಮತ್ತು ಸಸ್ಯಾಹಾರ/ಮಾಂಸಾಹಾರ ಗುರುತಿಸುತ್ತದೆ.",
    step2Title: "2. ದೃಢೀಕೃತ NGOಗಳೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ",
    step2Desc: "ಹತ್ತಿರದ ಆಶ್ರಮಗಳಿಗೆ ತ್ವರಿತ ಅಧಿಸೂಚನೆ ತಲುಪುತ್ತದೆ. ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಬುಕಿಂಗ್ ಲಾಕ್ ಆಗುತ್ತದೆ.",
    step3Title: "3. ಸುರಕ್ಷಿತ ಕೋಡ್ ಮತ್ತು ಹಸ್ತಾಂತರ",
    step3Desc: "4-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ ಹಸ್ತಾಂತರ ಪೂರ್ಣಗೊಳಿಸಿ. ತಕ್ಷಣ ಆಹಾರ ರಕ್ಷಣೆ ಅಂಕಗಳು ಹೆಚ್ಚಾಗುತ್ತವೆ.",
    liveImpactTitle: "ಬೆಂಗಳೂರು ಸಮುದಾಯದ ನೇರ ಪ್ರಭಾವ",
    mealsSaved: "ಉಳಿಸಿದ ಊಟಗಳು",
    kgRescued: "ಕೆಜಿ ಆಹಾರ ರಕ್ಷಣೆ",
    co2Avoided: "ಕೆಜಿ CO₂ ತಡೆಗಟ್ಟಲಾಗಿದೆ",
    activeDonors: "ಸಕ್ರಿಯ ದಾನಿಗಳು",
    activeNgos: "ದೃಢೀಕೃತ ಎನ್‌ಜಿಒಗಳು",
    urgentFoodNearYou: "ನಿಮ್ಮ ಬಳಿ ತುರ್ತು ಲಭ್ಯವಿರುವ ಆಹಾರ",
    exploreAll: "ಎಲ್ಲಾ ಪಟ್ಟಿಗಳನ್ನು ನೋಡಿ",
    viewMap: "ನಕ್ಷೆ ನೋಟ",
    viewList: "ಪಟ್ಟಿ ನೋಟ",
    filters: "ಫಿಲ್ಟರ್‌ಗಳು",
    all: "ಎಲ್ಲವೂ",
    vegOnly: "ಸಸ್ಯಾಹಾರ ಮಾತ್ರ",
    nonVegOnly: "ಮಾಂಸಾಹಾರ ಮಾತ್ರ",
    expiringSoon: "ಶೀಘ್ರ ಮುಕ್ತಾಯ (<2 ಗಂಟೆ)",
    within5km: "5 ಕಿಮೀ ಒಳಗಡೆ",
    plates: "ಪ್ಲೇಟ್‌ಗಳು",
    safeUntil: "ತಿನ್ನಲು ಸುರಕ್ಷಿತ ಸಮಯ",
    pickupLocation: "ಪಿಕಪ್ ಸ್ಥಳ",
    contactDonor: "ದಾನಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ",
    pickupCode: "ಪಿಕಪ್ ಕೋಡ್",
    enterPickupCode: "4-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
    confirmHandover: "ಹಸ್ತಾಂತರ ಖಚಿತಪಡಿಸಿ",
    statusAvailable: "ಲಭ್ಯವಿದೆ",
    statusBooked: "ಬುಕ್ ಮಾಡಲಾಗಿದೆ",
    statusCollected: "ಸಂಗ್ರಹಿಸಿ ತಲುಪಿಸಲಾಗಿದೆ",
    statusExpired: "ಮುಕ್ತಾಯಗೊಂಡಿದೆ",
    safetyChecklistTitle: "ಕಡ್ಡಾಯ ಆಹಾರ ಸುರಕ್ಷತಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    safetyCheck1: "ಆಹಾರವನ್ನು ಇತ್ತೀಚೆಗೆ ತಾಜಾವಾಗಿ ಬೇಯಿಸಲಾಗಿದೆ.",
    safetyCheck2: "ಆಹಾರವನ್ನು ಸುರಕ್ಷಿತ ಮುಚ್ಚಳವಿರುವ ಪಾತ್ರೆಗಳಲ್ಲಿ ಇಡಲಾಗಿದೆ.",
    safetyCheck3: "ಬಡಿಸಿದ ನಂತರ ಯಾರೂ ಮುಟ್ಟಿಲ್ಲ.",
    safetyCheck4: "ಸ್ವಚ್ಛವಾದ ಫುಡ್ ಗ್ರೇಡ್ ಡಬ್ಬಿಗಳಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ.",
    safetyCheckWarning: "ಪಟ್ಟಿಯನ್ನು ಲೈವ್ ಮಾಡುವ ಮುನ್ನ ಎಲ್ಲಾ 4 ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ದೃಢೀಕರಿಸಬೇಕು.",
    eventModeTitle: "ಈವೆಂಟ್ ಮೋಡ್: ಮುಂದಿನ ಸಮಾರಂಭಗಳ ಆಹಾರ ಮುಂಗಡ ನಿಗದಿಪಡಿಸಿ",
    eventModeSub: "ಮದುವೆ ಅಥವಾ ಸಮಾರಂಭಗಳ ಊಟವನ್ನು ಮುಂಗಡವಾಗಿ ನಿಗದಿಪಡಿಸಿ, ಆಶ್ರಮಗಳು ವಾಹನ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಬಹುದು.",
    scheduleEvent: "ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮ ನಿಗದಿಪಡಿಸಿ",
    volunteerDelivery: "ಸ್ವಯಂಸೇವಕ ಡೆಲಿವರಿ ಹಬ್",
    volunteerHeadline: "ಆಶ್ರಮಕ್ಕೆ ವಾಹನವಿಲ್ಲದಿದ್ದಾಗ ಆಹಾರವನ್ನು ತಲುಪಿಸಲು ನೆರವಾಗಿ.",
    acceptDelivery: "ಕಾರ್ಯ ಸ್ವೀಕರಿಸಿ",
    markedPickedUp: "ಪಿಕಪ್ ಮಾಡಲಾಗಿದೆ",
    markedDelivered: "ತಲುಪಿಸಲಾಗಿದೆ",
    foodHeroTitle: "ಫುಡ್ ಹೀರೋ ಗೌರವ",
    downloadCertificate: "ಫುಡ್ ಹೀರೋ ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್",
    verifiedBadge: "ದೃಢೀಕೃತ NGO",
    pendingApproval: "ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆ ಬಾಕಿ",
    voiceInputTooltip: "ಆಹಾರದ ವಿವರವನ್ನು ಮಾತನಾಡಿ ದಾಖಲಿಸಿ",
    voiceListening: "ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    aiAnalyzing: "AI ಆಹಾರದ ಫೋಟೋ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    aiDetected: "AI ಆಹಾರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಿದೆ",
    loginSignup: "ಸೈನ್ ಇನ್ / ನೋಂದಣಿ",
    selectRole: "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    donorRole: "ಅನ್ನದಾತ (ಕ್ಯಾಟರಿಂಗ್ / ಮೆಸ್ / ವ್ಯಕ್ತಿ)",
    receiverRole: "ಸ್ವೀಕೃತಿದಾರ (ಆಶ್ರಮ / ಎನ್‌ಜಿಒ / ಅಗತ್ಯವಿರುವವರು)",
    volunteerRole: "ಸ್ವಯಂಸೇವಕ ಚಾಲಕ (ವಾಹನವಿದೆ)",
    adminRole: "ನಗರ ಸಂಯೋಜಕ / ಅಡ್ಮಿನ್",
    adminDashboard: "ಅಡ್ಮಿನ್ ಮತ್ತು ಪರಿಶೀಲನಾ ಹಬ್",
    verifyNgo: "ದೃಢೀಕೃತ ಬ್ಯಾಡ್ಜ್ ಅನುಮೋದಿಸಿ",
    wasteHotspots: "ಆಹಾರ ತ್ಯಾಜ್ಯ ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ",
    speechLang: "kn-IN",
    rateExperience: "ಅನುಭವ ರೇಟಿಂಗ್ ನೀಡಿ",
    submitRating: "ರೇಟಿಂಗ್ ಸಲ್ಲಿಸಿ",
    congratsImpact: "ನೀವು ಆಹಾರ ಉಳಿಸಿ ಹಸಿದ ಹೊಟ್ಟೆಗಳಿಗೆ ಊಟ ನೀಡಿದ್ದೀರಿ!"
  }
};
