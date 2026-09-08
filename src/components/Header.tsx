import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Music, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../utils/i18n';
import { pomodoroTimer } from '../utils/pomodoroTimer';

interface HeaderProps {
  onToolsClick: (tool: 'lofi' | 'pomodoro') => void;
}

export function Header({ onToolsClick }: HeaderProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [time, setTime] = useState(new Date());
  const [pomodoroTime, setPomodoroTime] = useState(0);
  const [pomodoroIsBreak, setPomodoroIsBreak] = useState(false);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  const lofiPlaying = state.toolsState?.lofiPlaying || false;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Подписка на глобальный таймер помодоро
  useEffect(() => {
    pomodoroTimer.onTick((timeLeft, isBreak, running) => {
      setPomodoroTime(timeLeft);
      setPomodoroIsBreak(isBreak);
      setPomodoroRunning(running);
    });

    // Инициализация
    const initialState = pomodoroTimer.getState();
    setPomodoroTime(initialState.timeLeft);
    setPomodoroIsBreak(initialState.isBreak);
    setPomodoroRunning(initialState.running);
  }, []);

  const timeStr = time.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = formatDate(time, lang);

  const pomodoroMinutes = Math.floor(pomodoroTime / 60);
  const pomodoroSeconds = pomodoroTime % 60;
  const pomodoroDisplay = `${String(pomodoroMinutes).padStart(2, '0')}:${String(pomodoroSeconds).padStart(2, '0')}`;

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
          {/* Lo-fi badge */}
          {lofiPlaying && (
            <button
              onClick={() => onToolsClick('lofi')}
              className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-full px-3 py-1.5 hover:border-[var(--accent)]/50 transition-colors"
            >
              <Music size={14} className="text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Lo-fi</span>
            </button>
          )}

          {/* Pomodoro badge */}
          {pomodoroRunning && (
            <button
              onClick={() => onToolsClick('pomodoro')}
              className={`flex items-center gap-1.5 bg-[var(--card-bg)] border rounded-full px-3 py-1.5 hover:border-[var(--accent)]/50 transition-colors ${
                pomodoroIsBreak ? 'border-green-300' : 'border-[var(--border)]'
              }`}
            >
              <Timer size={14} className={pomodoroIsBreak ? 'text-green-400' : 'text-[var(--accent)]'} />
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{pomodoroDisplay}</span>
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
