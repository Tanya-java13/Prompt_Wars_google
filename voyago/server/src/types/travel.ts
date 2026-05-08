export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  type: 'stay' | 'eat' | 'explore' | 'experience' | 'transport';
  duration: string;
  estimatedCost: number;
  tip: string;
  bookingRequired: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  items: ItineraryItem[];
}

export interface PracticalInfo {
  bestTimeToVisit: string;
  currency: string;
  languages: string[];
  visaRequired: boolean;
  emergencyNumber: string;
}

export interface Itinerary {
  destination: string;
  duration: string;
  estimatedTotalCost: number;
  currency: string;
  highlights: string[];
  days: ItineraryDay[];
  practicalInfo: PracticalInfo;
}
