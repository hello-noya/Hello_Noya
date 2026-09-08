// Глобальный аудио-модуль для Lo-fi плеера
// Singleton, который управляет воспроизведением независимо от React-компонентов

type ProgressCallback = (progress: number) => void;

class LofiAudioManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private volume: number = 0.7;
  private onProgressCallback: ProgressCallback | null = null;
  private progress: number = 0;
  private animationFrameId: number | null = null;
  private startTime: number = 0;

  constructor() {
    // Singleton
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

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private playAmbient(): void {
    if (!this.audioCtx || !this.masterGain) return;

    this.stopAllSounds();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    this.startTime = Date.now();

    // Мягкие аккорды - очень плавные и тёплые
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 349.23, 440.00], // D minor
      [349.23, 440.00, 523.25], // F major
      [392.00, 493.88, 587.33], // G major
    ];

    // Создаём реверб
    const convolver = ctx.createConvolver();
    const reverbLength = 3;
    const sampleRate = ctx.sampleRate;
    const reverbBufferSize = sampleRate * reverbLength;
    const impulse = ctx.createBuffer(2, reverbBufferSize, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < reverbBufferSize; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbBufferSize, 2.5);
      }
    }
    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.15;
    convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Воспроизводим аккорды циклически
    const playChordSequence = () => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      chords.forEach((chord, chordIdx) => {
        const startTime = now + chordIdx * 8;

        chord.forEach((freq) => {
          // Основной осциллятор - синусоида для мягкости
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = freq;

          // Очень плавная огибающая
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.06, startTime + 2);
          gain.gain.setValueAtTime(0.06, startTime + 6);
          gain.gain.linearRampToValueAtTime(0, startTime + 8);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          gain.connect(convolver);
          osc.start(startTime);
          osc.stop(startTime + 8);

          this.activeOscillators.push(osc);
          this.activeGains.push(gain);

          // Басовая нота (октава ниже) - очень мягкая
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.value = freq / 2;
          
          bassGain.gain.setValueAtTime(0, startTime);
          bassGain.gain.linearRampToValueAtTime(0.03, startTime + 2);
          bassGain.gain.setValueAtTime(0.03, startTime + 6);
          bassGain.gain.linearRampToValueAtTime(0, startTime + 8);
          
          bassOsc.connect(bassGain);
          bassGain.connect(this.masterGain!);
          bassOsc.start(startTime);
          bassOsc.stop(startTime + 8);

          this.activeOscillators.push(bassOsc);
          this.activeGains.push(bassGain);
        });
      });

      // Планируем следующую последовательность
      setTimeout(() => {
        if (this.isPlaying) {
          playChordSequence();
        }
      }, 32000); // 4 аккорда × 8 секунд
    };

    playChordSequence();

    // Очень мягкий шум - почти как ветер
    const noiseBufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    // Очень мягкий розовый шум
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < noiseBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.005; // Очень тихо
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400; // Очень низкая частота среза

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.08;

    this.noiseSource.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);
    this.noiseSource.start();
  }

  private updateProgress(): void {
    if (!this.isPlaying) return;

    const elapsed = Date.now() - this.startTime;
    this.progress = (elapsed % 32000) / 32000 * 100; // 32 секунды цикл

    if (this.onProgressCallback) {
      this.onProgressCallback(this.progress);
    }

    this.animationFrameId = requestAnimationFrame(() => this.updateProgress());
  }

  public play(): void {
    if (this.isPlaying) return; // Уже играет - не перезапускаем

    this.initAudioContext();
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.playAmbient();
    this.updateProgress();
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
    return 'Lo-fi Ambient';
  }

  public onProgress(callback: ProgressCallback): void {
    this.onProgressCallback = callback;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

// Singleton instance
export const lofiAudio = new LofiAudioManager();
