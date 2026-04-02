# Prompt Lab — PolandAI Training Platform

An interactive web-based training tool designed for Polish NGO staff to practice and master AI prompting through realistic, hands-on scenarios.

## 🚀 Stack Choice & Rationale

- **Framework:** [Next.js](https://nextjs.org/) (React) — Chosen for its seamless routing and ability to handle API calls securely on the server side (protecting API keys).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) — Allows for a "Mobile-First" approach, ensuring NGO workers can use the tool on their phones during workshops.
- **AI Engine:** [Google Gemini 2.5 Flash](https://aistudio.google.com/) — Selected for its exceptional performance in the Polish language and high-speed response times, essential for live training environments.
- **State Management:** Local Storage — Used for progress tracking to keep the app lightweight and eliminate the need for a complex login system.

## 📂 Task Library Management

The application is designed for non-developers. To add, edit, or remove training scenarios:
1. Open `src/app/data/tasks.json`.
2. Follow the existing JSON structure.
3. You can define:
   - **Scenario description** (Context for the user).
   - **Input text** (Source data to process).
   - **Expert prompt** (The "gold standard" for comparison).
   - **Tips** (Educational takeaways shown after submission).

No code changes are required to update the curriculum.

## 🔮 Phase 2 Roadmap

If this project moves to the next phase, I would implement:
1. **Interactive Prompt Scoring:** An AI-driven "Quality Meter" (0-100%) to give users a quantitative sense of their progress.
2. **Category Tracks:** Specific learning paths for Fundraising, Communication, and Project Management.
3. **Leaderboards:** Optional gamification for workshops where teams can see who crafted the most efficient prompt.
4. **Export Results:** Ability to download a PDF "Cheat Sheet" with the user's best prompts and AI feedback for future office use.

## 🛠️ How to Run Locally

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file and add your Google AI Key: `API_KEY=your_key_here`.
4. Run the development server: `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).