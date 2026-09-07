import React, { useState } from 'react';
import { ArrowLeft, Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface ManageScreenProps {
  onBack: () => void;
}

export function ManageScreen({ onBack }: ManageScreenProps) {
  const { state, deleteHabit, deleteTask } = useApp();
  const lang = state.settings.language;
  const [activeTab, setActiveTab] = useState<'habits' | 'tasks' | 'completed'>('habits');
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  const completedTasks = state.tasks.filter(t => t.completed);
  const activeTasks = state.tasks.filter(t => !t.completed);

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'habit') deleteHabit(confirmDelete.id);
    if (confirmDelete.type === 'task') deleteTask(confirmDelete.id);
    setConfirmDelete(null);
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
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'habits' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          {t('allHabits', lang)}
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'tasks' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          {t('allTasks', lang)}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'completed' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          {t('completed', lang)}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {activeTab === 'habits' && (
          state.habits.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('noItems', lang)}</p>
          ) : (
            state.habits.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                <span className="text-lg">{h.icon}</span>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{h.name}</span>
                <button
                  onClick={() => setConfirmDelete({ type: 'habit', id: h.id })}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )
        )}

        {activeTab === 'tasks' && (
          activeTasks.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('noItems', lang)}</p>
          ) : (
            activeTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                <span className="flex-1 text-sm text-[var(--text-primary)]">{task.text}</span>
                <span className="text-xs text-[var(--text-muted)]">{task.date}</span>
                <button
                  onClick={() => setConfirmDelete({ type: 'task', id: task.id })}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )
        )}

        {activeTab === 'completed' && (
          completedTasks.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('noItems', lang)}</p>
          ) : (
            completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
                <span className="flex-1 text-sm text-[var(--text-muted)] line-through">{task.text}</span>
                <span className="text-xs text-[var(--text-muted)]">{task.date}</span>
                <button
                  onClick={() => setConfirmDelete({ type: 'task', id: task.id })}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )
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
