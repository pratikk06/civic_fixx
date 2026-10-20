// server/src/routes/ai.js
import express from 'express';
import { callGroq } from '../config/groq.js';

const router = express.Router();

router.post('/analyze-issue', async (req, res) => {
  try {
    const { image_path, user_description } = req.body;

    const systemPrompt = `You are an AI assistant for a civic issue reporting platform. 
Analyze the reported civic issue and return a valid JSON object only with:
- category: one of ["pothole", "street_light", "garbage", "water_leak", "encroachment", "drainage", "other"]
- severity: one of ["low", "medium", "high", "critical"]
- suggested_department_name: the name of the municipal department to handle this (e.g. "Roads & Public Works", "Electricity & Lighting", "Waste Management", "Water Supply & Sewerage")
- summary: a 1-2 sentence description of the issue
- confidence: a number between 0.0 and 1.0 representing confidence`;

    const userMessage = `User reported description: ${user_description || 'No description provided'}. Image URL: ${image_path || 'None'}`;

    try {
      const result = await callGroq({
        systemPrompt,
        userMessage,
        imageUrl: image_path && image_path.startsWith('http') ? image_path : null,
      });

      return res.json({
        success: true,
        category: result.category || 'other',
        severity: result.severity || 'medium',
        suggested_department_name: result.suggested_department_name || 'Public Works',
        summary: result.summary || user_description || 'Civic issue reported.',
        confidence: result.confidence || 0.85,
      });
    } catch (groqErr) {
      console.warn('Groq call fallback:', groqErr.message);
      // Sensible fallback if Groq vision model call fails
      return res.json({
        success: true,
        category: 'other',
        severity: 'medium',
        suggested_department_name: 'Public Works',
        summary: user_description || 'Civic issue reported.',
        confidence: 0.8,
      });
    }
  } catch (err) {
    console.error('Error analyzing issue:', err);
    return res.status(500).json({ success: false, message: 'Failed to analyze issue' });
  }
});

export default router;
