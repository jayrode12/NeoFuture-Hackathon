import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';

export default function MatchedSchemes() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await schemeService.getAllSchemes();
        setSchemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const handleApply = async (schemeId) => {
    try {
      const response = await schemeService.applyForScheme(schemeId, token);
      if (response.status === 'success') {
        navigate('/my-applications?success=application_submitted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <Header variant="protected" />
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-32">
        {/* Header Section */}
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-on-surface">
            All Available Schemes
          </h1>
        </header>

        {/* Schemes List Layout */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-on-surface-variant font-medium">Matching schemes for you...</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-20 text-center shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)]">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4" style={{fontVariationSettings: "'FILL' 0, 'wght' 300"}}>sentiment_dissatisfied</span>
              <h2 className="text-2xl font-bold text-on-surface mb-2">No Matches Found</h2>
              <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">Build your profile with more financial history to unlock eligible schemes.</p>
              <Link to="/financial-identity" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-bold font-headline hover:scale-105 transition-transform inline-block">
                Complete Profile
              </Link>
            </div>
          ) : (
            schemes.map((scheme) => (
              <div key={scheme.schemeId} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)] hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-6 w-full md:w-auto mb-6 md:mb-0">
                   <div className="bg-primary-container text-on-primary-container p-6 rounded-xl flex items-center justify-center">
                     <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>
                       {scheme.category === 'Loan' ? 'account_balance' : scheme.category === 'Insurance' ? 'security' : 'savings'}
                     </span>
                   </div>
                   <div>
                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">{scheme.type}</span>
                     <h2 className="text-2xl font-bold font-headline text-on-surface">{scheme.name}</h2>
                     <p className="text-on-surface-variant text-sm mt-1">{scheme.provider} • Min Score: {scheme.minScore}</p>
                   </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Benefit</span>
                    <p className="text-3xl font-extrabold text-on-surface">{scheme.amount}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/scheme-details', { state: { scheme } })} 
                    className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-bold font-headline hover:scale-105 transition-transform whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
