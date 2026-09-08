import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { TodayScreen } from './components/screens/TodayScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { GoalsScreen } from './components/screens/GoalsScreen';
import { MenuScreen, MenuSection } from './components/screens/MenuScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ToolsScreen } from './components/screens/ToolsScreen';
import { ManageScreen } from './components/screens/ManageScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { Header } from './components/Header';
import { TabBar, Tab } from './components/TabBar';
import { HabitModal } from './components/modals/HabitModal';
import { EventModal } from './components/modals/EventModal';
import { GoalModal } from './components/modals/GoalModal';
import { Toast } from './components/ui/Toast';
import { Habit, ScheduleEvent, Goal } from './types';

function AppContent() {
  const { state, toast, deleteEvent, deleteGoal } = useApp();
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [menuSection, setMenuSection] = useState<MenuSection | null>(null);

  // Modals
  const [habitModal, setHabitModal] = useState<{ open: boolean; habit: Habit | null }>({ open: false, habit: null });
  const [eventModal, setEventModal] = useState<{ open: boolean; event: ScheduleEvent | null }>({ open: false, event: null });
  const [goalModal, setGoalModal] = useState<{ open: boolean; goal: Goal | null }>({ open: false, goal: null });

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  // Check if profile exists after splash
  const handleSplashComplete = () => {
    if (state.profile) {
      setAppPhase('main');
    } else {
      setAppPhase('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    // Always transition to main - profile was just created
    setAppPhase('main');
  };

  if (appPhase === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appPhase === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Main app
  const renderContent = () => {
    if (menuSection) {
      switch (menuSection) {
        case 'profile':
          return <ProfileScreen onBack={() => setMenuSection(null)} />;
        case 'settings':
          return <SettingsScreen onBack={() => setMenuSection(null)} />;
        case 'tools':
          return <ToolsScreen onBack={() => setMenuSection(null)} />;
        case 'manage':
          return <ManageScreen onBack={() => setMenuSection(null)} />;
        case 'statistics':
          return <StatisticsScreen onBack={() => setMenuSection(null)} />;
      }
    }

    switch (activeTab) {
      case 'today':
        return (
          <TodayScreen
            onEditHabit={(h) => setHabitModal({ open: true, habit: h })}
            onAddHabit={() => setHabitModal({ open: true, habit: null })}
          />
        );
      case 'schedule':
        return (
          <ScheduleScreen
            onEditEvent={(e) => setEventModal({ open: true, event: e })}
            onAddEvent={() => setEventModal({ open: true, event: null })}
            onDeleteEvent={(id) => deleteEvent(id)}
          />
        );
      case 'goals':
        return (
          <GoalsScreen
            onEditGoal={(g) => setGoalModal({ open: true, goal: g })}
            onAddGoal={() => setGoalModal({ open: true, goal: null })}
            onDeleteGoal={(id) => deleteGoal(id)}
          />
        );
      case 'menu':
        return <MenuScreen onNavigate={(section) => setMenuSection(section)} />;
    }
  };

  const handleToolsClick = (tool: 'lofi' | 'pomodoro') => {
    setActiveTab('menu');
    setMenuSection('tools');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header onToolsClick={handleToolsClick} />
      <main className="max-w-[420px] mx-auto px-4 pt-20 pb-20">
        {renderContent()}
      </main>
      <TabBar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setMenuSection(null); }} />

      {/* Modals */}
      <HabitModal
        isOpen={habitModal.open}
        onClose={() => setHabitModal({ open: false, habit: null })}
        habit={habitModal.habit}
      />
      <EventModal
        isOpen={eventModal.open}
        onClose={() => setEventModal({ open: false, event: null })}
        event={eventModal.event}
      />
      <GoalModal
        isOpen={goalModal.open}
        onClose={() => setGoalModal({ open: false, goal: null })}
        goal={goalModal.goal}
      />

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
