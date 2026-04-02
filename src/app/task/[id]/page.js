'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import tasksData from '../../data/tasks.json';

export default function TaskPage() {
  const params = useParams();
  const [userPrompt, setUserPrompt] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const task = params?.id ? tasksData.find(t => t.id === params.id) : null;

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Nie znaleziono zadania.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      alert('Wpisz swój prompt przed wysłaniem!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: task.scenario,
          inputText: task.inputText || '',
          userPrompt: userPrompt,
          expertPrompt: task.expertPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Wystąpił błąd podczas łączenia z AI.');
      }

      const data = await response.json();
      
      const savedProgress = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      if (!savedProgress.includes(task.id)) {
        savedProgress.push(task.id);
        localStorage.setItem('completedTasks', JSON.stringify(savedProgress));
      }

      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Błąd połączenia. Sprawdź swoje połączenie z internetem lub klucz API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setResults(null);
    setUserPrompt('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:underline mr-4 flex items-center font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Wróć do listy
          </Link>
          <h1 className="text-xl font-bold text-gray-800 border-l border-gray-300 pl-4">Prompt Lab</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
             <span className={`text-xs font-bold uppercase px-2 py-1 rounded inline-block mb-3 ${
                task.level === 1 ? 'bg-green-100 text-green-700' : 
                task.level === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                Poziom {task.level}
              </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-gray-800 mb-4 rounded-r">
              <p className="font-semibold mb-1 text-blue-900">Scenariusz (Twoja sytuacja):</p>
              <p>{task.scenario}</p>
            </div>
            
            {task.inputText && (
              <div className="bg-gray-100 p-4 text-gray-700 rounded border border-gray-200">
                <p className="font-semibold text-sm text-gray-600 mb-2">Dane wejściowe:</p>
                <p className="whitespace-pre-wrap font-serif text-sm bg-white p-3 border border-gray-200 rounded">{task.inputText}</p>
              </div>
            )}
          </div>

          {!results && !isLoading && (
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-gray-800 font-bold mb-2">
                Napisz swój prompt do AI:
              </label>
              <p className="text-gray-500 text-sm mb-3">
                Jakiej instrukcji użyjesz, aby AI pomogło Ci w tej sytuacji?
              </p>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-4 h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4 shadow-sm"
                placeholder="Np. Jesteś ekspertem ds. komunikacji. Napisz..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button 
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Wyślij do AI
              </button>
            </div>
          )}

          {isLoading && (
            <div className="border-t border-gray-100 pt-12 pb-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium animate-pulse">Analizowanie promptu i generowanie odpowiedzi AI...</p>
            </div>
          )}
        </div>

        {results && !isLoading && (
          <div className="animate-fade-in-up">
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
                <span className="text-2xl mr-2">✨</span> Feedback od AI
              </h3>
              <p className="text-indigo-800 whitespace-pre-wrap">{results.feedback}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Twój wynik</h3>
                </div>
                {/* Использован класс grow вместо flex-grow */}
                <div className="p-6 grow flex flex-col">
                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Twój prompt:</p>
                    {/* Кавычки заменены на &quot; */}
                    <div className="bg-gray-50 p-4 rounded text-gray-700 italic border border-gray-100">
                      &quot;{userPrompt}&quot;
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Odpowiedź AI:</p>
                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                      {results.userResponse}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden flex flex-col relative">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Wzór
                </div>
                <div className="bg-blue-100/50 px-6 py-4 border-b border-blue-200">
                  <h3 className="font-bold text-blue-900">Wersja eksperta</h3>
                </div>
                {/* Использован класс grow вместо flex-grow */}
                <div className="p-6 grow flex flex-col">
                  <div className="mb-6">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Prompt eksperta:</p>
                    {/* Кавычки заменены на &quot; */}
                    <div className="bg-white p-4 rounded text-blue-900 italic border border-blue-100">
                      &quot;{task.expertPrompt}&quot;
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Odpowiedź AI:</p>
                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                      {results.expertResponse}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-4">💡 Dlaczego prompt eksperta zadziałał dobrze?</h3>
              <ul className="space-y-3">
                {task.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mb-12">
              <button 
                onClick={handleRetry}
                className="bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Spróbuj jeszcze raz
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}