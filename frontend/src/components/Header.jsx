import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 max-w-full bg-slate-50/80 backdrop-blur-xl z-50 shadow-[0_40px_40px_-15px_rgba(26,28,28,0.06)]">
      <Link to="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-br from-indigo-900 to-indigo-500 bg-clip-text text-transparent">
        Invisible India
      </Link>
      <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-bold tracking-tight">
        <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/schemes">Scheme Matcher</Link>
        <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/trust-score">Trust Score</Link>
        <Link className="text-slate-600 hover:text-indigo-900 transition-colors" to="/help">Help</Link>
        <Link className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-bold hover:bg-indigo-900 transition-colors" to="/login">Login</Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-200/50 rounded-full transition-all scale-95 active:scale-90">
          <span className="material-symbols-outlined">language</span>
        </button>
        <button className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 items-center justify-center text-slate-400 hover:border-slate-400 transition-colors">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>
    </nav>
  );
}
