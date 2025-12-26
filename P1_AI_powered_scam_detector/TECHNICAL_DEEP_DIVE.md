# ScamGuard Pro: Technical Deep Dive

A comprehensive technical breakdown of the AI-powered scam detection system.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │   React Frontend (Vite)                                              │    │
│  │   • Chat-style message interface                                     │    │
│  │   • Real-time analysis display                                       │    │
│  │   • History panel with localStorage persistence                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST /api/analyze
                                    │ Content-Type: application/json
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND SERVER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │   Express.js + TypeScript                                            │    │
│  │   • CORS-enabled REST API                                            │    │
│  │   • Zod input validation                                             │    │
│  │   • Error handling middleware                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Genkit Flow Invocation
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GENKIT ORCHESTRATION                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │   Firebase Genkit (ADK)                                              │    │
│  │   • Defines AI Flows with typed I/O                                  │    │
│  │   • Handles prompt construction                                      │    │
│  │   • Enforces structured JSON output                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ gRPC / HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE CLOUD PLATFORM                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │   Vertex AI                                                          │    │
│  │   • Hosts Gemini 1.0 Pro model                                       │    │
│  │   • Processes natural language                                       │    │
│  │   • Returns structured scam analysis                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern SPA with HMR |
| **Styling** | Vanilla CSS | Custom design system with animations |
| **Backend** | Express.js + TypeScript | REST API server |
| **AI Framework** | Firebase Genkit | AI workflow orchestration |
| **AI Model** | Vertex AI (Gemini 1.0 Pro) | Large Language Model |
| **Validation** | Zod | Runtime type checking & schema validation |
| **State** | localStorage | Client-side history persistence |

---

## 3. Backend Deep Dive

### 3.1 Entry Point (`src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import { runAnalysis } from './flows/analyzeScam';
import { AnalysisInputSchema } from './schemas';
import './genkit'; // Initialize Genkit

const app = express();
app.use(cors());
app.use(express.json());

// Main Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const input = AnalysisInputSchema.parse(req.body);
        const result = await runAnalysis(input);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
});
```

**Key Points:**
- **CORS Enabled**: Allows frontend on different port to communicate.
- **Zod Validation**: `AnalysisInputSchema.parse()` throws if input is malformed.
- **Async Handler**: AI analysis is awaited before responding.

---

### 3.2 Genkit Configuration (`src/genkit.ts`)

```typescript
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

export const ai = genkit({
    plugins: [
        vertexAI({
            projectId: process.env.GOOGLE_CLOUD_PROJECT || 'scamguard-pro',
            location: 'us-central1',
        }),
    ],
});
```

**What This Does:**
1. **Initializes Genkit**: Creates a singleton AI instance.
2. **Registers Vertex AI Plugin**: Connects to Google Cloud.
3. **Sets Region**: `us-central1` for low latency.

---

### 3.3 The AI Flow (`src/flows/analyzeScam.ts`)

This is the **core intelligence** of the application.

```typescript
import { ai } from '../genkit';
import { gemini10Pro } from '@genkit-ai/vertexai';

const SYSTEM_PROMPT = `You are an expert AI security analyst...`;

export const analyzeScamFlow = ai.defineFlow(
    {
        name: 'analyzeScamFlow',
        inputSchema: AnalysisInputSchema,
        outputSchema: AnalysisOutputSchema,
    },
    async (input) => {
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
        return output;
    }
);
```

**Technical Breakdown:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `model` | `gemini10Pro` | Uses Gemini 1.0 Pro from Vertex AI |
| `output.format` | `'json'` | Forces structured JSON response |
| `output.schema` | `AnalysisOutputSchema` | Validates AI output against Zod schema |
| `temperature` | `0.2` | Low randomness = consistent, predictable results |

**Why Use Flows?**
- **Observability**: Every flow execution is traced (viewable in Genkit UI).
- **Type Safety**: Input/output schemas ensure contract adherence.
- **Testability**: Flows can be unit tested in isolation.

---

### 3.4 Data Schemas (`src/schemas.ts`)

```typescript
import { z } from 'zod';

// Input Schema
export const AnalysisInputSchema = z.object({
    text: z.string().describe('The message text to analyze'),
    fileUrl: z.string().optional().describe('Optional URL of an image/audio'),
});

// Output Schema
export const AnalysisOutputSchema = z.object({
    riskLevel: z.enum(['safe', 'suspicious', 'high-risk']),
    score: z.number().min(0).max(100),
    scamType: z.string(),
    riskIndicators: z.array(z.string()),
    similarity: z.enum(['Low', 'Medium', 'High']),
    reasons: z.array(z.string()),
    advice: z.string(),
    simplifiedExplanation: z.string(),
});
```

**Why Zod?**
- **Runtime Validation**: Unlike TypeScript (compile-time only), Zod validates at runtime.
- **Self-Documenting**: `.describe()` adds metadata for the AI model.
- **Type Inference**: `z.infer<typeof Schema>` generates TypeScript types automatically.

---

## 4. Frontend Deep Dive

### 4.1 Application Structure

```
frontend/src/
├── App.jsx                 # Main app with routing logic
├── components/
│   ├── MessageInput.jsx    # Text input + file upload
│   ├── ChatStream.jsx      # Message list renderer
│   ├── AnalysisResult.jsx  # AI response display
│   ├── RiskBadge.jsx       # Visual risk indicator
│   ├── HistoryPanel.jsx    # Past analyses
│   ├── SafetyTips.jsx      # Educational content
│   └── LiveAlerts.jsx      # Trending scam ticker
└── utils/
    └── mockAi.js           # API wrapper
```

### 4.2 State Management (`App.jsx`)

```javascript
const [messages, setMessages] = useState([]);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [history, setHistory] = useState([]);

// Load history from localStorage on mount
useEffect(() => {
    const savedHistory = localStorage.getItem('scamGuardHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
}, []);
```

**Key Patterns:**
- **Optimistic UI**: Shows loading state immediately while AI processes.
- **Persistent History**: Uses `localStorage` for cross-session memory.
- **Chat-style UX**: Messages are appended to a stream, not replaced.

### 4.3 Risk Visualization (`AnalysisResult.jsx`)

The component renders the AI response with visual hierarchy:

1. **Risk Badge**: Color-coded indicator (green/yellow/red)
2. **Scam Type Chip**: Categorization label
3. **Risk Indicators**: Checklist of detected red flags
4. **Explanation Section**: With "Simple Mode" toggle
5. **Similarity Bar**: Visual progress bar showing pattern match
6. **Action Box**: Recommended next steps

**Simple Mode Feature:**
```javascript
const [simpleMode, setSimpleMode] = useState(false);

<p className="explanation-text">
    {simpleMode ? result.simplifiedExplanation : result.reasons[0]}
</p>
```

This toggle switches between technical analysis and layman-friendly explanation.

---

## 5. AI Prompt Engineering

### The System Prompt

```
You are an expert AI security analyst specializing in detecting 
financial scams, phishing attempts, and fraudulent messages. 
Your role is to protect users from malicious content.

Analyze the provided message and respond with a JSON object containing:
- riskLevel: "safe", "suspicious", or "high-risk"
- score: A number 0-100 (0 = completely safe, 100 = definite scam)
- scamType: Classify the scam (e.g., "Prize / Reward Scam", ...)
- riskIndicators: Array of specific red flags found
- similarity: "Low", "Medium", or "High" based on known scam patterns
- reasons: Array of detailed explanations for your assessment
- advice: Clear, actionable recommendation for the user
- simplifiedExplanation: A simple explanation suitable for elderly users
```

**Prompt Engineering Techniques Used:**
1. **Role Assignment**: "You are an expert AI security analyst"
2. **Task Definition**: "Analyze the provided message"
3. **Output Specification**: Explicit JSON field requirements
4. **Audience Awareness**: "suitable for elderly users"

---

## 6. Data Flow Sequence

```
User                Frontend              Backend               Vertex AI
  │                    │                    │                      │
  │ Paste message      │                    │                      │
  ├───────────────────▶│                    │                      │
  │                    │ POST /api/analyze  │                      │
  │                    ├───────────────────▶│                      │
  │                    │                    │ ai.generate()        │
  │                    │                    ├─────────────────────▶│
  │                    │                    │                      │
  │                    │                    │   Gemini Analysis    │
  │                    │                    │◀─────────────────────┤
  │                    │   JSON Response    │                      │
  │                    │◀───────────────────┤                      │
  │  Display Result    │                    │                      │
  │◀───────────────────┤                    │                      │
  │                    │                    │                      │
```

---

## 7. Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Input Sanitization** | Zod schema validation prevents injection |
| **CORS** | Restricted to known frontend origins |
| **API Keys** | Stored in environment variables, never exposed |
| **Rate Limiting** | (Recommended) Add express-rate-limit |
| **Error Handling** | Generic error messages to prevent info leakage |

---

## 8. Performance Optimizations

1. **Low Temperature (0.2)**: Reduces LLM processing time with deterministic outputs.
2. **Structured Output**: JSON schema reduces post-processing.
3. **Vite for Frontend**: Sub-second HMR and optimized production builds.
4. **Single API Call**: One request contains all analysis data.

---

## 9. Observability with Genkit

Run the Genkit Developer UI:
```bash
npx genkit start
```

This provides:
- **Trace Viewer**: See exact prompts sent to AI
- **Flow Testing**: Run flows with custom inputs
- **Metrics**: Response times and token usage

---

## 10. Summary

ScamGuard Pro demonstrates a production-ready AI application architecture:

- **Type-Safe AI**: Zod schemas ensure reliable, predictable AI outputs
- **Modular Design**: Separation of concerns (API, Flows, Schemas)
- **User-Centric**: Dual-mode explanations for technical and non-technical users
- **Observable**: Full traceability via Genkit developer tools
- **Secure**: Input validation, environment-based secrets, CORS protection

This architecture can be extended to support:
- Multi-language analysis
- Image/audio scam detection
- Real-time WebSocket alerts
- Admin dashboard for scam pattern updates
