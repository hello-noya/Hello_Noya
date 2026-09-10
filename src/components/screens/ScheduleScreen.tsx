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
        <div className="p-8 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 bg-[var(--accent)]/5 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
            <Calendar size={20} className="text-[var(--accent)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
            {lang === 'ru' ? 'Сегодня идеальный день, чтобы...' : "Today is the perfect day to..."}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {lang === 'ru' ? 'Начать с чего-то нового' : 'Start something new'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => {
            const active = isNow(event);
            return (
              <div
                key={event.id}
                onClick={() => onEditEvent(event)}
                className={`relative flex gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-all hover:shadow-md ${
                  active 
                    ? 'border-[var(--accent)] shadow-sm bg-gradient-to-br from-[var(--accent)]/5 to-transparent' 
                    : 'border-[var(--border)] hover:border-[var(--accent)]/30'
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                  <Calendar size={24} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Time - first line */}
                  <p className={`text-base font-bold ${active ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {event.startTime}
                  </p>
                  {/* Time - second line */}
                  <p className="text-sm text-[var(--text-muted)]">
                    {lang === 'ru' ? 'до' : 'until'} {event.endTime}
                  </p>
                  {/* Name */}
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{event.name}</p>
                  {/* Note */}
                  {event.note && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{event.note}</p>
                  )}
                  {active && (
                    <span className="text-[10px] font-semibold text-[var(--accent)] mt-1 inline-block">● {t('now', lang)}</span>
                  )}
                </div>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(event.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors self-start"
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
