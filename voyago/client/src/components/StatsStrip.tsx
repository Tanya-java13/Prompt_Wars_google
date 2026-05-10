import React, { useEffect, useState } from 'react';

interface SiteStats {
  totalItineraries: number;
  totalUsers: number;
  itinerariesToday: number;
  topDestinations: { name: string; count: number }[];
  satisfaction: string;
  avgPlanTime: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`;
  return n > 0 ? `${n}+` : '—';
}

export default function StatsStrip() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => null);
  }, []);

  const items = [
    {
      value: stats ? formatCount(stats.totalItineraries) : '—',
      label: 'Itineraries Generated',
      live: true,
    },
    {
      value: stats ? formatCount(stats.totalUsers) : '—',
      label: 'Travellers Joined',
      live: true,
    },
    {
      value: stats?.satisfaction ?? '98%',
      label: 'Satisfaction Rate',
      live: false,
    },
    {
      value: stats?.avgPlanTime ?? '12s',
      label: 'Avg. Plan Time',
      live: false,
    },
  ];

  return (
    <section className="bg-sand py-12" aria-label="Platform statistics">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map(({ value, label, live }) => (
            <div key={label}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="font-display text-3xl font-bold text-forest">{value}</span>
                {live && value !== '—' && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0 mb-1" title="Live count" />
                )}
              </div>
              <div className="text-sm text-gray-500 font-body">{label}</div>
            </div>
          ))}
        </div>
        {stats?.topDestinations && stats.topDestinations.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-body mb-3 uppercase tracking-wider">Trending destinations</p>
            <div className="flex flex-wrap justify-center gap-2">
              {stats.topDestinations.map(({ name, count }) => (
                <span key={name}
                  className="inline-flex items-center gap-1.5 bg-white text-gray-600 text-xs font-body px-3 py-1.5 rounded-full border border-mist">
                  <i className="ti ti-map-pin text-gold text-xs" aria-hidden="true" />
                  {name}
                  <span className="text-gray-300">· {count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
