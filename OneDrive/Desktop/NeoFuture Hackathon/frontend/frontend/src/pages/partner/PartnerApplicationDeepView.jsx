import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PartnerApplicationDeepView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/partner/applications/${id}`);
        const data = await response.json();
        setApplication(data);
      } catch (err) {
        console.error("App fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleAction = async (actionType) => {
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/partner/applications/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: id,
          action: actionType,
          approverId: user.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        setApplication(prev => ({ ...prev, status: result.new_status }));
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
       </div>
     );
  }

  if (!application) return <div>App not found</div>;


  return (
    <div className="p-8 lg:p-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 pt-4">
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-indigo-900 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label font-bold text-sm tracking-widest uppercase">Back to Applications</span>
          </button>
          <div className="flex items-center gap-4">
            <h2 className="font-headline font-bold text-4xl tracking-tight text-on-surface">Application {application.applicationId}</h2>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest ${application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : application.status === 'rejected' ? 'bg-error-container text-on-error-content' : 'bg-amber-100 text-amber-700'}`}>
              {application.status}
            </span>
          </div>
          <p className="text-on-surface-variant">Submitted on {new Date(application.createdAt).toLocaleDateString()}</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Applicant Data */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-0 border-r border-surface-container pr-8 border-b lg:border-b-0 pb-8 lg:pb-0 text-left">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-6">Applicant Data</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-2xl shrink-0">
                {application.workerName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-headline font-bold text-xl">{application.workerName}</p>
                <p className="text-sm text-slate-500">ID: {application.workerId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Profession</label>
                <p className="font-medium text-slate-800">Verified Specialist</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">KYC Status</label>
                <p className="font-medium text-slate-800">Aadhaar Verified</p>
              </div>
              <div className="pt-4 border-t border-surface-container">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Trust Score</label>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-headline font-extrabold text-indigo-900">842</span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Exceptional</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate(`/partner/workers/${application.workerId}`)} className="w-full mt-8 py-3 flex items-center justify-center gap-2 text-indigo-900 font-bold border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              View Full Profile
            </button>
          </div>
        </div>

        {/* Right Column: Scheme Info & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-8 text-left">
          <div className="flex-1 bg-surface-container-low p-0 pb-8 border-b border-surface-container relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <span className="material-symbols-outlined text-9xl">account_balance</span>
             </div>
             <div className="relative z-10">
                 <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Target Scheme</h3>
                 <h2 className="text-3xl font-headline font-bold text-indigo-900 mb-8">{application.schemeName}</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Approval Criteria & Logic</label>
                     <p className="text-slate-700 leading-relaxed text-sm">Applicants must meet the Trust Score threshold and provide necessary skill certification documents as per Indian Labour Law standards.</p>
                   </div>
                   <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Scheme Benefits</label>
                     <p className="text-slate-700 leading-relaxed text-sm">Includes accidental insurance, child education allowance, and tool purchase grants for eligible workers.</p>
                   </div>
                 </div>
             </div>
          </div>

          <div className="p-0 mt-8">
            <h3 className="font-headline font-bold text-2xl mb-2">Review Decision</h3>
            <p className="text-slate-500 mb-8 max-w-xl">
              Based on the trust score and historical verification, this applicant clears the automated threshold for {application.schemeName}. Final manual approval is required.
            </p>
            
            {application.status === 'approved' ? (
              <div className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-200">
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                Application has been approved. Notification sent to beneficiary.
              </div>
            ) : application.status === 'rejected' ? (
              <div className="flex items-center gap-3 p-6 bg-red-50 text-red-800 rounded-xl font-bold border border-red-200">
                <span className="material-symbols-outlined text-red-600">cancel</span>
                Application has been rejected.
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => handleAction('APPROVED')}
                  disabled={actionLoading}
                  className="flex-1 py-5 bg-indigo-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow hover:bg-indigo-800 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      Confirm Approval
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleAction('REJECTED')}
                  disabled={actionLoading}
                  className="flex-1 py-5 bg-surface-container-lowest text-error border border-error-container rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-error-container/20 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
