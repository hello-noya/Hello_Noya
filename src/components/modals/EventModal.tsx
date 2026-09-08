import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { BottomSheet } from '../ui/BottomSheet';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ScheduleEvent, DayOfWeek } from '../../types';
import { createEvent } from '../../utils/storage';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const { state, addEvent, updateEvent, deleteEvent, showToast } = useApp();
  const lang = state.settings.language;

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationEnabled, setDurationEnabled] = useState(true);
  const [durationMode, setDurationMode] = useState<'auto' | 'manual'>('auto');
  const [duration, setDuration] = useState(60);
  const [days, setDays] = useState<DayOfWeek[]>([1]);
  const [note, setNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setDurationMode(event.durationMode);
      setDuration(event.duration);
      setDays(event.days);
      setNote(event.note);
    } else {
      setName('');
      setStartTime('');
      setEndTime('');
      setDurationMode('auto');
      setDuration(60);
      setDays([1]);
      setNote('');
    }
  }, [event, isOpen]);

  const toggleDay = (day: DayOfWeek) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const calculateEndTime = () => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const eh = Math.floor(totalMin / 60) % 24;
    const em = totalMin % 60;
    return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const calculatedEnd = durationMode === 'auto' ? calculateEndTime() : endTime;
    if (event) {
      updateEvent({ ...event, name, startTime, endTime: calculatedEnd, durationMode, duration, days, note });
    } else {
      addEvent(createEvent({ name, startTime, endTime: calculatedEnd, durationMode, duration, days, note }));
    }
    showToast(t('saved', lang));
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={t('configureEvent', lang)}>
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

          {/* Duration mode - compact toggle */}
          <div className="rounded-xl bg-[var(--hover)] p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[var(--text-secondary)]">{t('duration', lang)}</label>
              <button
                onClick={() => setDurationEnabled(!durationEnabled)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                  durationEnabled ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
                }`}
              >
                {durationEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>
            {durationEnabled && (
              <>
                <div className="flex gap-0.5 p-0.5 rounded-md bg-[var(--bg-primary)] mb-2">
                  <button
                    onClick={() => setDurationMode('auto')}
                    className={`flex-1 px-2 py-0.5 rounded text-xs font-medium transition-all ${
                      durationMode === 'auto' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {t('auto', lang)}
                  </button>
                  <button
                    onClick={() => setDurationMode('manual')}
                    className={`flex-1 px-2 py-0.5 rounded text-xs font-medium transition-all ${
                      durationMode === 'manual' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {t('manual', lang)}
                  </button>
                </div>
                {durationMode === 'manual' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={1}
                      className="w-20 px-2 py-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-xs text-center focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <span className="text-xs text-[var(--text-muted)]">{t('minutes', lang)}</span>
                  </div>
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

          {/* Note */}
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('note', lang)}</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('notePlaceholder', lang)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {event && (
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
