import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Header variant="landing" />
      <main className="relative overflow-hidden">
        {/*Hero Section */}
        <section className="pt-32 pb-24 px-8 md:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-12">
            <div className="w-full md:w-3/5">
              <span className="text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm mb-6 block">Resilient Horizon</span>
              <h1 className="text-6xl md:text-8xl font-headline font-bold text-on-surface leading-[1.1] tracking-tighter mb-12">
                Humanizing the <br/><span className="text-on-primary-container italic">Invisible Workforce.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl font-body">
                India's backbone consists of 450 million informal workers. Invisible India is the bridge between their resilience and the formal financial infrastructure they deserve.
              </p>
            </div>
            <div className="w-full md:w-2/5 pb-4">
              <div className="bg-secondary-container p-12 rounded-xl rotate-3 shadow-lg hover:rotate-0 transition-transform duration-500">
                <span className="material-symbols-outlined text-5xl text-on-secondary-container mb-6">format_quote</span>
                <p className="text-on-secondary-container text-xl font-medium leading-tight">
                  "We don't just build software; we architect dignity for those who build our cities."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-surface-container-low py-32 px-8 md:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="relative">
                <img alt="Informal labor in India" className="rounded-xl object-cover w-full aspect-[4/5] shadow-2xl" src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
                <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-8 rounded-lg shadow-xl max-w-xs border-l-4 border-secondary-container">
                  <h3 className="font-headline font-bold text-2xl mb-2">The Credit Gap</h3>
                  <p className="text-on-surface-variant text-sm">Over 90% of informal workers lack access to institutional credit, forcing them into high-interest debt traps.</p>
                </div>
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-8 leading-tight">The Problem of <br/>Unverified Identity.</h2>
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="bg-surface-container-lowest w-16 h-16 shrink-0 rounded-full flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary-container">block</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-headline mb-2">Data Invisibility</h4>
                      <p className="text-on-surface-variant leading-relaxed">Daily earnings are cash-based and unrecorded, leaving no digital footprint for traditional banking assessments.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="bg-surface-container-lowest w-16 h-16 shrink-0 rounded-full flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary-container">trending_down</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-headline mb-2">Systemic Friction</h4>
                      <p className="text-on-surface-variant leading-relaxed">Complex documentation and rigid criteria make formal schemes inaccessible to the mobile migrant workforce.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="bg-surface-container-lowest w-16 h-16 shrink-0 rounded-full flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary-container">security_update_warning</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-headline mb-2">Economic Fragility</h4>
                      <p className="text-on-surface-variant leading-relaxed">A single health crisis or equipment failure can reset years of hard-earned progress without financial safety nets.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-32 px-8 md:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-on-surface mb-6">Our Ripple Effect.</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Measuring progress through the lens of individual empowerment and systemic change.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
              <div className="md:col-span-8 bg-gradient-to-br from-[#010766] to-[#747cd3] rounded-xl p-12 flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-white/70 font-headline uppercase tracking-widest text-sm mb-4 block">Total Impact</span>
                  <div className="text-white text-8xl md:text-9xl font-headline font-extrabold tracking-tighter">12.4M</div>
                  <p className="text-white/80 text-2xl mt-4 max-w-md font-body leading-relaxed">
                    Workers successfully onboarded into formal financial ecosystems since 2021.
                  </p>
                </div>
                <div className="relative z-10 flex gap-4 mt-8">
                  <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">Download Report</button>
                  <button className="text-white font-bold border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition-colors">View Schemes</button>
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[400px] text-white">diversity_3</span>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-10 flex flex-col justify-center shadow-[0_40px_40px_rgba(26,28,28,0.06)] border border-outline-variant/15">
                <div className="mb-8">
                  <div className="text-on-primary-container text-6xl font-headline font-bold mb-2">₹4.2B</div>
                  <div className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Credit Disbursed</div>
                </div>
                <div className="h-px bg-outline-variant/20 w-full mb-8"></div>
                <div>
                  <div className="text-on-primary-container text-6xl font-headline font-bold mb-2">1.8k+</div>
                  <div className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Partner Banks</div>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between group">
                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary-container group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-bold mb-2">99.4%</h4>
                  <p className="text-on-surface-variant text-sm">Success rate in verification for workers with zero formal credit history.</p>
                </div>
              </div>
              <div className="md:col-span-8 rounded-xl relative overflow-hidden">
                <img alt="Community gathering" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
                  <h3 className="text-white text-3xl font-headline font-bold">Building Grassroots Resilience</h3>
                  <p className="text-white/80 max-w-sm mt-2">Every number represents a family with newfound stability and a secure future.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Detail */}
        <section className="py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-8 md:px-24">
            <div className="flex flex-col md:flex-row gap-24">
              <div className="w-full md:w-1/3">
                <h2 className="text-5xl font-headline font-bold sticky top-32 leading-tight">The Core Pillars of Inclusion.</h2>
              </div>
              <div className="w-full md:w-2/3 space-y-32">
                <article>
                  <div className="text-on-primary-container font-headline font-bold text-6xl mb-8">01</div>
                  <h3 className="text-3xl font-headline font-bold mb-6">Democratizing Data Access</h3>
                  <p className="text-xl text-on-surface-variant leading-relaxed">
                    We leverage alternative data points—from utility payments to community-vouched reputation—to create a "Resilient Score." This allows workers to bypass traditional banking barriers and prove their creditworthiness through their lived consistency.
                  </p>
                </article>
                <article>
                  <div className="text-on-primary-container font-headline font-bold text-6xl mb-8">02</div>
                  <h3 className="text-3xl font-headline font-bold mb-6">Frictionless Integration</h3>
                  <p className="text-xl text-on-surface-variant leading-relaxed">
                    Our platform isn't just for workers; it's a bridge for institutions. We provide banks with a real-time risk assessment engine tailored specifically for the informal sector, reducing their operational costs and expanding their market reach.
                  </p>
                </article>
                <article>
                  <div className="text-on-primary-container font-headline font-bold text-6xl mb-8">03</div>
                  <h3 className="text-3xl font-headline font-bold mb-6">Empathetic Education</h3>
                  <p className="text-xl text-on-surface-variant leading-relaxed">
                    Inclusion is only as strong as the literacy behind it. We provide micro-learning modules focused on savings, insurance, and interest rates, ensuring every worker we onboard understands how to build generational wealth.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto bg-primary-container rounded-xl p-16 md:p-32 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-8">Ready to join the movement?</h2>
              <p className="text-on-primary-container text-xl md:text-2xl max-w-2xl mx-auto mb-12">Whether you are an institution looking to partner or a worker ready for a profile, your journey starts here.</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">Partner With Us</button>
                <button className="text-white border border-white/20 px-12 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">Request a Demo</button>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-container/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
