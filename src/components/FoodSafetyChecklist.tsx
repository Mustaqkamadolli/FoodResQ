import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { Check } from 'lucide-react';

interface FoodSafetyChecklistProps {
  checkedState: [boolean, boolean, boolean, boolean];
  onChange: (index: number, val: boolean) => void;
  currentLang: SupportedLanguage;
}

export const FoodSafetyChecklist: React.FC<FoodSafetyChecklistProps> = ({
  checkedState,
  onChange,
  currentLang
}) => {
  const t = translations[currentLang];
  const allChecked = checkedState.every(Boolean);

  const items = [
    { title: "Freshly Cooked", desc: t.safetyCheck1 },
    { title: "Proper Temperature & Storage", desc: t.safetyCheck2 },
    { title: "Untouched by Diners", desc: t.safetyCheck3 },
    { title: "Hygienically Packed", desc: t.safetyCheck4 }
  ];

  return (
    <div className="bg-[#e7e5e4] text-[#000000] rounded-[9px] p-6 border border-[#dfdcd5] space-y-4 font-grotesk">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-[#595855] block mb-0.5">
            MANDATORY PROTOCOL
          </span>
          <h4 className="font-davinci text-xl font-medium tracking-tight text-[#000000]">
            {t.safetyChecklistTitle}
          </h4>
          <p className="text-xs text-[#595855] mt-0.5">
            Required attestation to safeguard receivers and food health.
          </p>
        </div>

        <span className="text-[10px] font-medium px-2.5 py-1 rounded-[28.8px] bg-[#c4c3b6] text-[#000000] border border-[#dfdcd5]">
          {checkedState.filter(Boolean).length} / 4 Attested
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isTicked = checkedState[idx];
          return (
            <label
              key={idx}
              className={`flex items-start gap-3 p-3.5 rounded-[9px] border transition-colors cursor-pointer select-none ${
                isTicked
                  ? 'bg-[#c4c3b6] border-[#000000]'
                  : 'bg-[#e7e5e4] border-[#dfdcd5] hover:bg-[#dfdcd5]/50'
              }`}
            >
              <input
                type="checkbox"
                checked={isTicked}
                onChange={(e) => onChange(idx, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-[2px] accent-black cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-medium text-xs text-[#000000]">
                  {item.title}
                </div>
                <p className="text-[11px] text-[#595855] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              {isTicked && (
                <Check className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
              )}
            </label>
          );
        })}
      </div>

      {!allChecked && (
        <div className="text-xs text-[#595855] p-3 rounded-[9px] bg-[#dfdcd5]/50 border border-[#dfdcd5]">
          {t.safetyCheckWarning}
        </div>
      )}
    </div>
  );
};
