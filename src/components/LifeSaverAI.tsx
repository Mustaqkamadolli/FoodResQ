import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, FoodListing, SupportedLanguage } from '../types';
import {
  Sparkles,
  Bot,
  Send,
  X,
  MessageSquare,
  Mic,
  MicOff,
  ChevronRight,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Navigation,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface LifeSaverAIProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  listings: FoodListing[];
  onNavigateTab?: (tab: string) => void;
  onSelectListing?: (listing: FoodListing) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    actionType: 'navigate' | 'filter_urgent' | 'guide_route' | 'open_donate';
    payload?: any;
  };
}

export const LifeSaverAI: React.FC<LifeSaverAIProps> = ({
  currentUser,
  currentLang,
  listings,
  onNavigateTab,
  onSelectListing
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available urgent food count (<3 hours)
  const urgentCount = listings.filter((l) => {
    if (l.status !== 'available') return false;
    const diff = (new Date(l.safeUntil).getTime() - Date.now()) / (3600 * 1000);
    return diff > 0 && diff <= 3;
  }).length;

  // Initial welcome message tailored to role
  const getInitialMessages = (): ChatMessage[] => {
    let roleGreeting = "I'm LifeSaverAI, your intelligent surplus food rescue copilot.";
    if (currentUser.role === 'donor') {
      roleGreeting += ` Welcome back ${currentUser.name}! I can help you estimate safe-until deadlines, packaging guidelines, and match you with nearby verified Bengaluru NGOs.`;
    } else if (currentUser.role === 'receiver') {
      roleGreeting += ` Hello ${currentUser.name}! There are currently ${listings.filter(l => l.status === 'available').length} available food lots in Bengaluru. I can help identify the most urgent food and plan your transport routes.`;
    } else {
      roleGreeting += ` Greetings ${currentUser.name}! I can suggest optimized delivery routes and vehicle packing safety tips for your volunteer runs.`;
    }

    return [
      {
        id: 'msg-1',
        sender: 'ai',
        text: roleGreeting,
        timestamp: 'Just now'
      }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice recognition via Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Generate intelligent suggestions & responses
  const generateAiResponse = (query: string): { text: string; action?: ChatMessage['action'] } => {
    const q = query.toLowerCase();

    // 1. Route or Navigation queries
    if (q.includes('route') || q.includes('direction') || q.includes('map') || q.includes('where')) {
      const nearestAvailable = listings.find((l) => l.status === 'available');
      if (nearestAvailable) {
        return {
          text: `I've mapped out the route to the nearest available surplus lot: "${nearestAvailable.title}" at ${nearestAvailable.pickupAddress}. Our turn-by-turn guidance is ready with both car/van and 2-wheeler times.`,
          action: {
            label: `View Route to ${nearestAvailable.title.split(',')[0]}`,
            actionType: 'guide_route',
            payload: nearestAvailable
          }
        };
      }
      return {
        text: "You can explore all live pickup locations on the Surplus Food Map. Click any listing to immediately preview the driving route and turn-by-turn steps.",
        action: {
          label: "Open Live Map",
          actionType: 'navigate',
          payload: 'browse'
        }
      };
    }

    // 2. Urgent food queries
    if (q.includes('urgent') || q.includes('expir') || q.includes('quick') || q.includes('soon')) {
      const urgentLots = listings.filter((l) => {
        if (l.status !== 'available') return false;
        const diff = (new Date(l.safeUntil).getTime() - Date.now()) / (3600 * 1000);
        return diff > 0 && diff <= 3;
      });

      if (urgentLots.length > 0) {
        const top = urgentLots[0];
        return {
          text: `🚨 Urgent Action Alert: We have ${urgentLots.length} lot(s) expiring within 3 hours! High priority: "${top.title}" (~${top.quantityPlates} plates) at ${top.pickupAddress}. Rescuing this immediately prevents it from becoming waste!`,
          action: {
            label: `Book & Rescue ${top.title.split(',')[0]} Now`,
            actionType: 'guide_route',
            payload: top
          }
        };
      }
      return {
        text: "Currently all active listings have safe consumption buffers over 3 hours. Feel free to browse by diet or highest quantity."
      };
    }

    // 3. Packaging & safety tips
    if (q.includes('pack') || q.includes('store') || q.includes('safe') || q.includes('fssai') || q.includes('temp')) {
      return {
        text: "🛡️ LifeSaverAI Food Safety Protocol:\n• Hot cooked rice/curry must remain at ≥60°C or be distributed within 4 hours at room temp.\n• Pack into food-grade stainless steel or thermal containers in 25-50 plate batches so volunteers can lift them easily.\n• Keep gravies and dry items in separate containers to avoid sogginess.\n• Label containers clearly with Vegetarian / Non-Vegetarian tags."
      };
    }

    // 4. Vehicle / Transport capacity queries
    if (q.includes('vehicle') || q.includes('car') || q.includes('bike') || q.includes('tempo') || q.includes('van') || q.includes('auto')) {
      return {
        text: "🛵 Logistics Capacity Guide:\n• 1 to 40 plates (<16 kg): standard two-wheeler or scooter with thermal bag.\n• 40 to 120 plates (16–50 kg): Auto-rickshaw with rear seat folded.\n• 120 to 500+ plates (>50 kg): Small commercial tempo (Tata Ace / Omni van) with tied containers.",
        action: {
          label: "View Volunteer Delivery Board",
          actionType: 'navigate',
          payload: 'volunteer'
        }
      };
    }

    // 5. Wedding / Banquet schedule queries
    if (q.includes('wedding') || q.includes('banquet') || q.includes('event') || q.includes('hall')) {
      return {
        text: "If you're planning a wedding reception at Palace Grounds or a banquet hall, use 'Event Mode' to schedule surplus 12-24 hours ahead. Verified NGOs will allocate collection vans beforehand so no food is wasted.",
        action: {
          label: "Schedule Future Banquet in Event Mode",
          actionType: 'navigate',
          payload: 'events'
        }
      };
    }

    // 6. Veg / Dietary queries
    if (q.includes('veg') || q.includes('non-veg') || q.includes('diet') || q.includes('halal')) {
      const vegCount = listings.filter((l) => l.status === 'available' && l.foodType === 'veg').length;
      return {
        text: `We currently have ${vegCount} 100% Pure Vegetarian listings available across Bengaluru. All listings feature strict dietary badges and segregated packaging verified by donors.`,
        action: {
          label: "Filter Vegetarian Only on Map",
          actionType: 'navigate',
          payload: 'browse'
        }
      };
    }

    // General fallback response
    return {
      text: `LifeSaverAI Recommendation: Connect with nearby shelters within 5 km to maximize freshness. Would you like to view urgent listings on the map, schedule a future banquet, or inspect safety guidelines?`,
      action: {
        label: "Explore Live Surplus Map",
        actionType: 'navigate',
        payload: 'browse'
      }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(q);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: 'Just now',
        action: response.action
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleExecuteAction = (action: NonNullable<ChatMessage['action']>) => {
    if (action.actionType === 'navigate' && onNavigateTab) {
      onNavigateTab(action.payload);
      setIsOpen(false);
    } else if (action.actionType === 'guide_route') {
      if (onSelectListing && action.payload) {
        onSelectListing(action.payload);
      }
      if (onNavigateTab) {
        onNavigateTab('browse');
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* FLOATING AGENT TRIGGER BUTTON */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[28.8px] bg-[#000000] text-[#ffffff] border border-[#dfdcd5] shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Open LifeSaverAI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <span className="font-davinci text-xs font-normal tracking-wide">
            LifeSaverAI
          </span>

          {urgentCount > 0 && (
            <span className="text-[10px] font-mono bg-rose-600 text-white px-1.5 py-0.2 rounded-full">
              {urgentCount}
            </span>
          )}
        </button>
      </div>

      {/* EXPANDABLE LIFESAVER AI PANEL */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-96 sm:max-h-[640px] sm:rounded-[9px] w-full z-50 card-bone shadow-2xl border border-[#000000] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="p-4 bg-[#000000] text-white flex items-center justify-between border-b border-[#dfdcd5]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-davinci text-sm font-normal text-white flex items-center gap-1.5">
                  LifeSaverAI
                  <span className="text-[9px] font-mono uppercase bg-[#595855] text-white px-1.5 py-0.2 rounded-[28.8px]">
                    v2.4
                  </span>
                </h3>
                <p className="text-[10px] font-sans text-[#c4c3b6]">
                  Surplus Food Rescue & Route Copilot
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#c4c3b6] hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Status Bar */}
          <div className="px-4 py-2 bg-[#dfdcd5] text-[#000000] text-[11px] font-mono flex items-center justify-between border-b border-[#dfdcd5]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#000000]" />
              Role: <strong className="capitalize">{currentUser.role}</strong>
            </span>
            <span className="text-[#595855]">
              {urgentCount} urgent lot(s) nearby
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e7e5e4] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-[9px] max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#000000] text-white'
                      : 'bg-[#ffffff] text-[#000000] border border-[#dfdcd5]'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>

                  {/* Optional Interactive Action Pill */}
                  {msg.action && (
                    <button
                      onClick={() => handleExecuteAction(msg.action!)}
                      className="mt-2.5 w-full btn-pill text-[10px] py-1.5 px-3 flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>{msg.action.label}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] font-mono text-[#808080] mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-[#595855] text-xs p-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000] animate-bounce [animation-delay:0.4s]"></span>
                <span className="font-mono text-[10px] text-[#595855] ml-1">LifeSaverAI is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick One-Tap Suggestion Prompts */}
          <div className="p-2.5 bg-[#dfdcd5] border-t border-[#dfdcd5] flex items-center gap-1.5 overflow-x-auto text-[11px] font-sans">
            <button
              onClick={() => handleSendMessage("Where is the closest urgent food lot?")}
              className="px-2.5 py-1 rounded-[28.8px] bg-[#ffffff] text-[#000000] border border-[#dfdcd5] whitespace-nowrap hover:border-[#000000]"
            >
              🚨 Nearest Urgent Food
            </button>
            <button
              onClick={() => handleSendMessage("Guide me the route to available food")}
              className="px-2.5 py-1 rounded-[28.8px] bg-[#ffffff] text-[#000000] border border-[#dfdcd5] whitespace-nowrap hover:border-[#000000]"
            >
              🧭 Route Guidance
            </button>
            <button
              onClick={() => handleSendMessage("How should I pack and store cooked banquet food?")}
              className="px-2.5 py-1 rounded-[28.8px] bg-[#ffffff] text-[#000000] border border-[#dfdcd5] whitespace-nowrap hover:border-[#000000]"
            >
              🍱 Packaging Safety Tips
            </button>
            <button
              onClick={() => handleSendMessage("What vehicle size is needed for 80 plates?")}
              className="px-2.5 py-1 rounded-[28.8px] bg-[#ffffff] text-[#000000] border border-[#dfdcd5] whitespace-nowrap hover:border-[#000000]"
            >
              🛵 Vehicle Capacity
            </button>
          </div>

          {/* User Input Bar with Voice Input */}
          <div className="p-3 bg-[#ffffff] border-t border-[#dfdcd5] flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-full border transition-colors ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-[#e7e5e4] text-[#000000] border-[#dfdcd5] hover:bg-[#dfdcd5]'
              }`}
              title="Voice Input (English / Hindi / Kannada)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening..." : "Ask LifeSaverAI anything..."}
              className="flex-1 text-xs px-3 py-2 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-hidden focus:border-[#000000] font-sans"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-2 rounded-full bg-[#000000] text-white disabled:opacity-30 transition-opacity cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
