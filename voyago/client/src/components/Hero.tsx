import React, { useState } from 'react';

interface Props { onStartPlanning: () => void; }

const chips = ['Beaches', 'Mountains', 'Culture', 'Adventure', 'Food & Wine', 'Wellness'];

export default function Hero({ onStartPlanning }: Props) {
  const [active, setActive] = useState('');

  return (
    <section className="bg-forest min-h-screen flex items-center pt-16">
      <div className="container-main py-16 w-full">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-gold-light text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-7">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              AI-Powered Travel Intelligence
            </div>

            <h1 className="font-display text-5xl lg:text-6xl text-cream leading-[1.12] mb-6">
              Plan your next{' '}
              <em className="text-gold-light" style={{ fontStyle: 'italic' }}>perfect</em>
              <br />journey, instantly.
            </h1>

            <p className="text-cream/65 text-lg leading-relaxed mb-9 font-body max-w-md">
              Voyago's AI concierge crafts personalised travel itineraries in seconds — with real-time updates, smart routing, and local expertise built in.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={onStartPlanning}
                className="bg-gold text-forest px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-gold-light transition-colors">
                Plan My Trip
              </button>
              <button className="flex items-center gap-3 border border-cream/25 text-cream px-6 py-3.5 rounded-full text-sm font-semibold hover:border-cream/50 transition-colors">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <i className="ti ti-player-play text-gold text-xs" />
                </span>
                See how it works
              </button>
            </div>

            <div className="flex flex-wrap gap-7">
              {[
                { icon: 'ti-refresh', label: 'Live Sync' },
                { icon: 'ti-brain', label: 'AI Personalisation' },
                { icon: 'ti-shield-check', label: 'Safety Alerts' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-cream/50 text-sm font-body">
                  <i className={`ti ${icon} text-gold`} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — card */}
          <div className="slide-up">
            <div className="bg-white rounded-2xl p-7 shadow-2xl shadow-black/30">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Where to?</p>
              <div className="flex items-center gap-3 border border-mist rounded-xl px-4 py-3 mb-6">
                <i className="ti ti-map-pin text-gold text-lg" />
                <input type="text" placeholder="Search destinations, regions…"
                  className="flex-1 outline-none text-gray-700 text-sm font-body placeholder-gray-400" />
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Categories</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {chips.map(c => (
                  <button key={c} onClick={() => setActive(c === active ? '' : c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      active === c
                        ? 'bg-forest text-gold-light border-forest'
                        : 'border-mist text-gray-600 hover:border-gold hover:text-gold'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>

              <button onClick={onStartPlanning}
                className="w-full bg-forest text-gold-light py-3.5 rounded-xl font-semibold text-sm hover:bg-forest/90 transition-colors flex items-center justify-center gap-2">
                <i className="ti ti-sparkles text-gold" />
                Generate AI Itinerary
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">12 seconds avg · Personalised · Free to try</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
