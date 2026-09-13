import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

interface TaskDetailScreenProps {
  taskId: string;
  onBack: () => void;
}

export function TaskDetailScreen({ taskId, onBack }: TaskDetailScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  
  const task = state.tasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Задача не найдена' : 'Task not found'}
          </h2>
        </div>
      </div>
    );
  }

  // Helper function to format date as YYYY-MM-DD using local time
  const formatDateLocal = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Get date range for selected period
  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    if (period === 'week') {
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      start = firstDay;
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return { start, end };
  };

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const { start, end } = getDateRange();
    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);
    
    // Find similar tasks (same text pattern)
    const similarTasks = state.tasks.filter(t => 
      t.text.toLowerCase().includes(task.text.toLowerCase().split(' ')[0]) &&
      t.date >= startStr && t.date <= endStr
    );
    
    const completed = similarTasks.filter(t => t.completed).length;
    const total = similarTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completionRate,
      completed,
      total,
      similarTasks,
    };
  }, [task, period, state.tasks]);

  const totalDays = Math.ceil((getDateRange().end.getTime() - getDateRange().start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {lang === 'ru' ? 'Детали задачи' : 'Task Details'}
        </h2>
      </div>

      {/* Task card */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
            {task.completed ? (
              <CheckCircle size={24} className="text-[var(--accent)]" />
            ) : (
              <Circle size={24} className="text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-[var(--text-primary)]">{task.text}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {formatDateLocal(new Date(task.date))}
            </p>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="grid grid-cols-2 gap-2">
        {([
          { id: 'week' as const, label: lang === 'ru' ? 'Неделя' : 'Week' },
          { id: 'month' as const, label: lang === 'ru' ? 'Месяц' : 'Month' },
        ]).map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
              period === p.id
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Task stats */}
      <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)] mb-1">
          {lang === 'ru' ? 'Выполнение похожих задач' : 'Similar tasks completion'}
        </p>
        <p className="text-5xl font-bold text-[var(--text-primary)]">
          {taskStats.completionRate}%
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {taskStats.completed} / {taskStats.total} {lang === 'ru' ? 'задач' : 'tasks'}
        </p>
      </div>

      {/* Activity calendar */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {lang === 'ru' ? 'Активность по дням' : 'Daily Activity'}
        </h3>
        
        {period === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = formatDateLocal(date);
              const wasCompleted = taskStats.similarTasks.some(t => t.date === dateStr && t.completed);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                      wasCompleted
                        ? 'bg-[var(--accent)] text-white'
                        : isToday
                        ? 'bg-[var(--card-bg)] border-2 border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="text-xs font-bold">{date.getDate()}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {period === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, i) => (
              <div key={i} className="text-center text-[10px] text-[var(--text-muted)] py-1">
                {day}
              </div>
            ))}
            {(() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth();
              const firstDay = new Date(year, month, 1);
              const firstDayOfWeek = firstDay.getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              
              const days = [];
              
              for (let i = 0; i < firstDayOfWeek; i++) {
                days.push(<div key={`empty-${i}`} className="aspect-square" />);
              }
              
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateStr = formatDateLocal(date);
                const wasCompleted = taskStats.similarTasks.some(t => t.date === dateStr && t.completed);
                const isToday = date.toDateString() === new Date().toDateString();
                
                days.push(
                  <div 
                    key={day}
                    className={`aspect-square rounded flex items-center justify-center transition-all ${
                      wasCompleted
                        ? 'bg-[var(--accent)] text-white'
                        : isToday
                        ? 'bg-[var(--card-bg)] border-2 border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="text-xs font-bold">{day}</span>
                  </div>
                );
              }
              
              return days;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
