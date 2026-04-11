import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TrackApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await applicationService.trackApplication(id);
        setTrackingData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
       fetchTracking();
    }
  }, [id]);

  return (
    <div className="bg-surface text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col">
      <Header variant="protected" />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        {/* Navigation Action */}
        <button onClick={() => navigate('/my-applications')} className="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-headline font-bold text-sm tracking-tight">Back to My Journey</span>
        </button>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-on-surface-variant font-medium">Locating your application...</p>
          </div>
        ) : !trackingData ? (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Tracking ID Not Found</h2>
            <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">We couldn't find any application matching this ID. Please double-check your link.</p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-headline text-indigo-950 tracking-tight">Application Tracker</h1>
                  <p className="text-lg text-on-surface-variant mt-2 font-medium">Reference ID: <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{trackingData.applicationId}</span></p>
                </div>
                <div className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl shadow-sm text-center">
                  <span className="block text-xs uppercase font-bold tracking-widest mb-1">Status</span>
                  <span className="block text-xl font-bold font-headline capitalize">{trackingData.status}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-14 shadow-sm border border-outline-variant/20 mb-12">
              <h2 className="text-2xl font-bold font-headline text-on-surface mb-10">Tracking History</h2>
              
              <div className="space-y-12 relative">
                <div className="absolute left-[27px] top-4 bottom-12 w-1 bg-surface-container-high rounded-full hidden md:block"></div>
                
                {trackingData.updates && trackingData.updates.map((update, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                    <div className="bg-emerald-100 p-3 rounded-full flex items-center justify-center border-4 border-white shadow-sm -ml-1 md:ml-0">
                      <span className="material-symbols-outlined text-emerald-700 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>task_alt</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-headline text-on-surface">{update.status}</h3>
                      <p className="text-on-surface-variant mt-1">{update.message}</p>
                      <div className="mt-3 text-sm font-medium text-slate-500">{new Date(update.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}

                {trackingData.status !== 'approved' && (
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10 opacity-50">
                    <div className="bg-surface-container-high p-3 rounded-full flex items-center justify-center border-4 border-white shadow-sm -ml-1 md:ml-0">
                      <span className="material-symbols-outlined text-outline text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>sync</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-headline text-on-surface">Instituional Verification</h3>
                      <p className="text-on-surface-variant mt-1">Awaiting data sync with our institutional partners.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
