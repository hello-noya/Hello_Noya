import React from 'react';
import { CalendarDays, LayoutList, Target, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

type Tab = 'today' | 'schedule' | 'goals' | 'menu';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'today', icon: <CalendarDays size={20} />, label: t('today', lang) },
    { id: 'schedule', icon: <LayoutList size={20} />, label: t('schedule', lang) },
    { id: 'goals', icon: <Target size={20} />, label: t('goals', lang) },
    { id: 'menu', icon: <Menu size={20} />, label: t('menu', lang) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-t border-[var(--border)]">
      <div className="max-w-[420px] mx-auto flex relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2.5 transition-colors relative ${
              activeTab === tab.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)] animate-twinkle" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { Tab };
