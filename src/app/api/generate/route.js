import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * API Route to handle AI generation using Gemini 2.5 Flash-Lite.
 * This model is chosen for its superior cost-efficiency ($0.10/$0.40 per 1M tokens).
 */
export async function POST(request) {
  // Retrieve API Key from environment variables
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: "Brak klucza API." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\n\nTekst źródłowy:\n${inputText}` : '';

    // Initialize the Gemini 2.5 Flash-Lite model [cite: 183]
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Single-turn prompt optimization to reduce API calls and costs
    const massivePrompt = `
      Jesteś ekspertem prompt engineeringu. Przeanalizuj zadanie dla NGO:
      SCENARIUSZ: ${scenario}
      DANE: ${contextText}
      PROMPT UŻYTKOWNIKA: ${userPrompt}
      PROMPT EKSPERTA: ${expertPrompt}

      ZADANIA:
      1. Wygeneruj odpowiedź na prompt użytkownika.
      2. Wygeneruj odpowiedź na prompt eksperta.
      3. Napisz 2-3 zdania feedbacku po polsku.

      WYNIK ODDAJ TYLKO JAKO CZYSTY JSON (bez markdown):
      {
        "userResponse": "tekst",
        "expertResponse": "tekst",
        "feedback": "tekst"
      }
    `;

    const result = await model.generateContent(massivePrompt);
    const responseText = result.response.text();
    
    // Clean potential markdown formatting from the AI response
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