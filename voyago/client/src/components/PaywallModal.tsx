import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  triggerType: 'generation' | 'customization';
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof Razorpay !== 'undefined') { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

export default function PaywallModal({ isOpen, onClose, onUpgradeSuccess, triggerType }: Props) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      await loadRazorpayScript();

      const res = await fetch('/api/subscribe/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Could not create subscription');
      const { subscriptionId } = await res.json();

      const rzp = new Razorpay({
        key: RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: 'Voyago Premium',
        description: 'Unlimited AI itineraries — Rs 49/month',
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch('/api/subscribe/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(response),
            });

            if (verifyRes.ok) {
              await refreshUser();
              onUpgradeSuccess();
              onClose();
            } else {
              setError('Payment verification failed. Contact support.');
            }
          } catch {
            setError('Verification failed. Your payment is safe — contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
          name: user?.name || '',
        },
        theme: { color: '#1B4332' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch {
      setError('Could not start payment. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isGenerationLimit = triggerType === 'generation';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Premium"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-forest px-6 py-5 text-center">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-3">
            <i className="ti ti-crown text-gold text-xl" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl text-cream">Upgrade to Premium</h3>
          <p className="text-cream/60 text-sm font-body mt-1">
            {isGenerationLimit
              ? "You've used your 2 free itinerary generations"
              : "You've used your free customization"}
          </p>
        </div>

        {/* Pricing */}
        <div className="px-6 py-6">
          <div className="text-center mb-5">
            <span className="font-display text-4xl font-bold text-forest">Rs 49</span>
            <span className="text-gray-400 text-sm font-body"> / month</span>
          </div>

          <ul className="space-y-3 mb-6">
            {[
              { icon: 'ti-infinity', text: 'Unlimited AI itinerary generations' },
              { icon: 'ti-edit', text: 'Unlimited customizations & day trips' },
              { icon: 'ti-bolt', text: 'Priority AI generation speed' },
              { icon: 'ti-heart', text: 'Support independent travel tech' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-body text-gray-600">
                <i className={`ti ${icon} text-gold text-base`} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-coral text-xs text-center mb-3 font-body">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading || !RAZORPAY_KEY_ID}
            className="w-full bg-gold text-forest py-3 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-forest rounded-full dot-bounce" style={{ animationDelay: `${i * 0.18}s` }} />)}
                </div>
                <span>Processing…</span>
              </>
            ) : !RAZORPAY_KEY_ID ? (
              <>
                <i className="ti ti-clock" aria-hidden="true" />
                Payments launching soon
              </>
            ) : (
              <>
                <i className="ti ti-lock-open" aria-hidden="true" />
                Subscribe — Rs 49/month
              </>
            )}
          </button>

          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-600 font-body transition-colors"
            >
              Not now
            </button>
            <span className="text-xs text-gray-300 font-body">Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
