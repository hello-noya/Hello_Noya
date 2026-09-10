import React, { useState, useEffect } from 'react';
import { Focus, Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { pomodoroTimer } from '../../utils/pomodoroTimer';

interface FocusModeProps {
  onBack: () => void;
}

export function FocusMode({ onBack }: FocusModeProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Переключение между фокусом и перерывом
            if (!isBreak) {
              setIsBreak(true);
              return breakDuration * 60;
            } else {
              setIsBreak(false);
              return focusDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, focusDuration, breakDuration]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col">
      <div className="max-w-[420px] mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Фокус-режим' : 'Focus Mode'}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Timer display */}
          <div className="text-center">
            <div className="text-7xl font-bold text-[var(--text-primary)] font-mono mb-2">
              {formatTime(timeLeft)}
            </div>
            <p className="text-lg text-[var(--text-muted)]">
              {isBreak 
                ? (lang === 'ru' ? 'Перерыв' : 'Break') 
                : (lang === 'ru' ? 'Фокус' : 'Focus')}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleRunning}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button
              onClick={reset}
              className="w-14 h-14 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          {/* Duration settings */}
          <div className="w-full max-w-sm space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                {lang === 'ru' ? 'Фокус (минуты)' : 'Focus (minutes)'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFocusDuration(Math.max(5, focusDuration - 5))}
                  className="w-10 h-10 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Math.max(5, Math.min(60, Number(e.target.value))))}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center text-lg font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  min="5"
                  max="60"
                />
                <button
                  onClick={() => setFocusDuration(Math.min(60, focusDuration + 5))}
                  className="w-10 h-10 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
              <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                {lang === 'ru' ? 'Перерыв (минуты)' : 'Break (minutes)'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBreakDuration(Math.max(1, breakDuration - 1))}
                  className="w-10 h-10 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Math.max(1, Math.min(30, Number(e.target.value))))}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center text-lg font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  min="1"
                  max="30"
                />
                <button
                  onClick={() => setBreakDuration(Math.min(30, breakDuration + 1))}
                  className="w-10 h-10 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <p className="text-sm text-[var(--text-muted)] text-center max-w-sm">
            {lang === 'ru'
              ? 'Фокус-режим помогает концентрироваться на задачах. После фокуса следует перерыв.'
              : 'Focus mode helps you concentrate on tasks. After focus comes a break.'}
          </p>
        </div>
      </div>
    </div>
  );
}
