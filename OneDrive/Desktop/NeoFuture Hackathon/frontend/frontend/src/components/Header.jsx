import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ variant = 'protected' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const isAuth = variant === 'auth';
  const isLanding = variant === 'landing';
  const isProtected = variant === 'protected';

  const currentPath = location.pathname;

  return (
    <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300 border-b border-surface-container w-full">
      <nav className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
        <Link to={isProtected || token ? "/dashboard" : "/"} className="text-2xl font-bold tracking-tighter text-indigo-950 font-headline">
          Invisible India
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {/* Landing Links */}
          {isLanding && (
            <>
              <Link
                className={`font-medium transition-colors duration-300 ${currentPath === '/home' || currentPath === '/' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-headline font-bold' : 'text-slate-600 hover:text-indigo-700'}`}
                to="/"
              >
                Schemes
              </Link>
              <Link
                className={`font-medium transition-colors duration-300 ${currentPath === '/about' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-headline font-bold' : 'text-slate-600 hover:text-indigo-700'}`}
                to="/about"
              >
                About Us
              </Link>
              <Link
                className={`font-medium transition-colors duration-300 ${currentPath === '/help' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-headline font-bold' : 'text-slate-600 hover:text-indigo-700'}`}
                to="/help"
              >
                Help Center
              </Link>
            </>
          )}

          {/* Protected Links */}
          {isProtected && (
            <>
              <Link
                className={`font-medium transition-colors duration-300 ${currentPath === '/my-applications' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-headline font-bold' : 'text-slate-600 hover:text-indigo-700'}`}
                to="/my-applications"
              >
                Dashboard
              </Link>
              <Link
                className={`font-medium transition-colors duration-300 ${currentPath === '/matched-schemes' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-headline font-bold' : 'text-slate-600 hover:text-indigo-700'}`}
                to="/matched-schemes"
              >
                Schemes
              </Link>
            </>
          )}

          {/* Divider */}
          {(!isAuth) && <div className="h-6 w-px bg-outline-variant/30"></div>}

          {/* Right Side Options */}
          <div className="flex gap-4 items-center">
            <button className="text-indigo-900 font-bold px-4 py-2 hover:bg-surface-container rounded-full transition-all">
              <span className="material-symbols-outlined align-middle mr-1">translate</span>
              Hindi/Marathi
            </button>

            {isLanding && (
              <>
                <Link to="/login" className="text-indigo-900 font-bold hover:text-indigo-700 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-primary-container text-white px-6 py-3 rounded-full hover:scale-95 transition-all duration-200">
                  Worker Sign Up
                </Link>
                <Link to="/partner-login" className="bg-secondary-container text-indigo-950 px-6 py-3 rounded-full hover:scale-95 transition-all duration-200 font-bold">
                  Register as Partner
                </Link>
              </>
            )}

            {isAuth && currentPath === '/login' && (
              <Link to="/register" className="bg-primary-container text-white px-8 py-3 rounded-full hover:scale-95 transition-all duration-200">
                Register
              </Link>
            )}

            {isAuth && currentPath === '/register' && (
              <Link to="/login" className="bg-surface-container-high text-indigo-900 font-bold px-8 py-3 rounded-full hover:bg-surface-container transition-all duration-200">
                Login
              </Link>
            )}

            {isProtected && (
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }} 
                className="bg-indigo-900 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-800 transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
