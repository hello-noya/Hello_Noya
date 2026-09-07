// Глобальный аудио-модуль для Lo-fi плеера
// Singleton, который управляет воспроизведением независимо от React-компонентов

type ProgressCallback = (progress: number) => void;

interface Track {
  name: string;
  chords: number[][];
  progression: number[];
  bpm: number;
  mood: 'chill' | 'focus' | 'dreamy' | 'warm' | 'bright';
}

// 12 треков с разными аккордами и настроением
const TRACKS: Track[] = [
  {
    name: 'Morning Coffee',
    chords: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    progression: [0, 1, 2, 3],
    bpm: 70,
    mood: 'warm',
  },
  {
    name: 'Rainy Day',
    chords: [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fm7
      [233.08, 293.66, 349.23, 440.00], // Bbmaj7
      [185.00, 233.08, 277.18, 349.23], // Bbm7
    ],
    progression: [0, 1, 2, 3],
    bpm: 65,
    mood: 'dreamy',
  },
  {
    name: 'Study Session',
    chords: [
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [349.23, 415.30, 523.25, 622.25], // Fm7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 311.13, 392.00], // G7
    ],
    progression: [0, 1, 2, 3, 0, 2, 1, 3],
    bpm: 72,
    mood: 'focus',
  },
  {
    name: 'Sunset Walk',
    chords: [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7
      [233.08, 293.66, 349.23, 440.00], // Bbmaj7
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    progression: [0, 1, 2, 3],
    bpm: 68,
    mood: 'warm',
  },
  {
    name: 'Night Owl',
    chords: [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fm7
      [196.00, 246.94, 293.66, 349.23], // Gm7
      [164.81, 207.65, 246.94, 311.13], // Em7
    ],
    progression: [0, 2, 1, 3],
    bpm: 60,
    mood: 'chill',
  },
  {
    name: 'Spring Breeze',
    chords: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    progression: [0, 1, 2, 3, 2, 1, 0, 3],
    bpm: 75,
    mood: 'bright',
  },
  {
    name: 'Library Vibes',
    chords: [
      [233.08, 293.66, 349.23, 440.00], // Bbmaj7
      [185.00, 233.08, 277.18, 349.23], // Bbm7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fm7
    ],
    progression: [0, 1, 2, 3],
    bpm: 66,
    mood: 'focus',
  },
  {
    name: 'Cloud Nine',
    chords: [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [293.66, 349.23, 440.00, 523.25], // Dm7
    ],
    progression: [0, 2, 1, 3],
    bpm: 70,
    mood: 'dreamy',
  },
  {
    name: 'Autumn Leaves',
    chords: [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 349.23], // Gm7
      [174.61, 220.00, 261.63, 329.63], // Fm7
      [164.81, 207.65, 246.94, 311.13], // Em7
    ],
    progression: [0, 1, 2, 3, 2, 1, 0, 3],
    bpm: 62,
    mood: 'warm',
  },
  {
    name: 'Midnight Study',
    chords: [
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [233.08, 293.66, 349.23, 440.00], // Bbmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    progression: [0, 1, 2, 3],
    bpm: 64,
    mood: 'focus',
  },
  {
    name: 'Gentle Waves',
    chords: [
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    progression: [0, 1, 2, 3, 2, 1],
    bpm: 68,
    mood: 'chill',
  },
  {
    name: 'Dreamscape',
    chords: [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fm7
    ],
    progression: [0, 2, 1, 3, 0, 1, 2, 3],
    bpm: 66,
    mood: 'dreamy',
  },
];

class LofiAudioManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private volume: number = 0.7;
  private onProgressCallback: ProgressCallback | null = null;
  private progress: number = 0;
  private trackStartTime: number = 0;
  private trackDuration: number = 16000; // 16 секунд на трек

  constructor() {
    // Singleton
  }

  private getTrackDuration(track: Track): number {
    return (track.progression.length * 4 * 60 * 1000) / track.bpm;
  }

  private initAudioContext(): void {
    if (this.audioCtx) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioCtx();
    
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.volume * 0.3;
    this.masterGain.connect(this.audioCtx.destination);
  }

  private stopAllSounds(): void {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.activeOscillators = [];
    this.activeGains = [];

    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch (e) {}
      this.noiseSource = null;
    }
  }

  private playTrack(track: Track): void {
    if (!this.audioCtx || !this.masterGain) return;

    this.stopAllSounds();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    this.trackStartTime = Date.now();
    this.trackDuration = this.getTrackDuration(track);

    // Создаём реверб
    const convolver = ctx.createConvolver();
    const reverbLength = 2;
    const sampleRate = ctx.sampleRate;
    const reverbBufferSize = sampleRate * reverbLength;
    const impulse = ctx.createBuffer(2, reverbBufferSize, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < reverbBufferSize; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbBufferSize, 2);
      }
    }
    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.2;
    convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Воспроизводим аккорды по прогрессии
    track.progression.forEach((chordIdx, progIdx) => {
      const chord = track.chords[chordIdx];
      const startTime = now + progIdx * 4 * (60 / track.bpm);

      chord.forEach((freq, noteIdx) => {
        // Основной осциллятор
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Лёгкое вибрато
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.3 + Math.random() * 0.2;
        lfoGain.gain.value = 1.5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(startTime);

        // Огибающая
        const noteDuration = 4 * (60 / track.bpm);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.5);
        gain.gain.setValueAtTime(0.08, startTime + noteDuration - 0.5);
        gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        gain.connect(convolver);
        osc.start(startTime);
        osc.stop(startTime + noteDuration);

        this.activeOscillators.push(osc);
        this.activeGains.push(gain);

        // Басовая нота (октава ниже)
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.value = freq / 2;
        bassGain.gain.setValueAtTime(0, startTime);
        bassGain.gain.linearRampToValueAtTime(0.04, startTime + 0.5);
        bassGain.gain.setValueAtTime(0.04, startTime + noteDuration - 0.5);
        bassGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain!);
        bassOsc.start(startTime);
        bassOsc.stop(startTime + noteDuration);

        this.activeOscillators.push(bassOsc);
        this.activeGains.push(bassGain);

        // Мелодические ноты (случайные высокие)
        if (Math.random() > 0.6) {
          const melodyOsc = ctx.createOscillator();
          const melodyGain = ctx.createGain();
          melodyOsc.type = 'triangle';
          melodyOsc.frequency.value = freq * 2 * (1 + Math.random() * 0.5);
          
          const melodyTime = startTime + Math.random() * noteDuration * 0.8;
          melodyGain.gain.setValueAtTime(0, melodyTime);
          melodyGain.gain.linearRampToValueAtTime(0.02, melodyTime + 0.2);
          melodyGain.gain.linearRampToValueAtTime(0, melodyTime + 1);
          
          melodyOsc.connect(melodyGain);
          melodyGain.connect(this.masterGain!);
          melodyGain.connect(convolver);
          melodyOsc.start(melodyTime);
          melodyOsc.stop(melodyTime + 1);

          this.activeOscillators.push(melodyOsc);
          this.activeGains.push(melodyGain);
        }
      });
    });

    // Виниловый шум
    const noiseBufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    // Розовый шум (более приятный)
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < noiseBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.01;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.15;

    this.noiseSource.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);
    this.noiseSource.start();
  }

  private scheduleNextTrack(): void {
    const track = TRACKS[this.currentTrackIndex];
    const duration = this.getTrackDuration(track);

    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }

    this.intervalId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACKS.length;
        this.playTrack(TRACKS[this.currentTrackIndex]);
        this.scheduleNextTrack();
      }
    }, duration);
  }

  private updateProgress(): void {
    if (!this.isPlaying) return;

    const elapsed = Date.now() - this.trackStartTime;
    this.progress = (elapsed / this.trackDuration) * 100;

    if (this.progress >= 100) {
      this.progress = 0;
    }

    if (this.onProgressCallback) {
      this.onProgressCallback(this.progress);
    }

    requestAnimationFrame(() => this.updateProgress());
  }

  public play(): void {
    this.initAudioContext();
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.playTrack(TRACKS[this.currentTrackIndex]);
    this.scheduleNextTrack();
    this.updateProgress();
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopAllSounds();
    
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume * 0.3;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrackName(): string {
    return TRACKS[this.currentTrackIndex].name;
  }

  public getTrackCount(): number {
    return TRACKS.length;
  }

  public onProgress(callback: ProgressCallback): void {
    this.onProgressCallback = callback;
  }

  public nextTrack(): void {
    if (this.isPlaying) {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACKS.length;
      this.playTrack(TRACKS[this.currentTrackIndex]);
      this.scheduleNextTrack();
    }
  }

  public previousTrack(): void {
    if (this.isPlaying) {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
      this.playTrack(TRACKS[this.currentTrackIndex]);
      this.scheduleNextTrack();
    }
  }
}

// Singleton instance
export const lofiAudio = new LofiAudioManager();
