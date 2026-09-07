import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface ToolsScreenProps {
  onBack: () => void;
}

export function ToolsScreen({ onBack }: ToolsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('tools', lang)}</h2>
      </div>

      <LoFiPlayer lang={lang} />
      <PomodoroTimer lang={lang} />
    </div>
  );
}

function LoFiPlayer({ lang }: { lang: 'ru' | 'en' }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  return (
    <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Music size={16} className="text-[var(--accent)]" />
        {t('lofiPlayer', lang)}
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
        >
          {playing ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {playing ? 'Lo-fi Chill Beats' : '—'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t('nowPlaying', lang)}: {playing ? 'Lo-fi Chill Beats' : '—'}
          </p>
          {/* Progress */}
          <div className="h-1 rounded-full bg-[var(--hover)] mt-2 overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <Volume2 size={16} className="text-[var(--text-muted)]" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--hover)] accent-[var(--accent)]"
        />
        <span className="text-xs text-[var(--text-muted)] w-8 text-right">{volume}%</span>
      </div>
    </div>
  );
}

function PomodoroTimer({ lang }: { lang: 'ru' | 'en' }) {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            // Switch phase
            if (!isBreak) {
              setIsBreak(true);
              return breakDuration * 60;
            } else {
              setIsBreak(false);
              setRunning(false);
              return focusDuration * 60;
            }
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, isBreak, focusDuration, breakDuration]);

  const handleReset = () => {
    setRunning(false);
    setIsBreak(false);
    setTimeLeft(focusDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t('pomodoro', lang)}</h3>

      {/* Timer display */}
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-[var(--text-primary)] font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {isBreak ? t('break', lang) : t('focus', lang)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[var(--hover)] overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isBreak ? 'bg-green-400' : 'bg-[var(--accent)]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          {running ? t('pause', lang) : t('start2', lang)}
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Duration settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{t('focus', lang)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setFocusDuration(d => Math.max(5, d - 5)); if (!running && !isBreak) setTimeLeft(Math.max(5, focusDuration - 5) * 60); }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >−</button>
            <span className="text-sm font-medium text-[var(--text-primary)] w-12 text-center">{focusDuration} {t('minutes', lang)}</span>
            <button
              onClick={() => { setFocusDuration(d => Math.min(60, d + 5)); if (!running && !isBreak) setTimeLeft(Math.min(60, focusDuration + 5) * 60); }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >+</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{t('break', lang)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setBreakDuration(d => Math.max(1, d - 1)); if (!running && isBreak) setTimeLeft(Math.max(1, breakDuration - 1) * 60); }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >−</button>
            <span className="text-sm font-medium text-[var(--text-primary)] w-12 text-center">{breakDuration} {t('minutes', lang)}</span>
            <button
              onClick={() => { setBreakDuration(d => Math.min(30, d + 1)); if (!running && isBreak) setTimeLeft(Math.min(30, breakDuration + 1) * 60); }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >+</button>
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs text-[var(--text-muted)] text-center mt-4">
        {t('focusTip', lang, { focus: focusDuration, break: breakDuration })}
      </p>
    </div>
  );
}
