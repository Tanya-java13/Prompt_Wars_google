import React from 'react';

const FEATURES = [
  { icon: 'ti-brain',          title: 'Adaptive AI Engine',       body: 'Claude-powered intelligence that learns your preferences, travel style, and constraints to craft truly personalised plans.',       badge: 'Claude AI' },
  { icon: 'ti-antenna',        title: 'Real-Time Intelligence',    body: 'Live flight data, weather updates, and local event feeds integrated into your plan — automatically adjusted as conditions change.',  badge: 'Live Data' },
  { icon: 'ti-shield-check',   title: 'Constraint Aware',          body: 'Dietary requirements, accessibility needs, budget limits, visa restrictions — Voyago factors in every detail from day one.',         badge: 'Smart Logic' },
  { icon: 'ti-route',          title: 'Optimised Routing',         body: 'AI-calculated routes minimise transit time and maximise experience, with real walking times and transport options.',                 badge: 'Route AI' },
  { icon: 'ti-users',          title: 'Collaborative Planning',    body: 'Share itineraries with travel companions, vote on activities, and co-plan in real-time from anywhere in the world.',                 badge: 'Social' },
  { icon: 'ti-calendar-check', title: 'Smart Booking Engine',      body: 'Direct booking links for hotels, flights, and experiences — with price tracking and availability alerts built in.',                  badge: 'Bookings' },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-sand">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">Why Voyago</p>
          <h2 className="font-display text-4xl text-forest">
            Built for how <em className="text-sky" style={{ fontStyle: 'italic' }}>modern</em> travellers plan
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, body, badge }) => (
            <div key={title} className="bg-cream rounded-2xl p-6 border border-mist hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-sand rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <i className={`ti ${icon} text-gold text-xl`} />
              </div>
              <h3 className="font-display text-lg text-forest mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-body mb-4">{body}</p>
              <span className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
