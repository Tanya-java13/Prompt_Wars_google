import React, { useState, useEffect } from 'react';
import ItineraryPanel from './ItineraryPanel';
import { useItinerary } from '../hooks/useItinerary';
import type { PlannerFormData } from '../types/travel';

const PREFS = [
  { id: 'culture',    icon: 'ti-building-arch', label: 'Culture & History' },
  { id: 'food',       icon: 'ti-chef-hat',      label: 'Food & Dining' },
  { id: 'adventure',  icon: 'ti-mountain',      label: 'Adventure' },
  { id: 'wellness',   icon: 'ti-spa',           label: 'Wellness & Spa' },
  { id: 'nightlife',  icon: 'ti-moon',          label: 'Nightlife' },
  { id: 'photography',icon: 'ti-camera',        label: 'Photography' },
];

const inputCls = 'flex-1 bg-transparent text-cream text-sm outline-none placeholder-white/35 font-body';
const wrapCls  = 'flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3';
const labelCls = 'block text-xs text-gold-light font-semibold uppercase tracking-wider mb-2';

interface Props { prefilledDestination: string; }

export default function PlannerSection({ prefilledDestination }: Props) {
  const { itinerary, isLoading, error, generate, saveTrip } = useItinerary();

  const [form, setForm] = useState<PlannerFormData>({
    destination: '', origin: '', startDate: '', endDate: '',
    travellers: '2 Adults', budget: 'Mid-range ($150-300/day)',
    preferences: [], constraints: '',
  });

  useEffect(() => {
    if (prefilledDestination) setForm(p => ({ ...p, destination: prefilledDestination }));
  }, [prefilledDestination]);

  const set = (k: keyof PlannerFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const togglePref = (id: string) =>
    setForm(p => ({
      ...p,
      preferences: p.preferences.includes(id)
        ? p.preferences.filter(x => x !== id)
        : [...p.preferences, id],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination || !form.origin) return;
    generate(form);
  };

  return (
    <section id="planner" className="py-20 bg-cream">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">AI Trip Planner</p>
          <h2 className="font-display text-4xl text-forest mb-4">
            Your journey, intelligently <em className="text-sky" style={{ fontStyle: 'italic' }}>crafted</em>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto font-body text-sm leading-relaxed">
            Tell us where you want to go and we'll build a complete day-by-day itinerary in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <form onSubmit={submit} className="bg-forest rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Destination</label>
                <div className={wrapCls}>
                  <i className="ti ti-map-pin text-gold text-sm shrink-0" />
                  <input type="text" placeholder="Kyoto, Japan" value={form.destination}
                    onChange={set('destination')} required className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Flying From</label>
                <div className={wrapCls}>
                  <i className="ti ti-plane-departure text-gold text-sm shrink-0" />
                  <input type="text" placeholder="New York, USA" value={form.origin}
                    onChange={set('origin')} required className={inputCls} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Departure</label>
                <input type="date" value={form.startDate} onChange={set('startDate')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body [color-scheme:dark]" />
              </div>
              <div>
                <label className={labelCls}>Return</label>
                <input type="date" value={form.endDate} onChange={set('endDate')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body [color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Travellers</label>
                <select value={form.travellers} onChange={set('travellers')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body">
                  <option>Solo</option>
                  <option>2 Adults</option>
                  <option>Family (2+2)</option>
                  <option>Group (5+)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Budget</label>
                <select value={form.budget} onChange={set('budget')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none font-body">
                  <option>Budget ($50-100/day)</option>
                  <option>Mid-range ($150-300/day)</option>
                  <option>Luxury ($500+/day)</option>
                  <option>Ultra-luxury ($1000+/day)</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Preferences</label>
              <div className="grid grid-cols-3 gap-2">
                {PREFS.map(({ id, icon, label }) => (
                  <button key={id} type="button" onClick={() => togglePref(id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs transition-all ${
                      form.preferences.includes(id)
                        ? 'bg-gold border-gold text-forest font-semibold'
                        : 'border-white/20 text-cream/55 hover:border-gold-light hover:text-cream'
                    }`}>
                    <i className={`ti ${icon} text-base`} />
                    <span className="leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Notes & Constraints</label>
              <textarea placeholder="Dietary requirements, mobility needs, must-see attractions…"
                value={form.constraints} onChange={set('constraints')} rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-cream text-sm outline-none placeholder-white/35 resize-none font-body" />
            </div>

            <button type="submit" disabled={isLoading || !form.destination || !form.origin}
              className="w-full bg-gold text-forest py-4 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-forest rounded-full dot-bounce" style={{ animationDelay: `${i*0.18}s` }} />)}
                  </div>
                  Generating…
                </>
              ) : (
                <><i className="ti ti-sparkles" />Generate AI Itinerary</>
              )}
            </button>
          </form>

          {/* Panel */}
          <ItineraryPanel itinerary={itinerary} isLoading={isLoading} error={error}
            onSave={() => saveTrip(form)} />
        </div>
      </div>
    </section>
  );
}
