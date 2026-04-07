# PolandAI Prompt Lab

An interactive web-based training tool designed for Polish NGO staff to practice and improve their AI prompting skills through realistic, day-to-day scenarios. 

## 🚀 Deployed Application
Live Demo: [https://poland-ai-prompt-lab.vercel.app/]

## ✨ Currently Implemented Features
1. Interactive Dashboard: Task library grouped by 3 difficulty levels (Basics, Intermediate, Advanced).
2. Task Engine: 6 pre-loaded, realistic NGO scenarios (social media, grant analysis, email drafting, data extraction).
3. Side-by-Side Comparison: Clear split-view comparing the user's prompt and the expert's prompt, along with their respective AI-generated results.
4. Pedagogical AI Feedback (The Learning Loop):
   - Key Difference: AI explains the functional difference between the two prompts in one sentence.
   - Actionable Feedback: AI provides specific strengths and concrete areas for improvement.
   - Universal Rule: A static heuristic (Złota zasada) is provided to reinforce the lesson.
5. Progress Tracking: Local storage-based progress tracking (completed task checkmarks, X/6 counter, and a reset button) requiring no authentication.
6. Non-Technical UX: Interface tailored for beginners (e.g., using "instrukcja dla AI", prompt formulas, dynamic placeholders, and loading states).

## 🛠️ Stack Choices & Architecture
* Frontend: Next.js 16 (App Router) & React, Tailwind CSS 4. Chosen for fast rendering and mobile-first, high-contrast "Card UI" design.
* Backend / API: Google Gemini API (`gemini-2.5-flash-lite`).
  * Cost-Efficiency: At ~$0.10 per 1M input tokens, it is highly economical for live workshops (30+ simultaneous users).
  * Single-Turn Prompting: The system makes a single complex API call to fetch the user's response, the expert's response, the key difference, and the feedback all at once. This prevents `429 Too Many Requests` errors and reduces latency.

## 📝 How to Add New Tasks
The task library is completely decoupled from the application logic. To add or modify tasks, simply edit the `src/app/data/tasks.json` file. 

**Exact structure of a currently implemented task:**
```json
{
  "id": "task-1",
  "level": "Basics",
  "title": "Post na media społecznościowe",
  "scenario": "Musisz napisać krótki post w mediach społecznościowych...",
  "inputText": "Opcjonalny tekst źródłowy (usuń pole, jeśli brak).",
  "expertPrompt": "Napisz post na Facebooka o biegu...",
  "tips": "Określenie formatu (Facebook), tonu, precyzyjnych elementów..."
}