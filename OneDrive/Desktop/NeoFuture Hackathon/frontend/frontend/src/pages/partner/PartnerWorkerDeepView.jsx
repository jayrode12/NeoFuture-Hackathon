import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PartnerWorkerDeepView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/partner/workers/${id}`);
        const data = await response.json();
        setWorker(data);
      } catch (err) {
        console.error("Worker fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-3xl font-headline font-bold text-indigo-900">Worker Profile Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 px-8 py-3 bg-indigo-900 text-white rounded-full">Go Back</button>
      </div>
    );
  }


  return (
    <div className="p-8 lg:p-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 pt-8">
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-indigo-900 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label font-bold text-sm tracking-widest uppercase">Back to Worker List</span>
          </button>
          <h2 className="font-headline font-bold text-5xl tracking-tight text-on-surface">{worker.fullName}</h2>
          <div className="flex items-center gap-6">
            <span className="bg-indigo-100 text-indigo-900 px-4 py-1.5 rounded-full text-sm font-bold">UID: {worker.workerId}</span>
            <span className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              Identity {worker.kyc_status}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 font-headline font-bold text-indigo-900 hover:bg-surface-container transition-colors rounded-xl">
            Download Dossier
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Score & Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="material-symbols-outlined text-8xl">security</span>
            </div>
            <h3 className="font-bold text-lg mb-8 uppercase tracking-widest text-on-surface-variant">Trust Score</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-7xl font-headline font-extrabold text-indigo-900">{worker.trust_score}</span>
              <span className="text-on-surface-variant font-medium">/ 1000</span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden mb-6">
              <div className={`h-full rounded-full ${worker.trust_score > 800 ? 'bg-indigo-600 w-[84%]' : 'bg-amber-500 w-[60%]'}`}></div>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              {worker.fullName} ranks in the <strong className="text-indigo-900">top {worker.trust_score > 800 ? '5%' : 'high performance'}</strong> bracket of informal specialists.
            </p>
          </div>

          <div className="bg-surface-container-low p-10 rounded-xl text-left">
            <h3 className="font-bold text-lg mb-6 uppercase tracking-widest text-on-surface-variant">Activity Summary</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
                <div>
                  <p className="font-bold text-indigo-900 text-sm">Last Profile Update</p>
                  <p className="text-xs text-on-surface-variant">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Data */}
        <div className="col-span-12 lg:col-span-8 space-y-8 text-left">
          <div className="bg-surface-container-lowest p-12 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Primary Occupation</label>
                <p className="font-headline text-xl font-bold">{worker.profession || 'Specialist'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Years of Experience</label>
                <p className="font-headline text-xl font-bold">{worker.experience || 'Verified'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Location</label>
                <p className="font-headline text-xl font-bold">{worker.location || 'Mumbai, MH'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contact Email</label>
                <p className="font-headline text-xl font-bold">{worker.email}</p>
              </div>
            </div>
            <div className="space-y-4 pt-8 border-t border-surface-container">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Bio & History</label>
              <p className="text-lg leading-relaxed text-on-surface-variant italic">"{worker.bio || 'Professional worker with verified skill record and consistent attendance history across multiple urban infrastructure projects.'}"</p>
            </div>
          </div>

          <div className="bg-surface-container-high p-12 rounded-xl border-l-8 border-indigo-900">
            <h3 className="font-headline font-bold text-2xl mb-8">Underwriter Decision</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reviewer Notes</label>
                <textarea 
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-6 min-h-[120px] focus:ring-2 focus:ring-indigo-500 shadow-inner" 
                  placeholder="Enter internal notes for this worker..."
                ></textarea>
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button className="flex-1 py-6 bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve for Scheme Matcher
                </button>
                <button className="flex-1 py-6 bg-surface-container-lowest text-error border border-error/50 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-colors hover:bg-error-container/20">
                  <span className="material-symbols-outlined">cancel</span>
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
