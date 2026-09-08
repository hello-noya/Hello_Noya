import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, CheckCircle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { renderIcon } from '../../utils/icons';

interface StatisticsScreenProps {
  onBack: () => void;
}

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  // Подсчёт статистики
  const today = new Date().toISOString().split('T')[0];
  
  const completedHabitsToday = state.habits.filter(h => 
    h.completedDates.includes(today)
  ).length;

  // Подсчёт серии дней (streak)
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const dayHabits = state.habits.filter(h => h.days.includes(dayOfWeek));
      
      if (dayHabits.length === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      
      const allCompleted = dayHabits.every(h => h.completedDates.includes(dateStr));
      
      if (allCompleted) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
      
      if (streak > 365) break;
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Общее количество выполненных привычек за всё время
  const totalCompletedHabits = state.habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  // Детальная статистика по привычкам
  const getHabitStats = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const totalCompletions = habit.completedDates.length;
    const completedToday = habit.completedDates.includes(today);
    
    // Подсчёт за последнюю неделю
    const lastWeek = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      lastWeek.push({
        date: dateStr,
        completed: habit.completedDates.includes(dateStr),
        dayName: date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' }),
      });
    }

    return {
      totalCompletions,
      completedToday,
      lastWeek,
    };
  };

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

      {/* Компактные карточки статистики */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <TrendingUp size={14} className="text-orange-500" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{currentStreak}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            {lang === 'ru' ? 'Дней подряд' : 'Day streak'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <CheckCircle size={14} className="text-purple-500" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{totalCompletedHabits}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            {lang === 'ru' ? 'Всего' : 'Total'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
          <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Target size={14} className="text-green-500" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{completedHabitsToday}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            {lang === 'ru' ? 'Сегодня' : 'Today'}
          </p>
        </div>
      </div>

      {/* Привычки с подробностями */}
      <div className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {lang === 'ru' ? 'Привычки' : 'Habits'}
        </h3>
        
        {state.habits.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-4">
            {lang === 'ru' ? 'Нет привычек' : 'No habits yet'}
          </p>
        ) : (
          <div className="space-y-2">
            {state.habits.map((habit) => {
              const stats = getHabitStats(habit.id);
              if (!stats) return null;
              
              const isExpanded = expandedHabit === habit.id;
              
              return (
                <div key={habit.id} className="rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => setExpandedHabit(isExpanded ? null : habit.id)}
                    className="w-full flex items-center gap-2 p-2.5 hover:bg-[var(--hover)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      {renderIcon(habit.icon, 16, 'var(--accent)')}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{habit.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {stats.totalCompletions} {lang === 'ru' ? 'выполнений' : 'completed'}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-[var(--text-muted)]" />
                    ) : (
                      <ChevronDown size={16} className="text-[var(--text-muted)]" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-2.5 pb-2.5 pt-1 border-t border-[var(--border)]">
                      <p className="text-[10px] font-medium text-[var(--text-muted)] mb-1.5">
                        {lang === 'ru' ? 'Последняя неделя' : 'Last week'}
                      </p>
                      <div className="flex gap-1">
                        {stats.lastWeek.map((day, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 aspect-square rounded-md flex flex-col items-center justify-center ${
                              day.completed
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--hover)] text-[var(--text-muted)]'
                            }`}
                          >
                            <span className="text-[8px] font-medium">{day.dayName}</span>
                            {day.completed && <CheckCircle size={10} className="mt-0.5" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
