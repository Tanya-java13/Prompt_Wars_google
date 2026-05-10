import React, { useEffect, useState, useCallback } from 'react';
import type { Itinerary } from '../types/travel';

interface TripSummary {
  id: string;
  destination: string;
  origin: string;
  dates: string;
  travellers: string;
  budget: string;
  createdAt: string;
}

interface TripDetail extends TripSummary {
  itinerary: Itinerary;
  preferences: string[];
  constraints: string | null;
}

const BADGE: Record<string, string> = {
  stay:       'bg-sky/15 text-sky border border-sky/30',
  eat:        'bg-coral/15 text-coral border border-coral/30',
  explore:    'bg-gold/15 text-gold border border-gold/30',
  experience: 'bg-forest/10 text-forest border border-forest/20',
  transport:  'bg-gray-100 text-gray-500 border border-gray-200',
};
const BADGE_LABEL: Record<string, string> = {
  stay: 'Stay', eat: 'Dine', explore: 'Explore', experience: 'Experience', transport: 'Transit',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReplan?: (destination: string, origin: string) => void;
}

export default function MyTripsDrawer({ isOpen, onClose, onReplan }: Props) {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TripDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTrips = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/trips/mine', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject('Failed'))
      .then(data => setTrips(data.trips ?? []))
      .catch(() => setError('Could not load trips. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isOpen) { setSelected(null); loadTrips(); } }, [isOpen, loadTrips]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selected ? setSelected(null) : onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, selected]);

  const openTrip = async (trip: TripSummary) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSelected(data);
    } catch {
      setError('Could not load trip details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE', credentials: 'include' });
      setTrips(prev => prev.filter(t => t.id !== id));
      setSelected(null);
    } catch {
      setError('Could not delete trip.');
    } finally {
      setDeleting(false);
    }
  };

  const share = (tripId: string) => {
    const url = `${window.location.origin}/api/trips/${tripId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const replan = () => {
    if (!selected) return;
    onReplan?.(selected.destination, selected.origin);
    onClose();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="My Trips">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-mist bg-forest shrink-0">
          {selected && (
            <button onClick={() => setSelected(null)} className="text-cream/70 hover:text-cream transition-colors p-1 -ml-1" aria-label="Back to list">
              <i className="ti ti-arrow-left text-lg" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg text-cream truncate">
              {selected ? selected.destination : 'My Trips'}
            </h2>
            <p className="text-xs text-cream/50 font-body">
              {selected ? `from ${selected.origin}` : 'Your saved itineraries'}
            </p>
          </div>
          <button onClick={onClose} className="text-cream/60 hover:text-cream transition-colors p-1 shrink-0" aria-label="Close">
            <i className="ti ti-x text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Loading list */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gold rounded-full dot-bounce" style={{ animationDelay: `${i * 0.18}s` }} />)}
              </div>
              <p className="text-sm text-gray-400 font-body">Loading your trips…</p>
            </div>
          )}

          {error && (
            <div className="m-5 p-4 bg-coral/5 border border-coral/20 rounded-xl text-sm text-coral font-body text-center">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !selected && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-1">
                <i className="ti ti-map-off text-2xl text-gold" />
              </div>
              <p className="text-gray-600 font-semibold text-sm">No saved trips yet</p>
              <p className="text-gray-400 text-xs font-body leading-relaxed">
                Generate an itinerary and tap "Save Trip" to keep it here.
              </p>
            </div>
          )}

          {/* Trip list */}
          {!loading && !selected && trips.length > 0 && (
            <ul className="divide-y divide-mist">
              {trips.map(trip => (
                <li key={trip.id}>
                  <button
                    onClick={() => openTrip(trip)}
                    className="w-full text-left px-5 py-4 hover:bg-sand/40 active:bg-sand transition-colors flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-forest/20 transition-colors">
                      <i className="ti ti-plane text-forest text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800 font-body truncate">{trip.destination}</p>
                        <p className="text-xs text-gray-300 font-body shrink-0">{formatDate(trip.createdAt)}</p>
                      </div>
                      <p className="text-xs text-gray-400 font-body mt-0.5">from {trip.origin}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">{trip.travellers}</span>
                        <span className="text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">{trip.budget.split(' ')[0]}</span>
                        {trip.dates && trip.dates !== 'Flexible' && (
                          <span className="text-xs text-gray-500 font-body bg-mist px-2 py-0.5 rounded-full">{trip.dates}</span>
                        )}
                      </div>
                    </div>
                    <i className="ti ti-chevron-right text-gray-300 group-hover:text-gold transition-colors shrink-0 mt-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Detail loading */}
          {detailLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gold rounded-full dot-bounce" style={{ animationDelay: `${i * 0.18}s` }} />)}
              </div>
              <p className="text-sm text-gray-400 font-body">Loading itinerary…</p>
            </div>
          )}

          {/* Trip detail */}
          {selected && !detailLoading && (
            <div>
              {/* Summary strip */}
              <div className="bg-sand/50 px-5 py-4 border-b border-mist flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-body">
                  <i className="ti ti-users text-gold" />{selected.travellers}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-body">
                  <i className="ti ti-wallet text-gold" />{selected.budget}
                </span>
                {selected.dates && selected.dates !== 'Flexible' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-body">
                    <i className="ti ti-calendar text-gold" />{selected.dates}
                  </span>
                )}
                {selected.itinerary?.estimatedTotalCost > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-body">
                    <i className="ti ti-coins text-gold" />~{selected.itinerary.currency} {selected.itinerary.estimatedTotalCost.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Highlights */}
              {selected.itinerary?.highlights?.length > 0 && (
                <div className="px-5 py-4 border-b border-mist">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.itinerary.highlights.map((h, i) => (
                      <span key={i} className="text-xs bg-gold/10 text-gold border border-gold/20 px-2.5 py-1 rounded-full font-body">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Day by day */}
              {selected.itinerary?.days?.map(day => (
                <div key={day.dayNumber} className="px-5 py-5 border-b border-mist">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-forest flex items-center justify-center text-xs font-bold text-gold shrink-0">{day.dayNumber}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 font-body">{day.title}</p>
                      <p className="text-xs text-gray-400 font-body">{day.theme}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pl-8">
                    {day.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-xs text-gray-400 font-body w-12 text-right">{item.time}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${BADGE[item.type] ?? BADGE.explore}`}>
                              {BADGE_LABEL[item.type] ?? item.type}
                            </span>
                            <p className="text-xs font-semibold text-gray-700 font-body">{item.title}</p>
                          </div>
                          <p className="text-xs text-gray-400 font-body leading-relaxed">{item.description}</p>
                          {item.tip && (
                            <p className="text-xs text-sky font-body mt-1 flex items-start gap-1">
                              <i className="ti ti-bulb shrink-0 mt-px" />{item.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Practical info */}
              {selected.itinerary?.practicalInfo && (
                <div className="px-5 py-4 bg-sand/30">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Practical Info</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body text-gray-600">
                    <span><strong>Currency:</strong> {selected.itinerary.practicalInfo.currency}</span>
                    <span><strong>Language:</strong> {selected.itinerary.practicalInfo.languages?.join(', ')}</span>
                    <span><strong>Best time:</strong> {selected.itinerary.practicalInfo.bestTimeToVisit}</span>
                    <span><strong>Visa:</strong> {selected.itinerary.practicalInfo.visaRequired ? 'Required' : 'Not required'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions for detail view */}
        {selected && !detailLoading && (
          <div className="shrink-0 border-t border-mist bg-white px-5 py-4 flex gap-2">
            <button
              onClick={replan}
              className="flex-1 flex items-center justify-center gap-2 bg-forest text-cream py-2.5 rounded-xl text-sm font-semibold hover:bg-forest/90 transition-colors font-body"
            >
              <i className="ti ti-refresh text-gold" />Re-plan this trip
            </button>
            <button
              onClick={() => share(selected.id)}
              className="flex items-center justify-center gap-1.5 border border-mist px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-sand transition-colors font-body"
              title="Copy link"
            >
              <i className={`ti ${copied ? 'ti-check text-green-500' : 'ti-share'}`} />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => deleteTrip(selected.id)}
              disabled={deleting}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-body text-coral hover:bg-coral/5 border border-coral/20 transition-colors disabled:opacity-50"
              title="Delete trip"
            >
              <i className="ti ti-trash" />
              <span>{deleting ? '…' : 'Delete'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
