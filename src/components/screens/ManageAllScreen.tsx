import React, { useState } from 'react';
import { ArrowLeft, Trash2, Target, ListTodo, Target as GoalIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface ManageAllScreenProps {
  onBack: () => void;
}

export function ManageAllScreen({ onBack }: ManageAllScreenProps) {
  const { state, deleteHabit, deleteTask, deleteGoal, showToast } = useApp();
  const lang = state.settings.language;
  const [activeTab, setActiveTab] = useState<'habits' | 'tasks' | 'goals'>('habits');
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'habit') {
      deleteHabit(confirmDelete.id);
    } else if (confirmDelete.type === 'task') {
      deleteTask(confirmDelete.id);
    } else if (confirmDelete.type === 'goal') {
      deleteGoal(confirmDelete.id);
    }
    setConfirmDelete(null);
    showToast(lang === 'ru' ? 'Удалено' : 'Deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {lang === 'ru' ? 'Управление' : 'Manage'}
        </h2>
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
          {lang === 'ru' ? 'Привычки' : 'Habits'} ({state.habits.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tasks' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          <ListTodo size={14} />
          {lang === 'ru' ? 'Задачи' : 'Tasks'} ({state.tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'goals' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          <GoalIcon size={14} />
          {lang === 'ru' ? 'Цели' : 'Goals'} ({state.goals.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {activeTab === 'habits' && (
          <>
            {state.habits.length === 0 ? (
              <div className="text-center py-12">
                <Target size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">
                  {lang === 'ru' ? 'Нет привычек' : 'No habits'}
                </p>
              </div>
            ) : (
              state.habits.map(habit => (
                <div key={habit.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{habit.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {habit.startTime || (lang === 'ru' ? 'Без времени' : 'No time')}
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ type: 'habit', id: habit.id })}
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
            {state.tasks.length === 0 ? (
              <div className="text-center py-12">
                <ListTodo size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">
                  {lang === 'ru' ? 'Нет задач' : 'No tasks'}
                </p>
              </div>
            ) : (
              state.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{task.text}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {task.date} {task.time && `• ${task.time}`}
                    </p>
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

        {activeTab === 'goals' && (
          <>
            {state.goals.length === 0 ? (
              <div className="text-center py-12">
                <GoalIcon size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm text-[var(--text-muted)]">
                  {lang === 'ru' ? 'Нет целей' : 'No goals'}
                </p>
              </div>
            ) : (
              state.goals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{goal.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {goal.current} / {goal.target} {goal.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ type: 'goal', id: goal.id })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        message={lang === 'ru' ? 'Удалить этот элемент?' : 'Delete this item?'}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
