import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return Response.json({ error: "Brak klucza API." }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\n\nTekst źródłowy:\n${inputText}` : '';

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Упаковываем всё в ОДИН запрос, чтобы лимиты не сходили с ума
    const massivePrompt = `
      Jesteś ekspertem prompt engineeringu. Przeanalizuj zadanie:
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
    
    // Чистим JSON от возможных символов ```json ... ```
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("ОШИБКА:", error);
    return Response.json({ error: "Błąd AI. Spróbuj za minutę." }, { status: 500 });
  }
}