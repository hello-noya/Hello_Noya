import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Briefcase, Heart, GraduationCap, Coffee, Dumbbell, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createHabit, createTask, createEvent, createGoal } from '../../utils/storage';
import { DayOfWeek } from '../../types';

type Category = 'study' | 'work' | 'life';

interface Template {
  id: string;
  category: Category;
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
  const { addHabit, addTask, addGoal, addEvent, showToast } = useApp();
  const lang = useApp().state.settings.language;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'study' as Category, name: lang === 'ru' ? 'Учеба' : 'Study', icon: <BookOpen size={32} /> },
    { id: 'work' as Category, name: lang === 'ru' ? 'Работа' : 'Work', icon: <Briefcase size={32} /> },
    { id: 'life' as Category, name: lang === 'ru' ? 'Жизнь' : 'Life', icon: <Heart size={32} /> },
  ];

  const templates: Template[] = [
    // Study templates
    {
      id: 'morning-student',
      category: 'study',
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
      category: 'study',
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
    // Work templates
    {
      id: 'productive-day',
      category: 'work',
      name: lang === 'ru' ? 'Продуктивный день' : 'Productive Day',
      icon: <Briefcase size={32} />,
      description: lang === 'ru'
        ? 'Планирование, фокус, встречи'
        : 'Planning, focus, meetings',
      habits: [
        { name: lang === 'ru' ? 'Планирование дня' : 'Daily planning', icon: 'book', startTime: '09:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Фокус 2 часа' : 'Focus 2 hours', icon: 'brain', startTime: '10:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Обед' : 'Lunch', icon: 'coffee', startTime: '13:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Проверить почту' : 'Check email', time: '09:15' },
        { text: lang === 'ru' ? 'Отчет за день' : 'Daily report', time: '17:30' },
      ],
      events: [
        { name: lang === 'ru' ? 'Работа' : 'Work', startTime: '09:00', endTime: '18:00', note: lang === 'ru' ? 'Офис' : 'Office', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Совещание' : 'Meeting', startTime: '14:00', endTime: '15:00', note: '', days: [1, 3] },
      ],
    },
    {
      id: 'freelancer',
      category: 'work',
      name: lang === 'ru' ? 'Фрилансер' : 'Freelancer',
      icon: <Coffee size={32} />,
      description: lang === 'ru'
        ? 'Гибкий график, проекты, клиенты'
        : 'Flexible schedule, projects, clients',
      habits: [
        { name: lang === 'ru' ? 'Утренний кофе' : 'Morning coffee', icon: 'coffee', startTime: '08:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Работа над проектом' : 'Project work', icon: 'brain', startTime: '10:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Общение с клиентами' : 'Client communication', icon: 'book', startTime: '15:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Ответить на письма' : 'Reply to emails', time: '09:00' },
        { text: lang === 'ru' ? 'Обновить портфолио' : 'Update portfolio', time: '17:00' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Завершить 5 проектов' : 'Complete 5 projects', target: 5, unit: lang === 'ru' ? 'проектов' : 'projects' },
      ],
    },
    // Life templates
    {
      id: 'balance',
      category: 'life',
      name: lang === 'ru' ? 'Баланс жизни' : 'Life Balance',
      icon: <Heart size={32} />,
      description: lang === 'ru'
        ? 'Спорт, сон, хобби, семья'
        : 'Sports, sleep, hobbies, family',
      habits: [
        { name: lang === 'ru' ? 'Тренировка' : 'Workout', icon: 'gym', startTime: '16:00', days: [1, 3, 5] },
        { name: lang === 'ru' ? 'Чтение книги' : 'Reading', icon: 'book', startTime: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Сон 8 часов' : 'Sleep 8 hours', icon: 'sleep', startTime: '23:00', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Позвонить родителям' : 'Call parents', time: '18:00' },
        { text: lang === 'ru' ? 'Купить продукты' : 'Buy groceries', time: '19:00' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Пробежать 50 км за месяц' : 'Run 50 km per month', target: 50, unit: 'km' },
        { name: lang === 'ru' ? 'Прочитать 4 книги' : 'Read 4 books', target: 4, unit: lang === 'ru' ? 'книг' : 'books' },
      ],
    },
    {
      id: 'healthy-lifestyle',
      category: 'life',
      name: lang === 'ru' ? 'Здоровый образ жизни' : 'Healthy Lifestyle',
      icon: <Dumbbell size={32} />,
      description: lang === 'ru'
        ? 'Питание, спорт, медитация'
        : 'Nutrition, sports, meditation',
      habits: [
        { name: lang === 'ru' ? 'Утренняя пробежка' : 'Morning run', icon: 'run', startTime: '06:30', days: [1, 3, 5] },
        { name: lang === 'ru' ? 'Здоровый завтрак' : 'Healthy breakfast', icon: 'apple', startTime: '07:30', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Медитация' : 'Meditation', icon: 'brain', startTime: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Выпить 8 стаканов воды' : 'Drink 8 glasses of water', time: '09:00' },
        { text: lang === 'ru' ? 'Съесть 5 порций овощей' : 'Eat 5 servings of vegetables', time: '20:00' },
      ],
      goals: [
        { name: lang === 'ru' ? 'Пробежать марафон' : 'Run a marathon', target: 42, unit: 'km' },
        { name: lang === 'ru' ? 'Потерять 10 кг' : 'Lose 10 kg', target: 10, unit: 'kg' },
      ],
    },
    // Time management templates
    {
      id: 'deep-work',
      category: 'study',
      name: lang === 'ru' ? 'Глубокая работа' : 'Deep Work',
      icon: <BookOpen size={32} />,
      description: lang === 'ru'
        ? '4 часа фокуса без отвлечений'
        : '4 hours of focused work without distractions',
      habits: [
        { name: lang === 'ru' ? 'Отключить уведомления' : 'Turn off notifications', icon: 'brain', startTime: '09:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Фокус 90 мин' : 'Focus 90 min', icon: 'brain', startTime: '09:15', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Перерыв 15 мин' : 'Break 15 min', icon: 'coffee', startTime: '10:45', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Фокус 90 мин' : 'Focus 90 min', icon: 'brain', startTime: '11:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Определить главную задачу' : 'Define main task', time: '09:00' },
        { text: lang === 'ru' ? 'Записать результаты' : 'Document results', time: '12:30' },
      ],
      goals: [
        { name: lang === 'ru' ? '100 часов глубокой работы' : '100 hours of deep work', target: 100, unit: lang === 'ru' ? 'часов' : 'hours' },
      ],
    },
    {
      id: 'time-blocking',
      category: 'work',
      name: lang === 'ru' ? 'Time Blocking' : 'Time Blocking',
      icon: <Briefcase size={32} />,
      description: lang === 'ru'
        ? 'Планирование дня по блокам времени'
        : 'Planning the day in time blocks',
      habits: [
        { name: lang === 'ru' ? 'Планирование утром' : 'Morning planning', icon: 'book', startTime: '08:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Блок фокуса 2ч' : 'Focus block 2h', icon: 'brain', startTime: '09:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Блок встреч 1ч' : 'Meeting block 1h', icon: 'book', startTime: '14:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Обзор дня' : 'Daily review', icon: 'book', startTime: '17:00', days: [1, 2, 3, 4, 5] },
      ],
      tasks: [
        { text: lang === 'ru' ? 'Создать блоки в календаре' : 'Create calendar blocks', time: '08:15' },
        { text: lang === 'ru' ? 'Проверить прогресс' : 'Check progress', time: '12:00' },
      ],
      events: [
        { name: lang === 'ru' ? 'Блок глубокой работы' : 'Deep work block', startTime: '09:00', endTime: '11:00', note: '', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Обед' : 'Lunch', startTime: '12:00', endTime: '13:00', note: '', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Блок коммуникации' : 'Communication block', startTime: '14:00', endTime: '15:00', note: '', days: [1, 2, 3, 4, 5] },
      ],
    },
    {
      id: 'morning-routine',
      category: 'life',
      name: lang === 'ru' ? 'Утренний ритуал' : 'Morning Routine',
      icon: <Heart size={32} />,
      description: lang === 'ru'
        ? 'Продуктивное начало дня за 90 минут'
        : 'Productive start of the day in 90 minutes',
      habits: [
        { name: lang === 'ru' ? 'Подъем в 6:00' : 'Wake up at 6:00', icon: 'sleep', startTime: '06:00', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Стакан воды' : 'Glass of water', icon: 'water', startTime: '06:05', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Медитация 10 мин' : 'Meditation 10 min', icon: 'brain', startTime: '06:10', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Зарядка 20 мин' : 'Exercise 20 min', icon: 'gym', startTime: '06:20', days: [1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Здоровый завтрак' : 'Healthy breakfast', icon: 'apple', startTime: '06:40', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Чтение 30 мин' : 'Reading 30 min', icon: 'book', startTime: '07:00', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      goals: [
        { name: lang === 'ru' ? '30 дней ритуала подряд' : '30 days of routine in a row', target: 30, unit: lang === 'ru' ? 'дней' : 'days' },
      ],
    },
    {
      id: 'evening-routine',
      category: 'life',
      name: lang === 'ru' ? 'Вечерний ритуал' : 'Evening Routine',
      icon: <Heart size={32} />,
      description: lang === 'ru'
        ? 'Подготовка ко сну и планирование завтра'
        : 'Sleep preparation and planning tomorrow',
      habits: [
        { name: lang === 'ru' ? 'Отключить экраны' : 'Turn off screens', icon: 'brain', startTime: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Планирование завтра' : 'Plan tomorrow', icon: 'book', startTime: '21:15', days: [0, 1, 2, 3, 4, 5] },
        { name: lang === 'ru' ? 'Чтение 20 мин' : 'Reading 20 min', icon: 'book', startTime: '21:30', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Медитация 10 мин' : 'Meditation 10 min', icon: 'brain', startTime: '21:50', days: [0, 1, 2, 3, 4, 5, 6] },
        { name: lang === 'ru' ? 'Сон в 22:30' : 'Sleep at 22:30', icon: 'sleep', startTime: '22:30', days: [0, 1, 2, 3, 4, 5, 6] },
      ],
      goals: [
        { name: lang === 'ru' ? '7 дней ритуала' : '7 days of routine', target: 7, unit: lang === 'ru' ? 'дней' : 'days' },
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
    setSelectedCategory(null);
  };

  const selected = templates.find(t => t.id === selectedTemplate);
  const categoryTemplates = selectedCategory ? templates.filter(t => t.category === selectedCategory) : [];

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
          {!selectedCategory ? (
            <>
              <p className="text-sm text-[var(--text-secondary)]">
                {lang === 'ru'
                  ? 'Выберите категорию для быстрого старта'
                  : 'Choose a category to get started'}
              </p>

              <div className="space-y-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">
                          {category.name}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          {templates.filter(t => t.category === category.id).length} {lang === 'ru' ? 'шаблонов' : 'templates'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : !selected ? (
            <>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                ← {lang === 'ru' ? 'Назад к категориям' : 'Back to categories'}
              </button>

              <p className="text-sm text-[var(--text-secondary)]">
                {lang === 'ru'
                  ? 'Выберите шаблон. Шаблон добавит привычки, задачи, цели и события.'
                  : 'Choose a template. Template will add habits, tasks, goals and events.'}
              </p>

              <div className="space-y-3">
                {categoryTemplates.map(template => (
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
