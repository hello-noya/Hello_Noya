// Lo-fi мелодии для фокуса - несколько треков с разными аккордами и мелодиями

interface Track {
  name: string;
  chords: number[][];
  melody: number[];
  tempo: number;
}

const TRACKS: Track[] = [
  {
    name: 'Seoul Nights',
    chords: [
      [261.63, 329.63, 392.00], // C
      [293.66, 349.23, 440.00], // Dm
      [349.23, 440.00, 523.25], // F
      [392.00, 493.88, 587.33], // G
    ],
    melody: [523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440.00, 493.88],
    tempo: 70,
  },
  {
    name: 'Cherry Blossom',
    chords: [
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // Em
      [261.63, 329.63, 392.00], // C
      [196.00, 246.94, 293.66], // G
    ],
    melody: [659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25, 587.33],
    tempo: 65,
  },
  {
    name: 'Midnight Study',
    chords: [
      [293.66, 349.23, 440.00], // Dm
      [261.63, 329.63, 392.00], // C
      [349.23, 440.00, 523.25], // F
      [392.00, 493.88, 587.33], // G
    ],
    melody: [587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25],
    tempo: 75,
  },
  {
    name: 'Rainy Day',
    chords: [
      [349.23, 440.00, 523.25], // F
      [293.66, 349.23, 440.00], // Dm
      [261.63, 329.63, 392.00], // C
      [196.00, 246.94, 293.66], // G
    ],
    melody: [523.25, 587.33, 659.25, 698.46, 659.25, 587.33, 523.25, 493.88],
    tempo: 60,
  },
  {
    name: 'Morning Coffee',
    chords: [
      [261.63, 329.63, 392.00], // C
      [349.23, 440.00, 523.25], // F
      [293.66, 349.23, 440.00], // Dm
      [392.00, 493.88, 587.33], // G
    ],
    melody: [493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440.00],
    tempo: 80,
  },
];

class FocusSoundsManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.7;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private scheduleTimeout: number | null = null;
  private currentTrackIndex: number = 0;

  private initAudioContext(): void {
    if (this.audioCtx) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioCtx();
    
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.volume * 0.3;
    this.masterGain.connect(this.audioCtx.destination);
  }

  private stopAllSounds(): void {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.oscillators = [];
    this.gains = [];

    if (this.scheduleTimeout) {
      clearTimeout(this.scheduleTimeout);
      this.scheduleTimeout = null;
    }
  }

  private playTrack(track: Track): void {
    if (!this.audioCtx || !this.masterGain) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const beatDuration = 60 / track.tempo;

    // Воспроизводим аккорды
    track.chords.forEach((chord, chordIdx) => {
      const startTime = now + chordIdx * beatDuration * 4;

      chord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = noteIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.03, startTime + 0.5);
        gain.gain.setValueAtTime(0.03, startTime + beatDuration * 3.5);
        gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 4);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(startTime);
        osc.stop(startTime + beatDuration * 4);

        this.oscillators.push(osc);
        this.gains.push(gain);
      });
    });

    // Воспроизводим мелодию
    track.melody.forEach((freq, noteIdx) => {
      const startTime = now + noteIdx * beatDuration;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
      gain.gain.setValueAtTime(0.05, startTime + beatDuration * 0.8);
      gain.gain.linearRampToValueAtTime(0, startTime + beatDuration);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + beatDuration);

      this.oscillators.push(osc);
      this.gains.push(gain);
    });

    // Планируем следующий трек
    const trackDuration = track.chords.length * beatDuration * 4 * 1000;
    this.scheduleTimeout = window.setTimeout(() => {
      if (this.isPlaying) {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACKS.length;
        this.playTrack(TRACKS[this.currentTrackIndex]);
      }
    }, trackDuration);
  }

  public play(): void {
    this.initAudioContext();
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopAllSounds();
    this.isPlaying = true;
    this.currentTrackIndex = Math.floor(Math.random() * TRACKS.length);
    this.playTrack(TRACKS[this.currentTrackIndex]);
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopAllSounds();
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

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

export const focusSounds = new FocusSoundsManager();
