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
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { StudentTemplates } from './components/screens/StudentTemplates';
import { TaskDetailScreen } from './components/screens/TaskDetailScreen';
import { GoalDetailScreen } from './components/screens/GoalDetailScreen';
import { Header } from './components/Header';
import { TabBar, Tab } from './components/TabBar';
import { HabitModal } from './components/modals/HabitModal';
import { EventModal } from './components/modals/EventModal';
import { GoalModal } from './components/modals/GoalModal';
import { Toast } from './components/ui/Toast';
import { Habit, ScheduleEvent, Goal } from './types';

function AppContent() {
  const { state, deleteEvent, deleteGoal } = useApp();
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [menuSection, setMenuSection] = useState<MenuSection | null>(null);

  // Modals
  const [habitModal, setHabitModal] = useState<{ open: boolean; habit: Habit | null }>({ open: false, habit: null });
  const [eventModal, setEventModal] = useState<{ open: boolean; event: ScheduleEvent | null }>({ open: false, event: null });
  const [goalModal, setGoalModal] = useState<{ open: boolean; goal: Goal | null }>({ open: false, goal: null });

  // Detail screens
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  // Auto-redirect to onboarding when profile is deleted (logout)
  useEffect(() => {
    if (appPhase === 'main' && !state.profile) {
      setAppPhase('onboarding');
    }
  }, [state.profile, appPhase]);

  // Check if profile exists after splash
  const handleSplashComplete = () => {
    console.log('Splash complete, profile:', state.profile);
    if (state.profile) {
      console.log('Profile exists, going to main');
      setAppPhase('main');
    } else {
      console.log('No profile, going to onboarding');
      setAppPhase('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding complete, going to main');
    setAppPhase('main');
  };

  if (appPhase === 'splash') {
    console.log('Rendering splash screen');
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appPhase === 'onboarding') {
    console.log('Rendering onboarding screen');
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  console.log('Rendering main app');

  // Main app
  const renderContent = () => {
    // Detail screens
    if (selectedTaskId) {
      return <TaskDetailScreen taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />;
    }
    
    if (selectedGoalId) {
      return <GoalDetailScreen goalId={selectedGoalId} onBack={() => setSelectedGoalId(null)} />;
    }
    
    if (menuSection) {
      switch (menuSection) {
        case 'profile':
          return <ProfileScreen onBack={() => setMenuSection(null)} />;
        case 'settings':
          return <SettingsScreen onBack={() => setMenuSection(null)} />;
        case 'tools':
          return <ToolsScreen onBack={() => setMenuSection(null)} />;
        case 'statistics':
          return (
            <StatisticsScreen 
              onBack={() => setMenuSection(null)} 
              onTaskClick={(taskId) => setSelectedTaskId(taskId)}
              onGoalClick={(goalId) => setSelectedGoalId(goalId)}
            />
          );
        case 'templates':
          return <StudentTemplates onBack={() => setMenuSection(null)} />;
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
      <Toast message={state.toast} />
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
