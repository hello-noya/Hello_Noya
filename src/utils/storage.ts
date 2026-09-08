import { AppState, Profile, Habit, Task, ScheduleEvent, Goal, AppSettings, Stats } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'rhythm_app_data';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure toolsState exists for backward compatibility
      if (!parsed.toolsState) {
        parsed.toolsState = {
          lofiPlaying: false,
          pomodoroRunning: false,
          pomodoroTimeLeft: 25 * 60,
          pomodoroIsBreak: false,
          pomodoroFocusDuration: 25,
          pomodoroBreakDuration: 5,
        };
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return getDefaultState();
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getDefaultState(): AppState {
  return {
    profile: null,
    habits: [],
    tasks: [],
    events: [],
    goals: [],
    settings: { language: 'ru', theme: 'pink' },
    stats: { habitsCompleted: 0, bestStreak: 0, tasksToday: 0, goalsAchieved: 0 },
    toolsState: {
      lofiPlaying: false,
      pomodoroRunning: false,
      pomodoroTimeLeft: 25 * 60,
      pomodoroIsBreak: false,
      pomodoroFocusDuration: 25,
      pomodoroBreakDuration: 5,
    },
  };
}

export function createProfile(name: string, motto: string, icon: string): Profile {
  return {
    id: uuidv4(),
    name,
    motto,
    icon,
    createdAt: new Date().toISOString(),
  };
}

export function createHabit(data: Partial<Habit>): Habit {
  return {
    id: uuidv4(),
    name: data.name || '',
    icon: data.icon || '✨',
    icon2: data.icon2,
    startTime: data.startTime || '',
    days: data.days || [1, 2, 3, 4, 5],
    completedDates: [],
    note: data.note,
  };
}

export function createTask(text: string, date: string, note?: string, deadline?: string): Task {
  return {
    id: uuidv4(),
    text,
    time: '',
    date,
    completed: false,
    note,
    deadline,
  };
}

export function createEvent(data: Partial<ScheduleEvent>): ScheduleEvent {
  return {
    id: uuidv4(),
    name: data.name || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    duration: data.duration || 60,
    durationMode: data.durationMode || 'auto',
    days: data.days || [1],
    note: data.note || '',
  };
}

export function createGoal(data: Partial<Goal>): Goal {
  return {
    id: uuidv4(),
    name: data.name || '',
    unit: data.unit || '',
    target: data.target || 10,
    current: 0,
  };
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayOfWeek(date: Date): number {
  // Convert JS day (0=Sun) to our format (0=Sun, 1=Mon...)
  return date.getDay();
}

export function calculateStats(state: AppState): Stats {
  const today = getTodayISO();
  
  // Habits completed total
  const habitsCompleted = state.habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  
  // Best streak: consecutive days with at least one habit completed
  const allDates = new Set<string>();
  state.habits.forEach(h => h.completedDates.forEach(d => allDates.add(d)));
  const sortedDates = Array.from(allDates).sort();
  
  let bestStreak = 0;
  let currentStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, currentStreak);
  }
  
  // Tasks today
  const tasksToday = state.tasks.filter(t => t.date === today && t.completed).length;
  
  // Goals achieved
  const goalsAchieved = state.goals.filter(g => g.current >= g.target).length;
  
  return { habitsCompleted, bestStreak, tasksToday, goalsAchieved };
}

// SVG-иконки вместо эмодзи
export const PROFILE_ICONS = ['star', 'crown', 'flame', 'diamond', 'rocket', 'heart', 'leaf', 'zap', 'sun', 'moon', 'trophy', 'sparkles'];

export const HABIT_ICONS = ['water', 'book', 'run', 'sleep', 'apple', 'brain', 'music', 'gym', 'coffee', 'laptop'];
