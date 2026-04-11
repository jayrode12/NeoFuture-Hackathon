import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

export default function MyApplications() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getMyApplications(token);
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }

    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'profile_created') {
      setShowSuccess(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      navigate(url.pathname + url.search, { replace: true });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location.search, navigate, token]);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed min-h-screen flex flex-col">
      <Header variant="protected" />
      {showSuccess && (
        <div className="bg-emerald-500 text-white text-center py-4 font-bold font-headline top-[5.5rem] z-40 sticky shadow-[0_10px_30px_-10px_rgba(0,180,100,0.4)] border-b border-emerald-600 animate-slide-down flex justify-center items-center gap-3 w-full">
          <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          Profile created successfully!
        </div>
      )}
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-on-surface">Application Journey</h1>
        </header>

        {/* Application List Layout */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-on-surface-variant font-medium">Fetching your application history...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-20 text-center shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)]">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4" style={{fontVariationSettings: "'FILL' 0, 'wght' 300"}}>assignment_late</span>
              <h2 className="text-2xl font-bold text-on-surface mb-2">No Applications Yet</h2>
              <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">You haven't applied for any schemes yet. Visit the schemes page to find opportunities matched for you.</p>
              <Link to="/matched-schemes" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-bold font-headline hover:scale-105 transition-transform inline-block">
                Explore Schemes
              </Link>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.applicationId} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_-10px_rgba(26,28,28,0.06)] hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-6 w-full md:w-auto mb-6 md:mb-0">
                  <div className={`p-6 rounded-xl flex items-center justify-center ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-container text-on-primary-container'}`}>
                    <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>
                      {app.category === 'Loan' ? 'account_balance' : app.category === 'Insurance' ? 'security' : 'savings'}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary-container text-on-secondary-container'}`}>
                      {app.status === 'pending' ? 'Under Review' : app.status}
                    </span>
                    <h2 className="text-2xl font-bold font-headline text-on-surface">{app.schemeName || 'Unknown Scheme'}</h2>
                    <p className="text-on-surface-variant text-sm mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <button onClick={() => navigate(`/track-application/${app.applicationId}`)} className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-bold font-headline hover:scale-105 transition-transform whitespace-nowrap">
                    Track Journey
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

