import React, { useState } from 'react';
import { BookOpen, Heart, Target, Brain, Dumbbell, BookOpen as BookIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { createHabit, createGoal } from '../../utils/storage';
import { Habit, Goal } from '../../types';
import { Header } from '../Header';

interface TemplatesContentProps {
  lang: 'ru' | 'en';
  onClose: () => void;
}

export function TemplatesContent({ lang, onClose }: TemplatesContentProps) {
  const { addHabit, addGoal, showToast } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'student',
      icon: <BookIcon size={20} />,
      name: lang === 'ru' ? 'Студент' : 'Student',
      habits: [
        { name: lang === 'ru' ? 'Читать 30 минут' : 'Read 30 minutes', icon: 'book', startTime: '20:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Решать задачи' : 'Solve problems', icon: 'brain', startTime: '19:00', days: [1, 2, 3, 4, 5] },
      ],
      goals: [
        { name: lang === 'ru' ? 'Прочитать 10 книг' : 'Read 10 books', target: 10, unit: lang === 'ru' ? 'книг' : 'books' },
      ],
    },
    {
      id: 'fitness',
      icon: <Dumbbell size={20} />,
      name: lang === 'ru' ? 'Фитнес' : 'Fitness',
      habits: [
        { name: lang === 'ru' ? 'Тренировка' : 'Workout', icon: 'gym', startTime: '18:00', days: [1, 3, 5] },
        { name: lang === 'ru' ? 'Растяжка' : 'Stretch', icon: 'stretch', startTime: '19:00', days: [1, 3, 5] },
      ],
      goals: [
        { name: lang === 'ru' ? 'Пробежать 50 км' : 'Run 50 km', target: 50, unit: 'km' },
      ],
    },
    {
      id: 'selfdev',
      icon: <Brain size={20} />,
      name: lang === 'ru' ? 'Саморазвитие' : 'Self-development',
      habits: [
        { name: lang === 'ru' ? 'Медитация' : 'Meditation', icon: 'meditate', startTime: '07:00', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Читать книгу' : 'Read book', icon: 'book', startTime: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      goals: [
        { name: lang === 'ru' ? 'Изучить новый навык' : 'Learn a new skill', target: 1, unit: lang === 'ru' ? 'навык' : 'skill' },
      ],
    },
  ];

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    template.habits.forEach(habit => {
      addHabit(createHabit(habit as Partial<Habit>));
    });

    template.goals.forEach(goal => {
      addGoal(createGoal(goal as Partial<Goal>));
    });

    showToast(lang === 'ru' ? 'Шаблон применен!' : 'Template applied!');
    onClose();
  };

  return (
    <div className="space-y-4">
      <Header />
      
      <div className="space-y-3">
        {templates.map(template => (
          <div key={template.id} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{template.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {template.habits.length} {lang === 'ru' ? 'привычек' : 'habits'}
                </p>
              </div>
            </div>
            <button
              onClick={() => applyTemplate(template.id)}
              className="w-full py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {lang === 'ru' ? 'Применить' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
