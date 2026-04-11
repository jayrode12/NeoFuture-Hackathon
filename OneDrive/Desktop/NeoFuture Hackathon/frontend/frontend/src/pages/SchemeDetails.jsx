import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VoiceAssistant from '../components/VoiceAssistant';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';

export default function SchemeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { scheme } = location.state || {}; // Get scheme data from navigation state
  const [applying, setApplying] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    if (scheme && token) {
      fetchInsights();
    }
  }, [scheme, token]);

  const fetchInsights = async () => {
    try {
      const data = await schemeService.getSchemeInsights(scheme.schemeId, token);
      setInsights(data);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  // If no scheme was passed, redirect back
  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Scheme Details Found</h2>
          <Link to="/matched-schemes" className="text-indigo-600 font-bold hover:underline">Go back to schemes</Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await schemeService.applyForScheme(scheme.schemeId, token);
      if (response.status === 'success') {
        navigate('/my-applications?success=application_submitted');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col">
      <Header variant="protected" />
      <main className="pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-2 mb-6 text-indigo-900/60 font-label font-medium uppercase tracking-widest text-[10px]">
            <Link to="/matched-schemes" className="flex items-center font-bold text-indigo-900 hover:underline">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="ml-1">All Schemes</span>
            </Link>
            <span className="mx-2">/</span>
            <span>{scheme.category || 'General'}</span>
          </div>
          <h1 className="font-headline font-bold text-5xl md:text-7xl text-on-primary-fixed mb-8 leading-[1.1] tracking-tight">
            {scheme.name}
          </h1>
          <div className="flex flex-wrap gap-4">
            <span className="px-5 py-2 bg-secondary-container text-on-secondary-container rounded-full font-label font-semibold text-xs">Recommended for you</span>
            <span className="px-5 py-2 bg-surface-container text-on-surface-variant rounded-full font-label font-semibold text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              Provider: {scheme.provider}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            <section className="bg-surface-container-lowest rounded-xl p-10 md:pt-16 md:pl-12 md:pr-24 md:pb-16 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
              <h2 className="font-headline font-bold text-3xl text-on-surface mb-8">About Scheme</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                {scheme.description || 'This scheme is designed to provide financial support and stability to workers in the informal sector. It offers low-interest credit and direct benefit transfers to help entrepreneurs grow their business.'}
              </p>
            </section>

            <section id="benefits">
              <h2 className="font-headline font-bold text-3xl text-on-surface mb-8 ml-4">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-container text-white rounded-lg p-8 flex flex-col justify-between h-64">
                  <span className="material-symbols-outlined text-4xl text-secondary-fixed-dim" style={{fontVariationSettings: "'FILL' 1"}}>sell</span>
                  <div>
                    <h3 className="font-headline font-bold text-xl mb-2">Benefit Amount</h3>
                    <p className="text-2xl font-extrabold text-on-primary-container">{scheme.amount}</p>
                    <p className="text-sm text-on-primary-container/80 mt-2">Directly credited to your verified UPI/Bank account.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest rounded-lg p-8 border border-outline-variant/15 flex flex-col justify-between h-64">
                  <span className="material-symbols-outlined text-4xl text-indigo-900">analytics</span>
                  <div>
                    <h3 className="font-headline font-bold text-xl mb-2 text-indigo-900">Eligibility Score</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Required Trust Score (IWTS): <strong>{scheme.minScore}</strong>. Your profile currently matches high-priority selection.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <h3 className="font-headline font-bold text-xl mb-6">Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-indigo-900">badge</span>
                  <p className="font-label font-bold text-sm">Identity Proof (Aadhaar)</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-indigo-900">verified</span>
                  <p className="font-label font-bold text-sm">Financial Identity VEP</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/30">
                <p className="text-xs text-on-surface-variant leading-relaxed">By applying, you authorize the platform to share your verified worker identity with {scheme.provider} for scheme induction.</p>
              </div>
            </div>

            {/* AI Model Insights Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/10 blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-secondary-fixed animate-pulse">psychology</span>
                  <h3 className="font-headline font-bold text-xl">Model Intelligence</h3>
                </div>

                {loadingInsights ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-6 w-6 border-2 border-secondary-fixed border-t-transparent rounded-full"></div>
                  </div>
                ) : insights ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-indigo-200/60 font-medium mb-1">Your Trust Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-secondary-fixed">{insights.current_score}</span>
                        <span className="text-sm text-indigo-200/60 mb-1">/ 100</span>
                      </div>
                    </div>

                    {insights.next_best && insights.next_best.name && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase font-bold text-indigo-300 mb-2">Next Milestone</p>
                        <p className="text-sm font-bold mb-1">{insights.next_best.name}</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div 
                            className="bg-secondary-fixed h-full transition-all duration-1000" 
                            style={{ width: `${(insights.current_score / insights.next_best.required_score) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-indigo-200/60 mt-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">info</span>
                          Need {insights.next_best.gap} more points to unlock
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs uppercase font-bold text-indigo-300 mb-4 tracking-wider">Fastest Path to Upgrade</h4>
                      <ul className="space-y-3">
                        {insights.improvement_path.map((item, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-3 group/item">
                            <span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5 group-hover/item:scale-125 transition-transform">bolt</span>
                            <div>
                              <p className="font-semibold">{item.action}</p>
                              <p className="text-[10px] text-indigo-200/60 uppercase tracking-tighter">{item.impact}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-indigo-200/60">No AI insights available for this profile.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md py-6 px-8 border-t border-outline-variant/10 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="hidden md:block">
            <p className="font-headline font-bold text-indigo-900">{scheme.name}</p>
            <p className="text-sm text-on-surface-variant">Benefit: {scheme.amount}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleApply}
              disabled={applying}
              className="flex-1 md:px-12 py-4 bg-secondary-container text-on-secondary-container rounded-full font-headline font-extrabold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {applying ? <div className="animate-spin h-6 w-6 border-2 border-indigo-900 border-t-transparent rounded-full"></div> : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
      {/* ── IWTS Voice + Chat Assistant ────────────────────────── */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="mb-8">
          <h2 className="font-headline font-bold text-3xl text-on-surface">Ask the Assistant</h2>
          <p className="text-sm text-on-surface-variant mt-2">
            Discover eligible schemes, understand your trust score, or get guidance — in English, हिंदी, or मराठी.
          </p>
        </div>
        <VoiceAssistant initialScheme={scheme} />
      </section>

      <div className="mb-24"></div>
      <Footer />
    </div>
  );
}
