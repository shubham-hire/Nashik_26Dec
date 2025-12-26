import express from 'express';
import cors from 'cors';
import { runAnalysis } from './flows/analyzeScam';
import { AnalysisInputSchema } from './schemas';
import './genkit'; // Initialize Genkit

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'ScamGuard Pro Backend is running! 🛡️' });
});

// Main Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        // Validate input
        const input = AnalysisInputSchema.parse(req.body);

        // Run the Genkit flow using the helper function
        const result = await runAnalysis(input);

        res.json(result);
    } catch (error: any) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message || 'Unknown error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🛡️ ScamGuard Pro Backend running on http://localhost:${PORT}`);
    console.log('🤖 Genkit configured with Vertex AI (Gemini 1.5 Pro)');
});
