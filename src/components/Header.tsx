import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Music, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../utils/i18n';

interface HeaderProps {
  onToolsClick?: (tool: 'lofi' | 'pomodoro') => void;
}

export function Header({ onToolsClick }: HeaderProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = formatDate(time, lang);

  const lofiPlaying = state.toolsState?.lofiPlaying || false;
  const pomodoroRunning = state.toolsState?.pomodoroRunning || false;
  const pomodoroTimeLeft = state.toolsState?.pomodoroTimeLeft || 0;
  const pomodoroMinutes = Math.floor(pomodoroTimeLeft / 60);
  const pomodoroSeconds = pomodoroTimeLeft % 60;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[var(--text-primary)] text-lg">{t('appName', lang)}</span>
            <Sparkles size={14} className="text-[var(--accent)] animate-pulse" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] capitalize">{dateStr}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Lo-fi indicator */}
          {lofiPlaying && (
            <button
              onClick={() => onToolsClick?.('lofi')}
              className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--accent)]/30 rounded-full px-3 py-1.5 hover:bg-[var(--hover)] transition-colors"
            >
              <Music size={14} className="text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Lo-fi</span>
            </button>
          )}

          {/* Pomodoro indicator */}
          {pomodoroRunning && (
            <button
              onClick={() => onToolsClick?.('pomodoro')}
              className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--accent)]/30 rounded-full px-3 py-1.5 hover:bg-[var(--hover)] transition-colors"
            >
              <Timer size={14} className="text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {pomodoroMinutes}:{String(pomodoroSeconds).padStart(2, '0')}
              </span>
            </button>
          )}

          {/* Time badge */}
          <div className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-full px-3 py-1.5">
            <Clock size={14} className="text-[var(--text-secondary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
