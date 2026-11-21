import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FoodListing, UserProfile } from '../types';
import { store } from '../services/store';
import { X, Check, Phone, MapPin, Navigation } from 'lucide-react';

interface PickupCodeModalProps {
  listing: FoodListing;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccessCollected?: () => void;
  onViewRoute?: (listing: FoodListing) => void;
}

export const PickupCodeModal: React.FC<PickupCodeModalProps> = ({
  listing,
  currentUser,
  isOpen,
  onClose,
  onSuccessCollected,
  onViewRoute
}) => {
  const [enteredPin, setEnteredPin] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isDonor = currentUser.id === listing.donorId || currentUser.role === 'donor';
  const pickupCode = listing.pickupCode || '8392';

  const handlePinInput = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newPin = [...enteredPin];
    newPin[index] = val;
    setEnteredPin(newPin);
    setErrorMsg(null);

    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyHandover = () => {
    const fullPin = enteredPin.join('');
    if (fullPin.length < 4) {
      setErrorMsg("Please enter all 4 digits of the code.");
      return;
    }

    const result = store.confirmPickupHandover(listing.id, fullPin);
    if (!result.success) {
      setErrorMsg(result.error || "Incorrect code. Please verify with receiver.");
      return;
    }

    setIsSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (onSuccessCollected) onSuccessCollected();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#e7e5e4] text-[#000000] w-full max-w-md rounded-[9px] p-8 border border-[#dfdcd5] relative shadow-2xl space-y-6 font-grotesk">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#595855] hover:text-[#000000] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#000000] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#000000]" />
            </div>
            <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
              Handover Verified
            </h3>
            <p className="text-xs text-[#595855] leading-relaxed">
              Successfully rescued {listing.quantityPlates} meals ({listing.quantityKg} kg). Social and carbon impact folios have been attested.
            </p>
            <button
              onClick={onClose}
              className="btn-pill w-full py-3"
            >
              Done
            </button>
          </div>
        ) : isDonor ? (
          /* DONOR VIEW: ENTER RECEIVER'S CODE TO CONFIRM HANDOVER */
          <div className="space-y-6">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#595855] block mb-1">
                HANDOVER VERIFICATION
              </span>
              <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
                Attest Food Handover
              </h3>
              <p className="text-xs text-[#595855] mt-1">
                Enter the 4-digit security code displayed on the receiver's screen.
              </p>
            </div>

            <div className="p-4 bg-[#c4c3b6] rounded-[9px] border border-[#dfdcd5] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#595855]">Receiver:</span>
                <span className="font-medium text-[#000000]">{listing.bookedByName || 'Verified NGO'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#595855]">Contact:</span>
                <span className="font-medium text-[#000000]">{listing.bookedByPhone || '+91 98450 12345'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#595855]">Quantity:</span>
                <span className="font-medium text-[#000000]">{listing.quantityPlates} Plates ({listing.quantityKg} kg)</span>
              </div>
            </div>

            {/* 4-Digit Input Boxes */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#595855] mb-2 text-center">
                Receiver 4-Digit Code
              </label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-box-${idx}`}
                    type="text"
                    maxLength={1}
                    value={enteredPin[idx]}
                    onChange={(e) => handlePinInput(idx, e.target.value)}
                    className="w-14 h-16 text-center font-davinci text-3xl font-medium rounded-[9px] border border-[#000000] bg-[#ffffff] text-[#000000] outline-none"
                    placeholder="•"
                  />
                ))}
              </div>
              {errorMsg && (
                <p className="text-xs text-[#000000] font-medium text-center mt-2">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              onClick={handleVerifyHandover}
              className="btn-pill w-full py-3.5 tracking-wide text-xs"
            >
              Verify & Complete Handover
            </button>
          </div>
        ) : (
          /* RECEIVER VIEW: DISPLAY 4-DIGIT CODE TICKET */
          <div className="space-y-6 text-center">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#595855] block mb-1">
                SECURED ACCESS TICKET
              </span>
              <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
                Your Pickup Code
              </h3>
              <p className="text-xs text-[#595855] mt-1">
                Present this 4-digit code to donor {listing.donorName} at handover.
              </p>
            </div>

            {/* Big Ticket Display */}
            <div className="p-8 bg-[#c4c3b6] rounded-[9px] border border-[#dfdcd5]">
              <div className="font-davinci text-5xl font-medium tracking-[0.25em] text-[#000000] select-all">
                {pickupCode}
              </div>
              <span className="font-grotesk text-[10px] uppercase tracking-widest text-[#595855] block mt-2">
                CRYPTOGRAPHIC HANDOVER PIN
              </span>
            </div>

            {/* Pickup Details Card */}
            <div className="p-4 bg-[#ebebeb] rounded-[9px] border border-[#dfdcd5] text-left text-xs space-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#595855] block">Pickup Address:</span>
                <p className="font-medium text-[#000000]">{listing.pickupAddress}</p>
              </div>

              <div className="pt-2 border-t border-[#dfdcd5] flex justify-between">
                <span className="text-[#595855]">Donor Phone:</span>
                <span className="font-medium text-[#000000]">{listing.donorPhone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {onViewRoute && (
                <button
                  onClick={() => {
                    onClose();
                    onViewRoute(listing);
                  }}
                  className="btn-pill flex-1 py-3 flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Guide Route to Donor</span>
                </button>
              )}
              <button
                onClick={onClose}
                className={`py-3 rounded-[28.8px] text-xs transition-colors ${
                  onViewRoute
                    ? 'px-4 border border-[#dfdcd5] bg-[#ffffff] text-[#000000] hover:bg-[#dfdcd5]'
                    : 'btn-pill w-full'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
