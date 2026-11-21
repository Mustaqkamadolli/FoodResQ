import React, { useState } from 'react';
import { ImpactStats, UserProfile, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  Award,
  Download
} from 'lucide-react';

interface ImpactViewProps {
  impact: ImpactStats;
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  onOpenCertificate: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({
  impact,
  currentUser,
  currentLang,
  onOpenCertificate
}) => {
  const [tab, setTab] = useState<'city' | 'personal'>('city');

  const leaderboards = [
    { rank: 1, name: "Palace Grounds Banquet Belt", meals: 24500, tier: "Gold", org: "Wedding Coalition" },
    { rank: 2, name: "The Grand Palace Caterers", meals: 18400, tier: "Gold", org: "Bellary Road" },
    { rank: 3, name: "Infosys Campus Sodexo Dining", meals: 14200, tier: "Gold", org: "Electronic City" },
    { rank: 4, name: "Royal Sagar Banquets (Priya)", meals: 3450, tier: "Silver", org: "Malleshwaram" },
    { rank: 5, name: "PES University Student Mess", meals: 2890, tier: "Silver", org: "Banashankari" },
    { rank: 6, name: "Koramangala Social Banquets", meals: 1980, tier: "Bronze", org: "Koramangala" },
    { rank: 7, name: "Marathahalli Wedding Mahal", meals: 1420, tier: "Bronze", org: "Outer Ring Road" }
  ];

  const maxWeeklyMeals = Math.max(...impact.weeklyData.map((d) => d.meals), 1);
  const treesEquiv = Math.round(impact.totalCo2AvoidedKg / 22);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
            Environmental & Social Accounting
          </span>
          <h1 className="text-3xl sm:text-4xl font-davinci font-normal text-[#000000] mt-1">
            Bengaluru Food Rescue Impact
          </h1>
          <p className="text-xs font-sans text-[#595855] mt-0.5">
            Real-time accounting of surplus meals diverted from landfills to hungry people.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#dfdcd5] p-1 rounded-[28.8px] text-xs font-sans self-start sm:self-auto">
          <button
            onClick={() => setTab('city')}
            className={`px-4 py-1.5 rounded-[28.8px] transition-all ${
              tab === 'city' ? 'bg-[#000000] text-[#ffffff]' : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            City-Wide Metrics
          </button>
          <button
            onClick={() => setTab('personal')}
            className={`px-4 py-1.5 rounded-[28.8px] transition-all ${
              tab === 'personal' ? 'bg-[#000000] text-[#ffffff]' : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Personal Ledger
          </button>
        </div>
      </div>

      {tab === 'city' ? (
        <>
          {/* Main 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="card-bone p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                Total Meals Saved
              </span>
              <p className="text-3xl sm:text-4xl font-mono text-[#000000]">
                {impact.totalMealsSaved.toLocaleString()}
              </p>
              <span className="text-[11px] font-sans text-[#595855] block">
                Directly distributed to shelters
              </span>
            </div>

            <div className="card-bone p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                Food Diverted (kg)
              </span>
              <p className="text-3xl sm:text-4xl font-mono text-[#000000]">
                {impact.totalKgRescued.toLocaleString()} kg
              </p>
              <span className="text-[11px] font-sans text-[#595855] block">
                Saved from landfills
              </span>
            </div>

            <div className="card-bone p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                CO₂ Emissions Avoided
              </span>
              <p className="text-3xl sm:text-4xl font-mono text-[#000000]">
                {impact.totalCo2AvoidedKg.toLocaleString()} kg
              </p>
              <span className="text-[11px] font-sans text-[#595855] block">
                2.5 kg CO₂e / kg food preserved
              </span>
            </div>

            <div className="card-bone p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                Tree Carbon Offset
              </span>
              <p className="text-3xl sm:text-4xl font-mono text-[#000000]">
                ~{treesEquiv.toLocaleString()}
              </p>
              <span className="text-[11px] font-sans text-[#595855] block">
                Equivalent seedlings planted
              </span>
            </div>

          </div>

          {/* WEEKLY RESCUE BAR CHART */}
          <div className="card-bone p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-davinci font-normal text-[#000000]">
                  Weekly Food Rescue Trend (Bengaluru Metro)
                </h3>
                <p className="text-xs font-sans text-[#595855]">
                  Surplus rescue peaks during Friday - Sunday wedding & banquet seasons.
                </p>
              </div>
              <span className="text-xs font-mono text-[#000000] bg-[#dfdcd5] px-3 py-1 rounded-[28.8px]">
                Active Week
              </span>
            </div>

            {/* Custom Bar Chart */}
            <div className="pt-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-6 items-end h-48 sm:h-56 pb-2 border-b border-[#dfdcd5]">
                {impact.weeklyData.map((item, idx) => {
                  const heightPercent = Math.round((item.meals / maxWeeklyMeals) * 100);
                  const isWeekend = item.day === 'Sat' || item.day === 'Sun';

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-[#595855] group-hover:text-[#000000] transition-colors">
                        {item.meals.toLocaleString()}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[48px] rounded-t-[4px] transition-all duration-500 ${
                          isWeekend
                            ? 'bg-[#000000]'
                            : 'bg-[#595855] group-hover:bg-[#000000]'
                        }`}
                      />
                      <span className="text-xs font-mono text-[#000000]">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TOP DONORS LEADERBOARD */}
          <div className="card-bone p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-davinci font-normal text-[#000000]">
                  Top Food Heroes Leaderboard (Bengaluru)
                </h3>
                <p className="text-xs font-sans text-[#595855]">
                  Recognizing caterers, wedding halls, and corporate messes with highest lifetime rescues.
                </p>
              </div>

              <Award className="w-5 h-5 text-[#000000]" />
            </div>

            <div className="divide-y divide-[#dfdcd5]">
              {leaderboards.map((row) => (
                <div
                  key={row.rank}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-[#000000] flex items-center justify-center font-mono text-xs text-[#000000]">
                      {row.rank}
                    </span>

                    <div>
                      <h4 className="font-davinci text-sm text-[#000000]">
                        {row.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#595855]">{row.org}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[#000000] text-sm block">
                      {row.meals.toLocaleString()} meals
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000]">
                      ★ {row.tier} Hero
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* PERSONAL IMPACT TAB */
        <div className="space-y-6">
          <div className="card-bone p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#595855]">Personal Rescue Record</span>
                <h2 className="text-3xl font-davinci font-normal mt-1 text-[#000000]">{currentUser.name}</h2>
                <p className="text-xs font-mono text-[#595855]">Role: {currentUser.role.toUpperCase()}</p>
              </div>

              <button
                onClick={onOpenCertificate}
                className="btn-pill flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Food Hero Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#dfdcd5]">
              <div className="p-4 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5]">
                <span className="text-[10px] font-mono text-[#595855] uppercase">Meals Donated / Rescued</span>
                <p className="text-2xl font-mono text-[#000000] mt-1">{currentUser.mealsDonated || 3450}</p>
              </div>

              <div className="p-4 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5]">
                <span className="text-[10px] font-mono text-[#595855] uppercase">Kg Surplus Handled</span>
                <p className="text-2xl font-mono text-[#000000] mt-1">{currentUser.kgRescued || 1380} kg</p>
              </div>

              <div className="p-4 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5]">
                <span className="text-[10px] font-mono text-[#595855] uppercase">Hero Tier</span>
                <p className="text-2xl font-mono text-[#000000] mt-1">★ {currentUser.badgeLevel || 'Gold'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
