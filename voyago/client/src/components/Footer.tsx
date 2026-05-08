import React from 'react';

const NAV = [
  { label: 'Discover', id: 'destinations' },
  { label: 'Plan a Trip', id: 'planner' },
  { label: 'Features', id: 'features' },
  { label: 'Alerts', id: 'alerts' },
];

export default function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* CTA */}
      <section className="py-20 bg-sand">
        <div className="container-main text-center">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">Ready to explore?</p>
          <h2 className="font-display text-5xl text-forest mb-4 leading-tight">
            Your next adventure<br />
            is <em className="text-sky" style={{ fontStyle: 'italic' }}>one click away</em>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-10 font-body text-sm leading-relaxed">
            Join 2.4 million travellers who plan smarter, travel better, and discover more with Voyago.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => go('planner')}
              className="bg-forest text-gold-light px-8 py-4 rounded-full font-semibold hover:bg-forest/90 transition-colors">
              Start Planning Free
            </button>
            <button className="border border-mist text-forest px-8 py-4 rounded-full font-semibold hover:border-gold hover:text-gold transition-colors">
              View Sample Itinerary
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest py-12">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-display text-2xl font-semibold text-cream">
              Voya<em className="text-gold-light" style={{ fontStyle: 'italic' }}>go</em>
            </span>
            <div className="flex flex-wrap gap-6 justify-center">
              {NAV.map(({ label, id }) => (
                <button key={label} onClick={() => go(id)}
                  className="text-cream/45 hover:text-gold-light text-sm transition-colors font-body">
                  {label}
                </button>
              ))}
            </div>
            <span className="text-cream/25 text-xs font-body">
              © {new Date().getFullYear()} Voyago. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
