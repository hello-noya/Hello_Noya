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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Get date range for selected period
  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    if (period === 'month') {
      start = new Date(selectedMonth);
      end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    } else if (period === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else {
      // Week starts from Sunday
      const dayOfWeek = now.getDay(); // 0 = Sunday
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek); // Go back to Sunday
      end = new Date(start);
      end.setDate(start.getDate() + 6); // Saturday
    }

    return { start, end };
  };

  // Calculate statistics for the period
  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

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
    const startStr = prevStart.toISOString().split('T')[0];
    const endStr = prevEnd.toISOString().split('T')[0];

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
    const todayStr = today.toISOString().split('T')[0];
    
    const todayHasActivity = 
      state.completionLog?.habits?.some(h => h.date === todayStr && h.completed) ||
      state.completionLog?.tasks?.some(t => t.date === todayStr);
    
    if (!todayHasActivity) return 0;
    
    count = 1;
    
    for (let i = 1; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
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

  // Calculate productivity percentage
  const getProductivity = () => {
    const current = getMetricValue();
    const prev = prevStats[metric];
    
    if (prev === 0) return current > 0 ? 100 : 0;
    
    const percentage = Math.round((current / prev) * 100);
    return Math.min(percentage, 999);
  };

  // Get trend
  const getTrend = () => {
    const current = getMetricValue();
    const prev = prevStats[metric];
    
    if (prev === 0) return current > 0 ? 100 : 0;
    
    const change = Math.round(((current - prev) / prev) * 100);
    return change;
  };

  // Generate week data (Sunday to Saturday)
  const weekData = useMemo(() => {
    if (period !== 'week') return [];
    const { start } = getDateRange();
    const data: Array<{ date: string; dayName: string; value: number }> = [];
    
    const dayLabels = lang === 'ru' 
      ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      let value = 0;
      if (metric === 'habits') {
        value = state.completionLog?.habits?.filter(h => h.date === dateStr && h.completed).length || 0;
      } else if (metric === 'tasks') {
        value = state.completionLog?.tasks?.filter(t => t.date === dateStr).length || 0;
      } else if (metric === 'goals') {
        value = state.completionLog?.goals?.filter(g => g.date === dateStr).reduce((sum, g) => sum + g.progressAdded, 0) || 0;
      }
      
      data.push({ 
        date: dateStr, 
        dayName: dayLabels[i],
        value
      });
    }
    
    return data;
  }, [period, metric, state.completionLog, lang]);

  // Generate calendar data for month
  const calendarData = useMemo(() => {
    if (period !== 'month') return [];
    const { start, end } = getDateRange();
    const data: Array<{ date: string; day: number; value: number; isToday: boolean }> = [];
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const day = current.getDate();
      
      let value = 0;
      if (metric === 'habits') {
        value = state.completionLog?.habits?.filter(h => h.date === dateStr && h.completed).length || 0;
      } else if (metric === 'tasks') {
        value = state.completionLog?.tasks?.filter(t => t.date === dateStr).length || 0;
      } else if (metric === 'goals') {
        value = state.completionLog?.goals?.filter(g => g.date === dateStr).reduce((sum, g) => sum + g.progressAdded, 0) || 0;
      }
      
      data.push({ 
        date: dateStr,
        day,
        value,
        isToday: dateStr === todayStr
      });
      current.setDate(current.getDate() + 1);
    }
    
    return data;
  }, [period, selectedMonth, metric, state.completionLog]);

  // Generate monthly data for year view
  const monthlyData = useMemo(() => {
    if (period !== 'year') return [];
    
    const year = new Date().getFullYear();
    const data: Array<{ month: number; label: string; value: number }> = [];
    
    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      let value = 0;
      if (metric === 'habits') {
        value = state.completionLog?.habits?.filter(h => h.date >= startStr && h.date <= endStr && h.completed).length || 0;
      } else if (metric === 'tasks') {
        value = state.completionLog?.tasks?.filter(t => t.date >= startStr && t.date <= endStr).length || 0;
      } else if (metric === 'goals') {
        value = state.completionLog?.goals?.filter(g => g.date >= startStr && g.date <= endStr).reduce((sum, g) => sum + g.progressAdded, 0) || 0;
      }
      
      const label = start.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short' });
      data.push({ month, label, value });
    }
    
    return data;
  }, [period, metric, state.completionLog, lang]);

  // Navigation for month view
  const prevMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Month title
  const monthTitle = selectedMonth.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const productivity = getProductivity();
  const trend = getTrend();

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

          {/* Month navigation for month view */}
          {period === 'month' && (
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors">
                <ChevronLeft size={20} className="text-[var(--text-primary)]" />
              </button>
              <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                {monthTitle}
              </span>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors">
                <ChevronRight size={20} className="text-[var(--text-primary)]" />
              </button>
            </div>
          )}

          {/* Productivity card */}
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {lang === 'ru' ? 'Продуктивность' : 'Productivity'}
                </p>
                <p className="text-5xl font-bold text-[var(--text-primary)]">
                  {productivity}%
                </p>
              </div>
              <div className="flex items-center gap-1">
                {trend > 0 ? (
                  <TrendingUp size={20} className="text-green-500" />
                ) : trend < 0 ? (
                  <TrendingDown size={20} className="text-red-500" />
                ) : null}
                <span className={`text-sm font-medium ${
                  trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-[var(--text-muted)]'
                }`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            </div>
            {streak > 0 && (
              <p className="text-sm text-[var(--text-secondary)]">
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

          {/* Three metric cards */}
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

          {/* Week view (Sunday to Saturday) */}
          {period === 'week' && (
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                {lang === 'ru' ? 'Активность по дням' : 'Daily Activity'}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, i) => {
                  const maxValue = Math.max(...weekData.map(d => d.value), 1);
                  const intensity = day.value / maxValue;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-full aspect-square rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `var(--accent)`,
                          opacity: day.value === 0 ? 0.3 : Math.max(0.5, intensity),
                        }}
                      >
                        <span className="text-xs font-bold text-white">{day.value}</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">{day.dayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Month view with calendar */}
          {period === 'month' && (
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                {lang === 'ru' ? 'Календарь активности' : 'Activity Calendar'}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {/* Day labels */}
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, i) => (
                  <div key={i} className="text-center-center text-[10px] text-[var(--text-muted)] py-1">
                    {day}
                  </div>
                ))}
                {/* Calendar days */}
                {calendarData.map((day, i) => {
                  const maxValue = Math.max(...calendarData.map(d => d.value), 1);
                  const intensity = day.value / maxValue;
                  
                  return (
                    <div 
                      key={i}
                      className={`aspect-square rounded flex flex-col items-center justify-center relative ${
                        day.isToday ? 'ring-2 ring-[var(--accent)]' : ''
                      }`}
                      style={{
                        backgroundColor: `var(--accent)`,
                          opacity: day.value === 0 ? 0.3 : Math.max(0.5, intensity),
                        }}
                    >
                      <span className="text-xs font-bold text-white">{day.day}</span>
                      {day.value > 0 && (
                        <span className="text-[8px] text-white/80">{day.value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Year view with two blocks */}
          {period === 'year' && (
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                {lang === 'ru' ? 'Обзор по месяцам' : 'Monthly Overview'}
              </h3>
              
              {/* Two blocks layout */}
              <div className="grid grid-cols-2 gap-3">
                {monthlyData.map((month, i) => {
                  const maxValue = Math.max(...monthlyData.map(m => m.value), 1);
                  const height = (month.value / maxValue) * 60;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedMonth(new Date(new Date().getFullYear(), month.month, 1));
                        setPeriod('month');
                      }}
                      className="flex flex-col items-center p-3 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--hover)] transition-colors"
                    >
                      <div 
                        className="w-full rounded-full mb-2"
                        style={{
                          height: `${height}px`,
                          backgroundColor: 'var(--accent)',
                          minHeight: month.value > 0 ? '4px' : '0px',
                        }}
                      />
                      <span className="text-xs font-medium text-[var(--text-primary)] capitalize">
                        {month.label}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {month.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
