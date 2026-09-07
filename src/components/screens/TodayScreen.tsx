import React, { useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { getDayOfWeek } from '../../utils/storage';
import { Habit, Task, DayOfWeek } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface TodayScreenProps {
  onEditHabit: (habit: Habit) => void;
  onAddHabit: () => void;
}

export function TodayScreen({ onEditHabit, onAddHabit }: TodayScreenProps) {
  const { state, toggleHabitCompletion, addTask, updateTask, toggleTaskCompletion, deleteTask } = useApp();
  const lang = state.settings.language;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');

  const today = new Date();
  const selectedISO = selectedDate.toISOString().split('T')[0];

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

  // Get habits for selected day
  const dayOfWeek = getDayOfWeek(selectedDate) as DayOfWeek;
  const dayHabits = state.habits.filter(h => h.days.includes(dayOfWeek));
  const completedHabits = dayHabits.filter(h => h.completedDates.includes(selectedISO));

  // Get tasks for selected day
  const dayTasks = state.tasks.filter(t => t.date === selectedISO);
  const completedTasks = dayTasks.filter(t => t.completed);

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
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t('habits', lang)} <span className="text-[var(--text-muted)] font-normal">({completedHabits.length}/{dayHabits.length})</span>
          </h3>
          <button
            onClick={onAddHabit}
            className="text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
          >
            {t('addHabit', lang)}
          </button>
        </div>

        {dayHabits.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">{t('noItems', lang)}</p>
        ) : (
          <div className="space-y-2">
            {dayHabits.map((habit) => {
              const isCompleted = habit.completedDates.includes(selectedISO);
              return (
                <div
                  key={habit.id}
                  onClick={() => onEditHabit(habit)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent)]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-lg">
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                      {habit.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {habit.startTime ? `${habit.startTime} · ${habit.duration} ${t('minutes', lang)}` : `${habit.duration} ${t('minutes', lang)}`}
                    </p>
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
          </div>
        )}
      </div>

      {/* Tasks section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t('tasks', lang)} <span className="text-[var(--text-muted)] font-normal">({completedTasks.length}/{dayTasks.length})</span>
          </h3>
        </div>

          <div className="space-y-2">
          {dayTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  task.completed
                    ? 'bg-[var(--accent)] text-white'
                    : 'border-2 border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {task.completed && <Check size={12} />}
              </button>
              <button
                onClick={() => {
                  setEditingTask(task);
                  setEditTaskText(task.text);
                  setEditTaskTime(task.time);
                }}
                className={`flex-1 text-left text-sm ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}
              >
                {task.text}
              </button>
              {task.time && <span className="text-xs text-[var(--text-muted)]">{task.time}</span>}
              <button
                onClick={() => setDeleteTaskId(task.id)}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
          ))}
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
                  updateTask({ ...editingTask, text: editTaskText, time: editTaskTime });
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
