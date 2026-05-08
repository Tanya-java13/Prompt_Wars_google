import { useState } from 'react';
import type { Itinerary, PlannerFormData } from '../types/travel';

export function useItinerary() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (formData: PlannerFormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination,
          origin: formData.origin,
          dates: formData.startDate && formData.endDate
            ? `${formData.startDate} to ${formData.endDate}`
            : 'Flexible dates',
          travellers: formData.travellers,
          budget: formData.budget,
          preferences: formData.preferences,
          constraints: formData.constraints,
        }),
      });

      if (!response.ok || !response.body) throw new Error(`Server error ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let json = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.error) throw new Error(payload.error);
          if (payload.done) {
            const parsed: Itinerary = JSON.parse(json);
            setItinerary(parsed);
          } else if (payload.chunk) {
            json += payload.chunk;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrip = async (formData: PlannerFormData): Promise<string | undefined> => {
    if (!itinerary) return;
    try {
      const res = await fetch('/api/trips/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, itinerary }),
      });
      const data = await res.json();
      return data.id as string;
    } catch {
      return undefined;
    }
  };

  return { itinerary, isLoading, error, generate, saveTrip };
}
