import React, { useEffect, useState } from 'react';

interface TripSummary {
  id: string;
  destination: string;
  origin: string;
  dates: string;
  travellers: string;
  budget: string;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyTripsDrawer({ isOpen, onClose }: Props) {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetch('/api/trips/mine', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load'))
      .then(data => setTrips(data.trips ?? []))
      .catch(() => setError('Could not load trips. Please try again.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="My Trips">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-mist bg-forest">
          <div>
            <h2 className="font-display text-lg text-cream">My Trips</h2>
            <p className="text-xs text-cream/50 font-body mt-0.5">Your saved itineraries</p>
          </div>
          <button onClick={onClose} className="text-cream/60 hover:text-cream transition-colors p-1" aria-label="Close">
            <i className="ti ti-x text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 bg-gold rounded-full dot-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
              <p className="text-sm text-gray-400 font-body">Loading your trips…</p>
            </div>
          )}

          {error && (
            <div className="m-6 p-4 bg-coral/5 border border-coral/20 rounded-xl text-sm text-coral font-body text-center">
              {error}
            </div>
          )}

          {!loading && !error && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-1">
                <i className="ti ti-map-off text-2xl text-gold" />
              </div>
              <p className="text-gray-600 font-semibold text-sm">No saved trips yet</p>
              <p className="text-gray-400 text-xs font-body leading-relaxed">
                Generate an itinerary and click "Save Trip" to see it here.
              </p>
            </div>
          )}

          {!loading && trips.length > 0 && (
            <ul className="divide-y divide-mist">
              {trips.map(trip => (
                <li key={trip.id} className="px-6 py-5 hover:bg-sand/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ti ti-plane text-forest text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 font-body truncate">{trip.destination}</p>
                      <p className="text-xs text-gray-400 font-body mt-0.5">from {trip.origin}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trip.dates && trip.dates !== 'Flexible' && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">
                            <i className="ti ti-calendar text-xs" />{trip.dates}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">
                          <i className="ti ti-users text-xs" />{trip.travellers}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">
                          <i className="ti ti-wallet text-xs" />{trip.budget.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 font-body shrink-0 mt-0.5">{formatDate(trip.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
