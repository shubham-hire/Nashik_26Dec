"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisOutputSchema = exports.AnalysisInputSchema = void 0;
const zod_1 = require("zod");
// Input schema for the analyze endpoint
exports.AnalysisInputSchema = zod_1.z.object({
    text: zod_1.z.string().describe('The message text to analyze'),
    fileUrl: zod_1.z.string().optional().describe('Optional URL of an image or audio file'),
});
// Output schema matching the frontend's AnalysisResult
exports.AnalysisOutputSchema = zod_1.z.object({
    riskLevel: zod_1.z.enum(['safe', 'suspicious', 'high-risk']).describe('Overall risk classification'),
    score: zod_1.z.number().min(0).max(100).describe('Numerical risk score'),
    scamType: zod_1.z.string().describe('Classification of scam type (e.g., "Prize / Reward Scam", "Bank Impersonation")'),
    riskIndicators: zod_1.z.array(zod_1.z.string()).describe('List of detected red flags'),
    similarity: zod_1.z.enum(['Low', 'Medium', 'High']).describe('Similarity to known scam patterns'),
    reasons: zod_1.z.array(zod_1.z.string()).describe('Detailed reasons for the assessment'),
    advice: zod_1.z.string().describe('Recommended action for the user'),
    simplifiedExplanation: zod_1.z.string().describe('Easy-to-understand explanation for non-technical users'),
});
