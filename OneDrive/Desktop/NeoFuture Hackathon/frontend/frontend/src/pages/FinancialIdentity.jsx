import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegistrationProgress from '../components/RegistrationProgress';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function FinancialIdentity() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [experiences, setExperiences] = useState([
    { title: 'Master Mason', company: 'Urban Projects Ltd', duration: '3 years' }
  ]);
  const [loading, setLoading] = useState(false);

  const addExperience = () => {
    const title = prompt("Enter Job Title");
    const company = prompt("Enter Company Name");
    if (title && company) {
      setExperiences([...experiences, { title, company, duration: 'New' }]);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // Create payload with 100% completion markers
      const payload = {
        workType: 'Skilled Construction',
        upi_transactions_count: 150,
        upi_avg_monthly_amount: 18500,
        location_consistency: 0.95,
        work_duration_months: experiences.length * 12,
        peer_attestations: 15,
        customer_rating_avg: 4.8,
        experience_history: experiences
      };

      const response = await fetch('http://localhost:8000/api/financial-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate('/my-applications?success=profile_created');
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const progress = experiences.length > 1 ? 100 : 85;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <Header variant="protected" />
      <RegistrationProgress />
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl leading-tight mb-6 font-headline font-extrabold text-primary-container">Build Your Worker Identity</h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">Let's complete your digital resume. Your verified experience helps you unlock better schemes.</p>
            </div>
            <div className="w-full md:w-72 bg-surface-container-low rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-on-surface">{progress === 100 ? "Ready to submit!" : "Almost there"}</span>
                <span className="text-sm font-bold text-on-primary-container">{progress}%</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? 'bg-emerald-500' : 'bg-primary-container'}`} style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-4 text-[10px] text-on-surface-variant uppercase tracking-tighter">Verified Employment Profile (VEP)</p>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)] md:col-span-2 overflow-hidden relative">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-indigo-950 mb-2">Work Location</h2>
                  <p className="text-lg text-on-surface-variant">Your primary service radius</p>
                </div>
                <div className="bg-surface-container p-4 rounded-full">
                  <span className="material-symbols-outlined text-4xl text-on-primary-container">location_on</span>
                </div>
              </div>
              <div className="w-full h-64 rounded-lg bg-surface-container overflow-hidden">
                <img alt="Map" className="w-full h-full object-cover grayscale opacity-80" src="https://images.unsplash.com/photo-1596404764426-1e6ac5aed306" />
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl pt-12 pb-10 px-8 shadow-sm">
              <h3 className="text-xl font-headline font-bold text-indigo-950 mb-4">Income Proof</h3>
              <p className="text-3xl font-extrabold text-on-surface">₹18,500/mo</p>
              <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span> Verified via UPI
              </p>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl pt-10 pb-14 px-8 shadow-sm">
              <h3 className="text-xl font-headline font-bold text-indigo-950 mb-4">Peer Trust</h3>
              <div className="flex -space-x-4 mb-4">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" />
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold">+15</div>
              </div>
              <p className="text-sm text-on-surface-variant">15 local coworkers confirmed your skill.</p>
            </div>
          </div>
          
          <div className="md:col-span-4 space-y-8">
            <div className="bg-surface-container-low rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-headline font-bold text-indigo-950 mb-6">Experience History</h3>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="pl-6 border-l-2 border-indigo-200 relative">
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-600"></div>
                    <h4 className="font-bold text-sm">{exp.title}</h4>
                    <p className="text-xs text-on-surface-variant">{exp.company}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={addExperience}
                className="mt-8 w-full py-3 border-2 border-dashed border-indigo-300 rounded-lg text-sm font-bold text-indigo-700 hover:bg-white transition-all"
              >
                + Add Role to reach 100%
              </button>
            </div>
            
            <div className="bg-primary-container rounded-xl p-8 text-white">
              <h3 className="text-xl font-headline font-bold mb-2">Finalize Profile</h3>
              <p className="text-indigo-200 text-sm mb-6">Complete your profile to unlock all matched schemes.</p>
              <button 
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-4 rounded-full font-headline font-bold hover:scale-105 transition-all shadow-lg flex justify-center items-center"
              >
                {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : "Confirm and Submit"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
