import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2, Power } from 'lucide-react';
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
  const { state, updateToolsState } = useApp();
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const isPlaying = state.toolsState.lofiPlaying;

  // Generate relaxing lo-fi sound using Web Audio API
  const startAudio = () => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume / 100 * 0.3;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create multiple oscillators for ambient sound
    const frequencies = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.1 / frequencies.length;
      
      // Add slight detune for warmth
      osc.detune.value = (i - 2) * 5;
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillatorsRef.current.push(osc);
    });

    // Add noise for texture
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    
    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start();
  };

  const stopAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
      intervalRef.current = window.setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 200);
    } else {
      stopAudio();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100 * 0.3;
    }
  }, [volume]);

  const togglePlay = () => {
    updateToolsState({ lofiPlaying: !isPlaying });
  };

  return (
    <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Music size={16} className="text-[var(--accent)]" />
        {t('lofiPlayer', lang)}
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {isPlaying ? 'Lo-fi Chill Beats' : '—'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t('nowPlaying', lang)}: {isPlaying ? 'Lo-fi Chill Beats' : '—'}
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
  const { state, updateToolsState } = useApp();
  const intervalRef = useRef<number | null>(null);

  const { pomodoroRunning: running, pomodoroTimeLeft: timeLeft, pomodoroIsBreak: isBreak, pomodoroFocusDuration: focusDuration, pomodoroBreakDuration: breakDuration } = state.toolsState;

  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        updateToolsState({ pomodoroTimeLeft: timeLeft - 1 });
      }, 1000);
    } else if (running && timeLeft === 0) {
      // Switch phase
      if (!isBreak) {
        updateToolsState({ 
          pomodoroIsBreak: true, 
          pomodoroTimeLeft: breakDuration * 60 
        });
      } else {
        updateToolsState({ 
          pomodoroIsBreak: false, 
          pomodoroRunning: false,
          pomodoroTimeLeft: focusDuration * 60 
        });
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft, isBreak, focusDuration, breakDuration]);

  const handleReset = () => {
    updateToolsState({ 
      pomodoroRunning: false, 
      pomodoroIsBreak: false, 
      pomodoroTimeLeft: focusDuration * 60 
    });
  };

  const toggleRunning = () => {
    updateToolsState({ pomodoroRunning: !running });
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
          onClick={toggleRunning}
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
              onClick={() => {
                const newDuration = Math.max(5, focusDuration - 5);
                updateToolsState({ pomodoroFocusDuration: newDuration });
                if (!running && !isBreak) updateToolsState({ pomodoroTimeLeft: newDuration * 60 });
              }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >−</button>
            <span className="text-sm font-medium text-[var(--text-primary)] w-12 text-center">{focusDuration} {t('minutes', lang)}</span>
            <button
              onClick={() => {
                const newDuration = Math.min(60, focusDuration + 5);
                updateToolsState({ pomodoroFocusDuration: newDuration });
                if (!running && !isBreak) updateToolsState({ pomodoroTimeLeft: newDuration * 60 });
              }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >+</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{t('break', lang)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDuration = Math.max(1, breakDuration - 1);
                updateToolsState({ pomodoroBreakDuration: newDuration });
                if (!running && isBreak) updateToolsState({ pomodoroTimeLeft: newDuration * 60 });
              }}
              className="w-7 h-7 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--text-secondary)]"
            >−</button>
            <span className="text-sm font-medium text-[var(--text-primary)] w-12 text-center">{breakDuration} {t('minutes', lang)}</span>
            <button
              onClick={() => {
                const newDuration = Math.min(30, breakDuration + 1);
                updateToolsState({ pomodoroBreakDuration: newDuration });
                if (!running && isBreak) updateToolsState({ pomodoroTimeLeft: newDuration * 60 });
              }}
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
