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

export interface PlannerFormData {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  travellers: string;
  budget: string;
  preferences: string[];
  constraints: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  generationsUsed: number;
  customizationsUsed: number;
  subscriptionStatus: 'free' | 'active' | 'cancelled' | 'expired';
  subscriptionExpiresAt: string | null;
}

export interface Alert {
  id: string;
  type: 'flight' | 'weather' | 'hotel' | 'safety';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  location: string;
  timestamp: string;
}
