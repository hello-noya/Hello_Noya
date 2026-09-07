import React, { useEffect, useRef, useCallback } from 'react';
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gains: GainNode[]; oscillators: OscillatorNode[]; noise?: AudioBufferSourceNode; noiseGain?: GainNode; filter?: BiquadFilterNode }>({ gains: [], oscillators: [] });
  const intervalRef = useRef<number | null>(null);
  const [progress, setProgress] = React.useState(0);

  const isPlaying = state.toolsState?.lofiPlaying || false;
  const volume = 70;

  // Lo-fi music generator — мягкие аккорды + лёгкий шум
  const startAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = (volume / 100) * 0.3;
    masterGain.connect(ctx.destination);

    // Мягкие аккорды для учёбы — Cmaj7, Fmaj7, Am7, G7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    const gains: GainNode[] = [];
    const oscillators: OscillatorNode[] = [];

    chords.forEach((chord, chordIdx) => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Мягкое вибрато
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.3 + Math.random() * 0.2;
        lfoGain.gain.value = 1.5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        // Огибающая — плавное появление/затухание
        gain.gain.value = 0;
        const startTime = ctx.currentTime + chordIdx * 4;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 1);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 3);
        gain.gain.linearRampToValueAtTime(0, startTime + 4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);

        oscillators.push(osc);
        gains.push(gain);
      });
    });

    // Лёгкий шум для атмосферы (vinyl crackle)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    nodesRef.current = { gains, oscillators, noise, noiseGain, filter: noiseFilter };

    // Циклическое повторение аккордов каждые 16 секунд
    const scheduleChords = () => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      chords.forEach((chord, chordIdx) => {
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.3 + Math.random() * 0.2;
          lfoGain.gain.value = 1.5;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          const startTime = now + chordIdx * 4;
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.08, startTime + 1);
          gain.gain.linearRampToValueAtTime(0.08, startTime + 3);
          gain.gain.linearRampToValueAtTime(0, startTime + 4);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(startTime);
          osc.stop(startTime + 4);
        });
      });
    };

    intervalRef.current = window.setInterval(scheduleChords, 16000);
  }, [volume]);

  const stopAudio = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    nodesRef.current.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    if (nodesRef.current.noise) {
      try { nodesRef.current.noise.stop(); } catch {}
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    nodesRef.current = { gains: [], oscillators: [] };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying]);

  // Progress animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    updateToolsState({ lofiPlaying: !isPlaying });
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
            {isPlaying ? 'Lo-fi Study Beats' : '—'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t('nowPlaying', lang)}: {isPlaying ? 'Lo-fi Study Beats' : '—'}
          </p>
          <div className="h-1 rounded-full bg-[var(--hover)] mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 size={14} className="text-[var(--text-muted)]" />
        <div className="flex-1 h-1.5 rounded-full bg-[var(--hover)] relative">
          <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${volume}%` }} />
        </div>
        <span className="text-xs text-[var(--text-muted)] w-8 text-right">{volume}%</span>
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

  const [timeLeft, setTimeLeft] = React.useState(
    state.toolsState?.pomodoroTimeLeft || focusDuration * 60
  );
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Timer logic — исправленный
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Переключение фазы
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

  // Синхронизация timeLeft с state при переключении фаз
  useEffect(() => {
    setTimeLeft(state.toolsState?.pomodoroTimeLeft || focusDuration * 60);
  }, [state.toolsState?.pomodoroIsBreak]);

  const handleToggle = () => {
    if (!running && timeLeft === 0) {
      // Если время вышло — сброс
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

      {/* Timer */}
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

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-[var(--hover)] overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isBreak ? 'bg-green-400' : 'bg-[var(--accent)]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Settings */}
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
