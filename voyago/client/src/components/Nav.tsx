import React, { useState, useEffect } from 'react';

const links = [
  { label: 'Discover', id: 'destinations' },
  { label: 'Plan a Trip', id: 'planner' },
  { label: 'Experiences', id: 'features' },
  { label: 'Real-Time Updates', id: 'alerts' },
  { label: 'My Trips', id: '' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 bg-forest transition-shadow ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <span className="font-display text-2xl font-semibold text-cream tracking-tight">
            Voya<em className="text-gold-light italic not-italic" style={{ fontStyle: 'italic' }}>go</em>
          </span>

          <div className="hidden md:flex items-center gap-7">
            {links.map(({ label, id }) => (
              <button key={label} onClick={() => go(id)}
                className="text-sm text-cream/65 hover:text-gold-light transition-colors font-body">
                {label}
              </button>
            ))}
          </div>

          <button onClick={() => go('planner')}
            className="hidden md:block bg-gold text-forest text-sm font-semibold px-5 py-2 rounded-full hover:bg-gold-light transition-colors">
            Start Planning
          </button>

          <button className="md:hidden text-cream text-xl" onClick={() => setOpen(o => !o)}>
            <i className={`ti ti-${open ? 'x' : 'menu-2'}`} />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-3">
            {links.filter(l => l.id).map(({ label, id }) => (
              <button key={label} onClick={() => go(id)}
                className="text-left text-cream/75 hover:text-gold-light text-sm py-1 font-body">
                {label}
              </button>
            ))}
            <button onClick={() => go('planner')}
              className="mt-1 w-fit bg-gold text-forest text-sm font-semibold px-5 py-2 rounded-full">
              Start Planning
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
