export interface Alert {
  id: string;
  type: 'flight' | 'weather' | 'hotel' | 'safety';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  location: string;
  timestamp: string;
}

const templates: Omit<Alert, 'id' | 'timestamp'>[] = [
  {
    type: 'flight',
    title: 'Flight Delay Alert',
    message: 'BA0287 London Heathrow → JFK delayed 45 min due to air traffic control. Gate change to B14.',
    severity: 'warning',
    location: 'London Heathrow, UK',
  },
  {
    type: 'weather',
    title: 'Weather Advisory',
    message: 'Tropical storm forming near Bali. Travel to Nusa Penida advised against for next 48 hours.',
    severity: 'warning',
    location: 'Bali, Indonesia',
  },
  {
    type: 'hotel',
    title: 'Room Upgrade Available',
    message: 'Complimentary upgrade to ocean-view suite at Amanjiwo Resort. Early check-in from 11am.',
    severity: 'success',
    location: 'Yogyakarta, Indonesia',
  },
  {
    type: 'safety',
    title: 'Safety Advisory',
    message: 'Increased pickpocket activity near Marrakech Medina. Keep valuables secure and use hotel safe.',
    severity: 'warning',
    location: 'Marrakech, Morocco',
  },
  {
    type: 'flight',
    title: 'Gate Change Notice',
    message: 'SQ0318 Singapore → Tokyo Narita moved to Gate F22. Boarding in 30 minutes.',
    severity: 'info',
    location: 'Changi Airport, Singapore',
  },
  {
    type: 'weather',
    title: 'Peak Bloom Alert',
    message: "Perfect cherry blossom conditions in Kyoto. Maruyama Park at peak bloom this week.",
    severity: 'success',
    location: 'Kyoto, Japan',
  },
];

let idx = 0;

export function getNextAlert(): Alert {
  const template = templates[idx % templates.length];
  idx++;
  return {
    ...template,
    id: `alert-${Date.now()}-${idx}`,
    timestamp: new Date().toISOString(),
  };
}
