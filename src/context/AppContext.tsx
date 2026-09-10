import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppState, Profile, Habit, Task, ScheduleEvent, Goal, AppSettings, ToolsState } from '../types';
import { loadState, saveState, clearState, createProfile, calculateStats, getDefaultState } from '../utils/storage';

interface AppContextType {
  state: AppState;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addEvent: (event: ScheduleEvent) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  incrementGoal: (id: string) => void;
  decrementGoal: (id: string) => void;
  resetAll: () => void;
  logout: () => void;
  updateToolsState: (updates: Partial<ToolsState>) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const setProfile = useCallback((profile: Profile) => {
    setState(prev => ({ ...prev, profile: profile }));
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...updates } : null,
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  const addHabit = useCallback((habit: Habit) => {
    setState(prev => {
      const newState = { ...prev, habits: [...prev.habits, habit] };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const updateHabit = useCallback((habit: Habit) => {
    setState(prev => {
      const newState = { ...prev, habits: prev.habits.map(h => h.id === habit.id ? habit : h) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setState(prev => {
      const newState = { ...prev, habits: prev.habits.filter(h => h.id !== id) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    setState(prev => {
      const habits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const completed = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: completed
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date],
        };
      });
      const newState = { ...prev, habits };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const addTask = useCallback((task: Task) => {
    setState(prev => {
      const newState = { ...prev, tasks: [...prev.tasks, task] };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const updateTask = useCallback((task: Task) => {
    setState(prev => {
      const newState = { ...prev, tasks: prev.tasks.map(t => t.id === task.id ? task : t) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => {
      const newState = { ...prev, tasks: prev.tasks.filter(t => t.id !== id) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
      };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const addEvent = useCallback((event: ScheduleEvent) => {
    setState(prev => ({ ...prev, events: [...prev.events, event] }));
  }, []);

  const updateEvent = useCallback((event: ScheduleEvent) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === event.id ? event : e),
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setState(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setState(prev => {
      const newState = { ...prev, goals: [...prev.goals, goal] };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const updateGoal = useCallback((goal: Goal) => {
    setState(prev => {
      const newState = { ...prev, goals: prev.goals.map(g => g.id === goal.id ? goal : g) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState(prev => {
      const newState = { ...prev, goals: prev.goals.filter(g => g.id !== id) };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const incrementGoal = useCallback((id: string) => {
    setState(prev => {
      const goals = prev.goals.map(g => {
        if (g.id !== id) return g;
        if (g.current >= g.target) return g;
        return { ...g, current: g.current + 1 };
      });
      const newState = { ...prev, goals };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const decrementGoal = useCallback((id: string) => {
    setState(prev => {
      const goals = prev.goals.map(g => {
        if (g.id !== id) return g;
        return { ...g, current: Math.max(0, g.current - 1) };
      });
      const newState = { ...prev, goals };
      return { ...newState, stats: calculateStats(newState) };
    });
  }, []);

  const resetAll = useCallback(() => {
    clearState();
    setState(getDefaultState());
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, profile: null }));
  }, []);

  const updateToolsState = useCallback((updates: Partial<ToolsState>) => {
    setState(prev => ({
      ...prev,
      toolsState: { ...prev.toolsState, ...updates },
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state, setProfile, updateProfile, updateSettings,
      addHabit, updateHabit, deleteHabit, toggleHabitCompletion,
      addTask, updateTask, deleteTask, toggleTaskCompletion,
      addEvent, updateEvent, deleteEvent,
      addGoal, updateGoal, deleteGoal, incrementGoal, decrementGoal,
      resetAll, logout, updateToolsState, toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
