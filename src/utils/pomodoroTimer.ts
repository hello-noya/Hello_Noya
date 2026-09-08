// Глобальный таймер Pomodoro - работает независимо от React-компонентов

type TimerCallback = (timeLeft: number, isBreak: boolean, running: boolean) => void;

class PomodoroTimer {
  private timeLeft: number = 25 * 60;
  private focusDuration: number = 25;
  private breakDuration: number = 5;
  private isBreak: boolean = false;
  private running: boolean = false;
  private intervalId: number | null = null;
  private onTickCallback: TimerCallback | null = null;

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
        
        this.notifyCallback();
      }
    }, 1000);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyCallback(): void {
    if (this.onTickCallback) {
      this.onTickCallback(this.timeLeft, this.isBreak, this.running);
    }
  }

  public start(): void {
    this.running = true;
    this.startInterval();
    this.notifyCallback();
  }

  public pause(): void {
    this.running = false;
    this.stopInterval();
    this.notifyCallback();
  }

  public reset(): void {
    this.running = false;
    this.isBreak = false;
    this.timeLeft = this.focusDuration * 60;
    this.stopInterval();
    this.notifyCallback();
  }

  public setTimeLeft(seconds: number): void {
    this.timeLeft = seconds;
    this.notifyCallback();
  }

  public setFocusDuration(minutes: number): void {
    this.focusDuration = minutes;
    if (!this.running && !this.isBreak) {
      this.timeLeft = minutes * 60;
      this.notifyCallback();
    }
  }

  public setBreakDuration(minutes: number): void {
    this.breakDuration = minutes;
    if (!this.running && this.isBreak) {
      this.timeLeft = minutes * 60;
      this.notifyCallback();
    }
  }

  public onTick(callback: TimerCallback): void {
    this.onTickCallback = callback;
  }

  public getState(): { timeLeft: number; isBreak: boolean; running: boolean; focusDuration: number; breakDuration: number } {
    return {
      timeLeft: this.timeLeft,
      isBreak: this.isBreak,
      running: this.running,
      focusDuration: this.focusDuration,
      breakDuration: this.breakDuration,
    };
  }
}

// Singleton instance
export const pomodoroTimer = new PomodoroTimer();
