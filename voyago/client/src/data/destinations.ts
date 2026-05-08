export const DESTINATIONS = [
  'Tokyo, Japan', 'Kyoto, Japan', 'Osaka, Japan', 'Hokkaido, Japan',
  'Paris, France', 'Lyon, France', 'Nice, France', 'Marseille, France',
  'London, UK', 'Edinburgh, UK', 'Bath, UK', 'Oxford, UK',
  'Rome, Italy', 'Florence, Italy', 'Venice, Italy', 'Amalfi Coast, Italy',
  'Cinque Terre, Italy', 'Milan, Italy', 'Sicily, Italy',
  'Barcelona, Spain', 'Madrid, Spain', 'Seville, Spain', 'Granada, Spain',
  'Santorini, Greece', 'Athens, Greece', 'Mykonos, Greece', 'Crete, Greece',
  'Amsterdam, Netherlands', 'Bruges, Belgium', 'Prague, Czech Republic',
  'Vienna, Austria', 'Salzburg, Austria', 'Budapest, Hungary',
  'Lisbon, Portugal', 'Porto, Portugal', 'Dubrovnik, Croatia',
  'Kotor, Montenegro', 'Copenhagen, Denmark', 'Stockholm, Sweden',
  'Reykjavik, Iceland', 'Dublin, Ireland', 'Zurich, Switzerland',
  'Munich, Germany', 'Berlin, Germany', 'Krakow, Poland',
  'Istanbul, Turkey', 'Cappadocia, Turkey', 'Dubai, UAE', 'Abu Dhabi, UAE',
  'Marrakech, Morocco', 'Fez, Morocco', 'Cairo, Egypt', 'Luxor, Egypt',
  'Cape Town, South Africa', 'Zanzibar, Tanzania', 'Nairobi, Kenya',
  'Maldives', 'Seychelles', 'Mauritius',
  'Bali, Indonesia', 'Ubud, Bali', 'Lombok, Indonesia', 'Raja Ampat, Indonesia',
  'Bangkok, Thailand', 'Chiang Mai, Thailand', 'Phuket, Thailand', 'Koh Samui, Thailand',
  'Singapore', 'Kuala Lumpur, Malaysia', 'Langkawi, Malaysia',
  'Hanoi, Vietnam', 'Hoi An, Vietnam', 'Ho Chi Minh City, Vietnam', 'Ha Long Bay, Vietnam',
  'Siem Reap, Cambodia', 'Luang Prabang, Laos',
  'Mumbai, India', 'Jaipur, India', 'Goa, India', 'Kerala, India', 'Delhi, India',
  'Colombo, Sri Lanka', 'Kathmandu, Nepal',
  'Sydney, Australia', 'Melbourne, Australia', 'Queenstown, New Zealand',
  'Auckland, New Zealand', 'Great Barrier Reef, Australia',
  'New York, USA', 'Los Angeles, USA', 'San Francisco, USA', 'Miami, USA',
  'New Orleans, USA', 'Chicago, USA', 'Las Vegas, USA', 'Hawaii, USA',
  'Cancun, Mexico', 'Mexico City, Mexico', 'Tulum, Mexico', 'Oaxaca, Mexico',
  'Havana, Cuba', 'Cartagena, Colombia', 'Medellín, Colombia',
  'Buenos Aires, Argentina', 'Patagonia, Argentina',
  'Rio de Janeiro, Brazil', 'São Paulo, Brazil', 'Florianópolis, Brazil',
  'Machu Picchu, Peru', 'Lima, Peru', 'Cusco, Peru',
  'Galápagos Islands, Ecuador', 'Quito, Ecuador',
];

export function searchDestinations(query: string): string[] {
  if (query.length < 2) return [];
  const q = query.toLowerCase();
  return DESTINATIONS.filter(d => d.toLowerCase().includes(q)).slice(0, 7);
}
