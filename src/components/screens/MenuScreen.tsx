import React, { useState } from 'react';
import { User, Settings, Wrench, ChevronRight, TrendingUp, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { renderIcon } from '../../utils/icons';
import { BottomSheet } from '../ui/BottomSheet';
import { ProfileContent } from './ProfileContent';
import { StatisticsContent } from './StatisticsContent';
import { TemplatesContent } from './TemplatesContent';
import { SettingsContent } from './SettingsContent';
import { ToolsContent } from './ToolsContent';
import { Header } from '../Header';

type MenuSection = 'profile' | 'settings' | 'tools' | 'statistics' | 'templates';

interface MenuScreenProps {
  onNavigate: (section: MenuSection) => void;
}

export function MenuScreen({ onNavigate }: MenuScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;
  const [openSheet, setOpenSheet] = useState<MenuSection | null>(null);

  const items = [
    { id: 'profile' as MenuSection, icon: <User size={20} />, label: t('profile', lang), desc: t('profileDesc', lang) },
    { id: 'statistics' as MenuSection, icon: <TrendingUp size={20} />, label: lang === 'ru' ? 'Статистика' : 'Statistics', desc: lang === 'ru' ? 'Анализ продуктивности' : 'Productivity analysis' },
    { id: 'templates' as MenuSection, icon: <BookOpen size={20} />, label: lang === 'ru' ? 'Шаблоны' : 'Templates', desc: lang === 'ru' ? 'Готовые наборы для быстрого старта' : 'Ready-made sets for quick start' },
    { id: 'settings' as MenuSection, icon: <Settings size={20} />, label: t('settings', lang), desc: t('settingsDesc', lang) },
    { id: 'tools' as MenuSection, icon: <Wrench size={20} />, label: t('tools', lang), desc: t('toolsDesc', lang) },
  ];

  const handleItemClick = (id: MenuSection) => {
    setOpenSheet(id);
  };

  const handleCloseSheet = () => {
    setOpenSheet(null);
  };

  const renderSheetContent = (section: MenuSection) => {
    switch (section) {
      case 'profile':
        return <ProfileContent lang={lang} state={state} onClose={handleCloseSheet} />;
      case 'statistics':
        return <StatisticsContent lang={lang} state={state} onClose={handleCloseSheet} />;
      case 'templates':
        return <TemplatesContent lang={lang} onClose={handleCloseSheet} />;
      case 'settings':
        return <SettingsContent lang={lang} state={state} onClose={handleCloseSheet} />;
      case 'tools':
        return <ToolsContent lang={lang} onClose={handleCloseSheet} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Header />
      
      {/* Profile card */}
      {state.profile && (
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
            {renderIcon(state.profile.icon, 24, 'var(--accent)')}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{state.profile.name}</p>
          </div>
        </div>
      )}

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
            <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </button>
      ))}
    </div>
  );
}

export type { MenuSection };
