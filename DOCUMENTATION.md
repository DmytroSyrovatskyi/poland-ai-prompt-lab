# 📘 PolandAI Prompt Lab: Dokumentacja Projektu

## 1. O projekcie
Interactive Prompt Lab to narzędzie szkoleniowe dla pracowników NGO, pozwalające na praktyczną naukę komunikacji z AI (Prompt Engineering) poprzez porównywanie własnych instrukcji z wersjami eksperckimi.

## 2. Struktura Projektu (Archiwalna)
Oto mapa najważniejszych plików w projekcie:

```text
prompt-lab/
├── src/
│   ├── app/
│   │   ├── api/generate/route.js    # Backend: Logika połączenia z Gemini API
│   │   ├── data/tasks.json          # Baza danych: Scenariusze zadań i wzory
│   │   ├── task/[id]/page.js        # Frontend: Strona konkretnego zadania (UI)
│   │   ├── layout.js                # Główny szkielet strony
│   │   └── page.js                  # Strona główna (Dashboard z listą zadań)
├── .env.local                       # Klucze API (plik prywatny, nie w Git)
├── package.json                     # Zależności (Next.js, Tailwind, Google AI SDK)
└── README.md                        # Opis techniczny dla programisty