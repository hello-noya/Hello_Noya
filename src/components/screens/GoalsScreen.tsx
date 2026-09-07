import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { Goal } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import confetti from 'canvas-confetti';

interface GoalsScreenProps {
  onEditGoal: (goal: Goal) => void;
  onAddGoal: () => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsScreen({ onEditGoal, onAddGoal, onDeleteGoal }: GoalsScreenProps) {
  const { state, incrementGoal, decrementGoal } = useApp();
  const lang = state.settings.language;
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const prevGoalsRef = useRef<Map<string, number>>(new Map());

  // Track goal completions for confetti
  useEffect(() => {
    state.goals.forEach(goal => {
      const prev = prevGoalsRef.current.get(goal.id);
      if (prev !== undefined && goal.current >= goal.target && prev < goal.target) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#3dd9b0', '#6366f1', '#f59e0b'],
        });
      }
      prevGoalsRef.current.set(goal.id, goal.current);
    });
  }, [state.goals]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{t('goalsTitle', lang)}</h2>
        <button
          onClick={onAddGoal}
          className="text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
        >
          {t('addGoal', lang)}
        </button>
      </div>

      {state.goals.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('noItems', lang)}</p>
      ) : (
        <div className="space-y-3">
          {state.goals.map((goal) => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            const isAchieved = goal.current >= goal.target;

            return (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className="text-sm font-medium text-[var(--text-primary)] cursor-pointer flex-1 truncate"
                    onClick={() => onEditGoal(goal)}
                  >
                    {goal.name}
                  </p>
                  <button
                    onClick={() => setDeleteConfirmId(goal.id)}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 rounded-full bg-[var(--hover)] overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAchieved ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]/70'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {goal.current} {t('step', lang)} {goal.unit ? `/ ${goal.target} ${goal.unit}` : `/ ${goal.target}`}
                    {isAchieved && <span className="ml-2 text-[var(--accent)] font-medium">{t('achieved', lang)}</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementGoal(goal.id)}
                      className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => incrementGoal(goal.id)}
                      disabled={isAchieved}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isAchieved
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--hover)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/20'
                      }`}
                    >
                      {isAchieved ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        message={t('deleteConfirm', lang)}
        onConfirm={() => {
          if (deleteConfirmId) onDeleteGoal(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
