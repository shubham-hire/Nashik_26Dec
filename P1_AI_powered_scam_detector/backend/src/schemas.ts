import { z } from 'zod';

// Input schema for the analyze endpoint
export const AnalysisInputSchema = z.object({
    text: z.string().describe('The message text to analyze'),
    fileUrl: z.string().optional().describe('Optional URL of an image or audio file'),
});

export type AnalysisInput = z.infer<typeof AnalysisInputSchema>;

// Output schema matching the frontend's AnalysisResult
export const AnalysisOutputSchema = z.object({
    riskLevel: z.enum(['safe', 'suspicious', 'high-risk']).describe('Overall risk classification'),
    score: z.number().min(0).max(100).describe('Numerical risk score'),
    scamType: z.string().describe('Classification of scam type (e.g., "Prize / Reward Scam", "Bank Impersonation")'),
    riskIndicators: z.array(z.string()).describe('List of detected red flags'),
    similarity: z.enum(['Low', 'Medium', 'High']).describe('Similarity to known scam patterns'),
    reasons: z.array(z.string()).describe('Detailed reasons for the assessment'),
    advice: z.string().describe('Recommended action for the user'),
    simplifiedExplanation: z.string().describe('Easy-to-understand explanation for non-technical users'),
});

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
