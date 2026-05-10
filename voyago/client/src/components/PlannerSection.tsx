import React, { useState, useEffect, useRef, useCallback } from 'react';
import ItineraryPanel from './ItineraryPanel';
import DestinationAutocomplete from './DestinationAutocomplete';
import LoginModal from './LoginModal';
import PaywallModal from './PaywallModal';
import UsageBadge from './UsageBadge';
import { useItinerary } from '../hooks/useItinerary';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import type { PlannerFormData } from '../types/travel';

const PREFS = [
  { id: 'culture',     icon: 'ti-building-arch', label: 'Culture & History' },
  { id: 'food',        icon: 'ti-chef-hat',      label: 'Food & Dining' },
  { id: 'adventure',   icon: 'ti-mountain',      label: 'Adventure' },
  { id: 'wellness',    icon: 'ti-spa',           label: 'Wellness & Spa' },
  { id: 'nightlife',   icon: 'ti-moon',          label: 'Nightlife' },
  { id: 'photography', icon: 'ti-camera',        label: 'Photography' },
];

const labelCls = 'block text-xs text-gold-light font-semibold uppercase tracking-wider mb-2';
const selectCls = 'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body';

interface Props { prefilledDestination: string; }

export default function PlannerSection({ prefilledDestination }: Props) {
  const { itinerary, isLoading, error, generate, refine, addDay, saveTrip } = useItinerary();
  const { isAuthenticated, canGenerate, canCustomize, refreshUser } = useAuth();

  const [form, setForm] = useState<PlannerFormData>({
    destination: '', origin: '', startDate: '', endDate: '',
    travellers: '2 Adults', budget: 'Mid-range ($150-300/day)',
    preferences: [], constraints: '',
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<'generation' | 'customization'>('generation');
  const pendingAction = useRef<(() => void) | null>(null);
  const { trackItineraryGenerated, trackItineraryCustomized, trackPaywallShown } = useAnalytics();

  useEffect(() => {
    if (prefilledDestination) setForm(p => ({ ...p, destination: prefilledDestination }));
  }, [prefilledDestination]);

  const set = (k: keyof PlannerFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const togglePref = (id: string) =>
    setForm(p => ({
      ...p,
      preferences: p.preferences.includes(id)
        ? p.preferences.filter(x => x !== id)
        : [...p.preferences, id],
    }));

  const doGenerate = useCallback(() => {
    trackItineraryGenerated(form.destination, form.budget, form.travellers);
    generate(form).then(() => refreshUser());
  }, [form, generate, refreshUser, trackItineraryGenerated]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination || !form.origin) return;

    if (!isAuthenticated) {
      pendingAction.current = doGenerate;
      setShowLoginModal(true);
      return;
    }

    if (!canGenerate) {
      setPaywallTrigger('generation');
      setShowPaywallModal(true);
      trackPaywallShown('generation');
      return;
    }

    doGenerate();
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      action();
    }
  };

  const handleRefine = useCallback((instruction: string) => {
    if (!isAuthenticated) {
      pendingAction.current = () => refine(instruction).then(() => refreshUser());
      setShowLoginModal(true);
      return;
    }
    if (!canCustomize) {
      setPaywallTrigger('customization');
      setShowPaywallModal(true);
      trackPaywallShown('customization');
      return;
    }
    trackItineraryCustomized('refine');
    refine(instruction).then(() => refreshUser());
  }, [isAuthenticated, canCustomize, refine, refreshUser]);

  const handleAddDay = useCallback(() => {
    if (!isAuthenticated) {
      pendingAction.current = () => addDay().then(() => refreshUser());
      setShowLoginModal(true);
      return;
    }
    if (!canCustomize) {
      setPaywallTrigger('customization');
      setShowPaywallModal(true);
      return;
    }
    trackItineraryCustomized('add_day');
    addDay().then(() => refreshUser());
  }, [isAuthenticated, canCustomize, addDay, refreshUser, trackItineraryCustomized, trackPaywallShown]);

  return (
    <section id="planner" className="py-20 bg-cream" aria-labelledby="planner-heading">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3" aria-hidden="true">AI Trip Planner</p>
          <h2 id="planner-heading" className="font-display text-4xl text-forest mb-4">
            Your journey, intelligently <em className="text-sky" style={{ fontStyle: 'italic' }}>crafted</em>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto font-body text-sm leading-relaxed">
            Tell us where you want to go and we'll build a complete day-by-day itinerary in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <form onSubmit={submit} className="bg-forest rounded-2xl p-8 space-y-5" noValidate aria-label="Trip planning form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="destination" className={labelCls}>Destination</label>
                <DestinationAutocomplete
                  value={form.destination}
                  onChange={v => setForm(p => ({ ...p, destination: v }))}
                  placeholder="Kyoto, Japan"
                  required
                />
              </div>
              <div>
                <label htmlFor="origin" className={labelCls}>Flying From</label>
                <DestinationAutocomplete
                  value={form.origin}
                  onChange={v => setForm(p => ({ ...p, origin: v }))}
                  placeholder="New York, USA"
                  icon="ti-plane-departure"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className={labelCls}>Departure</label>
                <input id="startDate" type="date" value={form.startDate} onChange={set('startDate')}
                  aria-label="Departure date"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body [color-scheme:dark]" />
              </div>
              <div>
                <label htmlFor="endDate" className={labelCls}>Return</label>
                <input id="endDate" type="date" value={form.endDate} onChange={set('endDate')}
                  min={form.startDate}
                  aria-label="Return date"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body [color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="travellers" className={labelCls}>Travellers</label>
                <select id="travellers" value={form.travellers} onChange={set('travellers')} className={selectCls} aria-label="Number of travellers">
                  <option>Solo</option>
                  <option>2 Adults</option>
                  <option>Family (2+2)</option>
                  <option>Group (5+)</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className={labelCls}>Budget</label>
                <select id="budget" value={form.budget} onChange={set('budget')} className={selectCls} aria-label="Budget range">
                  <option>Budget ($50-100/day)</option>
                  <option>Mid-range ($150-300/day)</option>
                  <option>Luxury ($500+/day)</option>
                  <option>Ultra-luxury ($1000+/day)</option>
                </select>
              </div>
            </div>

            <fieldset>
              <legend className={labelCls}>Preferences</legend>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Travel preferences">
                {PREFS.map(({ id, icon, label }) => (
                  <button key={id} type="button" onClick={() => togglePref(id)}
                    aria-pressed={form.preferences.includes(id)}
                    aria-label={`${label} preference`}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-gold ${
                      form.preferences.includes(id)
                        ? 'bg-gold border-gold text-forest font-semibold'
                        : 'border-white/20 text-cream/55 hover:border-gold-light hover:text-cream'
                    }`}>
                    <i className={`ti ${icon} text-base`} aria-hidden="true" />
                    <span className="leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="constraints" className={labelCls}>Notes & Constraints</label>
              <textarea id="constraints" placeholder="Dietary requirements, mobility needs, must-see attractions…"
                value={form.constraints} onChange={set('constraints')} rows={3}
                maxLength={500}
                aria-describedby="constraints-hint"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none placeholder-white/35 resize-none font-body" />
              <p id="constraints-hint" className="text-xs text-white/30 mt-1 font-body">{form.constraints.length}/500</p>
            </div>

            <div className="space-y-3">
              <button type="submit" disabled={isLoading || !form.destination || !form.origin}
                aria-busy={isLoading}
                className="w-full bg-gold text-forest py-4 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold-light">
                {isLoading ? (
                  <><div className="flex gap-1" aria-hidden="true">
                    {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-forest rounded-full dot-bounce" style={{ animationDelay: `${i*0.18}s` }} />)}
                  </div><span>Generating…</span></>
                ) : (
                  <><i className="ti ti-sparkles" aria-hidden="true" />Generate AI Itinerary</>
                )}
              </button>

              {isAuthenticated && (
                <div className="flex justify-center">
                  <UsageBadge />
                </div>
              )}
            </div>
          </form>

          {/* Itinerary panel */}
          <ItineraryPanel
            itinerary={itinerary}
            isLoading={isLoading}
            error={error}
            onSave={() => saveTrip(form)}
            onRefine={handleRefine}
            onAddDay={handleAddDay}
          />
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => { setShowLoginModal(false); pendingAction.current = null; }}
        onSuccess={handleLoginSuccess}
        message="Sign in with Google to generate your personalised travel itinerary."
      />

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgradeSuccess={() => {
          setShowPaywallModal(false);
          if (pendingAction.current) {
            const action = pendingAction.current;
            pendingAction.current = null;
            action();
          }
        }}
        triggerType={paywallTrigger}
      />
    </section>
  );
}
