import { VertexAI } from '@google-cloud/vertexai';

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

function getModel() {
  const vertex = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT || 'project-warmup-2026',
    location: 'us-central1',
  });
  return vertex.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  });
}

export async function generateItinerary(
  params: {
    destination: string;
    origin: string;
    dates: string;
    travellers: string;
    budget: string;
    preferences: string[];
    constraints: string;
  },
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> {
  const prompt = `Plan a trip to ${params.destination} from ${params.origin}.
Travel dates: ${params.dates}
Travellers: ${params.travellers}
Budget: ${params.budget}
Preferences: ${params.preferences.length > 0 ? params.preferences.join(', ') : 'General travel'}
Constraints/Notes: ${params.constraints || 'None'}
Return a complete, detailed itinerary as JSON only.`;

  const result = await getModel().generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (text) onChunk(text);
  }
  onComplete();
}

export async function refineItinerary(
  itinerary: object,
  instruction: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> {
  const prompt = `Here is an existing travel itinerary in JSON:
${JSON.stringify(itinerary, null, 2)}

User instruction: "${instruction}"

Apply the instruction to improve or modify this itinerary. Return the complete updated itinerary as valid JSON only, same structure as before.`;

  const result = await getModel().generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (text) onChunk(text);
  }
  onComplete();
}

export async function addDayTrip(
  itinerary: object,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> {
  const prompt = `Here is an existing travel itinerary in JSON:
${JSON.stringify(itinerary, null, 2)}

Add one more day trip to this itinerary. The new day should complement existing days with a fresh theme — a nearby excursion, hidden gem, or alternative experience. Return the complete updated itinerary as valid JSON only.`;

  const result = await getModel().generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (text) onChunk(text);
  }
  onComplete();
}
