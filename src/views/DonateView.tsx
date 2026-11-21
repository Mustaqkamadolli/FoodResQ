import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SupportedLanguage, UserProfile, FoodType } from '../types';
import { translations } from '../i18n/translations';
import { store } from '../services/store';
import { analyzeFoodPhoto, BANQUET_PRESETS } from '../services/aiVision';
import { FoodSafetyChecklist } from '../components/FoodSafetyChecklist';
import {
  Sparkles,
  Mic,
  MicOff,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Camera
} from 'lucide-react';

interface DonateViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  onSuccess: (newListingId: string) => void;
  onCancel: () => void;
}

export const DonateView: React.FC<DonateViewProps> = ({
  currentUser,
  currentLang,
  onSuccess,
  onCancel
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  );
  const [analyzingAi, setAnalyzingAi] = useState<boolean>(false);
  const [aiDetected, setAiDetected] = useState<boolean>(false);

  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState<FoodType>('veg');
  const [plates, setPlates] = useState<number>(45);
  const [kg, setKg] = useState<number>(18);
  const [safeUntilTime, setSafeUntilTime] = useState<string>(() => {
    const d = new Date(Date.now() + 4 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [pickupAddress, setPickupAddress] = useState('8th Cross, Malleshwaram, Bengaluru');
  const [pickupLat, setPickupLat] = useState<number>(13.0031);
  const [pickupLng, setPickupLng] = useState<number>(77.5703);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98450 12345');
  const [notes, setNotes] = useState('');

  // Voice input state
  const [isListening, setIsListening] = useState<boolean>(false);

  // Safety checklist state (4 mandatory checks)
  const [safetyChecks, setSafetyChecks] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false
  ]);

  const allSafetyChecked = safetyChecks.every(Boolean);

  // Handle Photo selection & AI Vision analysis
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoUrl(dataUrl);
      runAiAnalysis(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetIndex: number) => {
    const preset = BANQUET_PRESETS[presetIndex];
    setTitle(preset.title);
    setFoodType(preset.foodType);
    setPlates(preset.quantityPlates);
    setKg(preset.quantityKg);
    setNotes(preset.notes);
    setAiDetected(true);
  };

  const runAiAnalysis = async (imgData: string, fileName?: string) => {
    setAnalyzingAi(true);
    setAiDetected(false);
    try {
      const result = await analyzeFoodPhoto(imgData, fileName);
      setTitle(result.title);
      setFoodType(result.foodType);
      setPlates(result.quantityPlates);
      setKg(result.quantityKg);
      setNotes(result.notes);
      setAiDetected(true);
    } catch (err) {
      console.warn("AI analysis error:", err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  // Voice Input via Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type directly into the notes field.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = t.speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Recognition error:", err);
      setIsListening(false);
    }
  };

  // Geolocation
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupLat(pos.coords.latitude);
        setPickupLng(pos.coords.longitude);
        setPickupAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Bengaluru)`);
      },
      (err) => {
        alert("Unable to fetch GPS position: " + err.message);
      }
    );
  };

  const handleSafetyChange = (idx: number, val: boolean) => {
    const updated = [...safetyChecks] as [boolean, boolean, boolean, boolean];
    updated[idx] = val;
    setSafetyChecks(updated);
  };

  // Final Publish Handler
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allSafetyChecked) {
      alert("All 4 safety checklist items must be confirmed before posting.");
      return;
    }

    if (!title.trim()) {
      alert("Please provide a name or description for the food.");
      return;
    }

    const newListing = store.createListing({
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorPhone: phone,
      donorOrg: currentUser.organizationName,
      donorRating: currentUser.ratingAvg || 5.0,
      title,
      description: notes || "Fresh surplus banquet food ready for immediate pickup.",
      photoUrl,
      foodType,
      quantityPlates: Number(plates),
      quantityKg: Number(kg),
      safeUntil: new Date(safeUntilTime).toISOString(),
      pickupAddress,
      pickupLat,
      pickupLng,
      notes,
      safetyChecklistPassed: true
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onSuccess(newListing.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
          Surplus Intake Protocol
        </span>
        <h1 className="text-3xl sm:text-4xl font-davinci font-normal text-[#000000] mt-2">
          Donate Surplus Food
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#595855] mt-1">
          Upload a photograph. AI analyzes dishes, estimated volume, and consumption safety window.
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        
        {/* STEP 1: PHOTO UPLOAD & AI AUTO-ANALYSIS */}
        <div className="card-bone p-6 sm:p-8 space-y-5">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-davinci font-normal text-[#000000]">
                I.
              </span>
              <h3 className="text-base font-davinci font-normal text-[#000000]">
                Photograph & AI Recognition
              </h3>
            </div>

            {aiDetected && (
              <span className="text-xs font-mono text-[#000000] bg-[#dfdcd5] px-3 py-1 rounded-[28.8px] border border-[#dfdcd5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Analyzed</span>
              </span>
            )}
          </div>

          {/* Photo Display / Upload Zone */}
          <div className="relative group">
            <div className="h-64 sm:h-72 w-full rounded-[9px] overflow-hidden bg-[#dfdcd5] border border-[#dfdcd5] relative flex items-center justify-center">
              <img
                src={photoUrl}
                alt="Donation preview"
                className="w-full h-full object-cover"
              />

              {/* Upload Overlay Button */}
              <div className="absolute inset-0 bg-[#000000]/50 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-[#ffffff] text-[#000000] rounded-[28.8px] text-xs font-sans font-medium hover:bg-[#e7e5e4] flex items-center gap-2 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload or Take Photo</span>
                </button>

                <p className="text-[11px] font-mono text-[#dfdcd5]">
                  Select food container or buffet table image
                </p>
              </div>

              {/* AI Processing Overlay */}
              {analyzingAi && (
                <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-white z-20">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono tracking-wider animate-pulse">
                    AI Vision analyzing food dishes & plate capacity...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preset Dish Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#595855] uppercase tracking-wider">
                Sample Banquet Lots (1-Tap Test):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BANQUET_PRESETS.slice(0, 6).map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className="text-left p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] hover:border-[#000000] transition-all text-[11px]"
                >
                  <div className="font-davinci truncate text-[#000000]">
                    {preset.title.split(',')[0]}
                  </div>
                  <span className="text-[10px] font-mono text-[#595855]">
                    {preset.quantityPlates} pl · {preset.foodType.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* STEP 2: AUTO-FILLED FIELDS */}
        <div className="card-bone p-6 sm:p-8 space-y-5">
          
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-davinci font-normal text-[#000000]">
              II.
            </span>
            <div>
              <h3 className="text-base font-davinci font-normal text-[#000000]">
                Food Name, Dietary Type & Quantity
              </h3>
              <p className="text-xs font-sans text-[#595855]">Auto-filled by AI. Edit any value below.</p>
            </div>
          </div>

          {/* Food Title */}
          <div>
            <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1.5">
              Food Name / Main Dishes
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Steamed Rice, Sambar & Mixed Veg Poriyal"
              className="w-full text-xs sm:text-sm p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] focus:border-[#000000] outline-hidden font-sans"
            />
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-2">
              Dietary Classification
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFoodType('veg')}
                className={`flex-1 py-2.5 px-4 rounded-[28.8px] border flex items-center justify-center gap-2 text-xs font-sans transition-all ${
                  foodType === 'veg'
                    ? 'border-[#000000] bg-[#000000] text-[#ffffff]'
                    : 'border-[#dfdcd5] bg-[#ffffff] text-[#595855] hover:border-[#000000]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#000000]"></span>
                <span>Vegetarian (Pure Veg)</span>
              </button>

              <button
                type="button"
                onClick={() => setFoodType('non-veg')}
                className={`flex-1 py-2.5 px-4 rounded-[28.8px] border flex items-center justify-center gap-2 text-xs font-sans transition-all ${
                  foodType === 'non-veg'
                    ? 'border-[#000000] bg-[#000000] text-[#ffffff]'
                    : 'border-[#dfdcd5] bg-[#ffffff] text-[#595855] hover:border-[#000000]'
                }`}
              >
                <span className="w-2 h-2 rounded-full border border-current"></span>
                <span>Non-Vegetarian</span>
              </button>
            </div>
          </div>

          {/* Quantity in Plates and Kg */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1.5">
                Estimated Plates / Servings
              </label>
              <input
                type="number"
                min={1}
                required
                value={plates}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPlates(val);
                  setKg(Number((val * 0.4).toFixed(1)));
                }}
                className="w-full text-xs sm:text-sm p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1.5">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min={0.5}
                required
                value={kg}
                onChange={(e) => setKg(Number(e.target.value))}
                className="w-full text-xs sm:text-sm p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>
          </div>

          {/* Safe Until Date & Time Picker */}
          <div>
            <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1.5">
              Safe to Eat Until (Strict Expiry Deadline)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#808080] absolute left-3.5 top-3" />
              <input
                type="datetime-local"
                required
                value={safeUntilTime}
                onChange={(e) => setSafeUntilTime(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>
            <p className="text-[11px] font-sans text-[#595855] mt-1">
              Listings auto-expire and disappear when this safe consumption time passes.
            </p>
          </div>

        </div>

        {/* STEP 3: PICKUP LOCATION & NOTES */}
        <div className="card-bone p-6 sm:p-8 space-y-5">
          
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-davinci font-normal text-[#000000]">
              III.
            </span>
            <h3 className="text-base font-davinci font-normal text-[#000000]">
              Pickup Location, Contact & Instructions
            </h3>
          </div>

          {/* Location with Geolocation Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[#000000] uppercase tracking-wider">
                Pickup Address / Venue
              </label>
              <button
                type="button"
                onClick={handleUseLocation}
                className="text-[11px] font-sans text-[#000000] underline flex items-center gap-1 hover:opacity-80"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Use Current Location</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="e.g. Kalyana Mantapa, 8th Cross, Malleshwaram, Bengaluru"
              className="w-full text-xs sm:text-sm p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1.5">
              Contact Phone (for pickup driver coordination)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#808080] absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>
          </div>

          {/* Optional Notes with Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[#000000] uppercase tracking-wider">
                Packaging Notes & Instructions
              </label>
              
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`text-[11px] font-sans px-3 py-1 rounded-[28.8px] flex items-center gap-1.5 transition-all border ${
                  isListening
                    ? 'bg-[#000000] text-[#ffffff] border-[#000000] animate-pulse'
                    : 'bg-[#ffffff] text-[#000000] border-[#dfdcd5] hover:border-[#000000]'
                }`}
                title={t.voiceInputTooltip}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Input ({t.speechLang.slice(0, 2).toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed in returnable stainless steel crates. Rear gate service parking available for tempo..."
              className="w-full text-xs sm:text-sm p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans outline-hidden focus:border-[#000000]"
            />
          </div>

        </div>

        {/* STEP 4: MANDATORY FOOD SAFETY CHECKLIST */}
        <div className="space-y-4">
          <FoodSafetyChecklist
            checkedState={safetyChecks}
            onChange={handleSafetyChange}
            currentLang={currentLang}
          />
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#dfdcd5]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-[28.8px] border border-[#dfdcd5] text-xs font-sans text-[#595855] hover:text-[#000000] hover:border-[#000000] transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!allSafetyChecked}
            className={`btn-pill flex items-center gap-2 ${
              allSafetyChecked
                ? 'opacity-100 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Food Listing Now</span>
          </button>
        </div>

      </form>
    </div>
  );
};
