import React from 'react';

const stats = [
  { value: '2.4M+', label: 'Trips Planned' },
  { value: '190', label: 'Countries' },
  { value: '98%', label: 'Satisfaction' },
  { value: '12s', label: 'Avg Plan Time' },
];

export default function StatsStrip() {
  return (
    <section className="bg-sand py-12">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold text-forest mb-1">{value}</div>
              <div className="text-sm text-gray-500 font-body">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
