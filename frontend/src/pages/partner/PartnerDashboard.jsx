import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const userName = user?.name || "Acme Partner Corp";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/partner/metrics');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalWorkers: 0,
    growthRate: 0,
    averageScore: 0,
    pendingApplications: 0,
    approvalRate: 0
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pt-16">
      {/* Hero Header Section */}
      <div className="mb-12 animate-fade-in text-left border-b border-surface-container pb-6">
        <h2 className="text-5xl font-headline font-extrabold text-indigo-900 tracking-tight">
          Welcome back, {userName}
        </h2>
      </div>

      {/* Metric List Format */}
      <div className="flex flex-col md:flex-row gap-0 mb-12 border border-surface-container-high rounded-xl overflow-hidden shadow-sm divide-y md:divide-y-0 md:divide-x divide-surface-container-high bg-white">
        <div className="flex-1 p-6 flex justify-between items-center transition-colors hover:bg-slate-50 cursor-default">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Workers</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-indigo-900">{metrics.totalWorkers.toLocaleString()}</span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{metrics.growthRate}%</span>
          </div>
        </div>

        <div className="flex-1 p-6 flex justify-between items-center transition-colors hover:bg-slate-50 cursor-default">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Avg Score</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-indigo-900">{metrics.averageScore}</span>
          </div>
        </div>

        <div className="flex-1 p-6 flex justify-between items-center transition-colors hover:bg-slate-50 cursor-default">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Applications</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-indigo-900">{metrics.pendingApplications}</span>
          </div>
        </div>

        <div className="flex-1 p-6 flex justify-between items-center transition-colors hover:bg-slate-50 cursor-default">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Approval Rate</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-indigo-900">{metrics.approvalRate}%</span>
            <span className="material-symbols-outlined text-emerald-500">verified</span>
          </div>
        </div>
      </div>

      {/* Asymmetric Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Score Distribution (Visual Chart Area) */}
        <div className="lg:col-span-7 overflow-hidden relative min-h-[500px] border-r border-surface-container pr-8">
          <div className="flex justify-between items-end mb-12 border-b border-surface-container pb-4">
            <div>
              <h3 className="text-2xl font-headline font-bold text-indigo-900 mb-1">Score Distribution</h3>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low rounded-full text-xs font-bold text-indigo-900 border border-slate-200">Current Month</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-4 px-4">
            <div className="w-full flex flex-col items-center gap-4 group">
              <div className="w-full bg-slate-100 rounded-lg relative overflow-hidden h-48 transition-colors group-hover:bg-slate-200">
                <div className="absolute bottom-0 w-full bg-slate-400 rounded-b-lg h-[30%]"></div>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Low</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 group">
              <div className="w-full bg-slate-100 rounded-lg relative overflow-hidden h-48 transition-colors group-hover:bg-slate-200">
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-900 to-indigo-600 rounded-b-lg h-[85%]"></div>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medium</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 group">
              <div className="w-full bg-slate-100 rounded-lg relative overflow-hidden h-48 transition-colors group-hover:bg-slate-200">
                <div className="absolute bottom-0 w-full bg-secondary-container rounded-b-lg h-[65%]"></div>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">High</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-surface-container-low rounded-lg flex items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-indigo-900 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined">info</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <strong className="text-indigo-900">Insight:</strong> Medium-score workers have increased by <span className="font-bold">14%</span> since the last audit. Re-evaluation recommended for high-priority schemes.
            </p>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="pt-4">
            <div className="flex items-center justify-between mb-8 border-b border-surface-container pb-4">
              <h3 className="text-xl font-headline font-bold text-indigo-900">Recent Applications</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All</button>
            </div>
            
            <div className="space-y-6">
              {data?.recentApplications && data.recentApplications.length > 0 ? (
                data.recentApplications.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-indigo-900 font-bold">
                      {item.workerName?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface text-sm">{item.workerName || 'Anonymous Worker'}</h4>
                      <p className="text-xs text-slate-500">{item.schemeName} • {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 bg-${item.status === 'approved' ? 'emerald' : item.status === 'pending' ? 'amber' : 'slate'}-100 text-${item.status === 'approved' ? 'emerald' : item.status === 'pending' ? 'amber' : 'slate'}-700 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant italic">No recent applications found.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-[#747cd3] rounded-sm p-10 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200 block mb-2">Active Scheme</span>
              <h3 className="text-3xl font-headline font-extrabold mb-6">Metropolitan Resilience Grant</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container w-[72%]"></div>
                </div>
                <span className="text-sm font-bold">72%</span>
              </div>
              <button className="bg-white text-indigo-900 px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-slate-100 transition-colors block w-full text-center">
                Review Target Metrics
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
