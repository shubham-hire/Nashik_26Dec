import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import * as dotenv from 'dotenv';

dotenv.config();

// Configure and export the Genkit instance
export const ai = genkit({
    plugins: [
        vertexAI({
            projectId: process.env.GOOGLE_CLOUD_PROJECT || 'scamguard-pro',
            location: 'us-central1',
        }),
    ],
});
