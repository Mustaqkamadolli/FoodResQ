import React, { useState } from 'react';
import { UserRole, ReceiverType } from '../types';
import { store } from '../services/store';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'gmail' | 'standard'>('gmail');
  const [role, setRole] = useState<UserRole>('donor');
  
  // Gmail & Password states
  const [gmailId, setGmailId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Receiver NGO fields
  const [orgName, setOrgName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [receiverType, setReceiverType] = useState<ReceiverType>('ngo');
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle 1-click Google simulated quick sign-in
  const handleQuickGoogleSignIn = () => {
    const demoGmail = 'mustaq.kamdoli@gmail.com';
    setGmailId(demoGmail);
    setFullName('Mustaq Kamdoli');
    setPassword('FoodResQ@2026');
    setConfirmPassword('FoodResQ@2026');
  };

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedGmail = gmailId.trim();
    if (!trimmedGmail) {
      setErrorMessage("Please enter your Gmail address.");
      return;
    }

    // Auto-append @gmail.com if user only types the username
    let finalGmail = trimmedGmail;
    if (!finalGmail.includes('@')) {
      finalGmail += '@gmail.com';
      setGmailId(finalGmail);
    }

    if (!password || password.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = store.loginWithGmail({
        email: finalGmail,
        password,
        role,
        name: fullName.trim() || undefined,
        phone: phone.trim() || '+91 98450 12345',
        organizationName: orgName.trim() || undefined,
        registrationNumber: regNumber.trim() || undefined,
        receiverType: role === 'receiver' ? receiverType : undefined
      });

      setLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || "Authentication failed.");
        return;
      }

      onSuccess();
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#e7e5e4] text-[#000000] w-full max-w-lg rounded-[9px] p-8 border border-[#dfdcd5] relative shadow-2xl my-8 font-sans space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#595855] hover:text-[#000000] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#595855] block mb-1">
            FoodResQ Bengaluru
          </span>
          <h3 className="font-davinci text-3xl font-medium tracking-tight text-[#000000]">
            Sign In with Gmail
          </h3>
          <p className="text-xs font-sans text-[#595855] mt-1">
            Enter your Gmail ID, set your password, and start rescuing surplus food.
          </p>
        </div>

        {/* 1-Tap Google Quick Sign-In Banner */}
        <div className="p-3 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Multicolored Google 'G' icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div className="text-left">
              <span className="text-xs font-medium text-[#000000] block">
                Direct Google Sign-In
              </span>
              <span className="text-[10px] text-[#595855] block">
                One-tap auto-fill with Gmail ID
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickGoogleSignIn}
            className="px-3 py-1.5 rounded-[28.8px] bg-[#e7e5e4] text-[#000000] border border-[#dfdcd5] text-xs font-sans hover:bg-[#dfdcd5] transition-colors cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleGmailSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#595855] mb-1.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-2.5 rounded-[9px] border text-center transition-colors cursor-pointer ${
                  role === 'donor'
                    ? 'border-[#000000] bg-[#000000] text-white font-medium'
                    : 'border-[#dfdcd5] bg-[#ffffff] text-[#595855]'
                }`}
              >
                <span className="text-xs font-davinci block">Donor</span>
                <span className="text-[9px] opacity-80 block">Weddings / Mess</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('receiver')}
                className={`p-2.5 rounded-[9px] border text-center transition-colors cursor-pointer ${
                  role === 'receiver'
                    ? 'border-[#000000] bg-[#000000] text-white font-medium'
                    : 'border-[#dfdcd5] bg-[#ffffff] text-[#595855]'
                }`}
              >
                <span className="text-xs font-davinci block">Receiver</span>
                <span className="text-[9px] opacity-80 block">NGO / Shelter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`p-2.5 rounded-[9px] border text-center transition-colors cursor-pointer ${
                  role === 'volunteer'
                    ? 'border-[#000000] bg-[#000000] text-white font-medium'
                    : 'border-[#dfdcd5] bg-[#ffffff] text-[#595855]'
                }`}
              >
                <span className="text-xs font-davinci block">Volunteer</span>
                <span className="text-[9px] opacity-80 block">Delivery Driver</span>
              </button>
            </div>
          </div>

          {/* Gmail Address Input */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#000000] mb-1">
              Your Gmail ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#808080] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={gmailId}
                onChange={(e) => setGmailId(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-hidden focus:border-[#000000] font-sans"
              />
            </div>
          </div>

          {/* Password Input (Set Password & Login) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#000000]">
                  Set Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#595855] hover:text-[#000000] flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#808080] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set your password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-hidden focus:border-[#000000] font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#000000] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#808080] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-hidden focus:border-[#000000] font-sans"
                />
              </div>
            </div>
          </div>

          {/* Optional Display Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#595855] mb-1">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mustaq Kamdoli"
                className="w-full text-xs px-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#595855] mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full text-xs px-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
              />
            </div>
          </div>

          {/* Conditional NGO verification fields if role === receiver */}
          {role === 'receiver' && (
            <div className="p-3 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#000000]">
                <ShieldCheck className="w-4 h-4" />
                <span>NGO Verification Details</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#595855] mb-1">
                  Organization / Shelter Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Sneha Sadan Care Home"
                  className="w-full text-xs p-2 rounded-[6px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#595855] mb-1">
                    Registration / 12A ID
                  </label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="KA/2026/0419"
                    className="w-full text-xs p-2 rounded-[6px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#595855] mb-1">
                    Entity Type
                  </label>
                  <select
                    value={receiverType}
                    onChange={(e) => setReceiverType(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-[6px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000]"
                  >
                    <option value="ngo">Registered NGO</option>
                    <option value="anathashram">Anathashram / Shelter</option>
                    <option value="individual">Community Kitchen</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <p className="text-xs text-[#000000] bg-[#ffffff] p-2.5 rounded-[6px] border border-rose-300 font-sans">
              ⚠️ {errorMessage}
            </p>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-pill w-full py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign In with Gmail & Password</span>
              </>
            )}
          </button>

          <p className="text-[11px] font-mono text-[#595855] text-center">
            Your Gmail and password will be remembered for your session.
          </p>

        </form>

      </div>
    </div>
  );
};
