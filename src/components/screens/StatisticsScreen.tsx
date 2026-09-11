import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';
import { t } from '../../utils/i18n';
import { renderIcon } from '../../utils/icons';

interface StatisticsScreenProps {
  onBack: () => void;
}

type Period = 'week' | 'month';
type Metric = 'habits' | 'tasks' | 'goals';

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [period, setPeriod] = useState<Period>('week');
  const [metric, setMetric] = useState<Metric>('habits');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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
      // Week starts from Sunday
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (period === 'month') {
      start = new Date(selectedMonth);
      end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    } else {
      start = new Date(now);
      end = new Date(now);
    }

    return { start, end };
  };

  // Calculate statistics for the period
  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);

    const habitsCompleted = state.completionLog?.habits?.filter(h => 
      h.date >= startStr && h.date <= endStr && h.completed
    ).length || 0;

    const tasksCompleted = state.completionLog?.tasks?.filter(t => 
      t.date >= startStr && t.date <= endStr
    ).length || 0;

    const goalsProgress = state.completionLog?.goals?.filter(g => 
      g.date >= startStr && g.date <= endStr
    ).reduce((sum, g) => sum + g.progressAdded, 0) || 0;

    return { habits: habitsCompleted, tasks: tasksCompleted, goals: goalsProgress };
  }, [period, selectedMonth, state.completionLog]);

  // Calculate previous period stats for trend
  const prevStats = useMemo(() => {
    const { start, end } = getDateRange();
    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration);
    const prevEnd = new Date(start.getTime() - 1);
    const startStr = formatDateLocal(prevStart);
    const endStr = formatDateLocal(prevEnd);

    const habitsCompleted = state.completionLog?.habits?.filter(h => 
      h.date >= startStr && h.date <= endStr && h.completed
    ).length || 0;

    const tasksCompleted = state.completionLog?.tasks?.filter(t => 
      t.date >= startStr && t.date <= endStr
    ).length || 0;

    const goalsProgress = state.completionLog?.goals?.filter(g => 
      g.date >= startStr && g.date <= endStr
    ).reduce((sum, g) => sum + g.progressAdded, 0) || 0;

    return { habits: habitsCompleted, tasks: tasksCompleted, goals: goalsProgress };
  }, [period, selectedMonth, state.completionLog]);

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    const todayStr = formatDateLocal(today);
    
    const todayHasActivity = 
      state.completionLog?.habits?.some(h => h.date === todayStr && h.completed) ||
      state.completionLog?.tasks?.some(t => t.date === todayStr);
    
    if (!todayHasActivity) return 0;
    
    count = 1;
    
    for (let i = 1; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDateLocal(date);
      
      const hasActivity = 
        state.completionLog?.habits?.some(h => h.date === dateStr && h.completed) ||
        state.completionLog?.tasks?.some(t => t.date === dateStr);
      
      if (hasActivity) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }, [state.completionLog]);

  // Get metric value
  const getMetricValue = () => {
    switch (metric) {
      case 'habits': return stats.habits;
      case 'tasks': return stats.tasks;
      case 'goals': return stats.goals;
    }
  };

  // Get trend
  const getTrend = () => {
    const current = getMetricValue();
    const prev = prevStats[metric];
    
    if (prev === 0) return current > 0 ? 100 : 0;
    
    const change = Math.round(((current - prev) / prev) * 100);
    return change;
  };

  // Calculate habit-specific stats (moved to top level)
  const habitStats = useMemo(() => {
    if (!selectedHabit) return null;
    
    const { start, end } = getDateRange();
    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);
    
    // Get completion data for this specific habit
    const completions = state.completionLog?.habits?.filter(h => 
      h.habitId === selectedHabit.id && h.date >= startStr && h.date <= endStr && h.completed
    ) || [];
    
    // Calculate total days in period
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate completion percentage
    const completionRate = totalDays > 0 ? Math.round((completions.length / totalDays) * 100) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDateLocal(date);
      
      const wasCompleted = state.completionLog?.habits?.some(h => 
        h.habitId === selectedHabit.id && h.date === dateStr && h.completed
      );
      
      if (wasCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const allDates = state.completionLog?.habits
      ?.filter(h => h.habitId === selectedHabit.id && h.completed)
      .map(h => h.date)
      .sort() || [];
    
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currDate = new Date(allDates[i]);
        const diffDays = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    }
    
    return {
      completionRate,
      currentStreak,
      bestStreak,
      completions,
    };
  }, [selectedHabit, period, state.completionLog]);

  // Level 2: Habit detail view (conditional render)
  if (selectedHabit && habitStats) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedHabit(null)} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {selectedHabit.name}
          </h2>
        </div>

        {/* Habit card */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
              {renderIcon(selectedHabit.icon, 24, 'var(--accent)')}
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-[var(--text-primary)]">{selectedHabit.name}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {selectedHabit.startTime || (lang === 'ru' ? 'Без времени' : 'No time set')}
              </p>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'week' as Period, label: lang === 'ru' ? 'Неделя' : 'Week' },
            { id: 'month' as Period, label: lang === 'ru' ? 'Месяц' : 'Month' },
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

        {/* Habit stats */}
        <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">
            {lang === 'ru' ? 'Выполнение' : 'Completion'}
          </p>
          <p className="text-5xl font-bold text-[var(--text-primary)]">
            {habitStats.completionRate}%
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
                const wasCompleted = habitStats.completions.some(c => c.date === dateStr);
                
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                        wasCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--hover)]'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{date.getDate()}</span>
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
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedMonth(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors"
                >
                  <ArrowLeft size={20} className="text-[var(--text-primary)]" />
                </button>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {selectedMonth.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedMonth(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors"
                >
                  <ArrowLeft size={20} className="text-[var(--text-primary)] rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
              {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, i) => (
                <div key={i} className="text-center text-[10px] text-[var(--text-muted)] py-1">
                  {day}
                </div>
              ))}
              {(() => {
                const year = selectedMonth.getFullYear();
                const month = selectedMonth.getMonth();
                const firstDay = new Date(year, month, 1);
                const firstDayOfWeek = firstDay.getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                const days = [];
                
                // Empty cells for days before first day
                for (let i = 0; i < firstDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} className="aspect-square" />);
                }
                
                // Actual days
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const dateStr = formatDateLocal(date);
                  const wasCompleted = habitStats.completions.some(c => c.date === dateStr);
                  
                  days.push(
                    <div 
                      key={day}
                      className={`aspect-square rounded flex items-center justify-center ${
                        wasCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--hover)]'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{day}</span>
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Level 1: Overview
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {lang === 'ru' ? 'Статистика' : 'Statistics'}
        </h2>
      </div>

      {/* Period selector */}
      <div className="grid grid-cols-2 gap-2">
        {([
          { id: 'week' as Period, label: lang === 'ru' ? 'Неделя' : 'Week' },
          { id: 'month' as Period, label: lang === 'ru' ? 'Месяц' : 'Month' },
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

      {/* Productivity card */}
      <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)] mb-1">
          {lang === 'ru' ? 'Продуктивность' : 'Productivity'}
        </p>
        <p className="text-5xl font-bold text-[var(--text-primary)]">
          {getMetricValue()}%
        </p>
        <div className="flex items-center gap-1 mt-2">
          {getTrend() > 0 ? (
            <TrendingUp size={20} className="text-green-500" />
          ) : getTrend() < 0 ? (
            <TrendingDown size={20} className="text-red-500" />
          ) : null}
          <span className={`text-sm font-medium ${
            getTrend() > 0 ? 'text-green-500' : getTrend() < 0 ? 'text-red-500' : 'text-[var(--text-muted)]'
          }`}>
            {getTrend() > 0 ? '+' : ''}{getTrend()}%
          </span>
        </div>
        {streak > 0 && (
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            🔥 {streak} {lang === 'ru' ? 'дней подряд' : 'days in a row'}
          </p>
        )}
      </div>

      {/* Metric selector */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--hover)]">
        {(['habits', 'tasks', 'goals'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              metric === m ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'
            }`}
          >
            {m === 'habits' && (lang === 'ru' ? 'Привычки' : 'Habits')}
            {m === 'tasks' && (lang === 'ru' ? 'Задачи' : 'Tasks')}
            {m === 'goals' && (lang === 'ru' ? 'Цели' : 'Goals')}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.habits}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Привычки' : 'Habits'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.tasks}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Задачи' : 'Tasks'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.goals}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Цели' : 'Goals'}</p>
        </div>
      </div>

      {/* Habits list */}
      {metric === 'habits' && state.habits.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            {lang === 'ru' ? 'Привычки' : 'Habits'}
          </h3>
          <div className="space-y-2">
            {state.habits.slice(0, 6).map((habit) => {
              const { start, end } = getDateRange();
              const startStr = formatDateLocal(start);
              const endStr = formatDateLocal(end);
              
              const completed = state.completionLog?.habits?.filter(h => 
                h.habitId === habit.id && h.date >= startStr && h.date <= endStr && h.completed
              ).length || 0;
              
              const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
              
              return (
                <button
                  key={habit.id}
                  onClick={() => setSelectedHabit(habit)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--hover)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                    {renderIcon(habit.icon, 20, 'var(--accent)')}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{habit.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{percentage}%</p>
                  </div>
                </button>
              );
            })}
            {state.habits.length > 6 && (
              <button className="w-full py-2 text-sm text-[var(--accent)] hover:underline">
                {lang === 'ru' ? `Показать все (${state.habits.length})` : `Show all (${state.habits.length})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tasks list */}
      {metric === 'tasks' && state.tasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            {lang === 'ru' ? 'Задачи' : 'Tasks'}
          </h3>
          <div className="space-y-2">
            {state.tasks.slice(0, 6).map((task) => {
              const { start, end } = getDateRange();
              const startStr = formatDateLocal(start);
              const endStr = formatDateLocal(end);
              
              const completed = state.completionLog?.tasks?.filter(t => 
                t.taskId === task.id && t.date >= startStr && t.date <= endStr
              ).length || 0;
              
              const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
              
              return (
                <div
                  key={task.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                    <span className="text-[var(--accent)]">✓</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{task.text}</p>
                    <p className="text-xs text-[var(--text-muted)]">{percentage}%</p>
                  </div>
                </div>
              );
            })}
            {state.tasks.length > 6 && (
              <button className="w-full py-2 text-sm text-[var(--accent)] hover:underline">
                {lang === 'ru' ? `Показать все (${state.tasks.length})` : `Show all (${state.tasks.length})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Goals list */}
      {metric === 'goals' && state.goals.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            {lang === 'ru' ? 'Цели' : 'Goals'}
          </h3>
          <div className="space-y-2">
            {state.goals.slice(0, 6).map((goal) => {
              const { start, end } = getDateRange();
              const startStr = formatDateLocal(start);
              const endStr = formatDateLocal(end);
              
              const completed = state.completionLog?.goals?.filter(g => 
                g.goalId === goal.id && g.date >= startStr && g.date <= endStr
              ).reduce((sum, g) => sum + g.progressAdded, 0) || 0;
              
              const percentage = goal.target > 0 ? Math.round((completed / goal.target) * 100) : 0;
              
              return (
                <div
                  key={goal.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                    <span className="text-[var(--accent)]">🎯</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{goal.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{percentage}%</p>
                  </div>
                </div>
              );
            })}
            {state.goals.length > 6 && (
              <button className="w-full py-2 text-sm text-[var(--accent)] hover:underline">
                {lang === 'ru' ? `Показать все (${state.goals.length})` : `Show all (${state.goals.length})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
