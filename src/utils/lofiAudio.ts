// Глобальный аудио-модуль для lo-fi плеера
// Управляет воспроизведением независимо от React-компонентов

type ProgressCallback = (progress: number) => void;

class LoFiAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private chordInterval: number | null = null;
  private progressInterval: number | null = null;
  private startTime: number = 0;
  private playing: boolean = false;
  private onProgress: ProgressCallback | null = null;

  // Приятные аккорды для учёбы — jazz lo-fi
  private chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [349.23, 440.00, 523.25, 659.25], // Fmaj7
    [293.66, 369.99, 440.00, 523.25], // Dm7
    [392.00, 493.88, 587.33, 698.46], // G7
    [261.63, 311.13, 392.00, 466.16], // Cm7
    [349.23, 415.30, 523.25, 622.25], // Fm7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [196.00, 246.94, 293.66, 349.23], // Gm7
    [277.18, 349.23, 415.30, 493.88], // Bbmaj7
    [233.08, 293.66, 349.23, 415.30], // Bbm7
    [311.13, 392.00, 466.16, 554.37], // Ebmaj7
    [207.65, 261.63, 311.13, 392.00], // Abmaj7
  ];

  private chordProgressions = [
    [0, 1, 2, 3], // Cmaj7 - Fmaj7 - Dm7 - G7
    [0, 5, 2, 3], // Cmaj7 - Fm7 - Dm7 - G7
    [4, 1, 6, 3], // Cm7 - Fmaj7 - Am7 - G7
    [8, 9, 10, 3], // Bbmaj7 - Bbm7 - Ebmaj7 - G7
    [11, 1, 6, 3], // Abmaj7 - Fmaj7 - Am7 - G7
    [0, 8, 5, 3], // Cmaj7 - Bbmaj7 - Fm7 - G7
  ];

  private currentProgression = 0;

  start(onProgress?: ProgressCallback) {
    if (this.playing) return;
    this.playing = true;
    this.onProgress = onProgress || null;
    this.startTime = Date.now();

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
    const ctx = this.ctx;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.25;
    this.masterGain.connect(ctx.destination);

    // Reverb через convolver
    const convolver = ctx.createConvolver();
    const reverbLength = ctx.sampleRate * 2;
    const impulse = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < reverbLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2.5);
      }
    }
    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.3;
    convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Виниловый шум — очень мягкий
    this.createVinylNoise(ctx, this.masterGain);

    // Запуск аккордов
    this.scheduleChordProgression(ctx, this.masterGain, convolver);

    // Цикл каждые 16 секунд
    this.chordInterval = window.setInterval(() => {
      if (this.ctx && this.playing) {
        this.currentProgression = (this.currentProgression + 1) % this.chordProgressions.length;
        this.scheduleChordProgression(this.ctx, this.masterGain!, convolver);
      }
    }, 16000);

    // Прогресс
    this.progressInterval = window.setInterval(() => {
      if (this.onProgress) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const progress = (elapsed % 16) / 16 * 100;
        this.onProgress(progress);
      }
    }, 200);
  }

  private createVinylNoise(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Мягкий розовый шум
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.015;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 600;
    noiseFilter.Q.value = 0.7;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.4;

    this.noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);
    this.noiseSource.start();
  }

  private scheduleChordProgression(ctx: AudioContext, destination: AudioNode, reverb: ConvolverNode) {
    const progression = this.chordProgressions[this.currentProgression];
    const now = ctx.currentTime;

    progression.forEach((chordIdx, pos) => {
      const chord = this.chords[chordIdx];
      const startTime = now + pos * 4;

      // Бас-нота
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.value = chord[0] / 2; // Октава ниже
      bassGain.gain.setValueAtTime(0, startTime);
      bassGain.gain.linearRampToValueAtTime(0.12, startTime + 0.3);
      bassGain.gain.linearRampToValueAtTime(0.12, startTime + 3.5);
      bassGain.gain.linearRampToValueAtTime(0, startTime + 4);
      bassOsc.connect(bassGain);
      bassGain.connect(destination);
      bassOsc.start(startTime);
      bassOsc.stop(startTime + 4);

      // Аккорд — мягкие синусоиды
      chord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Лёгкое вибрато
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.2 + Math.random() * 0.3;
        lfoGain.gain.value = 0.8;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(startTime);
        lfo.stop(startTime + 4);

        // Плавная огибающая
        const delay = noteIdx * 0.05;
        gain.gain.setValueAtTime(0, startTime + delay);
        gain.gain.linearRampToValueAtTime(0.06, startTime + delay + 0.5);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 3.2);
        gain.gain.linearRampToValueAtTime(0, startTime + 4);

        osc.connect(gain);
        gain.connect(destination);
        gain.connect(reverb);
        osc.start(startTime + delay);
        osc.stop(startTime + 4);
      });

      // Высокие ноты — мелодия
      if (Math.random() > 0.3) {
        const melodyOsc = ctx.createOscillator();
        const melodyGain = ctx.createGain();
        melodyOsc.type = 'triangle';
        melodyOsc.frequency.value = chord[2] * 2; // Октава выше
        const melodyStart = startTime + 1 + Math.random() * 2;
        melodyGain.gain.setValueAtTime(0, melodyStart);
        melodyGain.gain.linearRampToValueAtTime(0.03, melodyStart + 0.2);
        melodyGain.gain.linearRampToValueAtTime(0, melodyStart + 1.5);
        melodyOsc.connect(melodyGain);
        melodyGain.connect(destination);
        melodyGain.connect(reverb);
        melodyOsc.start(melodyStart);
        melodyOsc.stop(melodyStart + 1.5);
      }
    });
  }

  stop() {
    this.playing = false;
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch {}
      this.noiseSource = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.masterGain = null;
    this.onProgress = null;
  }

  isPlaying() {
    return this.playing;
  }
}

// Singleton
export const lofiAudio = new LoFiAudio();
