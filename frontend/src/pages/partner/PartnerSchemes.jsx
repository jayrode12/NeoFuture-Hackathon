import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PartnerSchemes() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    minScore: '',
    sector: '',
    description: ''
  });

  const fetchSchemes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/schemes');
      const data = await response.json();
      setSchemes(data);
    } catch (err) {
      console.error("Failed to fetch schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.title,
        description: formData.description,
        provider: user?.name || "Invisible India Partner",
        category: formData.sector,
        eligibility_criteria: {
          min_trust_score: parseInt(formData.minScore),
          profession: formData.sector
        },
        benefits: ["Direct Benefit Transfer", "Skill Evaluation"]
      };

      const response = await fetch('http://localhost:8000/api/partner/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormData({ title: '', minScore: '', sector: '', description: '' });
        alert("Scheme published successfully!");
        fetchSchemes(); // Refresh list
      }
    } catch (err) {
      console.error("Create scheme error:", err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="pt-12 pb-24 px-8 lg:px-16 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-12 border-b border-surface-container pb-6">
        <span className="text-on-primary-container font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Institutional Offering</span>
        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">Scheme Management</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-surface-container-high">
            <h3 className="font-headline font-bold text-2xl mb-6 text-indigo-900 border-b border-surface-container pb-4">Create New Scheme</h3>
            <form onSubmit={handleCreateScheme} className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">Scheme Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-lg focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g. Healthcare Subsidy" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">Min Target Score</label>
                  <input 
                    required
                    name="minScore"
                    type="number"
                    value={formData.minScore}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. 750" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">Target Sector</label>
                  <select 
                    required
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="Construction">Construction</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="All">All Sectors</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">Description / Benefit</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]" 
                  placeholder="Provide scheme details..." 
                ></textarea>
              </div>
              <button disabled={submitting} type="submit" className="w-full py-4 bg-indigo-900 text-white rounded-lg font-bold hover:bg-indigo-800 transition-colors disabled:opacity-50">
                {submitting ? 'Publishing...' : 'Publish Scheme'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Existing Schemes */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] border border-surface-container">
            <div className="grid grid-cols-12 bg-surface-container-low px-8 py-5 text-on-surface-variant font-label text-xs font-bold tracking-widest uppercase border-b border-surface-container">
              <div className="col-span-5">Active Schemes</div>
              <div className="col-span-4">Eligibility</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="flex flex-col">
              {loading ? (
                <div className="p-12 text-center text-slate-500 font-medium">Synchronizing scheme registry...</div>
              ) : schemes.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">No ecosystem schemes found.</div>
              ) : (
                schemes.map((scheme) => (
                  <div key={scheme.schemeId || scheme.id} className="grid grid-cols-12 items-center px-8 py-6 border-b border-surface-container hover:bg-surface-container-low transition-colors group">
                    <div className="col-span-5 text-left">
                      <p className="font-headline font-bold text-lg text-indigo-900">{scheme.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{scheme.provider}</p>
                    </div>
                    <div className="col-span-4 text-left">
                      <p className="text-sm font-medium text-indigo-700">Min Score: {scheme.eligibility_criteria?.min_trust_score || 0}</p>
                      <p className="text-xs text-slate-500">{scheme.category}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                        ACTIVE
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button className="text-slate-400 hover:text-indigo-900">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
