import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  // Достаем ключ прямо внутри функции, чтобы Vercel точно его увидел
  const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;
  
  if (!apiKey) {
    console.error("Критическая ошибка: API_KEY не найден в переменных окружения!");
    return Response.json({ error: "Błąd konfiguracji serwera (brak klucza API)." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;

    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // Используем gemini-1.5-flash — она самая стабильная и бесплатная
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userFullPrompt = `${userPrompt}${contextText}`;
    const expertFullPrompt = `${expertPrompt}${contextText}`;
    const feedbackSystemPrompt = `Jesteś ekspertem od inżynierii promptów. Oceń prompt użytkownika w porównaniu do promptu eksperta. Daj 2-3 zdania konstruktywnego feedbacku po polsku. Scenariusz: ${scenario}\n\nPrompt użytkownika: ${userPrompt}\n\nPrompt eksperta: ${expertPrompt}`;

    const [userResult, expertResult, feedbackResult] = await Promise.all([
      model.generateContent(userFullPrompt),
      model.generateContent(expertFullPrompt),
      model.generateContent(feedbackSystemPrompt)
    ]);

    return Response.json({
      userResponse: userResult.response.text(),
      expertResponse: expertResult.response.text(),
      feedback: feedbackResult.response.text(),
    });

  } catch (error) {
    console.error("Błąd API Google:", error);
    // Если Google выдает ошибку (например, ограничение по региону), мы увидим это в логах Vercel
    return Response.json(
      { error: `Błąd AI: ${error.message || "Problem z połączeniem"}` }, 
      { status: 500 }
    );
  }
}