import React from 'react';
import { useAlertStream } from '../hooks/useAlertStream';
import type { Alert } from '../types/travel';

const ICON: Record<string, { icon: string; bg: string }> = {
  flight:  { icon: 'ti-plane',              bg: 'bg-sky text-white' },
  weather: { icon: 'ti-cloud-storm',         bg: 'bg-coral text-white' },
  hotel:   { icon: 'ti-building',            bg: 'bg-gold text-forest' },
  safety:  { icon: 'ti-shield-exclamation',  bg: 'bg-coral text-white' },
};

const DEMO: Alert[] = [
  { id: 'd1', type: 'flight',  title: 'Flight Delay Alert',     message: 'BA0287 London Heathrow → JFK delayed 45 min. Gate change to B14.',           severity: 'warning', location: 'London, UK',          timestamp: new Date().toISOString() },
  { id: 'd2', type: 'weather', title: 'Weather Advisory',       message: 'Tropical storm forming near Bali. Beach activities restricted 48 hours.',     severity: 'warning', location: 'Bali, Indonesia',      timestamp: new Date().toISOString() },
  { id: 'd3', type: 'hotel',   title: 'Room Upgrade Available', message: 'Complimentary ocean-view suite upgrade at Amanjiwo Resort from 11am.',        severity: 'success', location: 'Yogyakarta, Indonesia', timestamp: new Date().toISOString() },
];

function AlertCard({ alert }: { alert: Alert }) {
  const { icon, bg } = ICON[alert.type] ?? ICON.flight;
  return (
    <div className="bg-white/10 border border-white/15 rounded-xl p-4 flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <i className={`ti ${icon} text-sm`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-cream text-sm leading-snug">{alert.title}</span>
          <span className="text-white/35 text-xs shrink-0 font-body">
            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-white/55 text-xs mt-1 leading-relaxed font-body">{alert.message}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <i className="ti ti-map-pin text-gold/50 text-xs" />
          <span className="text-white/35 text-xs font-body">{alert.location}</span>
        </div>
      </div>
    </div>
  );
}

export default function RealTimeAlerts() {
  const { alerts, connected } = useAlertStream(true);
  const display = alerts.length ? alerts.slice(0, 3) : DEMO;

  return (
    <section id="alerts" className="py-20 bg-forest">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">Live Intelligence</p>
            <h2 className="font-display text-4xl text-cream mb-5">
              Real-time alerts,{' '}
              <em className="text-gold-light" style={{ fontStyle: 'italic' }}>zero</em> surprises
            </h2>
            <p className="text-cream/55 leading-relaxed mb-8 font-body">
              Voyago monitors your journey 24/7 — flight status, weather shifts, hotel upgrades, and safety advisories pushed directly to you.
            </p>
            <div className="flex items-center gap-3 mb-8">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-cream/45 text-sm font-body">
                {connected ? 'Live feed connected' : 'Connecting to live feed…'}
              </span>
            </div>
            <button className="bg-gold text-forest px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-gold-light transition-colors">
              Enable Push Alerts
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {display.map(a => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
