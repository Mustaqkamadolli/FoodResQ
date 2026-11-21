import React, { useState } from 'react';
import { Star, X, Check } from 'lucide-react';
import { store } from '../services/store';

interface RatingModalProps {
  listingId: string;
  targetUserId: string;
  targetUserName: string;
  isOpen: boolean;
  onClose: () => void;
  onRated?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  listingId,
  targetUserId,
  targetUserName,
  isOpen,
  onClose,
  onRated
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickTags = [
    "Punctual Handover",
    "Hygienically Packed",
    "Generous Quantity",
    "Warm Communication",
    "Pristine Temperature",
    "Reusable Containers"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalComment = selectedTags.length > 0 
      ? `${selectedTags.join(', ')}. ${comment}`
      : comment;

    store.submitRating(listingId, targetUserId, rating, finalComment);
    setSubmitted(true);
    setTimeout(() => {
      if (onRated) onRated();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#e7e5e4] text-[#000000] w-full max-w-md rounded-[9px] p-8 border border-[#dfdcd5] relative shadow-2xl space-y-6 font-grotesk">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#595855] hover:text-[#000000] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full border border-[#000000] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#000000]" />
            </div>
            <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
              Attestation Logged
            </h3>
            <p className="text-xs text-[#595855]">
              Thank you for maintaining trust and provenance in the FoodResQ gallery registry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#595855] block mb-1">
                PATRON REVIEW
              </span>
              <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
                Rate Handover
              </h3>
              <p className="text-xs text-[#595855] mt-1">
                Share provenance feedback regarding {targetUserName}.
              </p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-[#000000] text-[#000000]'
                        : 'text-[#dfdcd5]'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Tags */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-2">
                Quick Observations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] font-grotesk px-2.5 py-1 rounded-[28.8px] transition-colors border cursor-pointer ${
                        isSelected
                          ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                          : 'bg-[#c4c3b6] text-[#000000] border-[#dfdcd5] hover:bg-[#dfdcd5]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#595855] mb-1">
                Folio Commentary
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Punctual handover, food stored in clean stainless vessels..."
                className="w-full text-xs p-3 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-pill w-full py-3"
            >
              Submit Attestation
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
