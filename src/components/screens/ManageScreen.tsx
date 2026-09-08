import React, { useState } from 'react';
import { ArrowLeft, Trash2, RotateCcw, CheckCircle, Clock, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { renderIcon } from '../../utils/icons';

interface ManageScreenProps {
  onBack: () => void;
}

export function ManageScreen({ onBack }: ManageScreenProps) {
  const { state, deleteHabit, deleteTask, toggleHabitCompletion, toggleTaskCompletion } = useApp();
  const lang = state.settings.language;
  const [activeTab, setActiveTab] = useState<'habits' | 'tasks' | 'completed'>('habits');
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  
  // Все привычки
  const allHabits = state.habits;
  // Все задачи
  const allTasks = state.tasks;
  // Завершённые сегодня привычки
  const completedTodayHabits = allHabits.filter(h => h.completedDates.includes(today));
  // Завершённые задачи
  const completedTasks = allTasks.filter(t => t.completed);

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'habit') deleteHabit(confirmDelete.id);
    if (confirmDelete.type === 'task') deleteTask(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleRestoreHabit = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date);
  };

  const handleRestoreTask = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('manageLists', lang)}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--hover)]">
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'habits' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          <Target size={14} />
          {t('allHabits', lang)}
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tasks' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          <Clock size={14} />
          {t('allTasks', lang)}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'completed' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          <CheckCircle size={14} />
          {t('completed', lang)}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {activeTab === 'habits' && (
          <>
            {allHabits.length === 0 ? (
              <div className="text-center py-12">
                <Target size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">{t('noItems', lang)}</p>
              </div>
            ) : (
              allHabits.map(h => (
                <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    {renderIcon(h.icon, 20, 'var(--accent)')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[var(--text-primary)] block truncate">{h.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {h.startTime && `${h.startTime} · `}{h.duration} {t('minutes', lang)}
                    </span>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ type: 'habit', id: h.id })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            {allTasks.filter(t => !t.completed).length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">{t('noItems', lang)}</p>
              </div>
            ) : (
              allTasks.filter(t => !t.completed).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <Clock size={18} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[var(--text-primary)] block truncate">{task.text}</span>
                    <span className="text-xs text-[var(--text-muted)]">{task.date}</span>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ type: 'task', id: task.id })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedTodayHabits.length === 0 && completedTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">{t('noItems', lang)}</p>
              </div>
            ) : (
              <>
                {/* Completed habits */}
                {completedTodayHabits.map(h => (
                  <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-[var(--text-primary)] block truncate">{h.name}</span>
                      <span className="text-xs text-green-500">Привычка · сегодня</span>
                    </div>
                    <button
                      onClick={() => handleRestoreHabit(h.id, today)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                      title="Восстановить"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ))}
                {/* Completed tasks */}
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-[var(--text-muted)] line-through block truncate">{task.text}</span>
                      <span className="text-xs text-green-500">Задача · {task.date}</span>
                    </div>
                    <button
                      onClick={() => handleRestoreTask(task.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                      title="Восстановить"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        message={t('deleteConfirm', lang)}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
