import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-bright py-16 px-8 mt-auto">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto border-t border-outline-variant/20 pt-12">
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
  );
}
