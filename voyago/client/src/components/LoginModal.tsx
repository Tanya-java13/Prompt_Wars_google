import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, onSuccess, message }: Props) {
  const { isAuthenticated, loginError, login } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);
  const didSucceed = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated && !didSucceed.current) {
      didSucceed.current = true;
      onSuccess();
    }
  }, [isAuthenticated, isOpen, onSuccess]);

  useEffect(() => {
    if (!isOpen) { didSucceed.current = false; setShowFallback(false); }
  }, [isOpen]);

  // Try to render the GIS iframe button; if it stays empty after 1.5s, show fallback
  useEffect(() => {
    if (!isOpen || !btnRef.current) return;

    const tryRender = () => {
      if (typeof google === 'undefined' || !google.accounts?.id) return false;
      if (!btnRef.current) return false;
      btnRef.current.innerHTML = '';
      google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_blue',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 280,
      });
      return true;
    };

    let pollInterval: ReturnType<typeof setInterval>;
    if (!tryRender()) {
      pollInterval = setInterval(() => { if (tryRender()) clearInterval(pollInterval); }, 200);
    }

    // After 1.5s check if iframe actually rendered; if not, show our own button
    const fallbackTimer = setTimeout(() => {
      if (!btnRef.current?.querySelector('iframe')) {
        setShowFallback(true);
      }
    }, 1500);

    return () => { clearInterval(pollInterval); clearTimeout(fallbackTimer); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Voyago"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-plane text-gold text-2xl" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl text-forest mb-2">Welcome to Voyago</h3>
          <p className="text-gray-500 text-sm font-body leading-relaxed">
            {message || 'Sign in with Google to generate your personalised travel itinerary.'}
          </p>
        </div>

        {loginError && (
          <p className="text-coral text-xs text-center mb-3 font-body bg-coral/5 px-3 py-2 rounded-lg">
            {loginError}
          </p>
        )}

        <div className="flex justify-center mb-4 min-h-[44px]">
          {/* GIS iframe button — hidden once we show fallback */}
          <div ref={btnRef} id="voyago-gsi-btn" className={showFallback ? 'hidden' : ''} />

          {showFallback && (
            <button
              onClick={login}
              className="flex items-center gap-3 px-6 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-medium rounded-md transition-colors shadow-sm w-[280px] justify-center"
              aria-label="Sign in with Google"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#fff" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 font-body transition-colors"
          >
            Maybe later
          </button>
        </div>

        <p className="text-xs text-gray-300 text-center mt-4 font-body">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
