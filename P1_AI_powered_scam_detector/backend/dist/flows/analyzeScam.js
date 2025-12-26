"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeScamFlow = void 0;
exports.runAnalysis = runAnalysis;
const genkit_1 = require("../genkit");
const vertexai_1 = require("@genkit-ai/vertexai");
const schemas_1 = require("../schemas");
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
exports.analyzeScamFlow = genkit_1.ai.defineFlow({
    name: 'analyzeScamFlow',
    inputSchema: schemas_1.AnalysisInputSchema,
    outputSchema: schemas_1.AnalysisOutputSchema,
}, (input) => __awaiter(void 0, void 0, void 0, function* () {
    const userMessage = input.fileUrl
        ? `${input.text}\n\n[Attached file: ${input.fileUrl}]`
        : input.text;
    // Combine system prompt with user message
    const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\nMessage to analyze:\n${userMessage}`;
    const { output } = yield genkit_1.ai.generate({
        model: vertexai_1.gemini15Pro,
        prompt: fullPrompt,
        output: {
            format: 'json',
            schema: schemas_1.AnalysisOutputSchema,
        },
        config: {
            temperature: 0.2,
        },
    });
    return output;
}));
// Export a helper function to run the flow
function runAnalysis(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, exports.analyzeScamFlow)(input);
    });
}
