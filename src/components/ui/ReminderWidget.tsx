import React from 'react';
import { Bell, BellOff } from 'lucide-react';

interface ReminderWidgetProps {
  enabled: boolean;
  time: number;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (time: number) => void;
  lang: 'ru' | 'en';
}

export function ReminderWidget({ enabled, time, onToggle, onTimeChange, lang }: ReminderWidgetProps) {
  const timeOptions = [5, 15, 30, 60];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
      <Bell size={14} className="text-[var(--accent)] flex-shrink-0" />
      <div className="flex-1 flex items-center gap-1">
        {timeOptions.map(option => (
          <button
            key={option}
            onClick={() => onTimeChange(option)}
            disabled={!enabled}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
              !enabled
                ? 'bg-[var(--hover)] text-[var(--text-muted)] cursor-not-allowed'
                : time === option
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--hover)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        className={`p-1 rounded transition-all ${
          enabled
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--hover)] text-[var(--text-muted)]'
        }`}
      >
        {enabled ? <Bell size={12} /> : <BellOff size={12} />}
      </button>
    </div>
  );
}
