import type { Itinerary, ItineraryDay, ItineraryItem } from '../types/travel';

interface ItineraryParams {
  destination: string;
  origin: string;
  dates: string;
  travellers: string;
  budget: string;
  preferences: string[];
  constraints: string;
}

// ─── Destination catalogue ──────────────────────────────────────────────────

interface DestinationCatalogue {
  country: string;
  currency: string;
  languages: string[];
  emergencyNumber: string;
  bestTimeToVisit: string;
  visaRequired: boolean;
  highlights: string[];
  hotels: { budget: string[]; midrange: string[]; luxury: string[] };
  eateries: string[];
  experiences: Array<{ name: string; duration: string; cost: number; type: ItineraryItem['type'] }>;
}

const DESTINATIONS: Record<string, DestinationCatalogue> = {
  kyoto: {
    country: 'Japan', currency: 'JPY (¥)', languages: ['Japanese'],
    emergencyNumber: '110', visaRequired: false,
    bestTimeToVisit: 'March–May (cherry blossoms) and October–November (autumn foliage)',
    highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Gion District', 'Kinkaku-ji', 'Nishiki Market'],
    hotels: {
      budget: ["K's House Kyoto Hostel", 'Piece Hostel Kyoto', 'Gojo Guest House'],
      midrange: ['Hotel Granvia Kyoto', 'Cross Hotel Kyoto', 'The b Kyoto'],
      luxury: ['Ritz-Carlton Kyoto', 'Aman Kyoto', 'Four Seasons Hotel Kyoto'],
    },
    eateries: ['Nishiki Market', 'Gion Kappa', 'Ippudo Ramen', 'Tousuiro Tofu Kaiseki', 'Inoda Coffee'],
    experiences: [
      { name: 'Fushimi Inari Shrine – thousand torii gates walk', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Arashiyama Bamboo Grove & Tenryu-ji Garden', duration: '2 hrs', cost: 9, type: 'explore' },
      { name: 'Traditional tea ceremony at Urasenke', duration: '1.5 hrs', cost: 40, type: 'experience' },
      { name: 'Kinkaku-ji (Golden Pavilion)', duration: '1.5 hrs', cost: 5, type: 'explore' },
      { name: "Philosopher's Path cherry-blossom walk", duration: '1 hr', cost: 0, type: 'explore' },
      { name: 'Gion District evening stroll & geisha spotting', duration: '1.5 hrs', cost: 0, type: 'experience' },
      { name: 'Nishiki Market street-food tasting', duration: '1.5 hrs', cost: 20, type: 'eat' },
      { name: 'Nijo Castle & Ninomaru Palace', duration: '1.5 hrs', cost: 8, type: 'explore' },
      { name: 'Sake tasting in Fushimi sake district', duration: '1.5 hrs', cost: 25, type: 'experience' },
      { name: 'Kimono rental & photoshoot in Higashiyama', duration: '2 hrs', cost: 35, type: 'experience' },
    ],
  },
  bali: {
    country: 'Indonesia', currency: 'IDR (Rp)', languages: ['Balinese', 'Indonesian'],
    emergencyNumber: '112', visaRequired: false,
    bestTimeToVisit: 'April–October (dry season)',
    highlights: ['Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    hotels: {
      budget: ['Puri Garden Hotel Ubud', 'Kuta Paradiso Hostel', 'Seminyak Surf Hostel'],
      midrange: ['Alaya Resort Ubud', 'COMO Uma Canggu', 'Katamama Seminyak'],
      luxury: ['Four Seasons Resort Bali at Sayan', 'Amandari Ubud', 'The Villas at AYANA Resort'],
    },
    eateries: ['Locavore Ubud', 'Sarong Seminyak', 'Merah Putih Seminyak', 'Naughty Nuri\'s Ubud', 'The Sari Organik'],
    experiences: [
      { name: 'Tegallalang Rice Terraces sunrise trek', duration: '2 hrs', cost: 5, type: 'explore' },
      { name: 'Ubud Sacred Monkey Forest Sanctuary', duration: '1.5 hrs', cost: 7, type: 'explore' },
      { name: 'Tanah Lot sunset temple visit', duration: '2 hrs', cost: 4, type: 'explore' },
      { name: 'Mount Batur volcano sunrise hike', duration: '5 hrs', cost: 70, type: 'experience' },
      { name: 'Traditional Balinese cooking class', duration: '4 hrs', cost: 45, type: 'experience' },
      { name: 'Spa & traditional Balinese massage at COMO Shambhala', duration: '2 hrs', cost: 80, type: 'experience' },
      { name: 'Seminyak Beach sunset & surf lesson', duration: '2 hrs', cost: 30, type: 'experience' },
      { name: 'Tirta Empul holy spring water purification', duration: '1.5 hrs', cost: 3, type: 'experience' },
    ],
  },
  paris: {
    country: 'France', currency: 'EUR (€)', languages: ['French'],
    emergencyNumber: '112', visaRequired: false,
    bestTimeToVisit: 'April–June and September–October',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre', 'Seine River cruise'],
    hotels: {
      budget: ['Generator Paris', 'St Christopher\'s Inn Paris', 'Hotel Marais Bastille'],
      midrange: ['Hotel du Petit Moulin', 'Hotel des Grands Boulevards', 'Citadines Saint-Germain-des-Prés'],
      luxury: ['Ritz Paris', 'Le Meurice', 'Hotel Plaza Athénée'],
    },
    eateries: ['Café de Flore', 'L\'Ami Jean', 'Septime', 'Pierre Hermé Macaron Boutique', 'Marché des Enfants Rouges'],
    experiences: [
      { name: 'Eiffel Tower summit with priority access', duration: '2.5 hrs', cost: 29, type: 'explore' },
      { name: 'Louvre Museum highlights tour', duration: '3 hrs', cost: 17, type: 'experience' },
      { name: 'Montmartre & Sacré-Cœur walking tour', duration: '2.5 hrs', cost: 0, type: 'explore' },
      { name: 'Seine River evening cruise', duration: '1.5 hrs', cost: 15, type: 'experience' },
      { name: 'Versailles Palace & Gardens day trip', duration: '6 hrs', cost: 22, type: 'explore' },
      { name: 'Musée d\'Orsay Impressionist art', duration: '2.5 hrs', cost: 16, type: 'experience' },
      { name: 'Le Marais food & culture walk', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'French cooking class in Saint-Germain', duration: '3 hrs', cost: 90, type: 'experience' },
    ],
  },
  rome: {
    country: 'Italy', currency: 'EUR (€)', languages: ['Italian'],
    emergencyNumber: '112', visaRequired: false,
    bestTimeToVisit: 'April–June and September–October',
    highlights: ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Roman Forum', 'Borghese Gallery'],
    hotels: {
      budget: ['The Yellow Hostel', 'Alessandro Palace Hostel', 'Hotel La Griffe'],
      midrange: ['Hotel Campo de\' Fiori', 'Relais Palazzo Taverna', 'Hotel Forum'],
      luxury: ['Hotel Eden', 'Hassler Roma', 'Villa Spalletti Trivelli'],
    },
    eateries: ['Roscioli Salumeria', 'Tonnarello Trastevere', 'La Pergola', 'Forno Campo de\' Fiori', 'Gelateria dei Gracchi'],
    experiences: [
      { name: 'Colosseum & Roman Forum guided tour', duration: '3 hrs', cost: 22, type: 'explore' },
      { name: 'Vatican Museums & Sistine Chapel', duration: '4 hrs', cost: 21, type: 'explore' },
      { name: 'Trevi Fountain & Spanish Steps stroll', duration: '1.5 hrs', cost: 0, type: 'explore' },
      { name: 'Trastevere neighbourhood evening walk & dinner', duration: '3 hrs', cost: 30, type: 'eat' },
      { name: 'Borghese Gallery Baroque masterpieces', duration: '2 hrs', cost: 15, type: 'experience' },
      { name: 'Pizza & gelato making class', duration: '3 hrs', cost: 75, type: 'experience' },
      { name: 'Pantheon & Piazza Navona walk', duration: '2 hrs', cost: 5, type: 'explore' },
    ],
  },
  tokyo: {
    country: 'Japan', currency: 'JPY (¥)', languages: ['Japanese'],
    emergencyNumber: '110', visaRequired: false,
    bestTimeToVisit: 'March–May (cherry blossoms) and October–November',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Shinjuku Gyoen', 'Tsukiji Outer Market', 'teamLab Borderless'],
    hotels: {
      budget: ['Khaosan Tokyo Kabuki', 'Sakura Hotel Ikebukuro', 'Nui Hostel & Bar Lounge'],
      midrange: ['Hotel Century Southern Tower', 'Cerulean Tower Tokyu Hotel', 'Andaz Tokyo Toranomon Hills'],
      luxury: ['Park Hyatt Tokyo', 'The Peninsula Tokyo', 'Aman Tokyo'],
    },
    eateries: ['Tsukiji Outer Market', 'Ichiran Ramen Shibuya', 'Sushi Saito', 'Tempura Kondo', 'Narisawa'],
    experiences: [
      { name: 'Shibuya Crossing & Hachiko statue', duration: '1 hr', cost: 0, type: 'explore' },
      { name: 'Senso-ji Temple morning visit in Asakusa', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Tsukiji Outer Market breakfast food tour', duration: '2 hrs', cost: 25, type: 'eat' },
      { name: 'teamLab Planets immersive digital art', duration: '2 hrs', cost: 32, type: 'experience' },
      { name: 'Shinjuku Gyoen cherry-blossom garden', duration: '2 hrs', cost: 2, type: 'explore' },
      { name: 'Tokyo Skytree observation deck', duration: '1.5 hrs', cost: 21, type: 'explore' },
      { name: 'Akihabara electronics & anime district', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Traditional sushi omakase experience', duration: '1.5 hrs', cost: 80, type: 'eat' },
    ],
  },
  marrakech: {
    country: 'Morocco', currency: 'MAD (د.م.)', languages: ['Arabic', 'Berber', 'French'],
    emergencyNumber: '19', visaRequired: false,
    bestTimeToVisit: 'October–April',
    highlights: ['Jemaa el-Fna Square', 'Majorelle Garden', 'Saadian Tombs', 'Bahia Palace', 'Medina souks'],
    hotels: {
      budget: ['Riad Palmier', 'Hostel Waka Waka', 'Equity Point Marrakech'],
      midrange: ['Riad Yasmine', 'Riad Danka', 'Riad Al Ksar'],
      luxury: ['La Mamounia', 'Royal Mansour Marrakech', 'Amanjena'],
    },
    eateries: ['Café des Épices', 'Nomad Marrakech', 'Le Jardin', 'Al Fassia', 'Jemaa el-Fna food stalls'],
    experiences: [
      { name: 'Jemaa el-Fna Square sunset spectacle', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Medina souk shopping & haggling experience', duration: '2 hrs', cost: 30, type: 'experience' },
      { name: 'Majorelle Garden & YSL Museum', duration: '2 hrs', cost: 15, type: 'explore' },
      { name: 'Bahia Palace & Saadian Tombs', duration: '2 hrs', cost: 8, type: 'explore' },
      { name: 'Traditional hammam & argan oil treatment', duration: '2 hrs', cost: 40, type: 'experience' },
      { name: 'Atlas Mountains day trip & Berber village', duration: '8 hrs', cost: 60, type: 'explore' },
      { name: 'Moroccan cooking class in a riad', duration: '3 hrs', cost: 55, type: 'experience' },
    ],
  },
  'new york': {
    country: 'USA', currency: 'USD ($)', languages: ['English'],
    emergencyNumber: '911', visaRequired: false,
    bestTimeToVisit: 'April–June and September–November',
    highlights: ['Central Park', 'Metropolitan Museum of Art', 'Brooklyn Bridge', 'Times Square', 'High Line'],
    hotels: {
      budget: ['HI New York City Hostel', 'The Pod Hotel 39', 'Chelsea International Hostel'],
      midrange: ['The High Line Hotel', 'The Jane NYC', '1 Hotel Brooklyn Bridge'],
      luxury: ['The Plaza Hotel', 'Four Seasons New York', 'The Mark Hotel'],
    },
    eateries: ['Katz\'s Delicatessen', 'Per Se', 'Joe\'s Pizza', 'Eleven Madison Park', 'Chelsea Market'],
    experiences: [
      { name: 'Central Park walking tour & Bethesda Fountain', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Metropolitan Museum of Art highlights', duration: '3 hrs', cost: 30, type: 'experience' },
      { name: 'Brooklyn Bridge walk & DUMBO neighbourhood', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'High Line elevated park stroll', duration: '1.5 hrs', cost: 0, type: 'explore' },
      { name: 'Statue of Liberty & Ellis Island ferry', duration: '4 hrs', cost: 24, type: 'explore' },
      { name: 'Broadway show experience', duration: '2.5 hrs', cost: 100, type: 'experience' },
      { name: 'Chelsea Market food hall tour', duration: '1.5 hrs', cost: 20, type: 'eat' },
      { name: 'Top of the Rock observation deck', duration: '1.5 hrs', cost: 40, type: 'explore' },
    ],
  },
  barcelona: {
    country: 'Spain', currency: 'EUR (€)', languages: ['Spanish', 'Catalan'],
    emergencyNumber: '112', visaRequired: false,
    bestTimeToVisit: 'May–June and September–October',
    highlights: ['Sagrada Família', 'Park Güell', 'La Boqueria Market', 'Gothic Quarter', 'Barceloneta Beach'],
    hotels: {
      budget: ['TOC Hostel Barcelona', 'Generator Barcelona', 'Sant Jordi Hostel Sagrada Família'],
      midrange: ['Hotel Arts Barcelona', 'Practical Barcelona Centro', 'Yurbban Passage Hotel'],
      luxury: ['Hotel Arts Barcelona', 'W Barcelona', 'Mandarin Oriental Barcelona'],
    },
    eateries: ['La Boqueria Market', 'El Xampanyet', 'Tickets (Albert Adrià)', 'Bar Calders', 'Cervecería Catalana'],
    experiences: [
      { name: 'Sagrada Família guided tour with tower access', duration: '2.5 hrs', cost: 33, type: 'explore' },
      { name: 'Park Güell mosaics & city view', duration: '2 hrs', cost: 10, type: 'explore' },
      { name: 'La Boqueria Market food tasting tour', duration: '2 hrs', cost: 25, type: 'eat' },
      { name: 'Gothic Quarter evening walking tour', duration: '2 hrs', cost: 15, type: 'explore' },
      { name: 'Barceloneta Beach & coastal walk', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Flamenco dinner show at Tablao Cordobes', duration: '2.5 hrs', cost: 75, type: 'experience' },
      { name: 'Casa Batlló Gaudí audio tour', duration: '1.5 hrs', cost: 29, type: 'explore' },
    ],
  },
  dubai: {
    country: 'UAE', currency: 'AED (د.إ)', languages: ['Arabic', 'English'],
    emergencyNumber: '999', visaRequired: true,
    bestTimeToVisit: 'November–March (pleasant winter)',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari', 'Old Dubai & Gold Souk'],
    hotels: {
      budget: ['Bespoke Hostel Dubai', 'Dream Inn Dubai Creek', 'Zabeel House by Jumeirah'],
      midrange: ['Pullman Dubai Creek City Centre', 'Sheraton Grand Hotel Dubai', 'Aloft Dubai Creek'],
      luxury: ['Burj Al Arab Jumeirah', 'Atlantis The Palm', 'Armani Hotel Dubai'],
    },
    eateries: ['Al Ustad Special Kebab', 'Zuma Dubai', 'Nobu Dubai', 'Ravi Restaurant', 'Pierchic'],
    experiences: [
      { name: 'Burj Khalifa At.mosphere observation & view', duration: '2 hrs', cost: 35, type: 'explore' },
      { name: 'Dubai Fountain show & Dubai Mall visit', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Desert Safari with dune bashing & BBQ dinner', duration: '6 hrs', cost: 80, type: 'experience' },
      { name: 'Old Dubai Creek, Gold & Spice Souk walk', duration: '2.5 hrs', cost: 0, type: 'explore' },
      { name: 'Palm Jumeirah & Atlantis Aquaventure', duration: '4 hrs', cost: 90, type: 'experience' },
      { name: 'Dubai Frame panoramic views', duration: '1.5 hrs', cost: 14, type: 'explore' },
      { name: 'Abra boat ride across Dubai Creek', duration: '30 min', cost: 1, type: 'transport' },
    ],
  },
  singapore: {
    country: 'Singapore', currency: 'SGD (S$)', languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    emergencyNumber: '999', visaRequired: false,
    bestTimeToVisit: 'February–April (least rain)',
    highlights: ['Gardens by the Bay', 'Marina Bay Sands', 'Hawker Centre food', 'Sentosa Island', 'Chinatown'],
    hotels: {
      budget: ['Five Stones Hostel', 'The Pod Boutique Capsule Hotel', 'Footprints Hostel'],
      midrange: ['Hotel NuVe Urbane', 'PARKROYAL COLLECTION Marina Bay', 'Capella Singapore'],
      luxury: ['Marina Bay Sands', 'Raffles Hotel Singapore', 'Four Seasons Hotel Singapore'],
    },
    eateries: ['Maxwell Food Centre', 'Lau Pa Sat Hawker Centre', 'Odette', 'Burnt Ends', 'Tian Tian Hainanese Chicken Rice'],
    experiences: [
      { name: 'Gardens by the Bay Supertree Grove & Cloud Forest', duration: '3 hrs', cost: 20, type: 'explore' },
      { name: 'Marina Bay Sands SkyPark Observation Deck', duration: '1.5 hrs', cost: 26, type: 'explore' },
      { name: 'Maxwell Food Centre hawker food tour', duration: '1.5 hrs', cost: 15, type: 'eat' },
      { name: 'Sentosa Island beaches & Universal Studios', duration: '6 hrs', cost: 80, type: 'experience' },
      { name: 'Chinatown & Little India neighbourhood walk', duration: '2 hrs', cost: 0, type: 'explore' },
      { name: 'Night Safari wildlife experience', duration: '3 hrs', cost: 42, type: 'experience' },
      { name: 'Singapore Botanic Gardens UNESCO walk', duration: '1.5 hrs', cost: 0, type: 'explore' },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BUDGET_TIERS: Record<string, { multiplier: number; hotelTier: 'budget' | 'midrange' | 'luxury'; dailyCost: number }> = {
  'Budget ($50-100/day)':       { multiplier: 0.4, hotelTier: 'budget',  dailyCost: 75  },
  'Mid-range ($150-300/day)':   { multiplier: 1.0, hotelTier: 'midrange', dailyCost: 200 },
  'Luxury ($500+/day)':         { multiplier: 2.5, hotelTier: 'luxury',  dailyCost: 600 },
  'Ultra-luxury ($1000+/day)':  { multiplier: 5.0, hotelTier: 'luxury',  dailyCost: 1200 },
};

function parseDays(dates: string): number {
  try {
    const [start, end] = dates.split(' to ').map(d => new Date(d.trim()));
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
      return Math.max(1, Math.min(diff, 14));
    }
  } catch {/* ignore */}
  return 5;
}

function normaliseKey(destination: string): string {
  return destination.toLowerCase().replace(/,.*$/, '').trim();
}

function pick<T>(arr: T[], n: number, offset = 0): T[] {
  return arr.slice(offset % arr.length).concat(arr).slice(0, n);
}

function buildGenericCatalogue(destination: string): DestinationCatalogue {
  const city = destination.split(',')[0].trim();
  return {
    country: destination.includes(',') ? destination.split(',').slice(1).join(',').trim() : 'Unknown',
    currency: 'USD ($)', languages: ['Local language'],
    emergencyNumber: '112', visaRequired: false,
    bestTimeToVisit: 'Spring and autumn for the best weather',
    highlights: [
      `${city} Old Town`,
      `${city} National Museum`,
      `${city} Central Market`,
      `${city} Scenic Viewpoint`,
      `${city} Cultural Quarter`,
    ],
    hotels: {
      budget:   [`${city} Central Hostel`, `${city} Budget Inn`, `${city} City Guesthouse`],
      midrange: [`${city} Boutique Hotel`, `Hotel ${city}`, `${city} Grand Hotel`],
      luxury:   [`The ${city} Palace Hotel`, `${city} Luxury Resort`, `Grand Hyatt ${city}`],
    },
    eateries: [
      `${city} Central Market food stalls`,
      `Café ${city}`,
      `Restaurant Bella ${city}`,
      `${city} Night Market`,
      `Traditional ${city.split(' ')[0]} Kitchen`,
    ],
    experiences: [
      { name: `${city} Old Town guided walking tour`, duration: '2 hrs', cost: 15, type: 'explore' },
      { name: `${city} National Museum visit`, duration: '2 hrs', cost: 12, type: 'explore' },
      { name: `Central Market street-food tasting`, duration: '1.5 hrs', cost: 20, type: 'eat' },
      { name: `Local cooking class`, duration: '3 hrs', cost: 60, type: 'experience' },
      { name: `${city} Scenic Viewpoint & photography`, duration: '1.5 hrs', cost: 0, type: 'explore' },
      { name: `Cultural Quarter arts & craft walk`, duration: '2 hrs', cost: 0, type: 'explore' },
      { name: `Traditional spa & wellness treatment`, duration: '2 hrs', cost: 50, type: 'experience' },
      { name: `Day trip to surrounding countryside`, duration: '6 hrs', cost: 45, type: 'explore' },
    ],
  };
}

// ─── Day builder ─────────────────────────────────────────────────────────────

const DAY_THEMES = [
  { title: 'Arrival & First Impressions',  theme: 'Settle in, explore the neighbourhood'           },
  { title: 'Icons & Landmarks',            theme: 'The must-see sights of the city'                },
  { title: 'Culture & History',            theme: 'Museums, heritage and local stories'            },
  { title: 'Food & Markets',               theme: 'Flavours, street food and culinary adventures'  },
  { title: 'Off the Beaten Path',          theme: 'Hidden gems and local favourites'               },
  { title: 'Nature & Outdoors',            theme: 'Parks, gardens and scenic escapes'              },
  { title: 'Shopping & Leisure',           theme: 'Local crafts, fashion and leisurely afternoons' },
  { title: 'Day Trip & Excursion',         theme: 'Venture beyond the city limits'                 },
  { title: 'Wellness & Relaxation',        theme: 'Spa, yoga and slow travel'                      },
  { title: 'Farewell Moments',             theme: 'Final favourites before departure'              },
];

function buildDay(
  dayNum: number,
  catalogue: DestinationCatalogue,
  tier: typeof BUDGET_TIERS[string],
  preferences: string[],
  experienceOffset: number,
): ItineraryDay {
  const theme = DAY_THEMES[(dayNum - 1) % DAY_THEMES.length];
  const hotel = catalogue.hotels[tier.hotelTier][0];
  const hotelCost = tier.dailyCost * 0.45;
  const eatery = catalogue.eateries[(dayNum - 1) % catalogue.eateries.length];
  const dinnerSpot = catalogue.eateries[(dayNum) % catalogue.eateries.length];

  // 3 experiences per day, rotating through the catalogue
  const totalExp = catalogue.experiences.length;
  const exp1 = catalogue.experiences[(experienceOffset) % totalExp];
  const exp2 = catalogue.experiences[(experienceOffset + 1) % totalExp];
  const exp3 = catalogue.experiences[(experienceOffset + 2) % totalExp];

  const scaledCost = (c: number) => Math.round(c * tier.multiplier);

  const items: ItineraryItem[] = [
    {
      time: '08:00',
      title: dayNum === 1 ? `Check in at ${hotel}` : `Breakfast at ${eatery}`,
      description: dayNum === 1
        ? `Arrive and settle into ${hotel}. Take time to refresh before heading out to explore the ${catalogue.country} way of life.`
        : `Start the day with a hearty local breakfast at ${eatery}. Try the house speciality and fuel up for the day ahead.`,
      type: dayNum === 1 ? 'stay' : 'eat',
      duration: dayNum === 1 ? '1 hr' : '45 min',
      estimatedCost: dayNum === 1 ? Math.round(hotelCost) : scaledCost(12),
      tip: dayNum === 1
        ? 'Ask the front desk for a neighbourhood map and their top local recommendations.'
        : 'Arrive early to beat the crowds and get the best selection.',
      bookingRequired: dayNum === 1,
    },
    {
      time: '09:30',
      title: exp1.name,
      description: `Spend your morning at ${exp1.name}. ${preferences.includes('culture') ? 'Take time to understand the cultural significance.' : 'A fantastic way to kick off the day\'s adventures.'} Allow yourself to get lost in the experience.`,
      type: exp1.type,
      duration: exp1.duration,
      estimatedCost: scaledCost(exp1.cost),
      tip: 'Book tickets online in advance to avoid queues — prices are often lower too.',
      bookingRequired: exp1.cost > 15,
    },
    {
      time: '12:30',
      title: `Lunch break & local flavours`,
      description: `Grab lunch at ${eatery} or a nearby local spot. ${preferences.includes('food') ? 'Ask for the chef\'s recommendation — local dishes are always the highlight.' : 'Keep it light to leave energy for the afternoon.'}`,
      type: 'eat',
      duration: '1 hr',
      estimatedCost: scaledCost(preferences.includes('food') ? 35 : 20),
      tip: 'Locals eat lunch between 12:30 and 14:00 — join them for an authentic atmosphere.',
      bookingRequired: false,
    },
    {
      time: '14:00',
      title: exp2.name,
      description: `Your afternoon highlight — ${exp2.name}. ${preferences.includes('photography') ? 'Golden afternoon light makes this a great photography opportunity.' : 'A great balance of activity and exploration.'}`,
      type: exp2.type,
      duration: exp2.duration,
      estimatedCost: scaledCost(exp2.cost),
      tip: 'Weekday afternoons tend to be less crowded. Weekends attract more locals.',
      bookingRequired: exp2.cost > 20,
    },
    {
      time: '17:00',
      title: exp3.name,
      description: `${exp3.name} makes for a perfect late-afternoon activity before dinner. ${preferences.includes('wellness') ? 'Take it easy and soak in the atmosphere.' : ''}`,
      type: exp3.type,
      duration: exp3.duration,
      estimatedCost: scaledCost(exp3.cost),
      tip: 'Late afternoon often brings beautiful light and a more relaxed crowd.',
      bookingRequired: false,
    },
    {
      time: '19:30',
      title: `Dinner at ${dinnerSpot}`,
      description: `End the day with dinner at ${dinnerSpot}. ${preferences.includes('food') ? 'This is one of the city\'s most acclaimed spots — reserve a table.' : 'A wonderful local restaurant showcasing regional cuisine at its best.'}`,
      type: 'eat',
      duration: '1.5 hrs',
      estimatedCost: scaledCost(preferences.includes('food') ? 60 : 35),
      tip: 'Dining later (after 19:30) is culturally normal here and often means a quieter table.',
      bookingRequired: preferences.includes('food'),
    },
  ];

  // On day 1 add hotel stay line at end
  if (dayNum === 1) {
    items.push({
      time: '21:00',
      title: `Overnight at ${hotel}`,
      description: `Rest and recharge for the adventures ahead. ${hotel} is well-placed for exploring the city.`,
      type: 'stay',
      duration: 'Overnight',
      estimatedCost: 0,
      tip: 'Check if breakfast is included — it can save both time and money.',
      bookingRequired: true,
    });
  }

  return { dayNumber: dayNum, title: theme.title, theme: theme.theme, items };
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function buildItinerary(params: ItineraryParams): Itinerary {
  const key = normaliseKey(params.destination);
  const catalogue = DESTINATIONS[key] ?? buildGenericCatalogue(params.destination);
  const tier = BUDGET_TIERS[params.budget] ?? BUDGET_TIERS['Mid-range ($150-300/day)'];
  const numDays = parseDays(params.dates);

  const days: ItineraryDay[] = [];
  for (let i = 0; i < numDays; i++) {
    days.push(buildDay(i + 1, catalogue, tier, params.preferences, i * 3));
  }

  const perDayTotal = days.reduce((sum, d) => sum + d.items.reduce((s, it) => s + it.estimatedCost, 0), 0);
  const travCount = params.travellers.toLowerCase().startsWith('solo') ? 1
    : params.travellers.toLowerCase().startsWith('family') ? 4
    : params.travellers.toLowerCase().startsWith('group') ? 6
    : 2;

  return {
    destination: params.destination,
    duration: `${numDays} day${numDays !== 1 ? 's' : ''}`,
    estimatedTotalCost: Math.round(perDayTotal * travCount),
    currency: 'USD',
    highlights: catalogue.highlights.slice(0, 5),
    days,
    practicalInfo: {
      bestTimeToVisit: catalogue.bestTimeToVisit,
      currency: catalogue.currency,
      languages: catalogue.languages,
      visaRequired: catalogue.visaRequired,
      emergencyNumber: catalogue.emergencyNumber,
    },
  };
}

export function streamItinerary(
  params: ItineraryParams,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): void {
  const itinerary = buildItinerary(params);
  const json = JSON.stringify(itinerary);
  // Simulate streaming in chunks of ~200 chars
  const chunkSize = 200;
  let i = 0;
  const push = () => {
    if (i >= json.length) { onComplete(); return; }
    onChunk(json.slice(i, i + chunkSize));
    i += chunkSize;
    setImmediate(push);
  };
  push();
}

export function streamRefinedItinerary(
  existing: Itinerary,
  instruction: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): void {
  // Apply simple deterministic refinements based on keywords in the instruction
  const lower = instruction.toLowerCase();
  let modified = { ...existing, days: [...existing.days] };

  if (lower.includes('cost') || lower.includes('cheaper') || lower.includes('budget')) {
    modified = {
      ...modified,
      estimatedTotalCost: Math.round(modified.estimatedTotalCost * 0.7),
      days: modified.days.map(d => ({
        ...d,
        items: d.items.map(it => ({ ...it, estimatedCost: Math.round(it.estimatedCost * 0.7) })),
      })),
    };
  }

  if (lower.includes('adventure') || lower.includes('outdoor') || lower.includes('active')) {
    modified = {
      ...modified,
      days: modified.days.map(d => ({
        ...d,
        theme: 'Action-packed adventure day',
        items: d.items.map(it =>
          it.type === 'explore' || it.type === 'experience'
            ? { ...it, tip: 'Wear comfortable shoes and bring water for this active outing.' }
            : it
        ),
      })),
    };
  }

  const json = JSON.stringify(modified);
  const chunkSize = 200;
  let i = 0;
  const push = () => {
    if (i >= json.length) { onComplete(); return; }
    onChunk(json.slice(i, i + chunkSize));
    i += chunkSize;
    setImmediate(push);
  };
  push();
}

export function streamExtraDay(
  existing: Itinerary,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): void {
  const nextDayNum = existing.days.length + 1;
  const key = normaliseKey(existing.destination);
  const catalogue = DESTINATIONS[key] ?? buildGenericCatalogue(existing.destination);
  const tier = BUDGET_TIERS['Mid-range ($150-300/day)'];

  const newDay = buildDay(nextDayNum, catalogue, tier, [], nextDayNum * 3);
  newDay.title = 'Bonus Day Trip';
  newDay.theme = 'A nearby excursion or hidden local gem';

  const modified: Itinerary = {
    ...existing,
    days: [...existing.days, newDay],
    duration: `${nextDayNum} days`,
  };

  const json = JSON.stringify(modified);
  const chunkSize = 200;
  let i = 0;
  const push = () => {
    if (i >= json.length) { onComplete(); return; }
    onChunk(json.slice(i, i + chunkSize));
    i += chunkSize;
    setImmediate(push);
  };
  push();
}
