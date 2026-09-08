import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2, Droplets, Flame, Coffee, Trees } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { focusSounds, SoundType } from '../../utils/focusSounds';
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

      <FocusSoundsPlayer lang={lang} />
      <PomodoroTimer lang={lang} />
    </div>
  );
}

function FocusSoundsPlayer({ lang }: { lang: 'ru' | 'en' }) {
  const { state, updateToolsState } = useApp();
  const [volume, setVolume] = useState(focusSounds.getVolume() * 100);
  const [currentSound, setCurrentSound] = useState<SoundType>('lofi');

  const isPlaying = state.toolsState?.lofiPlaying || false;

  useEffect(() => {
    if (isPlaying) {
      focusSounds.play(currentSound);
    } else {
      focusSounds.pause();
    }
  }, [isPlaying, currentSound]);

  const togglePlay = () => {
    updateToolsState({ lofiPlaying: !isPlaying });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    focusSounds.setVolume(newVolume / 100);
  };

  const sounds: { id: SoundType; icon: React.ReactNode; label: string }[] = [
    { id: 'lofi', icon: <Music size={16} />, label: 'Lo-fi' },
    { id: 'rain', icon: <Droplets size={16} />, label: lang === 'ru' ? 'Дождь' : 'Rain' },
    { id: 'fire', icon: <Flame size={16} />, label: lang === 'ru' ? 'Костёр' : 'Fire' },
    { id: 'cafe', icon: <Coffee size={16} />, label: lang === 'ru' ? 'Кафе' : 'Cafe' },
    { id: 'nature', icon: <Trees size={16} />, label: lang === 'ru' ? 'Природа' : 'Nature' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <Music size={16} className="text-[var(--accent)]" />
        {lang === 'ru' ? 'Звуки для фокуса' : 'Focus Sounds'}
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
            {sounds.find(s => s.id === currentSound)?.label || 'Lo-fi'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {isPlaying ? (lang === 'ru' ? 'Сейчас играет' : 'Now playing') : '—'}
          </p>
        </div>
      </div>

      {/* Sound selection */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {sounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => setCurrentSound(sound.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentSound === sound.id
                ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]'
                : 'bg-[var(--hover)] border border-transparent hover:border-[var(--accent)]/30'
            }`}
          >
            <div className={currentSound === sound.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}>
              {sound.icon}
            </div>
            <span className="text-[10px] font-medium">{sound.label}</span>
          </button>
        ))}
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Circular progress visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    const totalSeconds = timerState.isBreak ? timerState.breakDuration * 60 : timerState.focusDuration * 60;
    const progress = (totalSeconds - timerState.timeLeft) / totalSeconds;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--hover').trim() || '#e5e7eb';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress circle
    ctx.beginPath();
    ctx.arc(center, center, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress);
    ctx.strokeStyle = timerState.isBreak 
      ? '#10b981' 
      : getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6b9d';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [timerState.timeLeft, timerState.isBreak]);

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

      {/* Circular visualization */}
      <div className="relative flex items-center justify-center mb-4">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="absolute"
        />
        <div className="relative z-10 text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {timerState.isBreak ? t('break', lang) : t('focus', lang)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={handleToggle}
          className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
        >
          {timerState.running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Settings */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)]">{t('focus', lang)}:</span>
          <button
            onClick={() => {
              const newDur = Math.max(5, timerState.focusDuration - 5);
              pomodoroTimer.setFocusDuration(newDur);
              updateToolsState({ pomodoroFocusDuration: newDur });
              setTimerState(prev => ({ ...prev, focusDuration: newDur }));
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >−</button>
          <span className="font-medium text-[var(--text-primary)]">{timerState.focusDuration}</span>
          <button
            onClick={() => {
              const newDur = Math.min(60, timerState.focusDuration + 5);
              pomodoroTimer.setFocusDuration(newDur);
              updateToolsState({ pomodoroFocusDuration: newDur });
              setTimerState(prev => ({ ...prev, focusDuration: newDur }));
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >+</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)]">{t('break', lang)}:</span>
          <button
            onClick={() => {
              const newDur = Math.max(1, timerState.breakDuration - 1);
              pomodoroTimer.setBreakDuration(newDur);
              updateToolsState({ pomodoroBreakDuration: newDur });
              setTimerState(prev => ({ ...prev, breakDuration: newDur }));
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >−</button>
          <span className="font-medium text-[var(--text-primary)]">{timerState.breakDuration}</span>
          <button
            onClick={() => {
              const newDur = Math.min(30, timerState.breakDuration + 1);
              pomodoroTimer.setBreakDuration(newDur);
              updateToolsState({ pomodoroBreakDuration: newDur });
              setTimerState(prev => ({ ...prev, breakDuration: newDur }));
            }}
            className="w-6 h-6 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
          >+</button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center mt-3">
        {t('focusTip', lang, { focus: timerState.focusDuration, break: timerState.breakDuration })}
      </p>
    </div>
  );
}
