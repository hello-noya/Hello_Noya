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

    // Мягкие аккорды
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 349.23, 440.00], // D minor
      [349.23, 440.00, 523.25], // F major
      [392.00, 493.88, 587.33], // G major
    ];

    const playChordSequence = () => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      chords.forEach((chord, chordIdx) => {
        const startTime = now + chordIdx * 8;

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.06, startTime + 2);
          gain.gain.setValueAtTime(0.06, startTime + 6);
          gain.gain.linearRampToValueAtTime(0, startTime + 8);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(startTime);
          osc.stop(startTime + 8);

          this.oscillators.push(osc);
          this.gains.push(gain);
        });
      });

      this.scheduleTimeout = window.setTimeout(() => {
        if (this.isPlaying) {
          playChordSequence();
        }
      }, 32000);
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
