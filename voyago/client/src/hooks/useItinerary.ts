import { useState, useCallback } from 'react';
import type { Itinerary, PlannerFormData } from '../types/travel';

async function consumeSSE(
  url: string,
  body: object,
  onItinerary: (it: Itinerary) => void,
  onError: (msg: string) => void
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Server error ${response.status}`);
  }

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
      if (payload.error) { onError(payload.error); return; }
      if (payload.done) {
        try {
          // Strip potential markdown fences from response
          const clean = json.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          onItinerary(JSON.parse(clean));
        } catch {
          onError('Failed to parse itinerary — please try again.');
        }
      } else if (payload.chunk) {
        json += payload.chunk;
      }
    }
  }
}

export function useItinerary() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (formData: PlannerFormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      await consumeSSE(
        '/api/generate-itinerary',
        {
          destination: formData.destination,
          origin: formData.origin,
          dates: formData.startDate && formData.endDate
            ? `${formData.startDate} to ${formData.endDate}`
            : 'Flexible dates',
          travellers: formData.travellers,
          budget: formData.budget,
          preferences: formData.preferences,
          constraints: formData.constraints,
        },
        setItinerary,
        setError
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refine = useCallback(async (instruction: string) => {
    if (!itinerary) return;
    setIsLoading(true);
    setError(null);
    try {
      await consumeSSE(
        '/api/refine-itinerary',
        { itinerary, instruction },
        setItinerary,
        setError
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed');
    } finally {
      setIsLoading(false);
    }
  }, [itinerary]);

  const addDay = useCallback(async () => {
    if (!itinerary) return;
    setIsLoading(true);
    setError(null);
    try {
      await consumeSSE(
        '/api/add-day-trip',
        { itinerary },
        setItinerary,
        setError
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add day trip');
    } finally {
      setIsLoading(false);
    }
  }, [itinerary]);

  const saveTrip = useCallback(async (formData: PlannerFormData): Promise<string | undefined> => {
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
  }, [itinerary]);

  return { itinerary, isLoading, error, generate, refine, addDay, saveTrip };
}
