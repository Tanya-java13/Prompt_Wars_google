import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import {
  streamItinerary,
  streamRefinedItinerary,
  streamExtraDay,
} from './templateService';
import type { Itinerary } from '../types/travel';

const SYSTEM_PROMPT = `You are Voyago's expert AI travel concierge with deep knowledge of global destinations, local culture, transport, dining, and accommodation. Generate a detailed, realistic travel itinerary as valid JSON only — no markdown, no explanation, no code fences.
Return this exact structure:
{
  "destination": string,
  "duration": string,
  "estimatedTotalCost": number,
  "currency": "USD",
  "highlights": string[],
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "theme": string,
      "items": [
        {
          "time": string,
          "title": string,
          "description": string,
          "type": "stay" | "eat" | "explore" | "experience" | "transport",
          "duration": string,
          "estimatedCost": number,
          "tip": string,
          "bookingRequired": boolean
        }
      ]
    }
  ],
  "practicalInfo": {
    "bestTimeToVisit": string,
    "currency": string,
    "languages": string[],
    "visaRequired": boolean,
    "emergencyNumber": string
  }
}
Personalise based on: traveller type, budget tier, dietary/accessibility constraints, and selected preferences. Use real venue names, real neighbourhoods, accurate timings. Return only valid JSON.`;

function getGeminiModel() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
    });
  } catch {
    return null;
  }
}

async function tryGeminiStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): Promise<boolean> {
  const model = getGeminiModel();
  if (!model) return false;
  try {
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) onChunk(text);
    }
    onComplete();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn('Gemini API unavailable, using template engine', { reason: msg.slice(0, 120) });
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ItineraryParams {
  destination: string;
  origin: string;
  dates: string;
  travellers: string;
  budget: string;
  preferences: string[];
  constraints: string;
}

export async function generateItinerary(
  params: ItineraryParams,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): Promise<void> {
  const prompt = `Plan a trip to ${params.destination} from ${params.origin}.
Travel dates: ${params.dates}
Travellers: ${params.travellers}
Budget: ${params.budget}
Preferences: ${params.preferences.length > 0 ? params.preferences.join(', ') : 'General travel'}
Constraints/Notes: ${params.constraints || 'None'}
Return a complete, detailed itinerary as JSON only.`;

  const ok = await tryGeminiStream(prompt, onChunk, onComplete);
  if (!ok) streamItinerary(params, onChunk, onComplete);
}

export async function refineItinerary(
  itinerary: Itinerary,
  instruction: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): Promise<void> {
  const prompt = `Here is an existing travel itinerary in JSON:
${JSON.stringify(itinerary, null, 2)}

User instruction: "${instruction}"

Apply the instruction to improve or modify this itinerary. Return the complete updated itinerary as valid JSON only, same structure as before.`;

  const ok = await tryGeminiStream(prompt, onChunk, onComplete);
  if (!ok) streamRefinedItinerary(itinerary, instruction, onChunk, onComplete);
}

export async function addDayTrip(
  itinerary: Itinerary,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
): Promise<void> {
  const prompt = `Here is an existing travel itinerary in JSON:
${JSON.stringify(itinerary, null, 2)}

Add one more day trip that complements the existing days — a nearby excursion, hidden gem, or alternative experience. Return the complete updated itinerary as valid JSON only.`;

  const ok = await tryGeminiStream(prompt, onChunk, onComplete);
  if (!ok) streamExtraDay(itinerary, onChunk, onComplete);
}
