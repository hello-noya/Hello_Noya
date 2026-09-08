import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { focusSounds } from '../../utils/focusSounds';
import { pomodoroTimer } from '../../utils/pomodoroTimer';

interface ToolsScreenProps {
  onBack: () => void;
}

export function ToolsScreen({ onBack }: ToolsScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  return (
    <div className="space-y-4">
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
  const { state, updateToolsState } = useApp();
  const [volume, setVolume] = useState(focusSounds.getVolume() * 100);

  const isPlaying = state.toolsState?.lofiPlaying || false;

  useEffect(() => {
    if (isPlaying) {
      focusSounds.play();
    } else {
      focusSounds.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    updateToolsState({ lofiPlaying: !isPlaying });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    focusSounds.setVolume(newVolume / 100);
  };

  return (
    <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <Music size={16} className="text-[var(--accent)]" />
        Lo-fi {lang === 'ru' ? 'плеер' : 'Player'}
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {isPlaying ? 'Lo-fi Study Beats' : (lang === 'ru' ? 'Музыка' : 'Music')}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {isPlaying ? (lang === 'ru' ? 'Сейчас играет' : 'Now playing') : (lang === 'ru' ? 'Нажми чтобы включить' : 'Tap to play')}
          </p>
        </div>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2">
        <Volume2 size={14} className="text-[var(--text-muted)] flex-shrink-0" />
        <div className="flex-1 relative">
          <div className="h-2 rounded-full bg-[var(--hover)] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-150"
              style={{ 
                width: `${volume}%`,
                background: `linear-gradient(90deg, var(--accent) 0%, var(--accent-hover) 100%)`
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs text-[var(--text-muted)] w-8 text-right">{Math.round(volume)}%</span>
      </div>
    </div>
  );
}

function PomodoroTimer({ lang }: { lang: 'ru' | 'en' }) {
  const { state, updateToolsState } = useApp();

  const [timerState, setTimerState] = useState(pomodoroTimer.getState());

  useEffect(() => {
    const unsubscribe = pomodoroTimer.subscribe((timeLeft, isBreak, running) => {
      setTimerState({
        timeLeft,
        isBreak,
        running,
        focusDuration: timerState.focusDuration,
        breakDuration: timerState.breakDuration,
      });

      updateToolsState({
        pomodoroTimeLeft: timeLeft,
        pomodoroIsBreak: isBreak,
        pomodoroRunning: running,
      });
    });

    const focusDuration = state.toolsState?.pomodoroFocusDuration || 25;
    const breakDuration = state.toolsState?.pomodoroBreakDuration || 5;
    pomodoroTimer.setFocusDuration(focusDuration);
    pomodoroTimer.setBreakDuration(breakDuration);

    return () => {
      unsubscribe();
    };
  }, []);

  const totalSeconds = timerState.isBreak ? timerState.breakDuration * 60 : timerState.focusDuration * 60;
  const progress = ((totalSeconds - timerState.timeLeft) / totalSeconds) * 100;

  const handleToggle = () => {
    if (timerState.running) {
      pomodoroTimer.pause();
    } else {
      pomodoroTimer.start();
    }
  };

  const handleReset = () => {
    pomodoroTimer.reset();
  };

  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;

  return (
    <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('pomodoro', lang)}</h3>

      {/* Large timer display */}
      <div className="text-center mb-6">
        <p className="text-6xl font-bold text-[var(--text-primary)] font-mono tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {timerState.isBreak ? t('break', lang) : t('focus', lang)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={handleToggle}
          className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          {timerState.running ? (
            <>
              <Pause size={18} />
              <span>{lang === 'ru' ? 'Пауза' : 'Pause'}</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>{lang === 'ru' ? 'Старт' : 'Start'}</span>
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-xl bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Settings - две строки */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">{t('focus', lang)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDur = Math.max(5, timerState.focusDuration - 5);
                pomodoroTimer.setFocusDuration(newDur);
                updateToolsState({ pomodoroFocusDuration: newDur });
                setTimerState(prev => ({ ...prev, focusDuration: newDur }));
              }}
              className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
            >−</button>
            <span className="font-bold text-[var(--text-primary)] text-lg w-10 text-center">{timerState.focusDuration}</span>
            <button
              onClick={() => {
                const newDur = Math.min(60, timerState.focusDuration + 5);
                pomodoroTimer.setFocusDuration(newDur);
                updateToolsState({ pomodoroFocusDuration: newDur });
                setTimerState(prev => ({ ...prev, focusDuration: newDur }));
              }}
              className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
            >+</button>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">{t('break', lang)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDur = Math.max(5, timerState.breakDuration - 5);
                pomodoroTimer.setBreakDuration(newDur);
                updateToolsState({ pomodoroBreakDuration: newDur });
                setTimerState(prev => ({ ...prev, breakDuration: newDur }));
              }}
              className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
            >−</button>
            <span className="font-bold text-[var(--text-primary)] text-lg w-10 text-center">{timerState.breakDuration}</span>
            <button
              onClick={() => {
                const newDur = Math.min(30, timerState.breakDuration + 5);
                pomodoroTimer.setBreakDuration(newDur);
                updateToolsState({ pomodoroBreakDuration: newDur });
                setTimerState(prev => ({ ...prev, breakDuration: newDur }));
              }}
              className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
            >+</button>
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center mt-3">
        {t('focusTip', lang, { focus: timerState.focusDuration, break: timerState.breakDuration })}
      </p>
    </div>
  );
}
