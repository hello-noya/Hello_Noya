// Глобальный таймер Pomodoro - работает независимо от React-компонентов

type TimerCallback = (timeLeft: number, isBreak: boolean, running: boolean) => void;

class PomodoroTimer {
  private timeLeft: number = 25 * 60;
  private focusDuration: number = 25;
  private breakDuration: number = 5;
  private isBreak: boolean = false;
  private running: boolean = false;
  private intervalId: number | null = null;
  private callbacks: Set<TimerCallback> = new Set();

  private startInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        
        if (this.timeLeft === 0) {
          // Переключение фазы
          if (!this.isBreak) {
            this.isBreak = true;
            this.timeLeft = this.breakDuration * 60;
          } else {
            this.isBreak = false;
            this.timeLeft = this.focusDuration * 60;
            this.running = false;
            this.stopInterval();
          }
        }
        
        this.notifyAll();
      }
    }, 1000);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyAll(): void {
    this.callbacks.forEach(cb => {
      cb(this.timeLeft, this.isBreak, this.running);
    });
  }

  public start(): void {
    if (!this.running) {
      this.running = true;
      this.startInterval();
      this.notifyAll();
    }
  }

  public pause(): void {
    if (this.running) {
      this.running = false;
      this.stopInterval();
      this.notifyAll();
    }
  }

  public reset(): void {
    this.running = false;
    this.isBreak = false;
    this.timeLeft = this.focusDuration * 60;
    this.stopInterval();
    this.notifyAll();
  }

  public setTimeLeft(seconds: number): void {
    this.timeLeft = seconds;
    this.notifyAll();
  }

  public setFocusDuration(minutes: number): void {
    this.focusDuration = minutes;
    if (!this.running && !this.isBreak) {
      this.timeLeft = minutes * 60;
      this.notifyAll();
    }
  }

  public setBreakDuration(minutes: number): void {
    this.breakDuration = minutes;
    if (!this.running && this.isBreak) {
      this.timeLeft = minutes * 60;
      this.notifyAll();
    }
  }

  public getState() {
    return {
      timeLeft: this.timeLeft,
      isBreak: this.isBreak,
      running: this.running,
      focusDuration: this.focusDuration,
      breakDuration: this.breakDuration,
    };
  }

  public subscribe(callback: TimerCallback): () => void {
    this.callbacks.add(callback);
    // Немедленно уведомляем о текущем состоянии
    callback(this.timeLeft, this.isBreak, this.running);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  public onTick(callback: TimerCallback): void {
    this.callbacks.add(callback);
  }
}

export const pomodoroTimer = new PomodoroTimer();
