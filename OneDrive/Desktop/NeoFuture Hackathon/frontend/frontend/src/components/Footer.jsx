import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-12 px-8 mt-auto border-t border-surface-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-bold text-indigo-950 mb-4 text-lg font-headline">Invisible India</div>
          <p className="text-slate-500 font-body text-sm leading-relaxed">
            Empowering the informal workforce through accessible technology and direct government linkage.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link className="text-slate-500 text-sm hover:text-indigo-600 transition-all" to="/dashboard">Government Schemes</Link>
          <Link className="text-slate-500 text-sm hover:text-indigo-600 transition-all" to="/help">Help Center</Link>
          <Link className="text-slate-500 text-sm hover:text-indigo-600 transition-all" to="/about">About Us</Link>
        </div>
        <div className="text-right flex flex-col justify-between">
          <p className="text-indigo-950 font-bold font-body">© 2024 Invisible India. Secure & Private.</p>
          <div className="flex justify-end gap-4 mt-4">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600">shield</span>
            <span class="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600">lock</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
