import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini client
// console.log("API KEY:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a diagram generator. Given a concept, return ONLY valid JSON with this structure:
                             { "title": string, "nodes": [{ "id": string, "label": string, "description": string }],
                               "edges": [{ "source": string, "target": string, "label": string }] }. 4-8 nodes max. No markdown, no explanation, only JSON.`;

// POST /api/visualize
app.post('/api/visualize', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty prompt string is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
  {
    role: "user",
    parts: [{ text: prompt.trim() }]
  }
],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1024,
        thinkingConfig: {thinkingBudget:0},
      },
    });

    // Extract text content from the response
    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'No text response from LLM.' });
    }

    // Parse the JSON from the response (strip markdown fences if present)
    let diagram;
    try {
const cleaned = text
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')  // strip thinking tokens
  .trim();

// Extract JSON object if there's extra text around it
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  return res.status(500).json({ error: 'No JSON found in response.', raw: text });
}
diagram = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({
        error: 'LLM returned invalid JSON.',
        raw: text,
      });
    }

    return res.json(diagram);
  } catch (err) {
    console.error('Error in /api/visualize:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
