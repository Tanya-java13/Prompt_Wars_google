import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UsageBadge() {
  const { user, isAuthenticated, isPremium, generationsRemaining } = useAuth();

  if (!isAuthenticated || !user) return null;

  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold border border-gold/30">
        <i className="ti ti-crown text-xs" aria-hidden="true" />
        Premium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sand text-gray-500 text-xs font-body border border-mist">
      <i className="ti ti-sparkles text-xs" aria-hidden="true" />
      {generationsRemaining > 0
        ? `${generationsRemaining} free generation${generationsRemaining === 1 ? '' : 's'} left`
        : 'Free limit reached'}
    </span>
  );
}
