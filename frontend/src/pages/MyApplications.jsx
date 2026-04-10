import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function MyApplications() {
  const { user, logout } = useStore();

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed min-h-screen">
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 max-w-full bg-slate-50/80 backdrop-blur-xl z-50 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
        <Link to="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-br from-indigo-900 to-indigo-500 bg-clip-text text-transparent">
          Invisible India
        </Link>
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-bold tracking-tight">
          <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/schemes">Scheme Matcher</Link>
          <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/trust-score">Trust Score</Link>
          <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/help">Help</Link>
          <Link className="text-indigo-900 border-b-2 border-amber-400 pb-1" to="/dashboard">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200/50 rounded-full transition-all scale-95 active:scale-90">
            <span className="material-symbols-outlined">language</span>
          </button>
          
          <button onClick={logout} title="Logout" className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary hover:bg-indigo-900 transition-colors">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-4">Application Journey</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Tracking your progress toward financial resilience. Each step forward is a milestone in your growth story.
          </p>
        </header>

        <section className="relative">
          <div className="flex flex-col gap-12">
            
            {/* Timeline Item 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_20px_rgba(120,90,0,0.4)] z-10"></div>
                <div className="w-px h-full bg-outline-variant/30 mt-4 hidden md:block"></div>
              </div>
              <div className="flex-1 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] hover:shadow-[0_40px_60px_-15px_rgba(26,28,28,0.08)] transition-all duration-500 border border-transparent hover:border-outline-variant/10">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest text-secondary uppercase">24 Oct 2023</span>
                      <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">Under Review</span>
                    </div>
                    <h3 className="text-3xl font-bold text-on-surface">Mudra Loan - Shishu</h3>
                    <p className="text-on-surface-variant leading-relaxed">Micro-credit support for small business start-ups. Essential capital for scaling local operations.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-gradient-to-br from-primary-container to-on-primary-container text-on-primary rounded-xl font-bold transition-transform active:scale-95 shadow-[0_20px_40px_rgba(1,7,102,0.15)]">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-on-primary-container/40 z-10"></div>
                <div className="w-px h-full bg-outline-variant/30 mt-4 hidden md:block"></div>
              </div>
              <div className="flex-1 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] hover:shadow-[0_40px_60px_-15px_rgba(26,28,28,0.08)] transition-all duration-500">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">12 Sep 2023</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">Approved</span>
                    </div>
                    <h3 className="text-3xl font-bold text-on-surface">PM Jan Dhan Yojana</h3>
                    <p className="text-on-surface-variant leading-relaxed">Universal access to banking services. Your foundation for financial inclusion and direct benefit transfers.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-surface-container text-on-surface rounded-xl font-bold transition-transform active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-error/20 z-10"></div>
                <div className="w-px h-full bg-outline-variant/30 mt-4 hidden md:block"></div>
              </div>
              <div className="flex-1 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] hover:shadow-[0_40px_60px_-15px_rgba(26,28,28,0.08)] transition-all duration-500">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">05 Aug 2023</span>
                      <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold">Pending Action</span>
                    </div>
                    <h3 className="text-3xl font-bold text-on-surface">Atal Pension Yojana</h3>
                    <p className="text-on-surface-variant leading-relaxed">Social security scheme providing a defined pension. Document verification required for final activation.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-surface-container text-on-surface rounded-xl font-bold transition-transform active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-on-primary-container/20 z-10"></div>
              </div>
              <div className="flex-1 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] opacity-70">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">15 Jul 2023</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">Approved</span>
                    </div>
                    <h3 className="text-3xl font-bold text-on-surface">Digital Saksharta Abhiyan</h3>
                    <p className="text-on-surface-variant leading-relaxed">IT training for rural citizens. Completed certification for digital literacy and awareness.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-surface-container text-on-surface rounded-xl font-bold transition-transform active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="mt-32">
          <div className="bg-primary-container rounded-xl p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="relative z-10 max-w-xl text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-on-primary mb-6 leading-tight">Your Trust Score is Growing.</h2>
              <p className="text-on-primary-container text-lg leading-relaxed mb-10">
                By maintaining consistent application status and verified profiles, you unlock higher tier schemes and lower interest rates.
              </p>
              <button className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                Explore Tier 2 Schemes
              </button>
            </div>
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-on-primary-container/20 to-transparent flex items-center justify-center border border-on-primary-container/30">
              <div className="text-center">
                <span className="text-6xl font-bold text-on-primary block">742</span>
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mt-2">Excellent</span>
              </div>
              <div className="absolute inset-0 rounded-full border-b-4 border-amber-400 rotate-45"></div>
            </div>

            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-on-primary-container/5 rounded-full blur-3xl"></div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t-0 py-16 px-8 mt-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="font-['Manrope'] font-bold text-indigo-900 text-xl">
            Invisible India
          </div>
          <div className="flex gap-8 font-['Inter'] text-sm text-slate-500">
            <Link className="hover:text-amber-500 transition-colors" to="#">Privacy Policy</Link>
            <Link className="hover:text-amber-500 transition-colors" to="#">Terms of Service</Link>
            <Link className="hover:text-amber-500 transition-colors" to="#">Worker Rights</Link>
            <Link className="hover:text-amber-500 transition-colors" to="#">Partner API</Link>
          </div>
          <div className="text-slate-500 font-['Inter'] text-sm leading-relaxed text-center md:text-right">
            © 2024 Invisible India. Empowering the Resilient Horizon.
          </div>
        </div>
      </footer>
    </div>
  );
}
