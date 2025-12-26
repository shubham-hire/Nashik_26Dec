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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyzeScam_1 = require("./flows/analyzeScam");
const schemas_1 = require("./schemas");
require("./genkit"); // Initialize Genkit
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'ScamGuard Pro Backend is running! 🛡️' });
});
// Main Analysis Endpoint
app.post('/api/analyze', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate input
        const input = schemas_1.AnalysisInputSchema.parse(req.body);
        // Run the Genkit flow using the helper function
        const result = yield (0, analyzeScam_1.runAnalysis)(input);
        res.json(result);
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message || 'Unknown error'
        });
    }
}));
app.listen(PORT, () => {
    console.log(`🛡️ ScamGuard Pro Backend running on http://localhost:${PORT}`);
    console.log('🤖 Genkit configured with Vertex AI (Gemini 1.5 Pro)');
});
