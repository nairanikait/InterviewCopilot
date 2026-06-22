import { useRef, useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { NAV_ITEMS } from './Sidebar';

/**
 * TopBar – shown in all authenticated pages.
 * Avatar opens a dropdown with user info and Logout.
 */
export function TopBar() {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-dark-200">
      {/* Mobile Hamburger */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="p-2 -ml-2 text-dark-600 hover:text-dark-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop spacer or Mobile Logo placeholder */}
      <div className="flex-1 md:flex-none" />

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <Button
          id="topbar-prepare-now"
          variant="primary"
          onClick={() => navigate('/interview')}
          className="text-xs px-3 py-1.5 md:px-4 md:py-2"
        >
          Prepare Now
        </Button>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          id="topbar-avatar"
          onClick={() => setOpen((v) => !v)}
          className="h-8 w-8 rounded-full bg-dark-700 flex items-center justify-center text-white text-xs font-semibold cursor-pointer select-none hover:bg-dark-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label="User menu"
          aria-expanded={open}
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-dark-200 shadow-lg py-1 animate-fade-in">
            {/* User info */}
            <div className="px-4 py-3 border-b border-dark-100">
              <p className="text-sm font-semibold text-dark-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-400 truncate mt-0.5">{user?.email || ''}</p>
            </div>

            {/* Logout */}
            <button
              id="topbar-logout"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white border-b border-dark-200 shadow-sm z-10 animate-fade-in">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-dark-900 text-white'
                      : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
