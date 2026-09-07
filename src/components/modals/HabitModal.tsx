import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { BottomSheet } from '../ui/BottomSheet';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Habit, DayOfWeek } from '../../types';
import { createHabit, HABIT_ICONS } from '../../utils/storage';
import { HabitIcons, renderIcon } from '../../utils/icons';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null; // null = creating new
}

export function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const { state, addHabit, updateHabit, deleteHabit, showToast } = useApp();
  const lang = state.settings.language;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('water');
  const [startTime, setStartTime] = useState('');
  const [durationEnabled, setDurationEnabled] = useState(true);
  const [durationMode, setDurationMode] = useState<'auto' | 'manual'>('auto');
  const [duration, setDuration] = useState(60);
  const [days, setDays] = useState<DayOfWeek[]>([1, 2, 3, 4, 5]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setIcon(habit.icon);
      setStartTime(habit.startTime);
      setDurationMode(habit.durationMode);
      setDuration(habit.duration);
      setDays(habit.days);
    } else {
      setName('');
      setIcon('water');
      setStartTime('');
      setDurationMode('auto');
      setDuration(60);
      setDays([1, 2, 3, 4, 5]);
    }
  }, [habit, isOpen]);

  const toggleDay = (day: DayOfWeek) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const finalDuration = durationEnabled ? duration : 0;
    if (habit) {
      updateHabit({ ...habit, name, icon, startTime, durationMode, duration: finalDuration, days });
    } else {
      addHabit(createHabit({ name, icon, startTime, durationMode, duration: finalDuration, days }));
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

          {/* Duration mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-[var(--text-secondary)]">{t('duration', lang)}</label>
              <button
                onClick={() => setDurationEnabled(!durationEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  durationEnabled ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-muted)]'
                }`}
              >
                {durationEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>
            {durationEnabled && (
              <>
                <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--hover)] mb-2">
                  <button
                    onClick={() => setDurationMode('auto')}
                    className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      durationMode === 'auto' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {t('auto', lang)}
                  </button>
                  <button
                    onClick={() => setDurationMode('manual')}
                    className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      durationMode === 'manual' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {t('manual', lang)}
                  </button>
                </div>
                {durationMode === 'auto' ? (
                  <p className="text-xs text-[var(--text-muted)]">{t('defaultDuration', lang, { min: 60 })}</p>
                ) : (
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                )}
              </>
            )}
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

          {/* Icon */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-2 block">{t('icon', lang)}</label>
            <div className="grid grid-cols-6 gap-2">
              {HABIT_ICONS.map((iconKey) => (
                <button
                  key={iconKey}
                  onClick={() => setIcon(iconKey)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                    icon === iconKey
                      ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]'
                      : 'bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                  title={t(`icon_${iconKey}`, lang)}
                >
                  {renderIcon(iconKey, 20, icon === iconKey ? 'var(--accent)' : 'var(--text-secondary)')}
                </button>
              ))}
            </div>
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
