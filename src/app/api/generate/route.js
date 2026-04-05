import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  // Ключ берется из переменных окружения Vercel или .env.local
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: "Brak klucza API в настройках." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // Используем самую дешевую и стабильную модель на апрель 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Упаковываем всё в ОДИН запрос для экономии и обхода лимитов (429)
    const massivePrompt = `
      Jesteś ekspertem od AI i NGO. Wykonaj zadania na podstawie danych:
      SCENARIUSZ: ${scenario}
      KONTEKST: ${contextText}
      PROMPT UŻYTKOWNIKA: ${userPrompt}
      PROMPT EKSPERTA: ${expertPrompt}

      ZADANIA:
      1. Wygeneruj odpowiedź na PROMPT UŻYTKOWNIKA.
      2. Wygeneruj odpowiedź na PROMPT EKSPERTA.
      3. Napisz 2-3 zdania feedbacku po polsku, co użytkownik może poprawić.

      WYNIK ODDAJ WYŁĄCZNIE JAKO CZYSTY JSON:
      {
        "userResponse": "tekst...",
        "expertResponse": "tekst...",
        "feedback": "tekst..."
      }
    `;

    const result = await model.generateContent(massivePrompt);
    const responseText = result.response.text();
    
    // Очистка от возможных markdown-тегов ```json
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const finalData = JSON.parse(cleanJson);

    return Response.json(finalData);

  } catch (error) {
    console.error("Błąd API Google:", error);
    return Response.json(
      { error: "Błąd AI. Upewnij się, że masz włączony Paid Tier для regionu UE." }, 
      { status: 500 }
    );
  }
}