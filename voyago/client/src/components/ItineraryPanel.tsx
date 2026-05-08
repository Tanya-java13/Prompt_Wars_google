import React, { useState } from 'react';
import type { Itinerary } from '../types/travel';

interface Props {
  itinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onRefine: (instruction: string) => void;
  onAddDay: () => void;
}

const BADGE: Record<string, { label: string; cls: string }> = {
  stay:       { label: 'Stay',       cls: 'bg-sky/15 text-sky border border-sky/30' },
  eat:        { label: 'Dine',       cls: 'bg-coral/15 text-coral border border-coral/30' },
  explore:    { label: 'Explore',    cls: 'bg-gold/15 text-gold border border-gold/30' },
  experience: { label: 'Experience', cls: 'bg-forest/10 text-forest border border-forest/20' },
  transport:  { label: 'Transit',    cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

export default function ItineraryPanel({ itinerary, isLoading, error, onSave, onRefine, onAddDay }: Props) {
  const [showRefine, setShowRefine] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    const id = await (onSave as () => Promise<string | undefined>)();
    if (id) setSavedId(id);
  };

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    onRefine(instruction);
    setInstruction('');
    setShowRefine(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-12 flex flex-col items-center justify-center min-h-[520px]" role="status" aria-label="Generating itinerary">
        <div className="flex gap-2 mb-5" aria-hidden="true">
          {[0,1,2].map(i => <span key={i} className="w-3 h-3 bg-gold rounded-full dot-bounce" style={{ animationDelay: `${i*0.18}s` }} />)}
        </div>
        <p className="text-gray-500 text-sm font-body">Crafting your personalised itinerary…</p>
        <p className="text-gray-300 text-xs mt-1.5 font-body">Powered by Gemini on Vertex AI</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-coral/30 shadow-sm p-12 flex flex-col items-center justify-center min-h-[520px]" role="alert">
        <i className="ti ti-alert-circle text-coral text-4xl mb-4" aria-hidden="true" />
        <p className="text-gray-700 font-semibold text-sm mb-2">Generation failed</p>
        <p className="text-gray-400 text-xs text-center font-body max-w-xs">{error}</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-12 flex flex-col items-center justify-center min-h-[520px]" aria-label="Itinerary placeholder">
        <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-6" aria-hidden="true">
          <i className="ti ti-map-2 text-gold text-2xl" />
        </div>
        <h3 className="font-display text-xl text-forest mb-3">Your itinerary awaits</h3>
        <p className="text-gray-400 text-sm text-center max-w-xs font-body leading-relaxed">
          Fill in the form and click "Generate AI Itinerary" to create your personalised travel plan.
        </p>
        <div className="mt-8 w-full max-w-xs space-y-2.5" aria-hidden="true">
          {['Day 1 · Arrival & Orientation', 'Day 2 · Cultural Immersion', 'Day 3 · Hidden Gems'].map(d => (
            <div key={d} className="h-10 bg-sand rounded-lg animate-pulse flex items-center px-4">
              <span className="text-xs text-gray-300">{d}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-sm overflow-hidden" aria-label={`Itinerary for ${itinerary.destination}`}>
      {/* Header */}
      <div className="bg-forest px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-cream">{itinerary.destination}</h3>
            <p className="text-gold-light/60 text-sm mt-0.5 font-body">{itinerary.duration}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-lg font-semibold text-gold" aria-label={`Estimated cost ${itinerary.estimatedTotalCost} USD`}>
              ${itinerary.estimatedTotalCost.toLocaleString()}
            </div>
            <div className="text-cream/40 text-xs font-body">est. total</div>
          </div>
        </div>
        {itinerary.highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-4" aria-label="Trip highlights">
            {itinerary.highlights.slice(0, 4).map(h => (
              <li key={h} className="text-xs bg-white/10 text-gold-light/80 px-3 py-1 rounded-full font-body">{h}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Days */}
      <div className="divide-y divide-mist overflow-y-auto max-h-[480px]" role="list" aria-label="Daily itinerary">
        {itinerary.days.map(day => (
          <article key={day.dayNumber} className="px-6 py-5" role="listitem">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gold rounded-full shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-display text-sm font-semibold text-forest">{day.title}</h4>
                <p className="text-xs text-gray-400 font-body">{day.theme}</p>
              </div>
            </div>
            <div className="space-y-4 ml-4">
              {day.items.map((item, idx) => {
                const badge = BADGE[item.type] ?? BADGE.explore;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="w-14 shrink-0 text-right pt-0.5">
                      <time className="text-xs text-gray-400 font-body">{item.time}</time>
                    </div>
                    <div className="flex-1 pb-4 border-b border-mist last:border-b-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>{badge.label}</span>
                        {item.bookingRequired && (
                          <span className="text-xs text-coral font-body" aria-label="Booking required">⚡ Book ahead</span>
                        )}
                      </div>
                      <p className="font-semibold text-sm text-gray-800 mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-body">{item.description}</p>
                      {item.tip && (
                        <p className="text-xs text-gold mt-2 italic font-body">
                          <i className="ti ti-bulb mr-1" aria-hidden="true" />{item.tip}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 font-body">{item.duration}</span>
                        {item.estimatedCost > 0 && (
                          <span className="text-xs font-semibold text-gray-600" aria-label={`Estimated cost ${item.estimatedCost} USD`}>~${item.estimatedCost}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}

        {itinerary.practicalInfo && (
          <section className="px-6 py-4 bg-sand/50" aria-label="Practical information">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Practical Info</p>
            <dl className="grid grid-cols-2 gap-2 text-xs font-body text-gray-600">
              <div><dt className="inline font-semibold">Best time: </dt><dd className="inline">{itinerary.practicalInfo.bestTimeToVisit}</dd></div>
              <div><dt className="inline font-semibold">Currency: </dt><dd className="inline">{itinerary.practicalInfo.currency}</dd></div>
              <div><dt className="inline font-semibold">Language: </dt><dd className="inline">{itinerary.practicalInfo.languages?.join(', ')}</dd></div>
              <div><dt className="inline font-semibold">Emergency: </dt><dd className="inline">{itinerary.practicalInfo.emergencyNumber}</dd></div>
            </dl>
          </section>
        )}
      </div>

      {/* Refine input */}
      {showRefine && (
        <form onSubmit={handleRefine} className="px-6 py-4 border-t border-mist bg-sand/30" aria-label="Customise itinerary">
          <label htmlFor="refine-input" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            What would you like to change?
          </label>
          <div className="flex gap-2">
            <input id="refine-input" type="text" value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="e.g. Make Day 2 more adventurous, add a cooking class…"
              maxLength={300}
              className="flex-1 border border-mist rounded-xl px-3 py-2 text-sm font-body outline-none focus:border-gold text-gray-700"
              aria-describedby="refine-hint"
              autoFocus />
            <button type="submit" disabled={!instruction.trim()}
              className="bg-forest text-gold-light px-4 py-2 rounded-xl text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Apply customisation">
              Apply
            </button>
            <button type="button" onClick={() => setShowRefine(false)}
              className="border border-mist text-gray-400 px-3 py-2 rounded-xl text-sm hover:border-coral hover:text-coral transition-colors focus:outline-none focus:ring-2 focus:ring-coral"
              aria-label="Cancel customisation">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          </div>
          <p id="refine-hint" className="text-xs text-gray-400 mt-1.5 font-body">{instruction.length}/300</p>
        </form>
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-mist flex gap-3">
        <button onClick={handleSave}
          aria-label="Save trip to my trips"
          className="flex-1 bg-forest text-gold-light py-2.5 rounded-xl text-sm font-semibold hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold">
          <i className="ti ti-bookmark" aria-hidden="true" />
          {savedId ? 'Saved!' : 'Save Trip'}
        </button>
        <button onClick={() => setShowRefine(s => !s)}
          aria-label="Customise itinerary with AI"
          aria-expanded={showRefine}
          className="flex-1 border border-mist text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold">
          <i className="ti ti-edit" aria-hidden="true" />Customise
        </button>
        <button onClick={onAddDay}
          aria-label="Add an extra day trip"
          className="border border-mist text-gray-600 py-2.5 px-4 rounded-xl text-sm font-semibold hover:border-gold hover:text-gold transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-gold">
          <i className="ti ti-plus" aria-hidden="true" />Day
        </button>
      </div>
    </div>
  );
}
