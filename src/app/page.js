"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import tasks from '@/app/data/tasks.json';

export default function Home() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Read progress only on the client side to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const saved = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    setCompletedTasks(saved);
  }, []);

  // Define course modules based on difficulty levels
  const taskGroups = [
    {
      level: 'Basics',
      title: 'Krok 1: Podstawy',
      description: 'Proste zadania jednoetapowe idealne na start.',
      badgeClass: 'bg-green-100 text-green-800 ring-1 ring-green-300',
    },
    {
      level: 'Intermediate',
      title: 'Krok 2: Średniozaawansowane',
      description: 'Zadania wymagające szerszego kontekstu i nadania struktury.',
      badgeClass: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300',
    },
    {
      level: 'Advanced',
      title: 'Krok 3: Zaawansowane',
      description: 'Wieloetapowe scenariusze, analiza danych i omijanie halucynacji AI.',
      badgeClass: 'bg-rose-100 text-rose-800 ring-1 ring-rose-300',
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 py-12 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto p-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-100 text-indigo-800 font-bold rounded-full text-sm tracking-wide border border-indigo-200">
            Platforma Treningowa
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 drop-shadow-sm">
            PolandAI <span className="text-indigo-600">Prompt Lab</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Praktyczny trening AI dla sektora NGO. Wybierz scenariusz, przetestuj swój prompt i porównaj go z wersją ekspercką.
          </p>
        </div>

        {/* Global Progress Tracking */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 border-b-2 border-slate-300 pb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wider">Scenariusze treningowe</h2>
          <div className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 px-6 py-2.5 rounded-full shadow-sm flex items-center">
            Twój postęp: 
            <span className="text-indigo-600 font-extrabold text-lg ml-3">
              {isMounted ? completedTasks.length : 0}
            </span> 
            <span className="mx-2 text-slate-400">/</span> {tasks.length}
          </div>
        </div>

        {/* Grouped Tasks Sections */}
        <div className="space-y-4">
          {taskGroups.map((group, index) => {
            const groupTasks = tasks.filter(t => t.level === group.level);
            if (groupTasks.length === 0) return null;

            return (
              <section key={group.level} className="animate-in fade-in duration-500 pt-8">
                
                {/* Visual Separator */}
                {index > 0 && (
                  <div className="w-full h-px bg-linear-to-r from-transparent via-slate-400/60 to-transparent mb-12"></div>
                )}

                {/* Group Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200">
                  <div className="shrink-0">
                    <span className={`text-sm font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm ${group.badgeClass}`}>
                      {group.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">{group.title}</h3>
                    <p className="text-slate-600 font-medium">{group.description}</p>
                  </div>
                </div>

                {/* Task Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupTasks.map((task) => {
                    const isCompleted = isMounted && completedTasks.includes(task.id);
                    
                    return (
                      <Link 
                        href={`/task/${task.id}`} 
                        key={task.id}
                        className={`group flex flex-col p-7 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                          isCompleted 
                            ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-400' 
                            : 'bg-white border-slate-300 hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        {/* Completed Status Icon */}
                        {isCompleted && (
                          <div className="absolute top-5 right-5 bg-emerald-100 text-emerald-700 p-1.5 rounded-full shadow-sm z-10 ring-1 ring-emerald-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        
                        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors leading-tight pr-8">
                          {task.title}
                        </h4>
                        
                        <p className="text-slate-700 text-sm leading-relaxed mt-auto font-medium">
                          {task.scenario}
                        </p>

                        {/* Bottom Accent Line */}
                        <div className={`absolute bottom-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                           isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}></div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}