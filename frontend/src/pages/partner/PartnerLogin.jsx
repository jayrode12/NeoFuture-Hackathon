import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PartnerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    institutionName: '',
    email: '',
    password: '',
    registrationId: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin ? {
      email: formData.email,
      password: formData.password
    } : {
      organizationName: formData.institutionName,
      email: formData.email,
      password: formData.password,
      registrationId: formData.registrationId,
      role: 'Partner Organization'
    };

    try {
      const response = await fetch(`http://localhost:8000/api/partner/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (!isLogin) {
          // Success registration
          alert("Partnership request received. You can now login.");
          setIsLogin(true);
        } else {
          login(data.partner, data.token);
          navigate('/partner/dashboard');
        }
      } else {
        setError(data.detail || `Partner ${endpoint} failed`);
      }
    } catch (err) {
      setError('Connection refused. Is the backend running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10">

        {/* Background glow logic */}
        <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary-container/10 blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-xl shadow-[0_40px_40px_rgba(26,28,28,0.06)] bg-surface-container-lowest z-10 relative">
          
          {/* Left Panel: Branding & Trust */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#010766] to-[#747cd3] p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="material-symbols-outlined text-white text-5xl">account_balance</span>
              </div>
              <h2 className="font-headline text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                Invisible India <br/><span className="text-secondary-container">Partner Portal</span>
              </h2>
              <p className="text-primary-fixed-dim text-md max-w-sm mx-auto leading-relaxed">
                Connect your organization to the inclusive workforce network.
              </p>
            </div>
          </div>

          {/* Right Panel: Login / Register Form */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-surface-container-lowest">
            <div className="max-w-md mx-auto w-full">

              {/* Toggle Switch */}
              <div className="flex bg-surface-container-low rounded-lg p-1 mb-12 relative overflow-hidden">
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ${!isLogin ? 'translate-x-full left-1' : 'left-1'}`}></div>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-indigo-900' : 'text-slate-500'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-indigo-900' : 'text-slate-500'}`}
                >
                  Register Partner
                </button>
              </div>

              <div className="mb-10 text-center lg:text-left">
                <h3 className="font-headline text-3xl font-bold text-primary-container mb-2">
                  {isLogin ? 'Partner Login' : 'Partner Registration'}
                </h3>
                <p className="text-on-surface-variant font-medium">
                  {isLogin ? 'Access your institutional dashboard' : 'Apply for institutional access workflow'}
                </p>
                {error && (
                  <div className="mt-4 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-bold animate-shake">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {!isLogin && (
                  <div className="group animate-fade-in">
                    <label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-2 px-1">Institution Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">corporate_fare</span>
                      <input
                        required
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all"
                        placeholder="Organization Name"
                        type="text"
                      />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-2 px-1">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all"
                      placeholder="admin@partner.org"
                      type="email"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="group animate-fade-in">
                    <label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-2 px-1">Registration ID (CIN/NGO)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">badge</span>
                      <input
                        required
                        name="registrationId"
                        value={formData.registrationId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all"
                        placeholder="U12345MH2023PTC123"
                        type="text"
                      />
                    </div>
                  </div>
                )}

                <div className="group">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant">Password</label>
                    {isLogin && <a href="#" className="text-xs font-bold text-on-primary-container hover:underline">Forgot password?</a>}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                    <input
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isLoading}
                    className="w-full bg-gradient-to-br from-[#010766] to-[#747cd3] text-white py-5 rounded-full font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    type="submit"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-white">progress_activity</span>
                    ) : (
                      isLogin ? 'Secure Login' : 'Submit Application'
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
