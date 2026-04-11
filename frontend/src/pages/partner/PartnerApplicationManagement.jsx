import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PartnerApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/partner/applications');
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);


  return (
    <div className="pt-12 pb-24 px-8 lg:px-16 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Header */}
      <header className="mb-12 border-b border-surface-container pb-6">
        <span className="text-on-primary-container font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Process Oversight</span>
        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">Application Management</h1>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b border-surface-container overflow-x-auto pb-4">
        <button className="px-6 py-2 text-indigo-900 border-b-2 border-indigo-900 font-bold whitespace-nowrap">All Applications</button>
        <button className="px-6 py-2 text-slate-500 hover:text-indigo-900 font-medium whitespace-nowrap transition-colors">Pending Review (12)</button>
        <button className="px-6 py-2 text-slate-500 hover:text-indigo-900 font-medium whitespace-nowrap transition-colors">Approved (48)</button>
        <button className="px-6 py-2 text-slate-500 hover:text-indigo-900 font-medium whitespace-nowrap transition-colors">Exceptions (4)</button>
      </div>

      {/* Applications Data Layout */}
      <div className="border-t border-surface-container">
        <div className="grid grid-cols-12 bg-surface-container-low px-8 py-6 text-on-surface-variant font-label text-xs font-bold tracking-widest uppercase">
          <div className="col-span-3">Application ID</div>
          <div className="col-span-3">Worker / Beneficiary</div>
          <div className="col-span-3">Target Scheme</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="flex flex-col flex-1">
          {loading ? (
             <div className="p-12 text-center text-on-surface-variant font-medium">Downloading application queue...</div>
          ) : applications.length === 0 ? (
             <div className="p-12 text-center text-on-surface-variant italic">No applications in the queue.</div>
          ) : (
            applications.map((app, idx) => (
              <div 
                key={app.applicationId} 
                className={`grid grid-cols-12 items-center px-8 py-6 transition-colors duration-300 ${idx % 2 !== 0 ? 'bg-surface-container-low/30' : ''} hover:bg-surface-container group border-b border-surface-container last:border-0`}
              >
                <div className="col-span-3">
                  <p className="font-headline font-bold text-indigo-900 text-base">{app.applicationId}</p>
                  <p className="text-slate-500 text-xs mt-1">Submitted: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-3 flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-indigo-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {app.workerName?.charAt(0) || 'U'}
                  </div>
                  <span className="font-bold text-on-surface hover:text-indigo-700 transition-colors cursor-pointer">{app.workerName}</span>
                </div>
                <div className="col-span-3 text-left">
                  <span className="bg-surface-container-high px-3 py-1 rounded-md text-xs font-medium text-slate-700">{app.schemeName}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    app.status === 'rejected' ? 'bg-error-container text-on-error-content' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <Link to={`/partner/applications/${app.applicationId}`} state={{ status: app.status }} className="inline-block text-slate-400 hover:text-indigo-900 transition-colors p-2 rounded-full hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
