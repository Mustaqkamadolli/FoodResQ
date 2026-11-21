# FoodResQ 🍲🌱
> **Don't waste it. Share it.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-FoodResQ-064E3B?style=for-the-badge&logo=github)](https://github.com/Mustaqkamadolli/FoodResQ)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FoodResQ** is a production-quality, real-time urban surplus food rescue web platform built specifically for Indian cities (seeded with Bengaluru). It connects surplus food from weddings, banquet halls, caterers, campus messes, and restaurants with nearby verified NGOs, anathashrams, and volunteer delivery drivers, ensuring freshly cooked food feeds hungry people instead of decomposing in landfills.

---

## 🌟 Key Features

### 1. Three Core Roles & Persona Switching
- **Donor**: Caterers, banquet halls, and campus messes upload photos and post surplus food with food-safety guarantees.
- **Receiver (NGOs & Shelters)**: Verified charities (*Akshaya Patra Foundation*, *Robin Hood Army*, *Sneha Sadan Anathashram*) and community kitchens atomically book food for instant pickup.
- **Volunteer Driver**: Transports food across the city using 2-wheelers, autos, or vans when receivers lack vehicles.
- **City Admin**: Verifies pending NGO applications and monitors urban food-waste hotspots via GIS heatmaps.
- **Demo Role Switcher**: Instant one-click persona switching between Priya (Donor), Sneha Sadan (Receiver), and Kiran (Volunteer).

### 2. End-to-End Core Flow
1. **Photo & AI Auto-Analysis**: Donor uploads a photo of surplus food. The AI vision model auto-fills dish name, estimated quantity (plates and kg), and vegetarian/non-vegetarian classification.
2. **Food Details & Safe-Until Deadline**: Donor sets safe consumption window (hours remaining), pickup address with Leaflet/OpenStreetMap pin, phone number, and optional packaging notes.
3. **Voice Input via Web Speech API**: Donors can speak dish notes in English, Hindi, or Kannada.
4. **Mandatory 4-Point Safety Checklist**:
   - Freshly prepared within safe window.
   - Stored in covered, temperature-safe containers.
   - Untouched by diners after buffet service.
   - Packed in hygienic food-grade disposable vessels.
   *(Posting is strictly blocked until all 4 criteria are checked).*
5. **Instant In-App Alert & Toast**: All nearby verified NGOs receive instant alerts.
6. **Atomic Concurrency Lock**: When an NGO clicks *"Book this food"*, the listing locks atomically, preventing race conditions or double-booking.
7. **4-Digit Handover Security Code**:
   - Receiver receives an encrypted 4-digit code (e.g. `7429`) with a digital ticket display.
   - Donor sees *"Booked by [Receiver Name] ([Phone])"*.
8. **Handover Verification & Celebration**:
   - At pickup, donor inputs the 4-digit code into a PIN pad.
   - System confirms match, fires celebration confetti, updates the live impact counter (+plates, +kg, +CO₂ saved), and marks the status as **Collected**.
9. **Auto-Expiry**: Listings automatically expire when their *"safe to eat until"* deadline elapses. Urgent food (&lt;2h remaining) is highlighted with pulsing badges.

### 3. Real-Time Location & OpenStreetMap Route Guidance (100% Free, No API Key)
- **Live User GPS**: Continuous tracking with animated pulsing beacon and one-click *"My GPS"* recentering.
- **Turn-by-Turn Route Guidance**: Integrated with **Open Source Routing Machine (OSRM)** to calculate and render real road polylines from the user's location to the food pickup venue.
- **Floating Route HUD**: Displays road distance (km), estimated driving time (Van/Car) and 2-wheeler time, expandable step-by-step navigation instructions, and one-tap launch into Google Maps navigation.

### 4. LifeSaverAI — Intelligent Copilot Agent
- Floating bottom-right assistant trained on Bengaluru surplus rescue protocols and FSSAI guidelines.
- **Role-Aware Proactive Suggestions**:
  - *Donors*: FSSAI safe temperature windows, thermal packaging batch sizes (25-50 plate crates).
  - *Receivers*: Urgent food lot alerts (<3h remaining), vehicle size matching (scooter vs auto vs tempo).
  - *Volunteers*: Fastest traffic routes across Bengaluru arterial roads and food safety handling.
- **Interactive Chat & Voice Input**: Free-text querying with speech-to-text recognition in English, Hindi, and Kannada.
- **Action-Executing**: LifeSaverAI directly launches routes, filters urgent lots, and navigates the app.

### 5. Gmail Authentication & Custom Password Setup
- Direct sign-in using your Gmail ID.
- Seamless password setup with show/hide toggle and confirmation.
- 1-click Google quick auto-fill.
- Role selection (Donor, Receiver NGO, Volunteer Driver) with NGO registration credentials.

### 6. Event Mode (Banquet Pre-Planning)
- Wedding hosts and convention centers can schedule future pickups (e.g. *"250 plates available after 10:30 PM, Saturday at Palace Grounds"*).
- NGOs can claim events and reserve logistics vans in advance.

### 7. Food Hero Certificate (Lush Greenish-Whitish Theme)
- Official printable high-resolution 300 DPI canvas certificate.
- Attested and signed by **Mustaq Kamdoli**, Director & Chief Coordinator, FoodResQ Bengaluru Initiative.
- Downloadable directly as a PNG.

### 8. Impact Dashboard & Waste Hotspots
- Real-time accounting: Total Meals Saved, Kg Food Rescued, CO₂ Emissions Avoided (2.5 kg CO₂e / kg food), Equivalent Tree Seedlings.
- City Waste Hotspot Heatmap for urban planners and admin NGO verification management.
- Multilingual: **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.

---

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Design Language**: Structured Renaissance Gallery (Putty paper `#c4c3b6`, Davinci serif, Bone cards `#e7e5e4`, hairline borders `#dfdcd5`, 28.8px pill buttons).
- **Mapping**: Leaflet 1.9 & OpenStreetMap (100% free, zero external API key needed).
- **Routing Engine**: Open Source Routing Machine (OSRM) with local geometric fallback.
- **AI Agent**: LifeSaverAI Copilot with Web Speech API integration.
- **Backend / Realtime**: Supabase (`@supabase/supabase-js`) with reactive store fallback and cross-tab synchronization.
- **PWA**: Installable Web App manifest (`manifest.json`) and service worker (`sw.js`).

---

## 🚀 Running the Project

```bash
# Clone the repository
git clone https://github.com/Mustaqkamadolli/FoodResQ.git
cd FoodResQ

# Install dependencies
npm install

# Start development server
npm run dev
```

App will run at: **`http://localhost:3000`**

---

## 👨‍💼 Leadership & Civic Coalition

* **Director & Chief Coordinator**: **Mustaq Kamdoli**
* **Initiative**: FoodResQ Bengaluru Civic Initiative
* **GitHub**: [@Mustaqkamadolli](https://github.com/Mustaqkamadolli)
