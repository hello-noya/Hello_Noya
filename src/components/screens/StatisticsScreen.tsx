import React from 'react';
import { ArrowLeft, Target, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface StatisticsScreenProps {
  onBack: () => void;
}

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  // Подсчёт статистики
  const totalHabits = state.habits.length;
  const completedHabitsToday = state.habits.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return h.completedDates.includes(today);
  }).length;

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;

  const totalGoals = state.goals.length;
  const achievedGoals = state.goals.filter(g => g.current >= g.target).length;

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
      
      // Ограничение на 365 дней
      if (streak > 365) break;
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Общее количество выполненных привычек за всё время
  const totalCompletedHabits = state.habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {lang === 'ru' ? 'Статистика' : 'Statistics'}
        </h2>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
              <Target size={16} className="text-[var(--accent)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalHabits}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {lang === 'ru' ? 'Всего привычек' : 'Total habits'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={16} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{completedHabitsToday}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {lang === 'ru' ? 'Выполнено сегодня' : 'Completed today'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{currentStreak}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {lang === 'ru' ? 'Дней подряд' : 'Day streak'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar size={16} className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalCompletedHabits}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {lang === 'ru' ? 'Всего выполнено' : 'Total completed'}
          </p>
        </div>
      </div>

      {/* Задачи */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {lang === 'ru' ? 'Задачи' : 'Tasks'}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Всего задач' : 'Total tasks'}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)]">{totalTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Выполнено' : 'Completed'}
            </span>
            <span className="text-sm font-bold text-green-500">{completedTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Прогресс' : 'Progress'}
            </span>
            <span className="text-sm font-bold text-[var(--accent)]">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Цели */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {lang === 'ru' ? 'Цели' : 'Goals'}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Всего целей' : 'Total goals'}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)]">{totalGoals}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Достигнуто' : 'Achieved'}
            </span>
            <span className="text-sm font-bold text-green-500">{achievedGoals}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {lang === 'ru' ? 'Прогресс' : 'Progress'}
            </span>
            <span className="text-sm font-bold text-[var(--accent)]">
              {totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
