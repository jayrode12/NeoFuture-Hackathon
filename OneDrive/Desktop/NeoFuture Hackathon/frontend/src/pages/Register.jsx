import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    state: '',
    district: '',
    primaryWorkType: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.register(formData);
      if (response.status === 'success') {
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection refused. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-surface text-on-surface">
      {/* Top Navigation Bar */}
      <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-950 font-headline">
            Invisible India
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium text-sm">Step 1 of 3</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center pt-12 pb-24 px-6 relative z-10">
        {/* Progress Indicator */}
        <div className="w-full max-w-lg mb-16 px-4">
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-on-primary-container w-1/3 rounded-full"></div>
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-primary-container">Registration</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Verification</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Profile</span>
          </div>
        </div>

        {/* Registration Content */}
        <section className="w-full max-w-lg">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-indigo-950 tracking-tight leading-tight mb-4">
              Join the Community.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              Start your journey to access government schemes and secure your work benefits.
            </p>
          </header>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-bold mb-8">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleContinue}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="Enter your full name" type="text" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Email Address</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="name@example.com" type="email" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg text-slate-500">+91</span>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-16 pr-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="Mobile number" type="tel" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Aadhaar Number (12 Digits)</label>
              <div className="relative">
                <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="XXXX XXXX XXXX" type="text" required />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-2">State</label>
                <select name="state" value={formData.state} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg text-slate-600 appearance-none bg-no-repeat bg-[right_1.5rem_center]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: "1.5em" }}>
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-2">District</label>
                <input name="district" value={formData.district} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="District" type="text" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Primary Work Type</label>
              <select name="primaryWorkType" value={formData.primaryWorkType} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg text-slate-600 appearance-none bg-no-repeat bg-[right_1.5rem_center]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: "1.5em" }}>
                <option value="">Choose Occupation</option>
                <option value="Construction Worker">Construction Worker</option>
                <option value="Domestic Help">Domestic Help</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Street Vendor">Street Vendor</option>
                <option value="Agricultural Labour">Agricultural Labour</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Create Password</label>
              <input name="password" value={formData.password} onChange={handleChange} className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400" placeholder="••••••••" type="password" required />
            </div>

            <div className="flex items-center gap-3 py-3 text-slate-500 justify-center">
              <span className="material-symbols-outlined text-green-600">verified_user</span>
              <p className="text-sm font-medium">Your data is safe and encrypted.</p>
            </div>

            <div className="pt-6">
              <button disabled={loading} className={`w-full py-5 bg-secondary-container text-on-secondary-container font-headline font-bold text-xl rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} type="submit">
                {loading ? 'Creating Account...' : 'Continue'}
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </div>
          </form>
          
          <div className="mt-12 p-8 bg-surface-container-low rounded-xl flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-indigo-900">info</span>
            </div>
            <div>
              <h3 className="font-bold text-indigo-950 mb-1">Why register?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Registered workers get priority access to the E-Shram portal and local government aid centers during emergencies.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Background Decoration */}
      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-secondary-container opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 -left-24 w-80 h-80 bg-on-primary-container opacity-5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Custom Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-indigo-950 text-lg">Invisible India</span>
            <p className="text-slate-500 text-sm max-w-xs">Connecting informal sector heroes with the dignity and support they deserve.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-indigo-950 text-sm uppercase tracking-widest mb-2">Resources</span>
            <Link className="text-slate-500 hover:text-indigo-600 transition-colors text-sm" to="/schemes">Government Schemes</Link>
            <Link className="text-slate-500 hover:text-indigo-600 transition-colors text-sm" to="/help">Help Center</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-indigo-950 text-sm uppercase tracking-widest mb-2">Support</span>
            <Link className="text-slate-500 hover:text-indigo-600 transition-colors text-sm" to="/contact">Contact Support</Link>
            <p className="mt-4 text-xs text-slate-400">© 2024 Invisible India. Secure &amp; Private.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
