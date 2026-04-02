import { GoogleGenerativeAI } from '@google/generative-ai';

// Подключаем официальную библиотеку Google с нашим ключом
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { scenario, inputText, userPrompt, expertPrompt } = body;

    const contextText = inputText ? `\n\nDane wejściowe:\n${inputText}` : '';

    // ИСправлено: используем самую новую модель Gemini 2.5 Flash!
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Подготавливаем тексты для 3 запросов
    const userFullPrompt = `${userPrompt}${contextText}`;
    const expertFullPrompt = `${expertPrompt}${contextText}`;
    const feedbackSystemPrompt = `Jesteś ekspertem od inżynierii promptów. Oceń prompt użytkownika w porównaniu do promptu eksperta. Daj 2-3 zdania konstruktywnego feedbacku po polsku, co użytkownik mógłby poprawić w swoim prompcie (np. dodać kontekst, określić format, ustalić ton). Bądź zachęcający i profesjonalny.\n\nScenariusz: ${scenario}\n\nPrompt użytkownika: ${userPrompt}\n\nPrompt eksperta: ${expertPrompt}\n\nNapisz krótki feedback dla użytkownika, wskazując, co ujął ekspert, a czego zabrakło użytkownikowi.`;

    // Отправляем все 3 запроса одновременно
    const [userResult, expertResult, feedbackResult] = await Promise.all([
      model.generateContent(userFullPrompt),
      model.generateContent(expertFullPrompt),
      model.generateContent(feedbackSystemPrompt)
    ]);

    // Достаем текст из ответов и отправляем на страницу
    return Response.json({
      userResponse: userResult.response.text(),
      expertResponse: expertResult.response.text(),
      feedback: feedbackResult.response.text(),
    });

  } catch (error) {
    console.error("Błąd API Google:", error);
    return Response.json(
      { error: "Nie udało się połączyć z AI. Sprawdź klucz API." }, 
      { status: 500 }
    );
  }
}