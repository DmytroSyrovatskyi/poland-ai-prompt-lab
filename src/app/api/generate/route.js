import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * API Route to handle AI generation using Gemini 2.5 Flash-Lite.
 * Features an advanced, top-tier prompt structure to act as an expert AI Trainer.
 */
export async function POST(request) {
  // The API key must be set in the environment for secure server-side calls.

  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: "Brak klucza API." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\nINPUT TEXT: ${inputText}` : '';

    // Choose the Gemini model to generate both responses and feedback.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // 🚀 TOP-TIER AI TRAINER PROMPT 🚀
    const massivePrompt = `
      You are an expert AI trainer helping Polish NGO workers improve their prompting skills.
      Your task is to compare the user's prompt with an expert prompt and give actionable, educational feedback.

      SCENARIO: ${scenario} ${contextText}
      USER PROMPT: ${userPrompt}
      EXPERT PROMPT: ${expertPrompt}

      TASKS:
      1. Generate AI response to USER PROMPT (in Polish).
      2. Generate AI response to EXPERT PROMPT (in Polish).
      3. Generate "keyDifference" (in Polish).
      4. Generate "feedback" (in Polish).

      RULES FOR "keyDifference":
      - Explain the key functional difference between the user's prompt and the expert prompt in exactly 1 sentence.
      - Focus on WHAT makes the expert prompt more effective and its practical impact (e.g., clarity, specificity, constraints).
      - ABSOLUTELY AVOID generic comparisons like "shorter vs longer" or "bardziej rozbudowany vs bardziej zwięzły".

      RULES FOR "feedback":
      - 2–4 sentences maximum.
      - Be specific and practical. No generic praise.
      - Include:
        1. One clear strength of the user's prompt.
        2. One or two concrete improvements.
      - CRITICAL: When suggesting improvements, briefly explain WHY it matters (e.g., "ponieważ bez tego AI może generować ogólne odpowiedzi lub zmyślać fakty").
      - Focus on: specificity (czy prompt jest konkretny?), constraints (czy określa warunki, np. termin, format?), clarity of goal.
      - Optionally include a short general principle (Zasada: ...) in 1 sentence that can be reused in other tasks.

      RETURN EXCLUSIVELY AS CLEAN JSON (no markdown):
      {
        "userResponse": "...",
        "expertResponse": "...",
        "keyDifference": "...",
        "feedback": "..."
      }
    `;

    const result = await model.generateContent(massivePrompt);
    const responseText = result.response.text();
    
    // Remove markdown fences if the model outputs JSON inside code blocks.
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json(
      { error: "Błąd AI. Upewnij się, że korzystasz z Paid Tier dla regionu UE." }, 
      { status: 500 }
    );
  }
}