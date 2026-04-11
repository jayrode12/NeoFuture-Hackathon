import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegistrationProgress from '../components/RegistrationProgress';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function TrustScore() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        // Fetch specific score from backend using workerId or from context if available
        const response = await fetch(`http://localhost:8000/api/scores/${user?.workerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setScoreData(data);
      } catch (err) {
        console.error("Failed to fetch score:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.workerId) {
      fetchScore();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const handleShare = () => {
    navigate('/matched-schemes');
  };

  const score = scoreData?.iwts_score || 0;
  const band = scoreData?.score_band || "CALCULATING";
  const breakdown = scoreData?.breakdown || { financial: 0, social: 0, reliability: 0 };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <Header variant="protected" />
      <RegistrationProgress />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
             <p className="mt-4 text-on-surface-variant font-bold">Calculating your Invisible Trust Score...</p>
          </div>
        ) : (
        <>
        {/* Hero Section: Trust Score Gauge */}
        <section className="flex flex-col md:flex-row items-center gap-16 mb-24">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 rounded-full flex items-center justify-center shadow-2xl p-4 bg-surface-container-lowest">
              {/* Gauge Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full opacity-20"
                style={{ background: `conic-gradient(from 180deg, #fdc002 ${score}%, #eeeeee 0deg)` }}
              ></div>
              {/* Central Score Display */}
              <div className="relative bg-surface-container-lowest w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="font-headline text-8xl font-extrabold text-primary-container tracking-tighter">{score}</span>
                <span className="font-headline font-bold text-secondary text-2xl tracking-widest mt-[-0.5rem] uppercase">{band}</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-left space-y-6">
            <div className="space-y-2">
              <span className="inline-block py-1 px-4 bg-secondary-container text-on-secondary-container font-label text-xs font-bold rounded-full uppercase">Verified {user?.workType}</span>
              <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-background tracking-tight">{user?.name || 'Worker'}</h1>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              Your Trust Score is a dynamic reflection of your professional reliability and verified history. High scores unlock priority access to government schemes and premium job listings.
            </p>
            <div className="pt-4">
              <button 
                onClick={handleShare}
                className="bg-gradient-to-br from-primary-container to-on-primary-container text-on-primary font-headline font-bold py-5 px-10 rounded-xl shadow-xl hover:scale-105 transition-transform"
              >
                Find Schemes
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid: Breakdown & Explanation */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          {/* Score Breakdown */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-10 md:p-14 rounded-xl shadow-sm">
            <h3 className="font-headline text-3xl font-bold mb-10 text-primary-container">Breakdown</h3>
            <div className="space-y-10">
              {/* Item: UPI History */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-600">payments</span>
                    <span className="font-bold text-on-surface">Financial Credibility</span>
                  </div>
                  <span className="font-mono font-bold text-on-surface-variant text-sm">{breakdown.financial}/100</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: `${breakdown.financial}%` }}></div>
                </div>
              </div>
              {/* Item: Peer Recommendations */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-600">group</span>
                    <span className="font-bold text-on-surface">Social Capital</span>
                  </div>
                  <span className="font-mono font-bold text-on-surface-variant text-sm">{breakdown.social}/100</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: `${breakdown.social}%` }}></div>
                </div>
              </div>
              {/* Item: Reliability */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-600">schedule</span>
                    <span className="font-bold text-on-surface">Reliability & Tenure</span>
                  </div>
                  <span className="font-mono font-bold text-on-surface-variant text-sm">{breakdown.reliability || 0}/100</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: `${breakdown.reliability || 30}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Explanation Card */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-primary-container text-white p-10 md:p-14 rounded-xl flex-1 flex flex-col justify-center">
              <h3 className="font-headline text-3xl font-bold mb-6">Why this score?</h3>
              <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                Invisible India uses a proprietary algorithm that analyzes your work consistency, digital payment footprint, and peer network. Measures your **professional resilience** value.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="text-indigo-50">Work history builds digital proof of income.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="text-indigo-50">Consistent location verification.</span>
                </li>
              </ul>
            </div>
            
            {/* Secondary Context Card */}
            <div className="bg-surface-container-low p-8 rounded-xl flex items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-4xl text-indigo-900">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Blockchain Secured</h4>
                <p className="text-sm text-on-surface-variant">Your score is cryptographically signed and tamper-proof.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final Trust Badge / Seal */}
        <section className="text-center py-16 border-t-0 bg-surface-container-lowest rounded-xl mb-12 shadow-sm">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-tr from-secondary to-secondary-fixed flex items-center justify-center rounded-full mb-4 shadow-lg">
              <span className="material-symbols-outlined text-5xl text-white" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-indigo-950">Official Trust Seal</h2>
            <p className="text-on-surface-variant mb-8 px-6">
              This seal confirms that <span className="font-bold">{user?.name}</span> has passed all preliminary background checks and holds a <span className="font-bold">{band}</span> Trust Ranking.
            </p>
          </div>
        </section>
        </>
        )}
      </main>

      <Footer />
    </div>
  );
}
