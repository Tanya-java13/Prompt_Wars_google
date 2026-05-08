import React from 'react';

interface Props { onDestinationSelect: (dest: string) => void; }

const DESTS = [
  { id: 1, name: 'Kyoto',        country: 'Japan',     emoji: '⛩️', price: 'From $2,400', meta: '7 days · Cultural',   tall: true },
  { id: 2, name: 'Amalfi Coast', country: 'Italy',     emoji: '🌊', price: 'From $3,200', meta: '10 days · Coastal',   tall: false },
  { id: 3, name: 'Patagonia',    country: 'Argentina', emoji: '🏔️', price: 'From $2,800', meta: '14 days · Adventure', tall: false },
  { id: 4, name: 'Marrakech',    country: 'Morocco',   emoji: '🕌', price: 'From $1,600', meta: '5 days · Culture',    tall: false },
  { id: 5, name: 'Bali',         country: 'Indonesia', emoji: '🌴', price: 'From $1,800', meta: '8 days · Wellness',   tall: false },
];

export default function DestinationsGrid({ onDestinationSelect }: Props) {
  return (
    <section id="destinations" className="py-20 bg-cream">
      <div className="container-main">
        <div className="mb-10">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">Trending Now</p>
          <h2 className="font-display text-4xl text-forest">
            Destinations <em className="text-sky" style={{ fontStyle: 'italic' }}>travellers</em> love
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 auto-rows-[200px]">
          {DESTS.map((d, i) => (
            <button key={d.id} onClick={() => onDestinationSelect(`${d.name}, ${d.country}`)}
              className={`group relative bg-forest rounded-2xl overflow-hidden cursor-pointer text-left hover:shadow-2xl transition-all ${
                i === 0 ? 'row-span-2' : ''
              }`}>
              {/* BG emoji */}
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
                {d.emoji}
              </div>
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/30 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-2xl mb-1 leading-none">{d.emoji}</div>
                <h3 className="font-display text-white text-xl font-semibold leading-tight">{d.name}</h3>
                <p className="text-white/55 text-xs mb-3 font-body">{d.country} · {d.meta}</p>
                <span className="inline-block bg-gold text-forest text-xs font-bold px-3 py-1 rounded-full">
                  {d.price}
                </span>
              </div>
              {/* Arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ti ti-arrow-up-right text-white text-sm" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="border border-mist text-gray-500 px-8 py-3 rounded-full text-sm font-semibold hover:border-gold hover:text-gold transition-colors font-body">
            Explore all 190 countries <i className="ti ti-arrow-right ml-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
