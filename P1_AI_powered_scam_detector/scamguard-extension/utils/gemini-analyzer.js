// Gemini AI Analyzer
class GeminiAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
    this.fallbackDetector = new FallbackDetector();
  }

  async analyzePageContent(text, url) {
    // If no API key, use fallback
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('No Gemini API key, using fallback detection');
      return this.fallbackDetector.analyze(text, url);
    }

    try {
      const prompt = this.createScamDetectionPrompt(text, url);
      const response = await this.callGeminiAPI(prompt);
      return this.parseGeminiResponse(response);
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to rule-based detection
      return this.fallbackDetector.analyze(text, url);
    }
  }

  createScamDetectionPrompt(text, url) {
    // Truncate text to avoid token limits (Gemini 1.5 Flash has 1M tokens but let's be safe)
    const truncatedText = text.substring(0, 10000);
    
    return `Analyze this webpage content for potential scams or financial risks.

URL: ${url}
Content Sample: ${truncatedText}

Please analyze for:
1. Scam indicators (fake urgency, impersonation, fake prizes)
2. Financial risks (poor value, hidden fees, predatory loans)
3. Phishing attempts (fake login pages, credential harvesting)
4. Social engineering (emotional manipulation, false authority)

Return ONLY a JSON object in this exact format:
{
  "riskLevel": "low" | "medium" | "high",
  "confidence": 0.0-1.0,
  "scamType": "none" | "phishing" | "fake_prize" | "impersonation" | "investment_scam" | "other",
  "reasons": ["reason1", "reason2", "reason3"],
  "explanation": "Brief explanation in simple terms",
  "recommendation": "What the user should do"
}`;
  }

  async callGeminiAPI(prompt) {
    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,  // Low for consistent results
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    return await response.json();
  }

  parseGeminiResponse(response) {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      // Extract JSON from response (Gemini sometimes adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if parsing fails
      return {
        riskLevel: "medium",
        confidence: 0.5,
        scamType: "unknown",
        reasons: ["AI analysis inconclusive"],
        explanation: "Could not analyze page content",
        recommendation: "Proceed with caution"
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return this.fallbackDetector.getDefaultResponse();
    }
  }
}

// Fallback detector (rule-based)
class FallbackDetector {
  analyze(text, url) {
    const patterns = {
      urgency: ['limited time', 'act now', 'today only', 'urgent'],
      payment: ['wire transfer', 'gift cards', 'bitcoin only'],
      deception: ['you\'ve won', 'free prize', 'congratulations']
    };

    const detected = [];
    for (const [type, keywords] of Object.entries(patterns)) {
      if (keywords.some(k => text.toLowerCase().includes(k))) {
        detected.push(type);
      }
    }

    const riskLevel = detected.length >= 2 ? 'high' : 
                     detected.length === 1 ? 'medium' : 'low';

    return {
      riskLevel,
      confidence: 0.7,
      scamType: detected.length > 0 ? 'suspicious' : 'none',
      reasons: detected.map(d => `Detected ${d} patterns`),
      explanation: 'Rule-based detection',
      recommendation: detected.length > 0 ? 'Be cautious' : 'Appears safe'
    };
  }

  getDefaultResponse() {
    return {
      riskLevel: "low",
      confidence: 0.5,
      scamType: "none",
      reasons: ["No analysis available"],
      explanation: "Using basic detection",
      recommendation: "Proceed normally"
    };
  }
}

export { GeminiAnalyzer };
