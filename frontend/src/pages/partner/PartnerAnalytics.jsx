import React, { useState, useEffect } from 'react';

export default function PartnerAnalytics() {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/partner/analytics/funnel');
        const data = await response.json();
        if (Array.isArray(data)) {
          setFunnelData(data);
        } else {
          setFunnelData([]);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setFunnelData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="pt-12 pb-24 px-8 lg:px-16 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-14 border-b border-surface-container pb-6">
        <span className="text-on-primary-container font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Intelligence Reports</span>
        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">Analytics Dashboard</h1>
      </header>

      {/* Hero Graph Area */}
      <div className="overflow-hidden relative mb-12 min-h-[400px] border-b border-surface-container pb-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-2xl font-headline font-bold text-indigo-900 mb-1">Scheme Funnel Acquisition Rate</h3>
          </div>
          <div className="flex gap-2 text-sm font-bold">
            <span className="px-4 py-2 bg-indigo-50 text-indigo-900 rounded-md cursor-pointer border border-indigo-200">1Y</span>
            <span className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-md cursor-pointer transition-colors">6M</span>
            <span className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-md cursor-pointer transition-colors">30D</span>
          </div>
        </div>
        
        {/* Real Chart mapping */}
        <div className="h-64 flex items-end justify-between border-b border-l border-slate-200 pb-0 pl-4 px-4 gap-4">
          {loading ? (
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium italic">Calculating ecosystem impact...</div>
          ) : (
            funnelData.slice(0, 12).map((item, i) => (
              <div key={i} className="w-full h-full flex items-end justify-center group relative cursor-pointer">
                <div 
                  className={`w-4/5 rounded-t-sm transition-all duration-500 bg-indigo-600 group-hover:bg-indigo-400 group-hover:scale-x-110`}
                  style={{ height: `${Math.min(item.count * 10, 100)}%` }}
                ></div>
                {/* Tooltip on hover */}
                <div className="absolute -top-10 bg-indigo-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  {item.month || 'Month'}: {item.count} Apps
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between px-4 pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>{funnelData[0]?.month || 'Start Period'}</span>
          <span>{funnelData[Math.floor(funnelData.length/2)]?.month || 'Mid Period'}</span>
          <span>{funnelData[funnelData.length-1]?.month || 'Current Period'}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col md:flex-row justify-between items-center border border-surface-container-high transition-colors">
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-4xl text-indigo-900 border-r border-slate-200 pr-6">bolt</span>
            <div>
              <h4 className="text-xl font-bold text-indigo-900 mb-1">High Predictability</h4>
            </div>
          </div>
          <button className="text-xs font-bold bg-indigo-900 text-white px-6 py-2 rounded-full uppercase mt-4 md:mt-0 tracking-widest shadow hover:bg-indigo-800 transition-colors">
            Review Breakdown
          </button>
        </div>

        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-8 border border-surface-container-high transition-colors">
          <div className="flex flex-col">
            <h4 className="font-bold text-on-surface mb-2">Bottleneck Analysis</h4>
          </div>
          <div className="flex flex-1 gap-6 w-full divide-x divide-surface-container">
            <div className="flex justify-between items-center text-sm flex-1 pl-4">
               <span className="text-slate-600">Verification</span>
               <span className="font-bold text-error">+4 Days Avg</span>
            </div>
            <div className="flex justify-between items-center text-sm flex-1 pl-6">
               <span className="text-slate-600">ID Sync</span>
               <span className="font-bold text-indigo-900">Optimal (&lt;1 hr)</span>
            </div>
            <div className="flex justify-between items-center text-sm flex-1 pl-6">
               <span className="text-slate-600">Underwriter</span>
               <span className="font-bold text-amber-600">+1 Day Avg</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-8 border border-surface-container-high transition-colors">
          <div className="flex flex-col">
            <h4 className="font-bold text-on-surface mb-2">Application Sources</h4>
          </div>
          <div className="flex flex-1 justify-end gap-4 w-full">
             <span className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded">Mumbai (45%)</span>
             <span className="text-sm px-4 py-2 bg-amber-50 text-amber-700 font-bold rounded">Pune (30%)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
