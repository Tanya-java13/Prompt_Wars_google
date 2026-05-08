import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Voyago's expert AI travel concierge with deep knowledge of global destinations, local culture, transport, dining, and accommodation. Generate a detailed, realistic travel itinerary as valid JSON only — no markdown, no explanation.
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
Personalise based on: traveller type, budget tier, dietary/accessibility constraints, and selected preferences. Make descriptions vivid and specific — real venue names, real neighbourhoods, accurate timings. Never use placeholder text.`;

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
  const userMessage = `Plan a trip to ${params.destination} from ${params.origin}.
Travel dates: ${params.dates}
Travellers: ${params.travellers}
Budget: ${params.budget}
Preferences: ${params.preferences.length > 0 ? params.preferences.join(', ') : 'General travel'}
Constraints/Notes: ${params.constraints || 'None'}

Generate a complete, detailed itinerary as JSON only.`;

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      onChunk(event.delta.text);
    }
  }

  onComplete();
}
