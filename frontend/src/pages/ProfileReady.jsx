import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfileReady() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-on-primary-container/30 min-h-screen flex flex-col">
      <Header variant="protected" />
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary-fixed-dim blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary-fixed blur-[100px]"></div>
        </div>

        {/* Success Content Container */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center mt-20">
          {/* Hero Illustration/Visual */}
          <div className="relative mb-12">
            <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
              <span className="material-symbols-outlined text-8xl md:text-9xl text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>
                verified
              </span>
            </div>
            {/* Abstract "Popper" Effects */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary-container rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-4 -left-8 w-12 h-12 bg-on-primary-container rounded-full opacity-40"></div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <h1 className="font-headline font-bold text-5xl md:text-7xl text-on-surface tracking-tight leading-[1.1]">
              Your profile is ready 🎉
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
              Welcome to Invisible India. We've mapped your skills to the most relevant national schemes and resources.
            </p>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-6 items-center">
            <button 
              onClick={() => navigate('/trust-score')}
              className="bg-gradient-to-br from-[#010766] to-[#747cd3] text-on-primary font-headline font-bold text-xl px-12 py-6 rounded-xl shadow-[0_40px_40px_-15px_rgba(26,28,28,0.1)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
            >
              View Your Score
              <span className="material-symbols-outlined">trending_up</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-on-surface-variant font-headline font-semibold text-lg px-8 py-6 rounded-full hover:bg-surface-container-low transition-colors"
            >
              Dashboard
            </button>
          </div>

          {/* Bento Preview Section */}
          <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] text-left flex flex-col gap-4">
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-fixed">description</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">12 Matches</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">We found government schemes specifically tailored to your artisan background.</p>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] text-left flex flex-col gap-4">
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Tier 1 Status</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Your verified documentation has placed you in the highest trust bracket.</p>
            </div>
            
            <div className="bg-primary-fixed-dim p-8 rounded-lg shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)] text-left flex flex-col gap-4">
              <div className="w-12 h-12 bg-on-primary-fixed/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-fixed">local_library</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-on-primary-fixed">Upskill Now</h3>
              <p className="text-on-primary-fixed-variant text-sm leading-relaxed">Recommended workshop: "Digital Literacy for Independent Weavers" begins tomorrow.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
