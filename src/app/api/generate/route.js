import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return Response.json({ error: "Brak klucza API." }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // Используем АКТУАЛЬНУЮ модель 2.0
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ХИТРОСТЬ: Просим ИИ сделать всё за ОДИН раз, чтобы не превысить лимит запросов
    const massivePrompt = `
      Jesteś ekspertem od AI. Wykonaj trzy zadania na podstawie poniższych danych:
      SCENARIUSZ: ${scenario}
      DANE: ${contextText}
      PROMPT UŻYTKOWNIKA: ${userPrompt}
      PROMPT EKSPERTA: ${expertPrompt}

      ZADANIA:
      1. Wygeneruj odpowiedź na PROMPT UŻYTKOWNIKA.
      2. Wygeneruj odpowiedź na PROMPT EKSPERTA.
      3. Napisz 2-3 zdania feedbacku po polsku dla użytkownika.

      ODPOWIEDZ WYŁĄCZNIE W FORMACIE JSON:
      {
        "userResponse": "tekst...",
        "expertResponse": "tekst...",
        "feedback": "tekst..."
      }
    `;

    const result = await model.generateContent(massivePrompt);
    const responseText = result.response.text();
    
    // Очищаем текст от возможных кавычек markdown (```json ... ```)
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const finalData = JSON.parse(cleanJson);

    return Response.json(finalData);

  } catch (error) {
    console.error("Błąd API Google:", error);
    return Response.json({ error: "Błąd AI. Spróbuj za 60 sekund." }, { status: 500 });
  }
}