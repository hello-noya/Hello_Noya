// Разные звуки для фокуса

export type SoundType = 'lofi' | 'rain' | 'fire' | 'cafe' | 'nature';

class FocusSoundsManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSources: AudioBufferSourceNode[] = [];
  private activeGains: GainNode[] = [];
  private currentSound: SoundType = 'lofi';
  private isPlaying: boolean = false;
  private volume: number = 0.7;

  private initAudioContext(): void {
    if (this.audioCtx) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioCtx();
    
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.volume * 0.3;
    this.masterGain.connect(this.audioCtx.destination);
  }

  private stopAllSounds(): void {
    this.activeSources.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    this.activeSources = [];
    this.activeGains = [];
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown', duration: number = 2): AudioBuffer {
    if (!this.audioCtx) throw new Error('AudioContext not initialized');

    const sampleRate = this.audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2;
      }
    } else { // brown
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }
    }

    return buffer;
  }

  private playRain(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Дождь — розовый шум с фильтром
    const noiseBuffer = this.createNoiseBuffer('pink', 4);
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.4;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeSources.push(source);
    this.activeGains.push(gain);
  }

  private playFire(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Костёр — коричневый шум с модуляцией
    const noiseBuffer = this.createNoiseBuffer('brown', 4);
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.5;

    // Модуляция для эффекта потрескивания
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.frequency.value = 0.5;
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeSources.push(source);
    this.activeGains.push(gain);
  }

  private playCafe(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Кафе — белый шум с фильтрами
    const noiseBuffer = this.createNoiseBuffer('white', 4);
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter1 = this.audioCtx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 800;

    const filter2 = this.audioCtx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.value = 200;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.3;

    source.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeSources.push(source);
    this.activeGains.push(gain);
  }

  private playNature(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Природа — розовый шум с модуляцией
    const noiseBuffer = this.createNoiseBuffer('pink', 4);
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.35;

    // Модуляция для эффекта ветра
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeSources.push(source);
    this.activeGains.push(gain);
  }

  private playLofi(): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Lo-fi — мягкие аккорды
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
        });
      });

      setTimeout(() => {
        if (this.isPlaying) {
          playChordSequence();
        }
      }, 32000);
    };

    playChordSequence();
  }

  public play(sound: SoundType = 'lofi'): void {
    this.initAudioContext();
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopAllSounds();
    this.currentSound = sound;
    this.isPlaying = true;

    switch (sound) {
      case 'rain':
        this.playRain();
        break;
      case 'fire':
        this.playFire();
        break;
      case 'cafe':
        this.playCafe();
        break;
      case 'nature':
        this.playNature();
        break;
      case 'lofi':
      default:
        this.playLofi();
        break;
    }
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

  public getCurrentSound(): SoundType {
    return this.currentSound;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

export const focusSounds = new FocusSoundsManager();
