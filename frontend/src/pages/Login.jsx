import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VoiceFormAssistant from '../components/VoiceFormAssistant';

// Highlight class applied to the email input when voice assistant is targeting it
const ACTIVE_FIELD_CLASS =
  'ring-2 ring-secondary-fixed ring-offset-2 bg-white transition-all duration-300';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceActiveField, setVoiceActive] = useState(null);

  // VoiceFormAssistant writes into a flat object; for Login we only need email
  const loginFormData    = { email };
  const setLoginFormData = (updater) => {
    const next = typeof updater === 'function' ? updater(loginFormData) : updater;
    if (next.email !== undefined) setEmail(next.email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.status === 'success') {
        login(response.data.user, response.data.access_token);
        navigate('/my-applications');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection refused. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen overflow-x-hidden flex flex-col">
      <Header variant="auth" />

      <div className="flex-1 flex flex-col md:flex-row items-stretch overflow-x-hidden">

        {/* ── Left visual column (unchanged) ── */}
        <aside className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container overflow-hidden p-8 lg:p-16 flex-col justify-between">
          <div className="relative z-10">
            <div className="block text-3xl font-headline font-bold tracking-tighter bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent mb-12">
              Welcome Back
            </div>
            <h1 className="text-white text-4xl lg:text-7xl font-headline font-bold leading-tight mb-8">
              Empowering the <br />Resilient Horizon.
            </h1>
            <p className="text-indigo-200 text-lg lg:text-xl max-w-md leading-relaxed font-light">
              A premium space designed for the journey of a billion dreams. Simple, secure, and crafted with care.
            </p>
          </div>

          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent z-10" />
            <img
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
              alt="workers background"
            />
          </div>

          <div className="relative z-10 flex gap-4 backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 max-w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="user"
                />
              ))}
            </div>
            <div className="text-indigo-100 text-sm font-medium self-center">
              Joined by over <span className="text-white font-bold">10 Lakh</span> resilient souls
            </div>
          </div>
        </aside>

        {/* ── Right form column ── */}
        <main className="flex-1 flex flex-col justify-center px-6 py-12 md:px-10 lg:px-20 bg-surface-bright relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="max-w-md w-full mx-auto space-y-7 relative z-10">

            {/* ── Form header + voice toggle ── */}
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-3">
                <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Welcome back</h2>
                <p className="text-on-surface-variant text-lg font-medium opacity-80">Continue your journey with us.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowVoice(v => !v); setVoiceActive(null); }}
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

            {/* ── Voice assistant panel ── */}
            {showVoice && (
              <div className="mb-4">
                <VoiceFormAssistant
                  mode="login"
                  formData={loginFormData}
                  setFormData={setLoginFormData}
                  onFieldChange={(f) => setVoiceActive(f)}
                  onComplete={() => {
                    setVoiceActive(null);
                    setShowVoice(false);
                  }}
                  onDismiss={() => {
                    setShowVoice(false);
                    setVoiceActive(null);
                  }}
                />

                {/* Separator */}
                <div className="flex items-center gap-3 mt-5 mb-1">
                  <div className="flex-1 h-px bg-outline-variant/30" />
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
                    then type your password below
                  </span>
                  <div className="flex-1 h-px bg-outline-variant/30" />
                </div>
              </div>
            )}

            {/* ── Error banner ── */}
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            {/* ── Login form — always visible ── */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="block text-sm font-label font-semibold text-on-surface-variant ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <span className="material-symbols-outlined text-2xl opacity-50">mail</span>
                  </span>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`block w-full pl-14 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-primary/20 rounded-2xl text-lg font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-300 placeholder:text-outline-variant ${voiceActiveField === 'email' && showVoice ? ACTIVE_FIELD_CLASS : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant" htmlFor="password">
                    Password
                    {showVoice && (
                      <span className="ml-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Type manually
                      </span>
                    )}
                  </label>
                  <Link to="#" className="text-sm font-semibold text-primary/60 hover:text-primary transition-colors">Forgot?</Link>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <span className="material-symbols-outlined text-2xl opacity-50">lock</span>
                  </span>
                  <input
                    required
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-14 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-primary/20 rounded-2xl text-lg font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-300 placeholder:text-outline-variant"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-secondary-container text-on-secondary-container font-headline font-bold py-5 px-8 rounded-2xl text-xl shadow-xl shadow-secondary-container/20 hover:shadow-2xl hover:shadow-secondary-container/30 hover:bg-secondary-fixed-dim active:scale-[0.98] transition-all duration-300 border border-secondary/10 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="pt-4">
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-low/50 backdrop-blur-sm rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary scale-90" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p className="text-on-surface-variant text-sm font-medium">
                  Your data is <span className="text-on-surface font-bold italic">Safe & Encrypted</span>
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-on-surface-variant text-base">
                New here? <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">Create account</Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
