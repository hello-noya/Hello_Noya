import React, { useState, useMemo } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ScheduleEvent, DayOfWeek } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface ScheduleScreenProps {
  onEditEvent: (event: ScheduleEvent) => void;
  onAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
}

export function ScheduleScreen({ onEditEvent, onAddEvent, onDeleteEvent }: ScheduleScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1); // Monday
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const dayLabels = [
    { key: 'sun', idx: 0 },
    { key: 'mon', idx: 1 },
    { key: 'tue', idx: 2 },
    { key: 'wed', idx: 3 },
    { key: 'thu', idx: 4 },
    { key: 'fri', idx: 5 },
    { key: 'sat', idx: 6 },
  ];

  // Filter events for selected day
  const dayEvents = useMemo(() => {
    return state.events
      .filter(e => e.days.includes(selectedDay))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [state.events, selectedDay]);

  // Count events per day
  const eventCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    state.events.forEach(e => {
      e.days.forEach(d => {
        counts[d] = (counts[d] || 0) + 1;
      });
    });
    return counts;
  }, [state.events]);

  // Check if event is happening now
  const isNow = (event: ScheduleEvent) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = event.startTime.split(':').map(Number);
    const [eh, em] = event.endTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const today = new Date().getDay();
    return event.days.includes(today as DayOfWeek) && currentMinutes >= startMin && currentMinutes < endMin;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between relative">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Calendar size={20} className="text-[var(--accent)]" />
          {t('schedule', lang)}
        </h3>
        <button
          onClick={onAddEvent}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          <span>{t('addEvent', lang).replace('+ ', '')}</span>
        </button>
        {/* Декоративный элемент */}
        <div className="absolute -top-1 -right-1 opacity-20">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-twinkle" />
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1">
        {dayLabels.map(({ key, idx }) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx as DayOfWeek)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
              selectedDay === idx
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            <span className="text-[10px] font-medium uppercase">{t(key, lang)}</span>
            <span className="text-xs font-bold mt-0.5">
              {eventCounts[idx] || '—'}
            </span>
          </button>
        ))}
      </div>

      {/* Events list */}
      {dayEvents.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('noItems', lang)}</p>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((event) => {
            const active = isNow(event);
            return (
              <div
                key={event.id}
                onClick={() => onEditEvent(event)}
                className={`flex gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-colors ${
                  active ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--accent)]/30'
                }`}
              >
                <div className="flex flex-col items-end min-w-[50px]">
                  <span className="text-lg font-bold text-[var(--text-primary)]">{event.startTime}</span>
                  <span className="text-xs text-[var(--text-muted)]">–{event.endTime}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{event.duration} {t('minutes', lang)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{event.name}</p>
                  {event.note && (
                    <p className="text-xs text-[var(--text-secondary)] italic truncate">{event.note}</p>
                  )}
                  {active && (
                    <span className="text-xs font-semibold text-[var(--accent)] mt-0.5">● {t('now', lang)}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(event.id);
                  }}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors self-start"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        message={t('deleteConfirm', lang)}
        onConfirm={() => {
          if (deleteConfirmId) onDeleteEvent(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
