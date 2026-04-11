import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VoiceFormAssistant from '../components/VoiceFormAssistant';
import RegistrationProgress from '../components/RegistrationProgress';
import { useAuth } from '../context/AuthContext';

// CSS class applied to a form input that the voice assistant is currently filling
const ACTIVE_FIELD_CLASS =
  'ring-2 ring-secondary-fixed ring-offset-2 bg-surface-container-lowest transition-all duration-300';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name:          '',
    email:         '',
    phone:         '',
    aadhaarMasked: '',
    state:         '',
    district:      '',
    workType:      '',
    password:      '',
  });
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [showVoice, setShowVoice]           = useState(false);
  const [voiceActiveField, setVoiceActive]  = useState(null);
  const [voiceDone, setVoiceDone]           = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Returns the extra className for a given input field
  const fieldClass = (fieldName) =>
    voiceActiveField === fieldName && showVoice ? ACTIVE_FIELD_CLASS : '';

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const registrationData = {
      ...formData,
      district: formData.district || 'Not Specified',
    };

    try {
      console.log('Sending registration data:', registrationData);
      const response = await authService.register(registrationData);

      if (response.status === 'success') {
        if (response.data && response.data.access_token) {
          login(response.data.user, response.data.access_token);
          navigate('/verify-otp');
        } else {
          setError('Registration successful but no token received.');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Connection refused. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-surface text-on-surface">
      <Header variant="auth" />
      <RegistrationProgress />

      <main className="flex-grow flex flex-col items-center pt-12 pb-24 px-6 relative z-10">
        <section className="w-full max-w-lg">

          {/* ── Page header + voice toggle ── */}
          <div className="flex justify-between items-end mb-10">
            <header>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-indigo-950 tracking-tight leading-tight mb-4">
                Join the Community.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Start your journey to access government schemes and secure your work benefits.
              </p>
            </header>
            <button
              type="button"
              onClick={() => { setShowVoice(v => !v); setVoiceDone(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shrink-0 ${
                showVoice
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {showVoice ? 'mic_off' : 'mic'}
              </span>
              {showVoice ? 'Close Voice' : 'Use Voice'}
            </button>
          </div>

          {/* ── Voice assistant panel (shown when active) ── */}
          {showVoice && (
            <div className="mb-8">
              <VoiceFormAssistant
                mode="registration"
                formData={formData}
                setFormData={setFormData}
                onFieldChange={(f) => setVoiceActive(f)}
                onComplete={() => {
                  setVoiceDone(true);
                  setVoiceActive(null);
                }}
                onDismiss={() => {
                  setShowVoice(false);
                  setVoiceActive(null);
                }}
              />

              {/* Separator */}
              <div className="flex items-center gap-4 mt-6 mb-2">
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
                  {voiceDone ? '✓ Voice complete — type password to finish' : 'Form updates in real-time below'}
                </span>
                <div className="flex-1 h-px bg-outline-variant/30" />
              </div>
            </div>
          )}

          {/* ── Error banner ── */}
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-bold mb-8">
              {error}
            </div>
          )}

          {/* ── Registration form — always visible, fills in real-time ── */}
          <form className="space-y-6" onSubmit={handleContinue}>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400 ${fieldClass('name')}`}
                placeholder="Enter your full name"
                type="text"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400 ${fieldClass('email')}`}
                placeholder="name@example.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg text-slate-500">+91</span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-16 pr-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400 ${fieldClass('phone')}`}
                  placeholder="Mobile number"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Aadhaar Number (12 Digits)</label>
              <div className="relative">
                <input
                  name="aadhaarMasked"
                  value={formData.aadhaarMasked}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400 ${fieldClass('aadhaarMasked')}`}
                  placeholder="XXXX XXXX XXXX"
                  type="text"
                  required
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg text-slate-600 appearance-none bg-no-repeat bg-[right_1.5rem_center] ${fieldClass('state')}`}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: '1.5em' }}
                >
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Goa">Goa</option>
                  <option value="Assam">Assam</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-2">District</label>
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400 ${fieldClass('district')}`}
                  placeholder="District"
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">Primary Work Type</label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className={`w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg text-slate-600 appearance-none bg-no-repeat bg-[right_1.5rem_center] ${fieldClass('workType')}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: '1.5em' }}
              >
                <option value="">Choose Occupation</option>
                <option value="Construction Worker">Construction Worker</option>
                <option value="Domestic Help">Domestic Help</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Street Vendor">Street Vendor</option>
                <option value="Agricultural Labour">Agricultural Labour</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 ml-2">
                Create Password
                {showVoice && (
                  <span className="ml-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Type manually — voice disabled for security
                  </span>
                )}
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-on-primary-container focus:bg-surface-container-lowest transition-all duration-300 editorial-shadow text-lg placeholder:text-slate-400"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <div className="flex items-center gap-3 py-3 text-slate-500 justify-center">
              <span className="material-symbols-outlined text-green-600">verified_user</span>
              <p className="text-sm font-medium">Your data is safe and encrypted.</p>
            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                className={`w-full py-5 bg-secondary-container text-on-secondary-container font-headline font-bold text-xl rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                type="submit"
              >
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
              <p className="text-sm text-slate-600 leading-relaxed">
                Registered workers get priority access to the E-Shram portal and local government aid centers during emergencies.
              </p>
            </div>
          </div>

        </section>
      </main>

      {/* Background decoration */}
      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-secondary-container opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 -left-24 w-80 h-80 bg-on-primary-container opacity-5 rounded-full blur-3xl pointer-events-none" />

      <Footer />
    </div>
  );
}
