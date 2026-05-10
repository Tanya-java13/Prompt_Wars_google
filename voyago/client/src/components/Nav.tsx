import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UsageBadge from './UsageBadge';
import LoginModal from './LoginModal';

const links = [
  { label: 'Discover', id: 'destinations' },
  { label: 'Plan a Trip', id: 'planner' },
  { label: 'Experiences', id: 'features' },
  { label: 'Real-Time Updates', id: 'alerts' },
];

export default function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 bg-forest transition-shadow ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <span className="font-display text-2xl font-semibold text-cream tracking-tight">
              Voya<em className="text-gold-light italic not-italic" style={{ fontStyle: 'italic' }}>go</em>
            </span>

            <div className="hidden md:flex items-center gap-7">
              {links.map(({ label, id }) => (
                <button key={label} onClick={() => go(id)}
                  className="text-sm text-cream/65 hover:text-gold-light transition-colors font-body">
                  {label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <UsageBadge />

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(d => !d)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    aria-expanded={showDropdown}
                    aria-haspopup="true"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-gold/40" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold text-xs font-semibold">{user.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-cream text-sm font-body max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <i className="ti ti-chevron-down text-cream/50 text-xs" aria-hidden="true" />
                  </button>

                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-mist z-50 py-1 overflow-hidden">
                        <div className="px-4 py-2 border-b border-mist">
                          <p className="text-sm font-semibold text-gray-700 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { go('planner'); setShowDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-sand transition-colors font-body flex items-center gap-2"
                        >
                          <i className="ti ti-map text-gray-400 text-sm" aria-hidden="true" />My Trips
                        </button>
                        <button
                          onClick={() => { logout(); setShowDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-coral hover:bg-coral/5 transition-colors font-body flex items-center gap-2"
                        >
                          <i className="ti ti-logout text-coral text-sm" aria-hidden="true" />Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gold text-forest text-sm font-semibold px-5 py-2 rounded-full hover:bg-gold-light transition-colors flex items-center gap-1.5"
                >
                  <i className="ti ti-brand-google text-sm" aria-hidden="true" />Sign In
                </button>
              )}
            </div>

            <button className="md:hidden text-cream text-xl" onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}>
              <i className={`ti ti-${open ? 'x' : 'menu-2'}`} />
            </button>
          </div>

          {open && (
            <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-3">
              {links.map(({ label, id }) => (
                <button key={label} onClick={() => go(id)}
                  className="text-left text-cream/75 hover:text-gold-light text-sm py-1 font-body">
                  {label}
                </button>
              ))}
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 py-2 border-t border-white/10 mt-1">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold text-xs font-semibold">{user.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-cream text-sm font-body">{user.name}</span>
                    <UsageBadge />
                  </div>
                  <button onClick={() => { logout(); setOpen(false); }}
                    className="text-left text-coral/80 text-sm py-1 font-body">
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setOpen(false); }}
                  className="mt-1 w-fit bg-gold text-forest text-sm font-semibold px-5 py-2 rounded-full flex items-center gap-1.5"
                >
                  <i className="ti ti-brand-google text-sm" aria-hidden="true" />Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
      />
    </>
  );
}
