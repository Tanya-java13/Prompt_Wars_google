import React from 'react';

const TESTIMONIALS = [
  {
    stars: 5,
    quote: 'Voyago turned a two-hour planning nightmare into a 12-second masterpiece. The Kyoto itinerary had real restaurant names, train times, temple opening hours — jaw-dropping.',
    name: 'Sarah Chen', trip: 'Kyoto, Japan · 7 days', initials: 'SC', color: 'bg-sky',
  },
  {
    stars: 5,
    quote: 'As a solo traveller, the constraint-aware planning and real-time safety alerts gave me genuine peace of mind. Marrakech was incredible — and perfectly planned.',
    name: 'Marcus Webb', trip: 'Marrakech, Morocco · 5 days', initials: 'MW', color: 'bg-gold',
  },
  {
    stars: 5,
    quote: "Family of four with two kids and a gluten intolerance. Voyago handled every detail — child-friendly venues, celiac-safe restaurants, stroller-accessible routes. Absolute game-changer.",
    name: 'Priya Sharma', trip: 'Amalfi Coast, Italy · 10 days', initials: 'PS', color: 'bg-coral',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">Traveller Stories</p>
          <h2 className="font-display text-4xl text-forest">
            Trusted by <em className="text-sky" style={{ fontStyle: 'italic' }}>2.4 million</em> travellers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ stars, quote, name, trip, initials, color }) => (
            <div key={name} className="bg-white rounded-2xl p-7 border border-mist shadow-sm">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: stars }).map((_, i) => (
                  <i key={i} className="ti ti-star-filled text-gold text-sm" />
                ))}
              </div>
              <p className="font-display text-base text-gray-700 italic leading-relaxed mb-6">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{name}</div>
                  <div className="text-gray-400 text-xs font-body">{trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
