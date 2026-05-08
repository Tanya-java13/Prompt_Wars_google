import React, { useState, useRef, useEffect, useId } from 'react';
import { searchDestinations } from '../data/destinations';

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
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onChange(q);
    const results = searchDestinations(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIdx(-1);
  };

  const select = (dest: string) => {
    setQuery(dest);
    onChange(dest);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx]);
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
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          required={required}
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={activeIdx >= 0 ? `dest-${activeIdx}` : undefined}
          className={inputCls}
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Destination suggestions"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-mist overflow-hidden"
        >
          {suggestions.map((dest, i) => (
            <li
              key={dest}
              id={`dest-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => select(dest)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body cursor-pointer transition-colors ${
                i === activeIdx ? 'bg-sand text-forest font-semibold' : 'text-gray-700 hover:bg-sand'
              }`}
            >
              <i className="ti ti-map-pin text-gold text-xs" aria-hidden="true" />
              {dest}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
