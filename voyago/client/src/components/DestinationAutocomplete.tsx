import React, { useState, useRef, useEffect, useId } from 'react';
import { searchDestinations, POPULAR_DESTINATIONS } from '../data/destinations';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  darkBg?: boolean;
}

export default function DestinationAutocomplete({
  value, onChange, placeholder = 'Search destinations…', icon = 'ti-map-pin',
  required = false, darkBg = true,
}: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPopular, setShowPopular] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onChange(q);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowPopular(true);
      setOpen(true);
    } else {
      const results = searchDestinations(q);
      setSuggestions(results);
      setShowPopular(false);
      setOpen(true);
    }
    setActiveIdx(-1);
  };

  const handleFocus = () => {
    if (query.trim().length < 2) {
      setShowPopular(true);
      setOpen(true);
    } else if (suggestions.length > 0) {
      setOpen(true);
    }
  };

  const select = (dest: string) => {
    setQuery(dest);
    onChange(dest);
    setOpen(false);
    setShowPopular(false);
    setActiveIdx(-1);
  };

  const displayList = showPopular ? POPULAR_DESTINATIONS : suggestions;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(displayList[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inputCls = darkBg
    ? 'flex-1 bg-transparent text-cream text-sm outline-none placeholder-white/35 font-body'
    : 'flex-1 bg-transparent text-gray-700 text-sm outline-none placeholder-gray-400 font-body';
  const wrapCls = darkBg
    ? 'flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3'
    : 'flex items-center gap-2 border border-mist rounded-xl px-4 py-3';

  // Extract city and country from "City, Country" format
  const parseDest = (dest: string) => {
    const idx = dest.indexOf(',');
    if (idx === -1) return { city: dest, country: '' };
    return { city: dest.slice(0, idx), country: dest.slice(idx + 1).trim() };
  };

  return (
    <div className="relative">
      <div className={wrapCls} role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-owns={listId}>
        <i className={`ti ${icon} text-gold text-sm shrink-0`} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          required={required}
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={activeIdx >= 0 ? `dest-opt-${activeIdx}` : undefined}
          className={inputCls}
        />
        {query && (
          <button
            type="button"
            onMouseDown={() => { setQuery(''); onChange(''); setShowPopular(true); setOpen(true); }}
            className="shrink-0 text-white/40 hover:text-white/70 transition-colors"
            aria-label="Clear"
          >
            <i className="ti ti-x text-xs" />
          </button>
        )}
      </div>

      {open && displayList.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Destination suggestions"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-mist overflow-hidden max-h-72 overflow-y-auto"
        >
          {showPopular && (
            <li className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-mist">
              Popular destinations
            </li>
          )}
          {displayList.map((dest, i) => {
            const { city, country } = parseDest(dest);
            return (
              <li
                key={dest}
                id={`dest-opt-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseDown={() => select(dest)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                  i === activeIdx ? 'bg-sand text-forest' : 'text-gray-700 hover:bg-sand/60'
                }`}
              >
                <i className="ti ti-map-pin text-gold text-xs shrink-0" aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="text-sm font-medium font-body block truncate">{city}</span>
                  {country && <span className="text-xs text-gray-400 font-body">{country}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {open && !showPopular && suggestions.length === 0 && query.length >= 2 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-mist px-4 py-3 text-sm text-gray-400 font-body">
          No matches — try a different spelling or just type the city name.
        </div>
      )}
    </div>
  );
}
