import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config();

// Configure Genkit with Google AI plugin (uses GOOGLE_GENAI_API_KEY from .env)
export const ai = genkit({
    plugins: [
        googleAI(),
    ],
});
