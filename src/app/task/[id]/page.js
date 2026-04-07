"use client";
import { useState, useEffect, use } from 'react'; 
import tasks from '@/app/data/tasks.json';
import Link from 'next/link';

export default function TaskPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const task = tasks.find(t => t.id === params.id);
  
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (result && task) {
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      if (!completed.includes(task.id)) {
        localStorage.setItem('completedTasks', JSON.stringify([...completed, task.id]));
      }
    }
  }, [result, task]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: task.scenario,
          inputText: task.inputText || "",
          userPrompt: userPrompt,
          expertPrompt: task.expertPrompt
        }),
      });
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      setResult(data);
    } catch (e) {
      alert("Błąd połączenia. Upewnij się, że masz połączenie z internetem.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return <div className="p-8 text-center text-slate-500 min-h-screen bg-slate-100">Zadanie nie znalezione.</div>;

  return (
    <main className="min-h-screen bg-slate-100 font-sans text-slate-900 py-8 selection:bg-indigo-200 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto p-4 md:px-8">
        
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center px-5 py-2.5 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full border-2 border-slate-300 shadow-sm transition-all text-sm font-bold mb-8 group"
        >
          <svg className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Powrót do listy
        </Link>
        
        {/* Task Details Card */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full mb-4 inline-block border border-indigo-200 tracking-wide">
            Poziom: {task.level}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{task.title}</h1>
          <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">{task.scenario}</p>
          
          {task.inputText && (
            <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 text-sm text-slate-800 relative mt-8 shadow-inner">
              <span className="absolute -top-3 left-4 bg-slate-200 px-3 py-0.5 rounded-full text-[10px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">
                Dane wejściowe do przetworzenia
              </span>
              <div className="whitespace-pre-wrap font-mono text-xs text-slate-700 mt-1 font-medium">{task.inputText}</div>
            </div>
          )}
        </div>

        {!result ? (
          // Input Section
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. Improved Instruction Block */}
            <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-sm">?</div>
              <div>
                <h4 className="font-bold text-indigo-900 mb-1 text-lg">Co masz zrobić?</h4>
                <p className="text-indigo-900/80 text-sm leading-relaxed font-medium">
                  Twoim zadaniem jest napisanie <strong>instrukcji dla AI (tzw. promptu)</strong>, która powie jej dokładnie, co ma zrobić ze scenariuszem powyżej.
                  <br/>
                  <span className="inline-block mt-2 font-bold text-indigo-700 bg-indigo-100/60 px-2.5 py-1 rounded-md border border-indigo-200">
                    Nie piszesz odpowiedzi — piszesz instrukcję dla AI.
                  </span>
                </p>
              </div>
            </div>

            {/* 2. Structured Prompt Formula Tip */}
            <div className="px-2 md:px-4">
              <h5 className="font-bold text-slate-700 text-sm flex items-center mb-2.5">
                <span className="mr-2 text-lg">💡</span> Wskazówka: Dobry prompt zawiera:
              </h5>
              <ul className="text-sm text-slate-600 font-medium space-y-1.5 ml-8 list-disc marker:text-indigo-400">
                <li><strong className="text-slate-800">rolę AI</strong> (kim ma być?)</li>
                <li><strong className="text-slate-800">cel</strong> (co ma zrobić?)</li>
                <li><strong className="text-slate-800">kontekst</strong> (dla kogo / dlaczego?)</li>
                <li><strong className="text-slate-800">format odpowiedzi</strong> (np. lista, e-mail, punkty)</li>
              </ul>
            </div>

            {/* 3 & 4. Clear Label and Better Placeholder */}
            <div className="pt-2">
              <label className="block text-slate-900 font-extrabold text-lg mb-3 ml-2">
                ✍️ Napisz prompt, który przekażesz AI:
              </label>
              <textarea
                className="w-full h-56 p-6 border-2 border-slate-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-none text-slate-800 text-lg shadow-inner bg-white placeholder-slate-400 font-medium leading-relaxed"
                placeholder={`Np.:\n"Zachowuj się jak specjalista ds. komunikacji NGO.\nNapisz post na Facebooka o biegu charytatywnym.\nUżyj entuzjastycznego tonu, podaj 3 powody udziału\ni zakończ wezwaniem do działania."`}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !userPrompt.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  AI generuje odpowiedź i analizuje Twój prompt...
                </span>
              ) : "Zobacz wynik i porównaj z ekspertem"}
            </button>
          </div>
        ) : (
          // Results Section
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            
            {/* Section 1: Prompts Comparison */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center">
                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shadow-md">1</span> 
                Porównanie promptów
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b-2 border-slate-100 pb-2">Twój prompt</h3>
                  <p className="text-slate-800 leading-relaxed font-medium">{userPrompt}</p>
                </div>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-lg uppercase tracking-wider shadow-sm">Wzór eksperta</div>
                  <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 border-b-2 border-indigo-100 pb-2">Prompt eksperta</h3>
                  <p className="text-indigo-900 font-bold leading-relaxed">{task.expertPrompt}</p>
                </div>
              </div>
            </div>

            {/* Section 2: AI Results Comparison */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center mt-12">
                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shadow-md">2</span> 
                Porównanie wyników AI
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b-2 border-slate-100 pb-3">Wynik dla Twojego promptu</h3>
                  <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed font-medium">{result.userResponse}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-md">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 border-b-2 border-indigo-50 pb-3 flex items-center">
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Wynik dla promptu eksperta
                  </h3>
                  <div className="whitespace-pre-wrap text-slate-900 text-sm leading-relaxed font-medium">{result.expertResponse}</div>
                </div>
              </div>
            </div>
            
            {/* Section 3: The PERFECT Learning Loop */}
            <div className="bg-linear-to-br from-amber-50 to-orange-100/50 p-6 md:p-8 rounded-3xl border-2 border-amber-200 shadow-sm mt-12">
              
              {/* Step 1: What is the main difference? */}
              {result.keyDifference && (
                <div className="mb-6 bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm">
                  <h4 className="font-bold text-indigo-700 uppercase tracking-wider text-xs mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Kluczowa różnica
                  </h4>
                  <p className="text-slate-800 font-bold leading-relaxed">{result.keyDifference}</p>
                </div>
              )}

              {/* Step 2: What should the user fix and WHY? */}
              <h3 className="font-bold text-amber-900 text-xl mb-4 flex items-center">
                <span className="text-2xl mr-3 bg-white p-2 rounded-xl shadow-sm border border-amber-100">💡</span> Twój obszar do poprawy
              </h3>
              <p className="text-amber-900 text-lg leading-relaxed mb-6 bg-white/80 p-5 rounded-2xl border border-amber-200 shadow-sm font-medium">{result.feedback}</p>
              
              {/* Step 3: Universal Rule */}
              <div className="flex items-start bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
                <span className="text-amber-700 font-extrabold mr-3 uppercase tracking-wider text-xs mt-1 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md shrink-0">Uniwersalna zasada</span>
                <p className="text-sm font-bold text-amber-900 leading-relaxed">{task.tips}</p>
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={() => {
                setResult(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="w-full mt-10 py-5 text-slate-700 hover:text-indigo-700 font-bold tracking-wide transition-all border-2 border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 bg-white shadow-sm text-lg"
            >
              Edytuj swój prompt i spróbuj ponownie
            </button>
          </div>
        )}
      </div>
    </main>
  );
}