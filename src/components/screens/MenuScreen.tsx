import React from 'react';
import { User, Settings, Wrench, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { renderIcon } from '../../utils/icons';

type MenuSection = 'profile' | 'settings' | 'tools';

interface MenuScreenProps {
  onNavigate: (section: MenuSection) => void;
}

export function MenuScreen({ onNavigate }: MenuScreenProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  const items = [
    { id: 'profile' as MenuSection, icon: <User size={20} />, label: t('profile', lang), desc: t('profileDesc', lang) },
    { id: 'settings' as MenuSection, icon: <Settings size={20} />, label: t('settings', lang), desc: t('settingsDesc', lang) },
    { id: 'tools' as MenuSection, icon: <Wrench size={20} />, label: t('tools', lang), desc: t('toolsDesc', lang) },
  ];

  return (
    <div className="space-y-2">
      {/* Profile card */}
      {state.profile && (
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            {renderIcon(state.profile.icon, 24, 'var(--accent)')}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{state.profile.name}</p>
            {state.profile.motto && <p className="text-xs text-[var(--text-secondary)] italic">{state.profile.motto}</p>}
          </div>
        </div>
      )}

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
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
