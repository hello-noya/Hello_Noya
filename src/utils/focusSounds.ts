// Lo-fi звуки для фокуса

class FocusSoundsManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.7;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private scheduleTimeout: number | null = null;

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

  private playLofi(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Корейские lo-fi аккорды - более сложные и атмосферные
    const chordProgressions = [
      // Прогрессия 1: I - V - vi - IV (популярная в K-pop)
      [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [392.00, 493.88, 587.33, 739.99], // Gmaj7
        [440.00, 523.25, 659.25, 783.99], // Am7
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
      ],
      // Прогрессия 2: vi - IV - I - V (эмоциональная)
      [
        [440.00, 523.25, 659.25, 783.99], // Am7
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [392.00, 493.88, 587.33, 739.99], // Gmaj7
      ],
    ];

    const playChordSequence = () => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      
      // Выбираем случайную прогрессию
      const progression = chordProgressions[Math.floor(Math.random() * chordProgressions.length)];

      progression.forEach((chord, chordIdx) => {
        const startTime = now + chordIdx * 4;

        chord.forEach((freq, noteIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          // Используем треугольную волну для более мягкого звука
          osc.type = noteIdx === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq;

          // Более плавная огибающая
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.04, startTime + 1);
          gain.gain.setValueAtTime(0.04, startTime + 3);
          gain.gain.linearRampToValueAtTime(0, startTime + 4);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(startTime);
          osc.stop(startTime + 4);

          this.oscillators.push(osc);
          this.gains.push(gain);
        });
      });

      this.scheduleTimeout = window.setTimeout(() => {
        if (this.isPlaying) {
          playChordSequence();
        }
      }, 16000);
    };

    playChordSequence();
  }

  public play(): void {
    this.initAudioContext();
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopAllSounds();
    this.isPlaying = true;
    this.playLofi();
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

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

export const focusSounds = new FocusSoundsManager();
