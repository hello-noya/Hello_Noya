import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { BottomSheet } from '../ui/BottomSheet';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Habit, DayOfWeek } from '../../types';
import { createHabit, HABIT_ICONS } from '../../utils/storage';
import { renderIcon } from '../../utils/icons';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}

export function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const { state, addHabit, updateHabit, deleteHabit, showToast } = useApp();
  const lang = state.settings.language;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('water');
  const [icon2, setIcon2] = useState('');
  const [startTime, setStartTime] = useState('');
  const [days, setDays] = useState<DayOfWeek[]>([1, 2, 3, 4, 5]);
  const [note, setNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setIcon(habit.icon);
      setIcon2(habit.icon2 || '');
      setStartTime(habit.startTime);
      setDays(habit.days);
      setNote(habit.note || '');
    } else {
      setName('');
      setIcon('water');
      setIcon2('');
      setStartTime('');
      setDays([1, 2, 3, 4, 5]);
      setNote('');
    }
  }, [habit, isOpen]);

  const toggleDay = (day: DayOfWeek) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (habit) {
      updateHabit({ ...habit, name, icon, icon2: icon2 || undefined, startTime, days, note: note || undefined });
    } else {
      addHabit(createHabit({ name, icon, icon2: icon2 || undefined, startTime, days, note: note || undefined }));
    }
    showToast(t('saved', lang));
    onClose();
  };

  const handleDelete = () => {
    if (habit) {
      deleteHabit(habit.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={t('configureHabit', lang)}>
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

          {/* Start time */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('startTime', lang)}</label>
            <div className="relative">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              {startTime && (
                <button
                  onClick={() => setStartTime('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-2 block">{t('daysOfWeek', lang)}</label>
            <div className="flex gap-1">
              {dayKeys.map((key, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx as DayOfWeek)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    days.includes(idx as DayOfWeek)
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--hover)] text-[var(--text-muted)]'
                  }`}
                >
                  {t(key, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Icons - 2 icons */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-2 block">{t('icon', lang)} (1-2)</label>
            <div className="grid grid-cols-5 gap-2">
              {HABIT_ICONS.map((iconKey) => (
                <button
                  key={iconKey}
                  onClick={() => {
                    if (!icon || icon === iconKey) {
                      setIcon(iconKey);
                    } else if (!icon2) {
                      setIcon2(iconKey);
                    } else {
                      setIcon(iconKey);
                      setIcon2('');
                    }
                  }}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all relative ${
                    icon === iconKey || icon2 === iconKey
                      ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]'
                      : 'bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                  title={t(`icon_${iconKey}`, lang)}
                >
                  {renderIcon(iconKey, 20, icon === iconKey || icon2 === iconKey ? 'var(--accent)' : 'var(--text-secondary)')}
                  {icon === iconKey && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[8px] flex items-center justify-center font-bold">1</span>
                  )}
                  {icon2 === iconKey && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[8px] flex items-center justify-center font-bold">2</span>
                  )}
                </button>
              ))}
            </div>
            {(icon || icon2) && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span>Выбрано:</span>
                {icon && <span className="px-2 py-0.5 rounded bg-[var(--hover)]">1: {t(`icon_${icon}`, lang)}</span>}
                {icon2 && <span className="px-2 py-0.5 rounded bg-[var(--hover)]">2: {t(`icon_${icon2}`, lang)}</span>}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('note', lang)}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Дополнительная информация..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {habit && (
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
