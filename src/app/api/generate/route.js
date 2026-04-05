import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: "Brak klucza API в настройках Vercel." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;

    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // ИСПОЛЬЗУЕМ АКТУАЛЬНУЮ МОДЕЛЬ 2026 ГОДА
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const userFullPrompt = `${userPrompt}${contextText}`;
    const expertFullPrompt = `${expertPrompt}${contextText}`;
    const feedbackSystemPrompt = `Jesteś ekspertem od inżynierii promptów. Oceń prompt użytkownika в сравнении с промптом эксперта. Daj 2-3 zdania feedbacku po polsku. Scenariusz: ${scenario}\n\nUser: ${userPrompt}\n\nExpert: ${expertPrompt}`;

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
    return Response.json(
      { error: `Błąd AI: ${error.message}` }, 
      { status: 500 }
    );
  }
}