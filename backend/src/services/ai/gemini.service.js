/**
 * AI Service — wraps Google Gemini API calls.
 *
 * Uses the Gemini REST API directly (no SDK dependency) so only
 * the GEMINI_API_KEY env var is required.
 *
 * Two operations are exposed:
 *   generateQuestions(resumeText, count?)  → string[]
 *   evaluateAnswer(question, answer)       → { score, feedback }
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Low-level helper — sends a prompt and returns the text response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API.');
  return text.trim();
};

/**
 * Normalizes varied AI outputs (Array<Question>, Array<String>, or multiline String)
 * into a consistent array of { id, question } objects.
 */
const normalizeQuestions = (input, count) => {
  let strings = [];
  if (typeof input === 'string') {
    strings = input.split('\n');
  } else if (Array.isArray(input)) {
    input.forEach((item) => {
      if (typeof item === 'string') {
        strings.push(...item.split('\n'));
      } else if (item && typeof item === 'object' && item.question) {
        strings.push(...String(item.question).split('\n'));
      }
    });
  }

  let parsed = [];
  strings.forEach((s) => {
    // split numbered lists and trim
    const cleaned = s.replace(/^[\d\-\*\.\s"]+/, '').replace(/[",]+$/, '').trim();
    if (cleaned.length > 0) {
      parsed.push(cleaned);
    }
  });

  return parsed.slice(0, count).map((q, i) => ({ id: i + 1, question: q }));
};

/**
 * Generates interview questions based on resume text.
 * @param {string} resumeText  - Extracted resume plain text
 * @param {number} count       - Number of questions (default 5)
 * @returns {Promise<string[]>}
 */
const generateQuestions = async (resumeText, count = 5) => {
  const prompt = `You are an expert technical interviewer.
Based on the following resume, generate exactly ${count} thoughtful, specific interview questions that probe the candidate's experience and skills.

Resume:
---
${resumeText.slice(0, 4000)}
---

Rules:
- Return ONLY a JSON array of question strings. No extra text, no markdown.
- Example format: ["Question 1?", "Question 2?", ...]
- Make questions technical and relevant to the resume content.`;

  const raw = await callGemini(prompt);

  // Strip possible markdown code fences
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let parsedRaw;
  try {
    parsedRaw = JSON.parse(cleaned);
  } catch {
    parsedRaw = cleaned;
  }

  const normalized = normalizeQuestions(parsedRaw, count);
  const questions = normalized.map((n) => n.question);

  if (questions.length === 0) {
    throw new Error('Failed to parse questions from AI response.');
  }

  return questions;
};

/**
 * Evaluates a candidate's answer to an interview question.
 * @param {string} question
 * @param {string} answer
 * @returns {Promise<{ score: number, feedback: string }>}
 */
const evaluateAnswer = async (question, answer) => {
  const prompt = `You are an expert interviewer evaluating a candidate's answer.

Question: ${question}

Candidate's Answer: ${answer || '(No answer provided)'}

Evaluate the answer strictly and fairly. Return ONLY a JSON object with exactly two fields:
- "score": integer from 0 to 10 (10 = perfect, 0 = completely wrong/no answer)
- "feedback": 2-3 sentence constructive feedback string

Example: {"score": 7, "feedback": "Good explanation of X but missed Y. Consider elaborating on Z."}

Return only the JSON object, no markdown.`;

  const raw = await callGemini(prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse evaluation from AI response.');
  }

  const score = Math.min(10, Math.max(0, Math.round(Number(result.score))));
  const feedback = String(result.feedback || '').trim();

  return { score, feedback };
};

module.exports = { generateQuestions, evaluateAnswer };
