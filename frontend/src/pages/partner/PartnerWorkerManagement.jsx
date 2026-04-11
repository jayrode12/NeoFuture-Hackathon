import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PartnerWorkerManagement() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Work Types");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/partner/workers');
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        console.error("Failed to fetch workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const getScoreBand = (score) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Consistent';
    return 'Needs Review';
  };

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                         w.workerId?.includes(search) ||
                         w.location?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All Work Types" || w.profession === filterType;
    return matchesSearch && matchesType;
  });


  return (
    <div className="pt-12 pb-24 px-8 lg:px-16 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Header */}
      <header className="mb-12 border-b border-surface-container pb-6">
        <span className="text-on-primary-container font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Fleet Oversight</span>
        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">Worker Management</h1>
      </header>

      {/* Filter & Search Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Search Bar */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or location..." 
            className="w-full h-16 pl-16 pr-6 bg-surface-container-low border-none rounded-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-primary-container/20 transition-all duration-300 shadow-sm"
          />
        </div>
        
        {/* Work Type Filter */}
        <div className="relative">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full h-16 px-6 bg-surface-container-low border-none rounded-md text-on-surface appearance-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-primary-container/20 transition-all cursor-pointer"
          >
            <option>All Work Types</option>
            <option>Construction</option>
            <option>Logistics</option>
            <option>Manufacturing</option>
            <option>Engineering</option>
          </select>
          <div className="absolute right-6 inset-y-0 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>

        {/* Score Range Filter */}
        <div className="relative">
          <select className="w-full h-16 px-6 bg-surface-container-low border-none rounded-md text-on-surface appearance-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-primary-container/20 transition-all cursor-pointer">
            <option>All Score Bands</option>
            <option>Exceptional (90+)</option>
            <option>Strong (80-89)</option>
            <option>Consistent (70-79)</option>
            <option>Needs Review (&lt;70)</option>
          </select>
          <div className="absolute right-6 inset-y-0 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined">filter_list</span>
          </div>
        </div>
      </section>

      {/* Data Table Area */}
      <div className="border-t border-surface-container">
        <div className="grid grid-cols-12 bg-surface-container-low px-8 py-6 text-on-surface-variant font-label text-xs font-bold tracking-widest uppercase">
          <div className="col-span-4">Worker Profile</div>
          <div className="col-span-2 hidden md:block">Work Type</div>
          <div className="col-span-2 text-center">Trust Score</div>
          <div className="col-span-2 text-center hidden sm:block">Score Band</div>
          <div className="col-span-2 text-right">Verification</div>
        </div>

        <div className="flex flex-col">
          {loading ? (
             <div className="p-12 text-center text-on-surface-variant font-medium">Downloading workforce registry...</div>
          ) : filteredWorkers.length === 0 ? (
             <div className="p-12 text-center text-on-surface-variant font-medium italic">No workers matching your criteria.</div>
          ) : (
            filteredWorkers.map((worker, idx) => (
              <Link 
                key={worker.workerId} 
                to={`/partner/workers/${worker.workerId}`}
                className={`grid grid-cols-12 items-center px-8 py-8 transition-colors duration-300 ${idx % 2 !== 0 ? 'bg-surface-container-low/30' : ''} hover:bg-surface-container group cursor-pointer`}
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                    {worker.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface text-lg group-hover:text-indigo-700 transition-colors">{worker.fullName}</p>
                    <p className="text-on-surface-variant text-sm">{worker.location || 'Location Pending'} • ID: #{worker.workerId}</p>
                  </div>
                </div>
                <div className="col-span-2 hidden md:block">
                  <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold">{worker.profession || 'Universal'}</span>
                </div>
                <div className="col-span-2 text-center font-headline font-bold text-xl text-on-surface">---</div>
                <div className="col-span-2 text-center hidden sm:block">
                  <span className={`text-sm font-medium text-slate-400`}>Awaiting Sync</span>
                </div>
                <div className="col-span-4 md:col-span-2 sm:col-span-2 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface text-on-surface rounded-full text-xs font-bold uppercase border border-slate-200">
                     Vetted
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-primary-container hover:text-white transition-all">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex gap-2 font-headline font-bold">
            <span className="w-10 h-10 flex items-center justify-center bg-primary-container text-white rounded-full">1</span>
            <span className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-full cursor-pointer">2</span>
            <span className="w-10 h-10 flex items-center justify-center">...</span>
          </div>
          <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-primary-container hover:text-white transition-all">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div className="max-w-xs text-right">
          <p className="text-on-surface-variant font-label text-sm italic">
            Showing 1-4 of 124 curated workforce profiles based on current resilience metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
