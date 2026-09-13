import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { Header } from '../Header';

interface StatisticsContentProps {
  lang: 'ru' | 'en';
  state: any;
  onClose: () => void;
}

export function StatisticsContent({ lang, state }: StatisticsContentProps) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [metric, setMetric] = useState<'habits' | 'tasks' | 'goals'>('habits');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    if (period === 'month') {
      start = new Date(selectedMonth);
      end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    } else {
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    }

    return { start, end };
  };

  const formatDateLocal = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);

    const habitsCompleted = state.completionLog?.habits?.filter((h: any) => 
      h.date >= startStr && h.date <= endStr && h.completed
    ).length || 0;

    const tasksCompleted = state.completionLog?.tasks?.filter((t: any) => 
      t.date >= startStr && t.date <= endStr
    ).length || 0;

    const goalsProgress = state.completionLog?.goals?.filter((g: any) => 
      g.date >= startStr && g.date <= endStr
    ).reduce((sum: number, g: any) => sum + g.progressAdded, 0) || 0;

    return { habits: habitsCompleted, tasks: tasksCompleted, goals: goalsProgress };
  }, [period, selectedMonth, state.completionLog]);

  const prevStats = useMemo(() => {
    const { start, end } = getDateRange();
    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration);
    const prevEnd = new Date(start.getTime() - 1);
    const startStr = formatDateLocal(prevStart);
    const endStr = formatDateLocal(prevEnd);

    const habitsCompleted = state.completionLog?.habits?.filter((h: any) => 
      h.date >= startStr && h.date <= endStr && h.completed
    ).length || 0;

    const tasksCompleted = state.completionLog?.tasks?.filter((t: any) => 
      t.date >= startStr && t.date <= endStr
    ).length || 0;

    const goalsProgress = state.completionLog?.goals?.filter((g: any) => 
      g.date >= startStr && g.date <= endStr
    ).reduce((sum: number, g: any) => sum + g.progressAdded, 0) || 0;

    return { habits: habitsCompleted, tasks: tasksCompleted, goals: goalsProgress };
  }, [period, selectedMonth, state.completionLog]);

  const getMetricValue = () => {
    switch (metric) {
      case 'habits': return stats.habits;
      case 'tasks': return stats.tasks;
      case 'goals': return stats.goals;
    }
  };

  const getProductivity = () => {
    const current = getMetricValue();
    const prev = prevStats[metric];
    
    if (prev === 0) return current > 0 ? 100 : 0;
    
    const percentage = Math.round((current / prev) * 100);
    return Math.min(percentage, 999);
  };

  const getTrend = () => {
    const current = getMetricValue();
    const prev = prevStats[metric];
    
    if (prev === 0) return current > 0 ? 100 : 0;
    
    const change = Math.round(((current - prev) / prev) * 100);
    return change;
  };

  return (
    <div className="space-y-4">
      <Header />
      
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            period === 'week' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'ru' ? 'Неделя' : 'Week'}
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            period === 'month' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'ru' ? 'Месяц' : 'Month'}
        </button>
      </div>

      {period === 'month' && (
        <div className="flex items-center justify-between">
          <button onClick={() => {
            const newMonth = new Date(selectedMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            setSelectedMonth(newMonth);
          }} className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors">
            <ChevronLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
            {selectedMonth.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => {
            const newMonth = new Date(selectedMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            setSelectedMonth(newMonth);
          }} className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors">
            <ChevronRight size={20} className="text-[var(--text-primary)]" />
          </button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              {lang === 'ru' ? 'Продуктивность' : 'Productivity'}
            </p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {getProductivity()}%
            </p>
          </div>
          <div className="flex items-center gap-1">
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
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMetric('habits')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            metric === 'habits' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'ru' ? 'Привычки' : 'Habits'}
        </button>
        <button
          onClick={() => setMetric('tasks')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            metric === 'tasks' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'ru' ? 'Задачи' : 'Tasks'}
        </button>
        <button
          onClick={() => setMetric('goals')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            metric === 'goals' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'ru' ? 'Цели' : 'Goals'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.habits}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Привычки' : 'Habits'}</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.tasks}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Задачи' : 'Tasks'}</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.goals}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Цели' : 'Goals'}</p>
        </div>
      </div>
    </div>
  );
}
