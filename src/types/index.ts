// Types for the habit tracker application

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 1=Monday...

export interface Profile {
  id: string;
  name: string;
  motto: string;
  icon: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  icon2?: string;
  startTime: string; // HH:MM
  days: DayOfWeek[];
  completedDates: string[]; // ISO date strings when completed
  note?: string;
}

export interface Task {
  id: string;
  text: string;
  time: string; // HH:MM or empty
  date: string; // ISO date
  completed: boolean;
  note?: string;
  deadline?: string; // ISO date
}

export interface ScheduleEvent {
  id: string;
  name: string;
  icon: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  durationMode: 'auto' | 'manual';
  days: DayOfWeek[];
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  unit: string;
  target: number;
  current: number;
}

export interface AppSettings {
  language: 'ru' | 'en';
  theme: 'pink' | 'lavender' | 'dark';
}

export interface Stats {
  habitsCompleted: number;
  bestStreak: number;
  tasksToday: number;
  goalsAchieved: number;
}

export interface ToolsState {
  lofiPlaying: boolean;
  pomodoroRunning: boolean;
  pomodoroTimeLeft: number;
  pomodoroIsBreak: boolean;
  pomodoroFocusDuration: number;
  pomodoroBreakDuration: number;
}

export interface AppState {
  profile: Profile | null;
  habits: Habit[];
  tasks: Task[];
  events: ScheduleEvent[];
  goals: Goal[];
  settings: AppSettings;
  stats: Stats;
  toolsState: ToolsState;
}
