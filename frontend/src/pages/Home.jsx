import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <Header variant="landing" />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 primary-gradient z-0"></div>
          <div 
            className="absolute inset-0 opacity-20 z-10" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLRPOXtCaYV8g4Lxawi5TRu5BvJ5abqz96cyLQA2QjPVu6fkxhq0lxm7Eo6oTOi3PTDkNliGENgeQ4t_R6XX0mGGZCyXC6Rjlh07VRxpkD3T0Av5XfQl2uh48K06aNyusWFhEphGJhswD7j-bow2GaBNV1f_LW_h6uAjwAnHhll0C7kk1Fs0-xHwosg5R4TSM1UCLbgDxOVGJo8hMvvGVV9DABrE3PUw4rtina6ERpJVxaBKCRaIJOlAdeKPjkvw4-gNs4xBhuMobj')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          <div className="relative z-20 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 py-24">
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-white font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
                Your Work. <br/>
                Your Identity. <br/>
                <span className="text-secondary-container">Your Future.</span>
              </h1>
              <p className="text-indigo-100 text-xl md:text-2xl leading-relaxed mb-12 max-w-xl font-light">
                Empowering India's informal workforce with digital identity and direct access to financial independence. No more middlemen, just pure agency.
              </p>
              <Link to="/register" className="bg-secondary-container text-on-secondary-container font-headline font-bold text-xl px-12 py-6 rounded-xl editorial-shadow hover:scale-105 transition-transform duration-300">
                Get Started
              </Link>
            </div>
            
            <div className="hidden lg:flex justify-end items-center">
              <div className="relative w-full max-w-lg aspect-square bg-white/10 backdrop-blur-md rounded-xl p-8 transform rotate-3">
                <img 
                  alt="identity card" 
                  className="w-full h-full object-cover rounded-lg editorial-shadow" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV6dwPqgZxFSf9q1pRFBFtNo-u5z4JBx-Bk7rYrCJ31iSw66sAvYzcqexvHul32zWS7V-HABRIbzkkHkFgPnVMUluuqN-bOIhar43z8WfIYwpZy59HZ4wo-3pzFbHm6eGlH0sNAy-Gsk9gZxIubFf1_GPEMwq9kxV9YwHrd72sOg5Y3D8-uvn4vROsLwdNPo6zHGWisPF0qXg-OU7hvZwpKmSf-gU-jCdoQfYMH6BcoGS-FUwpEj36AiRiU7BZmyXj4z87kaYECZ8q"
                />
                <div className="absolute -bottom-8 -left-8 bg-secondary-container p-6 rounded-lg editorial-shadow">
                  <span className="material-symbols-outlined text-4xl block mb-2">verified_user</span>
                  <p className="font-headline font-bold">100% Secured</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="bg-surface-container-low py-20 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-headline font-extrabold text-indigo-950 mb-2">450M+</span>
              <p className="text-slate-600 font-medium text-lg uppercase tracking-wider">Informal Workers</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-headline font-extrabold text-indigo-950 mb-2">1-Tap</span>
              <p className="text-slate-600 font-medium text-lg uppercase tracking-wider">Scheme Access</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-headline font-extrabold text-indigo-950 mb-2">Zero</span>
              <p className="text-slate-600 font-medium text-lg uppercase tracking-wider">Paperwork</p>
            </div>
          </div>
        </section>

        {/* Featured Schemes */}
        <section className="bg-surface-container py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-headline font-bold text-indigo-950 mb-6">Government Schemes Tailored for You</h2>
                <p className="text-slate-500 text-lg">We match your profile with the best schemes available, removing the confusion of paperwork.</p>
              </div>
              <a className="text-indigo-600 font-bold flex items-center gap-2 mb-2 group" href="#">
                View All Schemes 
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-10 rounded-lg editorial-shadow transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-indigo-600 text-3xl">payments</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-indigo-950 mb-4">Mudra Loan</h4>
                <p className="text-slate-500 mb-8 leading-relaxed">Collateral-free business loans up to ₹10 Lakhs to start or expand your small business.</p>
                <button onClick={() => navigate('/scheme-details')} className="w-full py-4 rounded-full bg-surface-container font-bold text-indigo-900 hover:bg-indigo-900 hover:text-white transition-colors">Details</button>
              </div>
              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-10 rounded-lg editorial-shadow transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-red-600 text-3xl">health_and_safety</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-indigo-950 mb-4">PM Suraksha</h4>
                <p className="text-slate-500 mb-8 leading-relaxed">Accident insurance cover for a death or disability due to an accident at a nominal premium.</p>
                <button onClick={() => navigate('/scheme-details')} className="w-full py-4 rounded-full bg-surface-container font-bold text-indigo-900 hover:bg-indigo-900 hover:text-white transition-colors">Details</button>
              </div>
              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-10 rounded-lg editorial-shadow transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-amber-600 text-3xl">account_balance</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-indigo-950 mb-4">Jan Dhan</h4>
                <p className="text-slate-500 mb-8 leading-relaxed">Zero-balance savings account with access to credit, insurance and pension services.</p>
                <button onClick={() => navigate('/scheme-details')} className="w-full py-4 rounded-full bg-surface-container font-bold text-indigo-900 hover:bg-indigo-900 hover:text-white transition-colors">Details</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;