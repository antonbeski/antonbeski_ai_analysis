import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let apiURL = 'http://localhost:9002/api/genkit';
if (process.env.VERCEL_URL) {
  // Set the API URL to the Vercel deployment URL
  apiURL = `https://${process.env.VERCEL_URL}/api/genkit`;
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
