import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HelpSupport() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-fixed min-h-screen flex flex-col">
      <Header variant="landing" />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-12 md:p-20 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.04)]">
            <div className="relative z-10 max-w-2xl">
              <span className="text-secondary font-headline font-bold tracking-widest text-xs uppercase mb-4 block">Support Center</span>
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface leading-tight mb-6">How can we support your journey today?</h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-10">We're here to ensure every worker and partner has the resources they need to thrive. Simple support, built on trust.</p>
              <div className="relative max-w-md">
                <input className="w-full bg-surface-container-low border-none rounded-md py-4 pl-12 pr-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/20 transition-all" placeholder="Search for help topics..." type="text"/>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block">
              <img className="h-full w-full object-cover opacity-20 grayscale mix-blend-multiply" src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Support" />
            </div>
          </div>
        </section>

        {/* Bento Grid for Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-7 bg-primary-container text-white rounded-xl p-10 md:p-14 relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>phone</span>
              </div>
              <h2 className="text-4xl font-headline font-bold mb-4">Call Support</h2>
              <p className="text-primary-fixed-dim text-lg mb-8 max-w-md">Speak directly with our dedicated empathy team. Available 24/7 for urgent assistance and worker rights queries.</p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4">
              <button className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-full font-headline font-bold text-lg hover:scale-105 active:scale-95 transition-transform">
                Dial 1-800-INVISIBLE
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-5 rounded-full font-headline font-semibold hover:bg-white/20 transition-colors">
                Request Callback
              </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="md:col-span-5 bg-secondary-container rounded-xl p-10 flex flex-col items-center justify-center text-center group">
            <div className="w-24 h-24 rounded-full bg-on-secondary-container/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-6xl text-on-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-secondary-container mb-4">Voice Help</h2>
            <p className="text-on-secondary-fixed-variant mb-10 max-w-xs">Just speak your question. Our AI-driven voice assistant supports 12 regional languages.</p>
            <button className="w-full bg-on-secondary-container text-secondary-container py-5 rounded-full font-headline font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
              Start Speaking
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-4">Common Questions</h2>
              <p className="text-on-surface-variant max-w-xl text-lg">Quick answers to help you navigate our platform and protect your rights effectively.</p>
            </div>
            <Link className="text-indigo-900 font-bold flex items-center gap-2 hover:underline" to="/help">
              View all documentation <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/15 hover:border-indigo-200 transition-colors">
              <h3 className="text-xl font-headline font-bold mb-4">How is my Trust Score calculated?</h3>
              <p className="text-on-surface-variant leading-relaxed">Your Trust Score is built on consistent verified work history, timely payments for partners, and peer endorsements within the community. It's a living record of your professional resilience.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/15 hover:border-indigo-200 transition-colors">
              <h3 className="text-xl font-headline font-bold mb-4">What should I do if a payment is delayed?</h3>
              <p className="text-on-surface-variant leading-relaxed">Use the 'Report Dispute' button in your dashboard. Our automated mediator first contacts the partner, and if unresolved in 24 hours, an Invisible India human advocate intervenes.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/15 hover:border-indigo-200 transition-colors">
              <h3 className="text-xl font-headline font-bold mb-4">Are my personal details private?</h3>
              <p className="text-on-surface-variant leading-relaxed">Yes. Partners only see your Trust Score and skills. Your full identity is only shared once a work contract is digitally signed by both parties through our secure portal.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/15 hover:border-indigo-200 transition-colors">
              <h3 className="text-xl font-headline font-bold mb-4">Can I access schemes in my local language?</h3>
              <p className="text-on-surface-variant leading-relaxed">Absolutely. We support over 12 languages. You can toggle your preference in the top navigation bar or simply ask our 'Voice Help' assistant in your native tongue.</p>
            </div>
          </div>
        </section>

        {/* Visual Trust Banner */}
        <section className="rounded-xl overflow-hidden relative min-h-[400px] flex items-center px-10 md:px-20">
          <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Landscape" />
          <div className="absolute inset-0 bg-primary-container/60 backdrop-blur-[2px]"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl font-headline font-bold text-white mb-6">Built on Editorial Integrity</h2>
            <p className="text-primary-fixed text-lg mb-8">We believe that support isn't just about answering questions—it's about providing a stable horizon for those who keep the world moving. Your resilience is our mandate.</p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/150?img=33" alt="Team member" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/150?img=47" alt="Team member" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/150?img=12" alt="Team member" />
              </div>
              <p className="text-white font-medium">Join 40,000+ workers supported today.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
