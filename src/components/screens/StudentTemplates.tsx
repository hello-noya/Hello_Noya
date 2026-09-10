import React, { useState } from 'react';
import { ArrowLeft, BookOpen, GraduationCap, Coffee, Dumbbell, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createHabit, createTask, createEvent, createGoal } from '../../utils/storage';
import { DayOfWeek } from '../../types';

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  habits: Array<{
    name: string;
    icon: string;
    startTime: string;
    days: DayOfWeek[];
  }>;
  tasks?: Array<{
    text: string;
    time?: string;
    note?: string;
  }>;
  goals?: Array<{
    name: string;
    target: number;
    unit: string;
  }>;
  events?: Array<{
    name: string;
    startTime: string;
    endTime: string;
    note?: string;
    days: DayOfWeek[];
  }>;
}

interface StudentTemplatesProps {
  onBack: () => void;
}

export function StudentTemplates({ onBack }: StudentTemplatesProps) {
  const { state, addHabit, addTask, addGoal, addEvent, showToast } = useApp();
  const lang = state.settings.language;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'morning-student',
      name: lang === 'ru' ? 'Утро студента' : 'Student Morning',
      icon: <GraduationCap size={32} />,
      description: lang === 'ru'
        ? 'Зарядка, завтрак, повторение материала'
        : 'Exercise, breakfast, review material',
      habits: [
        { name: lang === 'ru' ? 'Утренняя зарядка' : 'Morning exercise', icon: 'gym', startTime: '07:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Здоровый завтрак' : 'Healthy breakfast', icon: 'apple', startTime: '07:30', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Повторение конспектов' : 'Review notes', icon: 'book', startTime: '08:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Собрать рюкзак' : 'Pack backpack', time: '08:30' },
        { text: lang === 'ru' ? 'Проверить расписание' : 'Check schedule', time: '08:45' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Прочитать 10 книг за семестр' : 'Read 10 books per semester', target: 10, unit: lang === 'ru' ? 'книг' : 'books' },
      ],
      events: [
        { name: lang === 'ru' ? 'Лекции' : 'Lectures', startTime: '09:00', endTime: '12:00', note: lang === 'ru' ? 'Аудитория 301' : 'Room 301', days: [1, 2, 3, 4, 5] },
      ],
    },
    {
      id: 'exam-prep',
      name: lang === 'ru' ? 'Подготовка к экзамену' : 'Exam Preparation',
      icon: <BookOpen size={32} />,
      description: lang === 'ru'
        ? 'Помодоро техника, конспекты, отдых'
        : 'Pomodoro technique, notes, rest',
      habits: [
        { name: lang === 'ru' ? 'Учебная сессия (50 мин)' : 'Study session (50 min)', icon: 'brain', startTime: '09:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Перерыв 10 мин' : 'Break 10 min', icon: 'coffee', startTime: '09:50', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Создание конспекта' : 'Create summary', icon: 'book', startTime: '10:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Повторить главу 5' : 'Review chapter 5', time: '10:00', note: lang === 'ru' ? 'Математика' : 'Mathematics' },
        { text: lang === 'ru' ? 'Решить 10 задач' : 'Solve 10 problems', time: '14:00', note: lang === 'ru' ? 'Физика' : 'Physics' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Решить 100 задач' : 'Solve 100 problems', target: 100, unit: lang === 'ru' ? 'задач' : 'problems' },
      ],
    },
    {
      id: 'balance',
      name: lang === 'ru' ? 'Баланс жизни' : 'Life Balance',
      icon: <Dumbbell size={32} />,
      description: lang === 'ru'
        ? 'Учеба, спорт, сон, хобби'
        : 'Study, sports, sleep, hobbies',
      habits: [
        { name: lang === 'ru' ? 'Учеба 2 часа' : 'Study 2 hours', icon: 'book', startTime: '10:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Тренировка' : 'Workout', icon: 'gym', startTime: '16:00', days: [1, 3, 5] },
        { name: lang === 'ru' ? 'Чтение книги' : 'Reading', icon: 'book', startTime: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Сон 8 часов' : 'Sleep 8 hours', icon: 'sleep', startTime: '23:00', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Позвонить родителям' : 'Call parents', time: '18:00' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Пробежать 50 км за месяц' : 'Run 50 km per month', target: 50, unit: 'km' },
        { name: lang === 'ru' ? 'Прочитать 4 книги' : 'Read 4 books', target: 4, unit: lang === 'ru' ? 'книг' : 'books' },
      ],
    },
  ];

  const applyTemplate = (template: Template) => {
    // Создаем привычки
    template.habits.forEach(habit => {
      addHabit(createHabit({
        name: habit.name,
        icon: habit.icon,
        startTime: habit.startTime,
        days: habit.days,
      }));
    });

    // Создаем задачи на сегодня
    if (template.tasks) {
      const today = new Date().toISOString().split('T')[0];
      template.tasks.forEach(task => {
        const newTask = createTask(task.text, today, task.note);
        if (task.time) {
          newTask.time = task.time;
        }
        addTask(newTask);
      });
    }

    // Создаем цели
    if (template.goals) {
      template.goals.forEach(goal => {
        addGoal(createGoal({
          name: goal.name,
          target: goal.target,
          unit: goal.unit,
        }));
      });
    }

    // Создаем события
    if (template.events) {
      template.events.forEach(event => {
        addEvent(createEvent({
          name: event.name,
          startTime: event.startTime,
          endTime: event.endTime,
          note: event.note || '',
          days: event.days,
        }));
      });
    }

    showToast(lang === 'ru' ? 'Шаблон применен!' : 'Template applied!');
    setSelectedTemplate(null);
  };

  const selected = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col">
      <div className="max-w-[420px] mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Шаблоны' : 'Templates'}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selected ? (
            <>
              <p className="text-sm text-[var(--text-secondary)]">
                {lang === 'ru'
                  ? 'Выберите шаблон для быстрого начала. Шаблон добавит привычки, задачи, цели и события.'
                  : 'Choose a template to get started quickly. Template will add habits, tasks, goals and events.'}
              </p>

              <div className="space-y-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="w-full p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mb-2">
                          {template.description}
                        </p>
                        <div className="flex gap-3 text-xs text-[var(--text-secondary)]">
                          <span>{template.habits.length} {lang === 'ru' ? 'привычек' : 'habits'}</span>
                          {template.tasks && <span>{template.tasks.length} {lang === 'ru' ? 'задач' : 'tasks'}</span>}
                          {template.goals && <span>{template.goals.length} {lang === 'ru' ? 'целей' : 'goals'}</span>}
                          {template.events && <span>{template.events.length} {lang === 'ru' ? 'событий' : 'events'}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                ← {lang === 'ru' ? 'Назад к шаблонам' : 'Back to templates'}
              </button>

              <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                    {selected.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                      {selected.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {selected.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selected.habits.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        {lang === 'ru' ? 'Привычки' : 'Habits'}
                      </h4>
                      <div className="space-y-1">
                        {selected.habits.map((habit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Check size={14} className="text-[var(--accent)]" />
                            <span>{habit.name}</span>
                            <span className="text-xs text-[var(--text-muted)]">({habit.startTime})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.tasks && selected.tasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        {lang === 'ru' ? 'Задачи' : 'Tasks'}
                      </h4>
                      <div className="space-y-1">
                        {selected.tasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Check size={14} className="text-[var(--accent)]" />
                            <span>{task.text}</span>
                            {task.time && <span className="text-xs text-[var(--text-muted)]">({task.time})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.goals && selected.goals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        {lang === 'ru' ? 'Цели' : 'Goals'}
                      </h4>
                      <div className="space-y-1">
                        {selected.goals.map((goal, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Check size={14} className="text-[var(--accent)]" />
                            <span>{goal.name} ({goal.target} {goal.unit})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => applyTemplate(selected)}
                  className="w-full mt-4 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {lang === 'ru' ? 'Применить шаблон' : 'Apply template'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
