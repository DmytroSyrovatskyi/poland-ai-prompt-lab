import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return Response.json({ error: "Brak klucza API." }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;
    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // Используем 1.5-flash — у неё самые щедрые бесплатные лимиты
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ВАЖНО: Убираем Promise.all и делаем запросы ПО ОЧЕРЕДИ
    // Это медленнее на 2 секунды, но зато БЕСПЛАТНО и без ошибок 429
    
    const userResult = await model.generateContent(`${userPrompt}${contextText}`);
    const expertResult = await model.generateContent(`${expertPrompt}${contextText}`);
    
    const feedbackSystemPrompt = `Jesteś ekspertem od inżynierii promptów. Oceń prompt użytkownika w porównaniu do promptu eksperta. Daj 2-3 zdania feedbacku po polsku. Scenariusz: ${scenario}\n\nUser prompt: ${userPrompt}\n\nExpert prompt: ${expertPrompt}`;
    const feedbackResult = await model.generateContent(feedbackSystemPrompt);

    return Response.json({
      userResponse: userResult.response.text(),
      expertResponse: expertResult.response.text(),
      feedback: feedbackResult.response.text(),
    });

  } catch (error) {
    console.error("Błąd API Google:", error);
    return Response.json({ error: `Błąd AI (429): Spróbuj ponownie za chwilę.` }, { status: 500 });
  }
}