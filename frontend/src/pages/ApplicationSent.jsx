import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ApplicationSent() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col">
      <Header variant="protected" />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-sm tracking-wide">
              Status: Pending
            </div>
            <div className="space-y-4">
              <h1 className="text-on-surface font-headline font-bold text-5xl md:text-6xl tracking-tight leading-[1.1]">
                The journey to <br/>
                <span className="bg-gradient-to-br from-primary-container to-on-primary-container bg-clip-text text-transparent">Invisible India</span> <br/>
                has begun.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                Your application for the Scheme Matcher program has been successfully received. We are currently verifying your credentials against our resilience framework.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/track-application')}
                className="bg-gradient-to-br from-[#010766] to-[#747cd3] text-on-primary font-headline font-bold px-12 py-6 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] hover:scale-105 transition-transform duration-300"
              >
                Track Application
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border border-outline-variant/30 text-on-surface font-headline font-bold px-12 py-6 rounded-xl hover:bg-surface-container transition-colors"
              >
                Dashboard
              </button>
            </div>
            
            <div className="pt-8 border-t border-outline-variant/10 flex items-center gap-6">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-high overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://i.pravatar.cc/150?img=11" alt="Worker" />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-high overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://i.pravatar.cc/150?img=9" alt="Worker" />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  +4k
                </div>
              </div>
              <p className="text-on-surface-variant text-sm font-medium">
                Joined by 4,200+ resilient workers <br/> across the horizon.
              </p>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -z-10"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined text-primary-container/20 text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
                  <h3 className="text-on-surface font-headline font-bold text-xl">Verification in Progress</h3>
                  <p className="text-on-surface-variant text-sm">Reference ID: IV-99203-II</p>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-6">
                    <div className="bg-primary-container h-full w-1/3 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl aspect-square shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] overflow-hidden group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" alt="Building" />
              </div>
              <div className="bg-primary-container rounded-xl aspect-square flex flex-col justify-center items-center text-center p-6 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
                <span className="material-symbols-outlined text-amber-400 text-4xl mb-2" style={{fontVariationSettings: "'FILL' 1"}}>shield_with_heart</span>
                <span className="text-on-primary font-headline font-bold text-sm">Protected Identity</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 md:right-12 bg-white/80 backdrop-blur-xl p-6 rounded-lg shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)] max-w-[240px] border border-outline-variant/10">
              <p className="text-on-surface text-sm italic leading-relaxed">
                "The horizon is not a boundary, but a promise of what is to come."
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary-container"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Invisible India</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
