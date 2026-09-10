import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatisticsScreenProps {
  onBack: () => void;
}

type Period = 'week' | 'month' | 'year';
type Metric = 'habits' | 'tasks' | 'goals';

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [period, setPeriod] = useState<Period>('week');
  const [metric, setMetric] = useState<Metric>('habits');

  // Get date range for selected period
  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (period) {
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end };
  };

  // Calculate statistics for the period
  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    // Habits
    const habitsCompleted = state.completionLog?.habits?.filter(h => 
      h.date >= startStr && h.date <= endStr && h.completed
    ).length || 0;

    // Tasks
    const tasksCompleted = state.completionLog?.tasks?.filter(t => 
      t.date >= startStr && t.date <= endStr
    ).length || 0;

    // Goals
    const goalsProgress = state.completionLog?.goals?.filter(g => 
      g.date >= startStr && g.date <= endStr
    ).reduce((sum, g) => sum + g.progressAdded, 0) || 0;

    return {
      habits: habitsCompleted,
      tasks: tasksCompleted,
      goals: goalsProgress,
    };
  }, [period, state.completionLog]);

  // Get metric value
  const getMetricValue = () => {
    switch (metric) {
      case 'habits': return stats.habits;
      case 'tasks': return stats.tasks;
      case 'goals': return stats.goals;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col">
      <div className="max-w-[420px] mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Статистика' : 'Statistics'}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Period selector */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'week' as Period, label: lang === 'ru' ? 'Неделя' : 'Week' },
              { id: 'month' as Period, label: lang === 'ru' ? 'Месяц' : 'Month' },
              { id: 'year' as Period, label: lang === 'ru' ? 'Год' : 'Year' },
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

          {/* Main stat */}
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              {lang === 'ru' ? 'Всего выполнено' : 'Total completed'}
            </p>
            <p className="text-5xl font-bold text-[var(--text-primary)]">
              {getMetricValue()}
            </p>
          </div>

          {/* All stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.habits}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Привычки' : 'Habits'}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.tasks}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Задачи' : 'Tasks'}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.goals}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{lang === 'ru' ? 'Цели' : 'Goals'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
