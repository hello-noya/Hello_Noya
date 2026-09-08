import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, Target, ListTodo, Sparkles, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { getDayOfWeek } from '../../utils/storage';
import { Habit, Task, DayOfWeek } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { renderIcon } from '../../utils/icons';

interface TodayScreenProps {
  onEditHabit: (habit: Habit) => void;
  onAddHabit: () => void;
}

export function TodayScreen({ onEditHabit, onAddHabit }: TodayScreenProps) {
  const { state, toggleHabitCompletion, addTask, updateTask, toggleTaskCompletion, deleteTask, updateHabit } = useApp();
  const lang = state.settings.language;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');
  const [editTaskNote, setEditTaskNote] = useState('');
  const [showCompletedHabits, setShowCompletedHabits] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const today = new Date();
  const selectedISO = selectedDate.toISOString().split('T')[0];

  // Clean up completed habits and tasks from previous days
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Clean up old habit completions
    state.habits.forEach(habit => {
      const oldDates = habit.completedDates.filter(date => date < todayStr);
      if (oldDates.length > 0) {
        const newDates = habit.completedDates.filter(date => date >= todayStr);
        updateHabit({ ...habit, completedDates: newDates });
      }
    });
    
    // Clean up old completed tasks
    state.tasks.forEach(task => {
      if (task.completed && task.date < todayStr) {
        deleteTask(task.id);
      }
    });
  }, [state.habits, state.tasks, updateHabit, deleteTask]);

  // Get week days (Mon-Sun)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [today.toDateString()]);

  // Get habits for selected day (separate active and completed)
  const dayOfWeek = getDayOfWeek(selectedDate) as DayOfWeek;
  const allDayHabits = state.habits.filter(h => h.days.includes(dayOfWeek));
  const activeHabits = allDayHabits.filter(h => !h.completedDates.includes(selectedISO));
  const completedHabits = allDayHabits.filter(h => h.completedDates.includes(selectedISO));
  
  // Get tasks for selected day (separate active and completed)
  const allDayTasks = state.tasks.filter(t => t.date === selectedISO);
  const activeTasks = allDayTasks.filter(t => !t.completed);
  const completedTasks = allDayTasks.filter(t => t.completed);
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: newTaskText.trim(),
      time: '',
      date: selectedISO,
      completed: false,
    };
    addTask(task);
    setNewTaskText('');
  };

  // Приветствие в зависимости от времени
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return lang === 'ru' ? 'Доброе утро' : 'Good morning';
    if (hour >= 12 && hour < 18) return lang === 'ru' ? 'Добрый день' : 'Good afternoon';
    if (hour >= 18 && hour < 22) return lang === 'ru' ? 'Добрый вечер' : 'Good evening';
    return lang === 'ru' ? 'Доброй ночи' : 'Good night';
  };

  // Цитаты
  const quotes = [
    { ru: 'Каждый день — это новая возможность', en: 'Every day is a new opportunity' },
    { ru: 'Маленькие шаги ведут к большим целям', en: 'Small steps lead to big goals' },
    { ru: 'Ты сильнее, чем думаешь', en: 'You are stronger than you think' },
    { ru: 'Прогресс, а не совершенство', en: 'Progress, not perfection' },
    { ru: 'Сегодня — твой день', en: 'Today is your day' },
    { ru: 'Мечтай. Действуй. Достигай.', en: 'Dream. Act. Achieve.' },
    { ru: 'Будь лучшей версией себя', en: 'Be the best version of yourself' },
    { ru: 'Верь в себя', en: 'Believe in yourself' },
  ];

  const getDailyQuote = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quote = quotes[dayOfYear % quotes.length];
    return lang === 'ru' ? quote.ru : quote.en;
  };

  // Прогресс дня
  const totalHabits = allDayHabits.length;
  const completedHabitsCount = completedHabits.length;
  const progressPercent = totalHabits > 0 ? (completedHabitsCount / totalHabits) * 100 : 0;

  // Check if all habits completed for a day
  const isDayComplete = (date: Date) => {
    const iso = date.toISOString().split('T')[0];
    const dow = getDayOfWeek(date) as DayOfWeek;
    const habits = state.habits.filter(h => h.days.includes(dow));
    if (habits.length === 0) return false;
    return habits.every(h => h.completedDates.includes(iso));
  };

  return (
    <div className="space-y-5">

      {/* Week selector */}
      <div className="flex gap-1.5 justify-between">
        {weekDays.map((day, i) => {
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === today.toDateString();
          const complete = isDayComplete(day);
          const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[var(--accent)] text-white'
                  : isToday
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{t(dayKeys[day.getDay()], lang)}</span>
              <span className="text-sm font-bold mt-0.5">
                {complete ? <Check size={14} /> : day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Habits section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Target size={18} className="text-[var(--accent)]" />
            {t('habits', lang)} <span className="text-[var(--text-muted)] font-normal">({completedHabits.length}/{allDayHabits.length})</span>
          </h3>
          <button
            onClick={onAddHabit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            <span>{t('addHabit', lang).replace('+ ', '')}</span>
          </button>
        </div>

        {activeHabits.length === 0 ? (
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border)] text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <Target size={20} className="text-[var(--accent)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              {allDayHabits.length === 0 
                ? (lang === 'ru' ? 'Дисциплина бьет рекорды' : 'Discipline breaks records')
                : (lang === 'ru' ? 'Все привычки выполнены!' : 'All habits completed!')}
            </p>
            {allDayHabits.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'ru' ? 'Добавь свою первую привычку' : 'Add your first habit'}
              </p>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'ru' ? 'Отличная работа! Можешь отдохнуть' : 'Great job! Time to relax'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {activeHabits.map((habit) => {
              const isCompleted = false; // Active habits are never completed
              return (
                <div
                  key={habit.id}
                  onClick={() => onEditHabit(habit)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all hover:border-[var(--accent)]/30 ${
                    isCompleted 
                      ? 'bg-[var(--card-bg)] border-[var(--accent)]/30' 
                      : 'bg-[var(--card-bg)] border-[var(--border)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${
                    isCompleted 
                      ? 'border-[var(--accent)] text-[var(--accent)]' 
                      : 'border-[var(--border)] text-[var(--text-secondary)]'
                  }`}>
                    {renderIcon(habit.icon, 20, isCompleted ? 'var(--accent)' : 'var(--text-secondary)')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-[var(--text-muted)]">
                        {habit.startTime || 'Без времени'}
                      </p>
                      {habit.note && (
                        <span className="text-xs text-[var(--text-muted)] italic truncate max-w-[150px]">
                          · {habit.note}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabitCompletion(habit.id, selectedISO);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[var(--accent)] text-white'
                        : 'border-2 border-[var(--border)] hover:border-[var(--accent)]'
                    }`}
                  >
                    {isCompleted && <Check size={14} />}
                  </button>
                </div>
              );
            })}
            
            {/* Completed habits section */}
            {completedHabits.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowCompletedHabits(!showCompletedHabits)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--accent)]/30 hover:border-[var(--accent)]/50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-[var(--accent)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {lang === 'ru' ? 'Завершенные' : 'Completed'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ({completedHabits.length})
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-[var(--text-muted)] transition-transform ${showCompletedHabits ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showCompletedHabits && (
                  <div className="space-y-2 mt-2">
                    {completedHabits.map((habit) => (
                      <div
                        key={habit.id}
                        onClick={() => onEditHabit(habit)}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--accent)]/30 cursor-pointer transition-all hover:border-[var(--accent)]/50"
                      >
                        <div className="w-10 h-10 rounded-xl border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                          {renderIcon(habit.icon, 20, 'var(--accent)')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate line-through text-[var(--text-muted)]">
                            {habit.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-[var(--text-muted)]">
                              {habit.startTime || 'Без времени'}
                            </p>
                            {habit.note && (
                              <span className="text-xs text-[var(--text-muted)] italic truncate max-w-[150px]">
                                · {habit.note}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHabitCompletion(habit.id, selectedISO);
                          }}
                          className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tasks section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <ListTodo size={18} className="text-[var(--accent)]" />
            {t('tasks', lang)} <span className="text-[var(--text-muted)] font-normal">({completedTasks.length}/{allDayTasks.length})</span>
          </h3>
        </div>

          {activeTasks.length === 0 && completedTasks.length === 0 && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border)] text-center mb-2">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <ListTodo size={20} className="text-[var(--accent)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {lang === 'ru' ? 'Список чист' : 'List is clean'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'ru' ? 'Время выдохнуть и отдохнуть' : 'Time to breathe and relax'}
              </p>
            </div>
          )}
          {activeTasks.length === 0 && completedTasks.length > 0 && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border)] text-center mb-2">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check size={20} className="text-green-500" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {lang === 'ru' ? 'Все задачи выполнены!' : 'All tasks completed!'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'ru' ? 'Отличная работа! Можешь отдохнуть' : 'Great job! Time to relax'}
              </p>
            </div>
          )}
          <div className="space-y-2">
          {activeTasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all hover:border-[var(--accent)]/30 ${
                task.completed 
                  ? 'bg-[var(--card-bg)] border-[var(--accent)]/30' 
                  : 'bg-[var(--card-bg)] border-[var(--border)]'
              }`}
              onClick={() => {
                setEditingTask(task);
                setEditTaskText(task.text);
                setEditTaskTime(task.time);
                setEditTaskNote(task.note || '');
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskCompletion(task.id);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${
                  task.completed
                    ? 'bg-[var(--accent)] text-white'
                    : 'border-2 border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {task.completed && <Check size={12} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.time && (
                    <span className="text-xs text-[var(--accent)] font-medium bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                      {task.time}
                    </span>
                  )}
                  {task.deadline && (
                    <span className="text-xs text-orange-500 font-medium bg-orange-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      ⏰ {new Date(task.deadline).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                    </span>
                  )}
                  {task.note && (
                    <span className="text-xs text-[var(--text-muted)] italic truncate max-w-[200px]">
                      · {task.note}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTaskId(task.id);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          ))}
          
          {/* Completed tasks section */}
          {completedTasks.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--accent)]/30 hover:border-[var(--accent)]/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Check size={18} className="text-[var(--accent)]" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {lang === 'ru' ? 'Завершенные' : 'Completed'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    ({completedTasks.length})
                  </span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-[var(--text-muted)] transition-transform ${showCompletedTasks ? 'rotate-180' : ''}`}
                />
              </button>
              
              {showCompletedTasks && (
                <div className="space-y-2 mt-2">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--accent)]/30 cursor-pointer transition-all hover:border-[var(--accent)]/50"
                      onClick={() => {
                        setEditingTask(task);
                        setEditTaskText(task.text);
                        setEditTaskTime(task.time);
                        setEditTaskNote(task.note || '');
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center flex-shrink-0"
                      >
                        <Check size={12} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-through text-[var(--text-muted)]">
                          {task.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {task.time && (
                            <span className="text-xs text-[var(--text-muted)]">
                              {task.time}
                            </span>
                          )}
                          {task.note && (
                            <span className="text-xs text-[var(--text-muted)] italic truncate max-w-[150px]">
                              · {task.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTaskId(task.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Add task input */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder={t('newTask', lang)}
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] px-2 py-1 focus:outline-none"
            />
            <button
              onClick={handleAddTask}
              className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTaskId}
        message={t('deleteConfirm', lang)}
        onConfirm={() => {
          if (deleteTaskId) deleteTask(deleteTaskId);
          setDeleteTaskId(null);
        }}
        onCancel={() => setDeleteTaskId(null)}
      />

      {/* Edit task modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingTask(null)} />
          <div className="relative bg-[var(--card-bg)] rounded-2xl p-5 max-w-sm w-full shadow-xl animate-scale-in">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Редактировать задачу</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Название</label>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Время</label>
                <input
                  type="time"
                  value={editTaskTime}
                  onChange={(e) => setEditTaskTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Заметка</label>
                <textarea
                  value={editTaskNote}
                  onChange={(e) => setEditTaskNote(e.target.value)}
                  placeholder="Добавить заметку..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 py-2.5 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  updateTask({ ...editingTask, text: editTaskText, time: editTaskTime, note: editTaskNote || undefined });
                  setEditingTask(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
