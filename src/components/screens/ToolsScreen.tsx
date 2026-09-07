import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { lofiAudio } from '../../utils/lofiAudio';

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
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(lofiAudio.getVolume() * 100);
  const [trackName, setTrackName] = useState(lofiAudio.getCurrentTrackName());

  const isPlaying = state.toolsState?.lofiPlaying || false;

  // Управление аудио через глобальный модуль
  useEffect(() => {
    if (isPlaying) {
      lofiAudio.play();
      lofiAudio.onProgress((p: number) => setProgress(p));
      setTrackName(lofiAudio.getCurrentTrackName());
    } else {
      lofiAudio.pause();
      setProgress(0);
    }
    // НЕ останавливаем при unmount — музыка играет глобально
  }, [isPlaying]);

  // Обновляем название трека периодически
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTrackName(lofiAudio.getCurrentTrackName());
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    updateToolsState({ lofiPlaying: !isPlaying });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    lofiAudio.setVolume(newVolume / 100);
  };

  const handleNextTrack = () => {
    lofiAudio.nextTrack();
    setTrackName(lofiAudio.getCurrentTrackName());
    setProgress(0);
  };

  const handlePrevTrack = () => {
    lofiAudio.previousTrack();
    setTrackName(lofiAudio.getCurrentTrackName());
    setProgress(0);
  };

  return (
    <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <Music size={16} className="text-[var(--accent)]" />
        {t('lofiPlayer', lang)}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {isPlaying ? trackName : '—'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t('nowPlaying', lang)}: {isPlaying ? trackName : '—'}
          </p>
          <div className="h-1 rounded-full bg-[var(--hover)] mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Track controls */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={handlePrevTrack}
          disabled={!isPlaying}
          className="w-8 h-8 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors disabled:opacity-30"
        >
          <SkipBack size={14} />
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {lofiAudio.getTrackCount()} треков
        </span>
        <button
          onClick={handleNextTrack}
          disabled={!isPlaying}
          className="w-8 h-8 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors disabled:opacity-30"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2">
        <Volume2 size={14} className="text-[var(--text-muted)] flex-shrink-0" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--hover)] accent-[var(--accent)] cursor-pointer"
        />
        <span className="text-xs text-[var(--text-muted)] w-8 text-right">{Math.round(volume)}%</span>
      </div>
    </div>
  );
}

function PomodoroTimer({ lang }: { lang: 'ru' | 'en' }) {
  const { state, updateToolsState } = useApp();

  const focusDuration = state.toolsState?.pomodoroFocusDuration || 25;
  const breakDuration = state.toolsState?.pomodoroBreakDuration || 5;
  const isBreak = state.toolsState?.pomodoroIsBreak || false;
  const running = state.toolsState?.pomodoroRunning || false;

  const [timeLeft, setTimeLeft] = useState(
    state.toolsState?.pomodoroTimeLeft || focusDuration * 60
  );
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Timer logic
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (!isBreak) {
              updateToolsState({ pomodoroIsBreak: true, pomodoroTimeLeft: breakDuration * 60 });
              return breakDuration * 60;
            } else {
              updateToolsState({ pomodoroIsBreak: false, pomodoroRunning: false, pomodoroTimeLeft: focusDuration * 60 });
              return focusDuration * 60;
            }
          }
          const newVal = prev - 1;
          updateToolsState({ pomodoroTimeLeft: newVal });
          return newVal;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, isBreak]);

  useEffect(() => {
    setTimeLeft(state.toolsState?.pomodoroTimeLeft || focusDuration * 60);
  }, [state.toolsState?.pomodoroIsBreak]);

  const handleToggle = () => {
    if (!running && timeLeft === 0) {
      const newTime = isBreak ? breakDuration * 60 : focusDuration * 60;
      setTimeLeft(newTime);
      updateToolsState({ pomodoroTimeLeft: newTime, pomodoroRunning: true });
    } else {
      updateToolsState({ pomodoroRunning: !running });
    }
  };

  const handleReset = () => {
    updateToolsState({
      pomodoroRunning: false,
      pomodoroIsBreak: false,
      pomodoroTimeLeft: focusDuration * 60,
    });
    setTimeLeft(focusDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('pomodoro', lang)}</h3>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {isBreak ? t('break', lang) : t('focus', lang)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
          >
            {running ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-[var(--hover)] overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isBreak ? 'bg-green-400' : 'bg-[var(--accent)]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)]">{t('focus', lang)}:</span>
          <button
            onClick={() => {
              const newDur = Math.max(5, focusDuration - 5);
              updateToolsState({ pomodoroFocusDuration: newDur });
              if (!running && !isBreak) {
                setTimeLeft(newDur * 60);
                updateToolsState({ pomodoroFocusDuration: newDur, pomodoroTimeLeft: newDur * 60 });
              }
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >−</button>
          <span className="font-medium text-[var(--text-primary)]">{focusDuration}</span>
          <button
            onClick={() => {
              const newDur = Math.min(60, focusDuration + 5);
              updateToolsState({ pomodoroFocusDuration: newDur });
              if (!running && !isBreak) {
                setTimeLeft(newDur * 60);
                updateToolsState({ pomodoroFocusDuration: newDur, pomodoroTimeLeft: newDur * 60 });
              }
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >+</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)]">{t('break', lang)}:</span>
          <button
            onClick={() => {
              const newDur = Math.max(1, breakDuration - 1);
              updateToolsState({ pomodoroBreakDuration: newDur });
              if (!running && isBreak) {
                setTimeLeft(newDur * 60);
                updateToolsState({ pomodoroBreakDuration: newDur, pomodoroTimeLeft: newDur * 60 });
              }
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >−</button>
          <span className="font-medium text-[var(--text-primary)]">{breakDuration}</span>
          <button
            onClick={() => {
              const newDur = Math.min(30, breakDuration + 1);
              updateToolsState({ pomodoroBreakDuration: newDur });
              if (!running && isBreak) {
                setTimeLeft(newDur * 60);
                updateToolsState({ pomodoroBreakDuration: newDur, pomodoroTimeLeft: newDur * 60 });
              }
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >+</button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center mt-2">
        {t('focusTip', lang, { focus: focusDuration, break: breakDuration })}
      </p>
    </div>
  );
}
