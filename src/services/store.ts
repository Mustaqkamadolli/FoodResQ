import {
  UserProfile,
  FoodListing,
  ScheduledEvent,
  DeliveryRequest,
  UserRating,
  NotificationItem,
  ImpactStats,
  WasteHotspot,
  UserRole,
  ReceiverType
} from '../types';

// ==============================================================================
// SEED DATA: 3 VERIFIED NGOS + 1 PENDING NGO + DONOR PROFILES
// ==============================================================================
export const SEED_PROFILES: UserProfile[] = [
  {
    id: "usr_donor_priya",
    role: "donor",
    name: "Priya Sharma (Royal Sagar Caterers)",
    email: "priya@royalsagar.com",
    phone: "+91 98450 12345",
    organizationName: "Royal Sagar Caterers & Banquets",
    isVerified: true,
    verificationDate: "2024-03-15T10:00:00Z",
    mealsDonated: 3450,
    kgRescued: 1380,
    deliveriesCompleted: 0,
    ratingAvg: 4.9,
    ratingCount: 38,
    badgeLevel: "Gold",
    createdAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "usr_ngo_akshaya",
    role: "receiver",
    name: "Akshaya Patra Foundation",
    email: "bengaluru@akshayapatra.org",
    phone: "+91 80 2345 6789",
    organizationName: "The Akshaya Patra Foundation Bengaluru",
    registrationNumber: "KA/2000/001452 (12A/80G)",
    receiverType: "ngo",
    isVerified: true,
    verificationDate: "2024-02-01T10:00:00Z",
    mealsDonated: 0,
    kgRescued: 14200,
    deliveriesCompleted: 0,
    ratingAvg: 5.0,
    ratingCount: 94,
    badgeLevel: "Gold",
    createdAt: "2024-01-05T09:00:00Z"
  },
  {
    id: "usr_ngo_robinhood",
    role: "receiver",
    name: "Robin Hood Army Bengaluru",
    email: "bengaluru@robinhoodarmy.com",
    phone: "+91 99800 54321",
    organizationName: "Robin Hood Army - Bengaluru Chapter",
    registrationNumber: "IND/RHA/2014-BLR",
    receiverType: "ngo",
    isVerified: true,
    verificationDate: "2024-02-12T10:00:00Z",
    mealsDonated: 0,
    kgRescued: 9800,
    deliveriesCompleted: 0,
    ratingAvg: 4.9,
    ratingCount: 62,
    badgeLevel: "Silver",
    createdAt: "2024-01-12T09:00:00Z"
  },
  {
    id: "usr_ngo_snehasadan",
    role: "receiver",
    name: "Sneha Sadan Anathashram",
    email: "contact@snehasadanblr.org",
    phone: "+91 80 2520 1122",
    organizationName: "Sneha Sadan Shelter & Children Home",
    registrationNumber: "BLR/NGO/88219",
    receiverType: "anathashram",
    isVerified: true,
    verificationDate: "2024-03-01T10:00:00Z",
    mealsDonated: 0,
    kgRescued: 4600,
    deliveriesCompleted: 0,
    ratingAvg: 4.8,
    ratingCount: 29,
    badgeLevel: "Bronze",
    createdAt: "2024-02-01T09:00:00Z"
  },
  {
    id: "usr_ngo_snehalaya_pending",
    role: "receiver",
    name: "Snehalaya Care Trust (Pending)",
    email: "info@snehalayatrust.org",
    phone: "+91 97412 88990",
    organizationName: "Snehalaya Care Trust",
    registrationNumber: "KA/2026/0891 (Under Review)",
    receiverType: "ngo",
    isVerified: false,
    mealsDonated: 0,
    kgRescued: 0,
    deliveriesCompleted: 0,
    ratingAvg: 5.0,
    ratingCount: 0,
    badgeLevel: "Bronze",
    createdAt: "2026-11-20T14:30:00Z"
  },
  {
    id: "usr_vol_arjun",
    role: "volunteer",
    name: "Arjun Rao (Volunteer Driver)",
    email: "arjun.rao@gmail.com",
    phone: "+91 99160 33445",
    isVerified: true,
    verificationDate: "2024-04-10T10:00:00Z",
    mealsDonated: 0,
    kgRescued: 1850,
    deliveriesCompleted: 42,
    ratingAvg: 4.95,
    ratingCount: 39,
    badgeLevel: "Silver",
    createdAt: "2024-03-01T09:00:00Z"
  },
  {
    id: "usr_admin_blr",
    role: "admin",
    name: "Bengaluru City Admin",
    email: "admin@foodresq.bengaluru.gov.in",
    phone: "+91 80 2222 1111",
    isVerified: true,
    verificationDate: "2024-01-01T00:00:00Z",
    mealsDonated: 0,
    kgRescued: 0,
    deliveriesCompleted: 0,
    ratingAvg: 5.0,
    ratingCount: 0,
    badgeLevel: "Gold",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

// Helper to create future safe-until dates relative to now
const nowMs = Date.now();
const hours = (h: number) => new Date(nowMs + h * 3600 * 1000).toISOString();

// ==============================================================================
// 15 REALISTIC SAMPLE LISTINGS AROUND BENGALURU
// ==============================================================================
export const SEED_LISTINGS: FoodListing[] = [
  {
    id: "list-blr-01",
    donorId: "usr_donor_priya",
    donorName: "Royal Sagar Caterers",
    donorPhone: "+91 98450 12345",
    donorOrg: "Royal Sagar Caterers & Banquets",
    donorRating: 4.9,
    title: "Steamed Sona Masoori Rice, Sambar & Beans Poriyal",
    description: "Surplus wedding feast lunch. Kept hot in insulated stainless-steel food warmers. Freshly prepared 1 hour ago.",
    photoUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 65,
    quantityKg: 26,
    safeUntil: hours(1.75), // Red urgency: < 2 hours!
    pickupAddress: "Kalyana Mantapa, 8th Cross, Malleshwaram, Bengaluru",
    pickupLat: 13.0031,
    pickupLng: 77.5703,
    notes: "Main gate next to CTR. Parking available for tempo / auto.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 30 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-02",
    donorId: "usr_donor_02",
    donorName: "The Grand Palace Caterers",
    donorPhone: "+91 98452 33441",
    donorOrg: "Palace Grounds Banquet Hall",
    donorRating: 5.0,
    title: "Hyderabadi Veg Dum Biryani & Mirchi Ka Salan",
    description: "Untouched corporate reception buffet excess. Packed in heavy foil thermal containers.",
    photoUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 110,
    quantityKg: 45,
    safeUntil: hours(1.5), // Red urgency: < 2 hours!
    pickupAddress: "Gate 4, Princess Shrine, Palace Grounds, Bellary Road, Bengaluru",
    pickupLat: 13.0084,
    pickupLng: 77.5898,
    notes: "Large batch! Recommended to bring tempo or van. NGO volunteers available on-site.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 45 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-03",
    donorId: "usr_donor_03",
    donorName: "Koramangala Social Caterers",
    donorPhone: "+91 97401 99221",
    donorOrg: "Social Banquets Koramangala",
    donorRating: 4.8,
    title: "Paneer Butter Masala, Dal Makhani & Whole Wheat Rotis",
    description: "Engagement dinner surplus. Gravy and rotis stored in separate dry containers.",
    photoUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 40,
    quantityKg: 16,
    safeUntil: hours(4.5), // Amber urgency: < 6 hours
    pickupAddress: "80 Feet Road, 4th Block, Koramangala, Bengaluru",
    pickupLat: 12.9345,
    pickupLng: 77.6266,
    notes: "Kitchen service entrance at the rear lane.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 75 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-04",
    donorId: "usr_donor_04",
    donorName: "Empire Feast Caterers",
    donorPhone: "+91 98860 11223",
    donorOrg: "Empire Hospitality",
    donorRating: 4.9,
    title: "Ambur Chicken Biryani & Egg Roast",
    description: "Banquet dinner excess. Handled strictly with gloves, freshly chilled and sealed in 5kg buckets.",
    photoUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    foodType: "non-veg",
    quantityPlates: 80,
    quantityKg: 35,
    safeUntil: hours(3.5), // Amber urgency: < 6 hours
    pickupAddress: "100 Feet Road, Near CMH Junction, Indiranagar, Bengaluru",
    pickupLat: 12.9784,
    pickupLng: 77.6408,
    notes: "Non-veg container clearly labeled with date and prep time.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 60 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-05",
    donorId: "usr_donor_05",
    donorName: "Infosys Tech Park Food Court",
    donorPhone: "+91 99000 44882",
    donorOrg: "Sodexo Campus Dining",
    donorRating: 5.0,
    title: "Mixed Vegetable Pulao, Curd Rice & Boondi Ladoo",
    description: "Friday campus festival food surplus. Pristine condition, untouched by cafeteria guests.",
    photoUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 150,
    quantityKg: 60,
    safeUntil: hours(5.5), // Amber urgency: < 6 hours
    pickupAddress: "Gate 1, Electronics City Phase 1, Bengaluru",
    pickupLat: 12.8452,
    pickupLng: 77.6602,
    notes: "Security gate pass provided upon booking. Large vehicle parking readily accessible.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 90 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-06",
    donorId: "usr_donor_06",
    donorName: "Vidyarthi Bhavan Functions",
    donorPhone: "+91 94480 77112",
    donorOrg: "Gandhi Bazaar Caterers",
    donorRating: 4.9,
    title: "Bisi Bele Bath, Kara Boondi & Rava Kesari",
    description: "Traditional festival lunch feast. Piping hot in insulated containers.",
    photoUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 55,
    quantityKg: 22,
    safeUntil: hours(1.8), // Red urgency: < 2 hours!
    pickupAddress: "Near Bugle Rock, Gandhi Bazaar, Basavanagudi, Bengaluru",
    pickupLat: 12.9421,
    pickupLng: 77.5738,
    notes: "Please bring clean vessels or pickup with our returnable crates.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 20 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-07",
    donorId: "usr_donor_07",
    donorName: "Whitefield Convention Centre",
    donorPhone: "+91 97311 00445",
    donorOrg: "EPIP Zone Banquets",
    donorRating: 4.8,
    title: "Jeera Rice, Yellow Dal Tadka & Kadai Vegetable",
    description: "IT seminar dinner surplus. Ready for direct distribution.",
    photoUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 75,
    quantityKg: 30,
    safeUntil: hours(7.0), // Green urgency: > 6 hours
    pickupAddress: "ITPL Main Road, EPIP Zone, Whitefield, Bengaluru",
    pickupLat: 12.9868,
    pickupLng: 77.7289,
    notes: "Loading bay dock 3.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 120 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-08",
    donorId: "usr_donor_08",
    donorName: "HSR Club Caterers",
    donorPhone: "+91 98444 88331",
    donorOrg: "HSR Layout Banquets",
    donorRating: 4.7,
    title: "Poori, Aloo Sagu & Coconut Chutney",
    description: "Morning community breakfast excess. Packed in fresh hygienic boxes.",
    photoUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 35,
    quantityKg: 14,
    safeUntil: hours(2.5), // Amber
    pickupAddress: "Sector 2, 27th Main Road, HSR Layout, Bengaluru",
    pickupLat: 12.9116,
    pickupLng: 77.6534,
    notes: "Instant pickup available at the reception.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 40 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-09",
    donorId: "usr_donor_09",
    donorName: "Jayanagar Community Hall",
    donorPhone: "+91 99882 11993",
    donorOrg: "Shri Krishna Choultry",
    donorRating: 4.9,
    title: "South Indian Thali: Rice, Rasam, Palya & Payasam",
    description: "Housewarming ceremony meal excess. All sealed in food-grade buckets.",
    photoUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 90,
    quantityKg: 38,
    safeUntil: hours(4.0),
    pickupAddress: "4th Block, 11th Main Road, Jayanagar, Bengaluru",
    pickupLat: 12.9250,
    pickupLng: 77.5838,
    notes: "Ground floor parking porch.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 80 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-10",
    donorId: "usr_donor_10",
    donorName: "Shivaji Nagar Feast Masters",
    donorPhone: "+91 98451 99442",
    donorOrg: "Frazer Caterers",
    donorRating: 4.8,
    title: "Mutton Biryani & Chicken Kebab (Sealed Trays)",
    description: "Wedding banquet non-veg excess. High protein, temperature controlled since 10 PM.",
    photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    foodType: "non-veg",
    quantityPlates: 50,
    quantityKg: 24,
    safeUntil: hours(3.0),
    pickupAddress: "Mosque Road, Frazer Town, Bengaluru",
    pickupLat: 12.9982,
    pickupLng: 77.6145,
    notes: "Refrigerated van recommended. Containers chilled at 4°C.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 50 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-11",
    donorId: "usr_donor_11",
    donorName: "PES University Mess",
    donorPhone: "+91 96111 88321",
    donorOrg: "Campus Student Dining",
    donorRating: 4.9,
    title: "Chapati, Dal Tadka, Mixed Sabzi & Steamed Rice",
    description: "Hostel mess surplus from Saturday student lunch. Highly nutritious daily staple.",
    photoUrl: "https://images.unsplash.com/photo-1505253758473-96b3d5ebcd96?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 120,
    quantityKg: 48,
    safeUntil: hours(6.5),
    pickupAddress: "100 Feet Ring Road, Banashankari 3rd Stage, Bengaluru",
    pickupLat: 12.9352,
    pickupLng: 77.5348,
    notes: "Hostel Block B kitchen service door.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 110 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-12",
    donorId: "usr_donor_12",
    donorName: "The Leela Banquets",
    donorPhone: "+91 80 2521 1234",
    donorOrg: "Old Airport Road Banquets",
    donorRating: 5.0,
    title: "Gourmet Vegetable Lasagna, Garlic Bread & Garden Salad",
    description: "International corporate dinner banquet surplus. Premium quality, sealed in oven-safe trays.",
    photoUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 30,
    quantityKg: 15,
    safeUntil: hours(8.0),
    pickupAddress: "Old Airport Road, Kodihalli, Bengaluru",
    pickupLat: 12.9606,
    pickupLng: 77.6484,
    notes: "Direct contact with Chef Anand on call.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 140 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-13",
    donorId: "usr_donor_13",
    donorName: "Rajajinagar Temple Kalyana Mantapa",
    donorPhone: "+91 99011 22334",
    donorOrg: "ISKCON Cultural Hall",
    donorRating: 5.0,
    title: "Sweet Pongal, Puliyogare (Tamarind Rice) & Curd Rice",
    description: "Sacred feast prasad surplus. Untouched, pure ghee preparation, in giant steel cauldrons.",
    photoUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 140,
    quantityKg: 55,
    safeUntil: hours(9.0),
    pickupAddress: "Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru",
    pickupLat: 13.0098,
    pickupLng: 77.5511,
    notes: "Food distribution gate next to the west tower.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 160 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-14",
    donorId: "usr_donor_14",
    donorName: "Marathahalli Wedding Mahal",
    donorPhone: "+91 98457 66551",
    donorOrg: "Outer Ring Road Caterers",
    donorRating: 4.7,
    title: "Idli, Vada, Coconut Chutney & Medhu Vada",
    description: "Morning wedding breakfast buffer. Steamed idlis kept warm in thermal steamer cabinets.",
    photoUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    foodType: "veg",
    quantityPlates: 70,
    quantityKg: 20,
    safeUntil: hours(2.2),
    pickupAddress: "Near Innovative Multiplex, Marathahalli, Bengaluru",
    pickupLat: 12.9569,
    pickupLng: 77.7011,
    notes: "Easy tempo parking in basement.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 35 * 60 * 1000).toISOString()
  },
  {
    id: "list-blr-15",
    donorId: "usr_donor_15",
    donorName: "Hebbal Convention Centre",
    donorPhone: "+91 97422 99881",
    donorOrg: "North Bengaluru Banquets",
    donorRating: 4.8,
    title: "Egg Curry & Steamed Basmati Rice",
    description: "Corporate lunch meeting excess. Boiled egg masala curry in sealed catering containers.",
    photoUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    foodType: "non-veg",
    quantityPlates: 45,
    quantityKg: 18,
    safeUntil: hours(4.8),
    pickupAddress: "Near Hebbal Flyover, Bellary Road, Bengaluru",
    pickupLat: 13.0358,
    pickupLng: 77.5970,
    notes: "Rear service gate 2.",
    safetyChecklistPassed: true,
    status: "available",
    createdAt: new Date(nowMs - 65 * 60 * 1000).toISOString()
  }
];

// ==============================================================================
// SEED EVENTS (EVENT MODE FOR BANQUETS & WEDDINGS)
// ==============================================================================
export const SEED_EVENTS: ScheduledEvent[] = [
  {
    id: "evt-01",
    hostId: "usr_donor_priya",
    hostName: "Ramesh & Sunita Wedding Reception",
    title: "Grand Wedding Reception Dinner (Estimated 250 Plates)",
    venueName: "Tripuravasini, Palace Grounds, Bellary Road",
    eventDate: "Saturday, 28 Nov 2026",
    pickupTime: "10:30 PM - 11:30 PM",
    estimatedPlates: 250,
    foodType: "mixed",
    address: "Palace Grounds, Near Mekhri Circle, Bengaluru",
    lat: 13.0084,
    lng: 77.5898,
    contactPhone: "+91 98450 12345",
    vehicleNeeded: "Large Delivery Van / Canter Needed",
    claimedByNgoId: "usr_ngo_akshaya",
    claimedByNgoName: "Akshaya Patra Foundation",
    status: "claimed",
    createdAt: new Date(nowMs - 86400000).toISOString()
  },
  {
    id: "evt-02",
    hostId: "usr_host_02",
    hostName: "PES University Tech Symposium",
    title: "Annual Tech Fest Banquet (Estimated 180 Plates)",
    venueName: "PES University Main Auditorium Foyer",
    eventDate: "Sunday, 29 Nov 2026",
    pickupTime: "9:00 PM - 10:00 PM",
    estimatedPlates: 180,
    foodType: "veg",
    address: "100 Feet Ring Road, BSK 3rd Stage, Bengaluru",
    lat: 12.9352,
    lng: 77.5348,
    contactPhone: "+91 96111 88321",
    vehicleNeeded: "Tata Ace / Auto Rickshaw suitable",
    status: "upcoming",
    createdAt: new Date(nowMs - 43200000).toISOString()
  },
  {
    id: "evt-03",
    hostId: "usr_host_03",
    hostName: "Infosys Bangalore Leadership Summit",
    title: "Executive Dinner Gala (Estimated 120 Plates)",
    venueName: "Infosys Convention Centre, Campus 1",
    eventDate: "Monday, 30 Nov 2026",
    pickupTime: "9:30 PM",
    estimatedPlates: 120,
    foodType: "veg",
    address: "Electronics City Phase 1, Hosur Road, Bengaluru",
    lat: 12.8452,
    lng: 77.6602,
    contactPhone: "+91 99000 44882",
    vehicleNeeded: "Van with thermal cooler boxes",
    status: "upcoming",
    createdAt: new Date(nowMs - 20000000).toISOString()
  }
];

// ==============================================================================
// SEED DELIVERY REQUESTS (VOLUNTEER TASKS)
// ==============================================================================
export const SEED_DELIVERIES: DeliveryRequest[] = [
  {
    id: "deliv-01",
    listingId: "list-blr-01",
    listingTitle: "Steamed Sona Masoori Rice, Sambar & Poriyal (65 Plates)",
    plates: 65,
    receiverId: "usr_ngo_snehasadan",
    receiverName: "Sneha Sadan Anathashram",
    receiverAddress: "Kempapura, Hebbal, Bengaluru",
    receiverPhone: "+91 80 2520 1122",
    donorName: "Royal Sagar Caterers",
    donorAddress: "Kalyana Mantapa, 8th Cross, Malleshwaram, Bengaluru",
    donorPhone: "+91 98450 12345",
    pickupLat: 13.0031,
    pickupLng: 77.5703,
    dropLat: 13.0421,
    dropLng: 77.5921,
    distanceKm: 5.4,
    status: "open",
    createdAt: new Date(nowMs - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(nowMs - 15 * 60 * 1000).toISOString()
  },
  {
    id: "deliv-02",
    listingId: "list-blr-06",
    listingTitle: "Bisi Bele Bath & Rava Kesari (55 Plates)",
    plates: 55,
    receiverId: "usr_ngo_robinhood",
    receiverName: "Robin Hood Army Bengaluru",
    receiverAddress: "Lalbagh West Gate Shelter, Basavanagudi",
    receiverPhone: "+91 99800 54321",
    donorName: "Vidyarthi Bhavan Functions",
    donorAddress: "Gandhi Bazaar, Basavanagudi, Bengaluru",
    donorPhone: "+91 94480 77112",
    pickupLat: 12.9421,
    pickupLng: 77.5738,
    dropLat: 12.9490,
    dropLng: 77.5810,
    distanceKm: 2.1,
    volunteerId: "usr_vol_arjun",
    volunteerName: "Arjun Rao",
    volunteerPhone: "+91 99160 33445",
    status: "accepted",
    createdAt: new Date(nowMs - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(nowMs - 30 * 60 * 1000).toISOString()
  }
];

// ==============================================================================
// CITY WASTE HOTSPOTS FOR ADMIN HEATMAP
// ==============================================================================
export const SEED_HOTSPOTS: WasteHotspot[] = [
  {
    id: "hotspot-01",
    name: "Palace Grounds Banquet Belt",
    area: "Sadashivanagar / Bellary Road",
    type: "Wedding Hall",
    monthlyDonationsKg: 8400,
    mealsShared: 21000,
    lat: 13.0084,
    lng: 77.5898,
    intensity: 0.95
  },
  {
    id: "hotspot-02",
    name: "Koramangala Restaurant Cluster",
    area: "Koramangala 4th & 5th Blocks",
    type: "Restaurant Cluster",
    monthlyDonationsKg: 4200,
    mealsShared: 10500,
    lat: 12.9345,
    lng: 77.6266,
    intensity: 0.8
  },
  {
    id: "hotspot-03",
    name: "Electronic City IT Campus Messes",
    area: "Electronics City Phase 1",
    type: "College Mess",
    monthlyDonationsKg: 6500,
    mealsShared: 16250,
    lat: 12.8452,
    lng: 77.6602,
    intensity: 0.85
  },
  {
    id: "hotspot-04",
    name: "Malleshwaram Wedding Choultries",
    area: "Malleshwaram 8th-15th Cross",
    type: "Wedding Hall",
    monthlyDonationsKg: 5100,
    mealsShared: 12750,
    lat: 13.0031,
    lng: 77.5703,
    intensity: 0.82
  },
  {
    id: "hotspot-05",
    name: "Whitefield Corporate Banquets",
    area: "EPIP Zone / ITPL",
    type: "Catering Hub",
    monthlyDonationsKg: 4900,
    mealsShared: 12250,
    lat: 12.9868,
    lng: 77.7289,
    intensity: 0.78
  },
  {
    id: "hotspot-06",
    name: "Indiranagar 100ft Dining Corridor",
    area: "Indiranagar",
    type: "Restaurant Cluster",
    monthlyDonationsKg: 3800,
    mealsShared: 9500,
    lat: 12.9784,
    lng: 77.6408,
    intensity: 0.7
  }
];

// ==============================================================================
// INITIAL IMPACT STATS
// ==============================================================================
export const SEED_IMPACT: ImpactStats = {
  totalMealsSaved: 142850,
  totalKgRescued: 57140,
  totalCo2AvoidedKg: 142850,
  activeDonorsCount: 420,
  activeNgosCount: 78,
  weeklyData: [
    { day: "Mon", meals: 1840 },
    { day: "Tue", meals: 2150 },
    { day: "Wed", meals: 2420 },
    { day: "Thu", meals: 2890 },
    { day: "Fri", meals: 3850 },
    { day: "Sat", meals: 5940 },
    { day: "Sun", meals: 6420 }
  ]
};

// ==============================================================================
// REACTIVE LOCAL + REALTIME STORE IMPLEMENTATION
// ==============================================================================
class FoodResQStore {
  private profiles: UserProfile[] = [];
  private listings: FoodListing[] = [];
  private events: ScheduledEvent[] = [];
  private deliveries: DeliveryRequest[] = [];
  private ratings: UserRating[] = [];
  private notifications: NotificationItem[] = [];
  private impact: ImpactStats = SEED_IMPACT;
  private currentUser: UserProfile = SEED_PROFILES[0]; // Default: Priya Sharma (Donor)
  private listeners: Set<() => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      this.broadcastChannel = new BroadcastChannel('foodresq_cross_tab_sync');
      this.broadcastChannel.onmessage = () => {
        this.reloadFromStorage();
        this.notify();
      };
    } catch {
      // Ignore in environments without BroadcastChannel
    }

    const savedProfiles = localStorage.getItem('foodresq_profiles');
    const savedListings = localStorage.getItem('foodresq_listings');
    const savedEvents = localStorage.getItem('foodresq_events');
    const savedDeliveries = localStorage.getItem('foodresq_deliveries');
    const savedNotifications = localStorage.getItem('foodresq_notifications');
    const savedCurrentUserId = localStorage.getItem('foodresq_current_user_id');
    const savedImpact = localStorage.getItem('foodresq_impact');

    this.profiles = savedProfiles ? JSON.parse(savedProfiles) : [...SEED_PROFILES];
    this.listings = savedListings ? JSON.parse(savedListings) : [...SEED_LISTINGS];
    this.events = savedEvents ? JSON.parse(savedEvents) : [...SEED_EVENTS];
    this.deliveries = savedDeliveries ? JSON.parse(savedDeliveries) : [...SEED_DELIVERIES];
    this.notifications = savedNotifications ? JSON.parse(savedNotifications) : [
      {
        id: "notif-01",
        userId: "usr_donor_priya",
        title: "Welcome to FoodResQ! 🌱",
        message: "Your caterer account is verified with Gold Food Hero status. Thank you for rescuing surplus food!",
        type: "system",
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
    this.impact = savedImpact ? JSON.parse(savedImpact) : { ...SEED_IMPACT };

    if (savedCurrentUserId) {
      const found = this.profiles.find((p) => p.id === savedCurrentUserId);
      if (found) this.currentUser = found;
    }

    this.checkAndExpireListings();
  }

  private persist() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('foodresq_profiles', JSON.stringify(this.profiles));
    localStorage.setItem('foodresq_listings', JSON.stringify(this.listings));
    localStorage.setItem('foodresq_events', JSON.stringify(this.events));
    localStorage.setItem('foodresq_deliveries', JSON.stringify(this.deliveries));
    localStorage.setItem('foodresq_notifications', JSON.stringify(this.notifications));
    localStorage.setItem('foodresq_current_user_id', this.currentUser.id);
    localStorage.setItem('foodresq_impact', JSON.stringify(this.impact));

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage('sync');
    }
  }

  private reloadFromStorage() {
    try {
      const savedListings = localStorage.getItem('foodresq_listings');
      if (savedListings) this.listings = JSON.parse(savedListings);

      const savedDeliveries = localStorage.getItem('foodresq_deliveries');
      if (savedDeliveries) this.deliveries = JSON.parse(savedDeliveries);

      const savedNotifications = localStorage.getItem('foodresq_notifications');
      if (savedNotifications) this.notifications = JSON.parse(savedNotifications);

      const savedImpact = localStorage.getItem('foodresq_impact');
      if (savedImpact) this.impact = JSON.parse(savedImpact);
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- GETTERS ---
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public getAllProfiles(): UserProfile[] {
    return [...this.profiles];
  }

  public getListings(): FoodListing[] {
    this.checkAndExpireListings();
    return [...this.listings];
  }

  public getListingById(id: string): FoodListing | undefined {
    return this.listings.find((l) => l.id === id);
  }

  public getEvents(): ScheduledEvent[] {
    return [...this.events];
  }

  public getDeliveries(): DeliveryRequest[] {
    return [...this.deliveries];
  }

  public getNotifications(userId?: string): NotificationItem[] {
    const targetId = userId || this.currentUser.id;
    return this.notifications.filter((n) => n.userId === targetId || n.userId === 'all');
  }

  public getUnreadNotificationCount(userId?: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length;
  }

  public getImpactStats(): ImpactStats {
    return { ...this.impact };
  }

  public getHotspots(): WasteHotspot[] {
    return [...SEED_HOTSPOTS];
  }

  // --- ACTIONS ---

  public switchUser(userId: string) {
    const found = this.profiles.find((p) => p.id === userId);
    if (found) {
      this.currentUser = found;
      this.persist();
      this.notify();
    }
  }

  public setRole(role: UserRole) {
    const found = this.profiles.find((p) => p.role === role);
    if (found) {
      this.currentUser = found;
    } else {
      this.currentUser = {
        ...this.currentUser,
        role
      };
    }
    this.persist();
    this.notify();
  }

  public loginOrRegister(profileData: Partial<UserProfile>): UserProfile {
    const existing = this.profiles.find((p) => p.email === profileData.email);
    if (existing) {
      if (profileData.password) existing.password = profileData.password;
      this.currentUser = existing;
      this.persist();
      this.notify();
      return existing;
    }

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      role: profileData.role || 'donor',
      name: profileData.name || 'Anonymous User',
      email: profileData.email || 'user@example.com',
      password: profileData.password,
      provider: profileData.provider || 'email',
      phone: profileData.phone || '+91 99999 88888',
      organizationName: profileData.organizationName,
      registrationNumber: profileData.registrationNumber,
      receiverType: profileData.receiverType,
      isVerified: profileData.role === 'donor' || profileData.role === 'volunteer',
      mealsDonated: 0,
      kgRescued: 0,
      deliveriesCompleted: 0,
      ratingAvg: 5.0,
      ratingCount: 0,
      badgeLevel: 'Bronze',
      createdAt: new Date().toISOString()
    };

    this.profiles.push(newProfile);
    this.currentUser = newProfile;
    this.persist();
    this.notify();
    return newProfile;
  }

  public loginWithGmail(params: {
    email: string;
    password?: string;
    role?: UserRole;
    name?: string;
    phone?: string;
    organizationName?: string;
    registrationNumber?: string;
    receiverType?: ReceiverType;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const emailNorm = params.email.trim().toLowerCase();
    let existing = this.profiles.find((p) => p.email.toLowerCase() === emailNorm);

    if (existing) {
      if (existing.password && params.password && existing.password !== params.password) {
        return { success: false, error: 'Incorrect password for this Gmail account.' };
      }
      if (!existing.password && params.password) {
        existing.password = params.password;
      }
      if (params.role) existing.role = params.role;
      if (params.organizationName) existing.organizationName = params.organizationName;
      existing.provider = 'gmail';

      this.currentUser = existing;
      this.persist();
      this.notify();
      return { success: true, user: existing };
    }

    let derivedName = params.name;
    if (!derivedName || !derivedName.trim()) {
      const userPart = emailNorm.split('@')[0];
      derivedName = userPart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    const newProfile: UserProfile = {
      id: `usr_gmail_${Date.now()}`,
      role: params.role || 'donor',
      name: derivedName,
      email: emailNorm,
      password: params.password,
      provider: 'gmail',
      phone: params.phone || '+91 98450 12345',
      organizationName: params.organizationName,
      registrationNumber: params.registrationNumber,
      receiverType: params.receiverType,
      isVerified: params.role === 'donor' || params.role === 'volunteer',
      mealsDonated: 0,
      kgRescued: 0,
      deliveriesCompleted: 0,
      ratingAvg: 5.0,
      ratingCount: 0,
      badgeLevel: 'Bronze',
      createdAt: new Date().toISOString()
    };

    this.profiles.push(newProfile);
    this.currentUser = newProfile;
    this.persist();
    this.notify();
    return { success: true, user: newProfile };
  }

  public createListing(listingData: Omit<FoodListing, 'id' | 'createdAt' | 'status'>): FoodListing {
    const newId = `list_${Date.now()}`;
    const newListing: FoodListing = {
      ...listingData,
      id: newId,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    this.listings.unshift(newListing);

    // Notify all verified NGOs in Bengaluru instantly
    const verifiedNgos = this.profiles.filter((p) => p.role === 'receiver' && p.isVerified);
    verifiedNgos.forEach((ngo) => {
      this.notifications.unshift({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: ngo.id,
        title: `🚨 Urgent Food Alert: ${newListing.title}`,
        message: `${newListing.donorName} just posted ${newListing.quantityPlates} plates (${newListing.quantityKg} kg) near ${newListing.pickupAddress}.`,
        type: 'listing_alert',
        read: false,
        listingId: newId,
        createdAt: new Date().toISOString()
      });
    });

    this.persist();
    this.notify();
    return newListing;
  }

  // ATOMIC LOCK BOOKING
  // Guaranteed mutex simulation: if listing is not 'available', it strictly fails.
  public bookListingAtomic(
    listingId: string,
    receiverId: string,
    receiverName: string,
    receiverPhone: string,
    receiverOrg?: string,
    requestDelivery: boolean = false
  ): { success: boolean; pickupCode?: string; error?: string } {
    const listingIndex = this.listings.findIndex((l) => l.id === listingId);
    if (listingIndex === -1) {
      return { success: false, error: "Listing not found." };
    }

    const listing = this.listings[listingIndex];

    if (listing.status !== 'available') {
      return {
        success: false,
        error: "This food has already been claimed by another organization or is no longer available."
      };
    }

    if (new Date(listing.safeUntil).getTime() < Date.now()) {
      listing.status = 'expired';
      this.persist();
      this.notify();
      return { success: false, error: "This listing has passed its safe consumption time." };
    }

    // Generate random 4-digit pickup code
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Atomic update
    this.listings[listingIndex] = {
      ...listing,
      status: 'booked',
      bookedById: receiverId,
      bookedByName: receiverName,
      bookedByPhone: receiverPhone,
      bookedByOrg: receiverOrg,
      bookedAt: new Date().toISOString(),
      pickupCode,
      volunteerDeliveryRequested: requestDelivery
    };

    // If receiver requested volunteer delivery, create open delivery request
    if (requestDelivery) {
      this.deliveries.unshift({
        id: `deliv_${Date.now()}`,
        listingId: listing.id,
        listingTitle: `${listing.title} (${listing.quantityPlates} Plates)`,
        plates: listing.quantityPlates,
        receiverId,
        receiverName,
        receiverAddress: "Koramangala / Bengaluru Shelter",
        receiverPhone,
        donorName: listing.donorName,
        donorAddress: listing.pickupAddress,
        donorPhone: listing.donorPhone,
        pickupLat: listing.pickupLat,
        pickupLng: listing.pickupLng,
        dropLat: 12.9345,
        dropLng: 77.6266,
        distanceKm: 3.8,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Notify donor
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: listing.donorId,
      title: `Food Booked! 🍲`,
      message: `${receiverName} (${receiverOrg || 'Receiver'}) booked "${listing.title}". Verification code: ${pickupCode}`,
      type: 'booking_alert',
      read: false,
      listingId: listing.id,
      createdAt: new Date().toISOString()
    });

    this.persist();
    this.notify();

    return { success: true, pickupCode };
  }

  // CONFIRM HANDOVER WITH 4-DIGIT PIN
  public confirmPickupHandover(listingId: string, enteredCode: string): { success: boolean; error?: string } {
    const listingIndex = this.listings.findIndex((l) => l.id === listingId);
    if (listingIndex === -1) {
      return { success: false, error: "Listing not found." };
    }

    const listing = this.listings[listingIndex];
    if (listing.pickupCode !== enteredCode.trim()) {
      return { success: false, error: "Incorrect 4-digit code. Please verify code from the receiver's screen." };
    }

    const collectedAt = new Date().toISOString();
    this.listings[listingIndex] = {
      ...listing,
      status: 'collected',
      collectedAt
    };

    // Increase impact counters
    const meals = listing.quantityPlates;
    const kg = listing.quantityKg;
    const co2 = Number((kg * 2.5).toFixed(1));

    this.impact = {
      ...this.impact,
      totalMealsSaved: this.impact.totalMealsSaved + meals,
      totalKgRescued: this.impact.totalKgRescued + kg,
      totalCo2AvoidedKg: this.impact.totalCo2AvoidedKg + co2
    };

    // Update donor stats
    const donor = this.profiles.find((p) => p.id === listing.donorId);
    if (donor) {
      donor.mealsDonated += meals;
      donor.kgRescued += kg;
      if (donor.mealsDonated > 5000) donor.badgeLevel = 'Gold';
      else if (donor.mealsDonated > 1000) donor.badgeLevel = 'Silver';
    }

    // Update receiver stats
    if (listing.bookedById) {
      const receiver = this.profiles.find((p) => p.id === listing.bookedById);
      if (receiver) {
        receiver.kgRescued += kg;
      }

      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: listing.bookedById,
        title: "Food Handover Complete! 🎉",
        message: `Thank you for rescuing ${meals} meals from ${listing.donorName}. Enjoy your fresh meals!`,
        type: 'pickup_code',
        read: false,
        listingId: listing.id,
        createdAt: new Date().toISOString()
      });
    }

    this.persist();
    this.notify();
    return { success: true };
  }

  // VOLUNTEER DELIVERY STATUS PROGRESSION
  public updateDeliveryStatus(deliveryId: string, newStatus: DeliveryRequest['status'], volunteerId?: string, volunteerName?: string) {
    const deliveryIndex = this.deliveries.findIndex((d) => d.id === deliveryId);
    if (deliveryIndex === -1) return;

    const delivery = this.deliveries[deliveryIndex];
    this.deliveries[deliveryIndex] = {
      ...delivery,
      status: newStatus,
      volunteerId: volunteerId || delivery.volunteerId || this.currentUser.id,
      volunteerName: volunteerName || delivery.volunteerName || this.currentUser.name,
      updatedAt: new Date().toISOString()
    };

    if (newStatus === 'delivered') {
      const vol = this.profiles.find((p) => p.id === (volunteerId || delivery.volunteerId));
      if (vol) {
        vol.deliveriesCompleted += 1;
      }
    }

    this.persist();
    this.notify();
  }

  // ADMIN NGO APPROVAL
  public approveNgoVerification(profileId: string) {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (profile) {
      profile.isVerified = true;
      profile.verificationDate = new Date().toISOString();

      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: profile.id,
        title: "Verified NGO Badge Approved! 🛡️",
        message: "Your organization has been approved by the City Coordinator. You can now claim banquet surplus listings.",
        type: 'verification',
        read: false,
        createdAt: new Date().toISOString()
      });

      this.persist();
      this.notify();
    }
  }

  // EVENT MODE: CREATE SCHEDULED FUTURE EVENT
  public createScheduledEvent(eventData: Omit<ScheduledEvent, 'id' | 'createdAt' | 'status'>): ScheduledEvent {
    const newEvent: ScheduledEvent = {
      ...eventData,
      id: `evt_${Date.now()}`,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    this.events.unshift(newEvent);
    this.persist();
    this.notify();
    return newEvent;
  }

  public claimEvent(eventId: string, ngoId: string, ngoName: string) {
    const event = this.events.find((e) => e.id === eventId);
    if (event) {
      event.claimedByNgoId = ngoId;
      event.claimedByNgoName = ngoName;
      event.status = 'claimed';
      this.persist();
      this.notify();
    }
  }

  // RATING SUBMISSION
  public submitRating(listingId: string, toUserId: string, rating: number, comment: string) {
    this.ratings.push({
      id: `rate_${Date.now()}`,
      listingId,
      fromUserId: this.currentUser.id,
      fromUserName: this.currentUser.name,
      toUserId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    const targetUser = this.profiles.find((p) => p.id === toUserId);
    if (targetUser) {
      const userRatings = this.ratings.filter((r) => r.toUserId === toUserId);
      const total = userRatings.reduce((sum, r) => sum + r.rating, 0);
      targetUser.ratingAvg = Number((total / userRatings.length).toFixed(1));
      targetUser.ratingCount = userRatings.length;
    }

    this.persist();
    this.notify();
  }

  public markNotificationAsRead(notifId: string) {
    const notif = this.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.persist();
      this.notify();
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach((n) => {
      if (n.userId === this.currentUser.id || n.userId === 'all') {
        n.read = true;
      }
    });
    this.persist();
    this.notify();
  }

  private checkAndExpireListings() {
    const now = Date.now();
    let changed = false;
    this.listings.forEach((listing) => {
      if (listing.status === 'available' && new Date(listing.safeUntil).getTime() < now) {
        listing.status = 'expired';
        changed = true;
      }
    });
    if (changed) {
      this.persist();
    }
  }

  public resetToDefaultSeed() {
    this.profiles = [...SEED_PROFILES];
    this.listings = [...SEED_LISTINGS];
    this.events = [...SEED_EVENTS];
    this.deliveries = [...SEED_DELIVERIES];
    this.impact = { ...SEED_IMPACT };
    this.currentUser = SEED_PROFILES[0];
    this.persist();
    this.notify();
  }
}

export const store = new FoodResQStore();
