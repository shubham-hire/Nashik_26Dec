import { ai } from '../genkit';
import { gemini10Pro } from '@genkit-ai/vertexai';
import { AnalysisInputSchema, AnalysisOutputSchema, AnalysisOutput } from '../schemas';

const SYSTEM_PROMPT = `You are an expert AI security analyst specializing in detecting financial scams, phishing attempts, and fraudulent messages. Your role is to protect users from malicious content.

Analyze the provided message and respond with a JSON object containing:
- riskLevel: "safe", "suspicious", or "high-risk"  
- score: A number 0-100 (0 = completely safe, 100 = definite scam)
- scamType: Classify the scam (e.g., "Prize / Reward Scam", "Bank / Authority Impersonation", "Investment Scam", "Job / Employment Scam", "Not a Scam")
- riskIndicators: Array of specific red flags found (e.g., "Urgency or Pressure to Act", "Suspicious Link Request", "Request for Sensitive Credentials")
- similarity: "Low", "Medium", or "High" based on how closely it matches known scam patterns
- reasons: Array of detailed explanations for your assessment
- advice: Clear, actionable recommendation for the user
- simplifiedExplanation: A simple, non-technical explanation suitable for elderly users

Be thorough but concise. If the message appears safe, still explain why.`;

export const analyzeScamFlow = ai.defineFlow(
    {
        name: 'analyzeScamFlow',
        inputSchema: AnalysisInputSchema,
        outputSchema: AnalysisOutputSchema,
    },
    async (input) => {
        const userMessage = input.fileUrl
            ? `${input.text}\n\n[Attached file: ${input.fileUrl}]`
            : input.text;

        // Combine system prompt with user message
        const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\nMessage to analyze:\n${userMessage}`;

        const { output } = await ai.generate({
            model: gemini10Pro,
            prompt: fullPrompt,
            output: {
                format: 'json',
                schema: AnalysisOutputSchema,
            },
            config: {
                temperature: 0.2,
            },
        });

        return output as AnalysisOutput;
    }
);

// Export a helper function to run the flow
export async function runAnalysis(input: { text: string; fileUrl?: string }): Promise<AnalysisOutput> {
    return await analyzeScamFlow(input);
}
