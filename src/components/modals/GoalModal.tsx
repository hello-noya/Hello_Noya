import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { BottomSheet } from '../ui/BottomSheet';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Goal } from '../../types';
import { createGoal } from '../../utils/storage';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const { state, addGoal, updateGoal, deleteGoal, showToast } = useApp();
  const lang = state.settings.language;

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setUnit(goal.unit);
      setTarget(goal.target);
    } else {
      setName('');
      setUnit('');
      setTarget(10);
    }
  }, [goal, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (goal) {
      updateGoal({ ...goal, name, unit, target });
    } else {
      addGoal(createGoal({ name, unit, target }));
    }
    showToast(t('saved', lang));
    onClose();
  };

  const handleDelete = () => {
    if (goal) {
      deleteGoal(goal.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={t('configureGoal', lang)}>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('habitName', lang)}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('unit', lang)}</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder={t('unitPlaceholder', lang)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Target */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('quantity', lang)}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTarget(Math.max(1, target - 1))}
                className="w-10 h-10 rounded-xl bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                min={1}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-center text-lg font-bold focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                onClick={() => setTarget(target + 1)}
                className="w-10 h-10 rounded-xl bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {goal && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                {t('delete', lang)}
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium"
            >
              {t('cancel', lang)}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('save', lang)}
            </button>
          </div>
        </div>
      </BottomSheet>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message={t('deleteConfirm', lang)}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
