'use client';

import React, { useState, useEffect } from 'react';
// Добавили Link для правильной навигации между страницами
import Link from 'next/link';
import tasksData from './data/tasks.json';

export default function Home() {
  const [tasks, setTasks] = useState(tasksData);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('completedTasks');
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      }
    };

    loadProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">Prompt Lab</h1>
          <p className="text-gray-600 mt-1">PolandAI Training Platform</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Wybierz zadanie</h2>
          <p className="text-gray-600">Wybierz scenariusz poniżej, aby zacząć ćwiczyć swoje prompty.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    task.level === 1 ? 'bg-green-100 text-green-700' : 
                    task.level === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Poziom {task.level}
                  </span>
                  {completedTasks.includes(task.id) && (
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Ukończone
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {task.scenario}
                </p>
              </div>
              
              {/* Заменили кнопку <button> на ссылку <Link> */}
              <Link 
                href={`/task/${task.id}`}
                className="w-full block text-center bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Zacznij ćwiczyć
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        &copy; 2024 PolandAI Training Platform
      </footer>
    </div>
  );
}