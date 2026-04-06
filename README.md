# PolandAI Prompt Lab

An interactive web-based training tool designed for Polish NGO staff to practice and improve their AI prompting skills through realistic, day-to-day scenarios. 

## 🚀 Deployed Application
**Live Demo:** [Insert Your Vercel Link Here]

## 🛠️ Stack Choices & Architecture

* **Framework:** Next.js 16 (App Router) & React. Chosen for fast rendering, robust API route handling, and seamless deployment.
* **Styling & UX:** Tailwind CSS. The app uses a mobile-first "Card UI" design. Tasks are grouped into logical learning modules (Basics, Intermediate, Advanced) with instruction blocks and high-contrast elements to ensure maximum accessibility for non-technical users.
* **AI API:** Google Gemini API (`gemini-2.5-flash-lite`). 
  * *Why this model?* It handles the Polish language exceptionally well and is highly cost-effective. This ensures that when 20–30 workshop participants click "Submit" simultaneously, the API can handle the high throughput efficiently and economically without hitting severe rate limits.
* **State Management:** Browser `localStorage`. Fulfills the requirement for session progress tracking (visual checkmarks on the dashboard) without the friction of a login/auth system.

## 🧠 Prompt Engineering Logic

To minimize API costs and reduce the risk of `429 Too Many Requests` errors during live workshops, the application uses a **Single-Turn Prompt Optimization** strategy. Instead of making three separate API calls (one for the user prompt, one for the expert prompt, and one for the feedback), the backend merges them into a single, complex system prompt. This instructs the AI to return all three outputs simultaneously in a clean, parsable JSON format.

## 📝 How to Add New Tasks (Extensibility)

The task library is completely decoupled from the application logic. A non-developer can easily add, edit, or remove tasks by modifying the `src/app/data/tasks.json` file.

**Structure of a Task:**
```json
{
  "id": "task-7",
  "level": "Intermediate",
  "title": "Tytuł zadania",
  "scenario": "Opis sytuacji dla użytkownika.",
  "inputText": "Opcjonalny tekst źródłowy. Usuń tę linijkę, jeśli niepotrzebna.",
  "expertPrompt": "Wzór idealnego promptu.",
  "tips": "Krótka wskazówka, dlaczego prompt eksperta zadziałał lepiej."
}