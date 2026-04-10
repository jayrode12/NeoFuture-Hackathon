import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    if (e.target.value.length === 1 && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // In a real app, verify OTP here.
    navigate('/login');
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Editorial Element */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-secondary-container/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary-container/5 blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-xl z-10">
          {/* Back Action */}
          <Link to="/register" className="mb-12 flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group w-min">
             <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
             <span className="font-headline font-bold text-sm tracking-tight">Back</span>
          </Link>

          {/* Card Shell */}
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-16 soft-ambient-shadow relative overflow-hidden">
            {/* Branding Anchor */}
            <div className="mb-10">
              <span className="font-headline font-extrabold text-2xl tracking-tighter bg-gradient-to-br from-indigo-900 to-indigo-500 bg-clip-text text-transparent">Invisible India</span>
            </div>

            {/* Editorial Header */}
            <header className="mb-12">
              <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
                Secure your <br /><span className="text-on-primary-container">access.</span>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                We’ve sent a 4-digit verification code to your registered mobile number. Please enter it below to continue.
              </p>
            </header>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-10">
              <div className="flex gap-4 md:gap-6 justify-between max-w-sm">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="flex-1 aspect-square bg-surface-container-low rounded-lg focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-on-primary-container/20 transition-all duration-300">
                    <input
                      ref={(el) => inputs.current[idx] = el}
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                      maxLength="1"
                      placeholder="•"
                      type="text"
                      onChange={(e) => handleChange(e, idx)}
                      className="w-full h-full text-center text-3xl font-headline font-bold bg-transparent border-none focus:ring-0 text-indigo-900"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-6">
                <button type="submit" className="primary-gradient text-on-primary py-5 px-10 rounded-xl font-headline font-bold text-lg soft-ambient-shadow hover:opacity-90 active:scale-95 transition-all w-full md:w-fit">
                  Verify OTP
                </button>
                <div className="flex items-center gap-4">
                  <p className="text-on-surface-variant text-sm font-medium">Didn't receive a code?</p>
                  <button type="button" className="text-secondary font-headline font-bold text-sm hover:underline hover:text-on-secondary-container transition-all">Resend OTP</button>
                </div>
              </div>
            </form>

            <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[200px]" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between px-4">
            <p className="text-on-surface-variant/60 text-xs font-label">
              By continuing, you agree to our <Link to="#" className="underline">Terms of Service</Link>.
            </p>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
              <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
