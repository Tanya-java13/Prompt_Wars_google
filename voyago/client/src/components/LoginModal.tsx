import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, onSuccess, message }: Props) {
  const { isAuthenticated, loginError } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);
  const didSucceed = useRef(false);

  // When the user logs in while the modal is open, trigger onSuccess
  useEffect(() => {
    if (isOpen && isAuthenticated && !didSucceed.current) {
      didSucceed.current = true;
      onSuccess();
    }
  }, [isAuthenticated, isOpen, onSuccess]);

  // Reset the flag when the modal closes
  useEffect(() => {
    if (!isOpen) didSucceed.current = false;
  }, [isOpen]);

  // Render the Google Sign-In button whenever the modal opens
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

    if (!tryRender()) {
      const interval = setInterval(() => { if (tryRender()) clearInterval(interval); }, 200);
      return () => clearInterval(interval);
    }
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
          <div ref={btnRef} id="voyago-gsi-btn" />
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
