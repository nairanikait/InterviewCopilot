import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LandingNav – public navbar shown only on the landing page.
 * Does NOT reuse AppShell or TopBar (those are for authenticated pages).
 */
export function LandingNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-dark-200">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          id="landing-nav-logo"
          onClick={() => navigate('/')}
          className="text-sm font-bold text-dark-900 tracking-tight hover:opacity-80 transition-opacity"
        >
          InterviewCopilot
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-dark-600">
          <a href="#features" className="hover:text-dark-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-dark-900 transition-colors">How It Works</a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="landing-nav-login"
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-dark-600 hover:text-dark-900 transition-colors px-3 py-2"
          >
            Login
          </button>
          <button
            id="landing-nav-get-started"
            onClick={() => navigate('/login', { state: { register: true } })}
            className="btn-primary text-sm px-5 py-2"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          id="landing-nav-mobile-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden btn-ghost p-2 rounded-xl"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-100 bg-white px-5 py-4 space-y-3 animate-fade-in">
          <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-dark-700 py-1.5 hover:text-dark-900">Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm text-dark-700 py-1.5 hover:text-dark-900">How It Works</a>
          <div className="pt-2 space-y-2">
            <button
              id="landing-mobile-login"
              onClick={() => { setMobileOpen(false); navigate('/login'); }}
              className="btn-secondary w-full text-sm py-2.5"
            >
              Login
            </button>
            <button
              id="landing-mobile-get-started"
              onClick={() => { setMobileOpen(false); navigate('/login', { state: { register: true } }); }}
              className="btn-primary w-full text-sm py-2.5"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
