import React, { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { state, updateSettings, resetAll } = useApp();
  const lang = state.settings.language;
  const theme = state.settings.theme;
  const [showConfirm, setShowConfirm] = useState(false);

  const themes: { id: 'pink' | 'lavender' | 'dark'; label: string; icon: string }[] = [
    { id: 'pink', label: t('themePink', lang), icon: '🌸' },
    { id: 'lavender', label: t('themeLavender', lang), icon: '💜' },
    { id: 'dark', label: t('themeDark', lang), icon: '🌙' },
  ];

  const handleExport = () => {
    const data = {
      profile: state.profile,
      habits: state.habits,
      tasks: state.tasks,
      events: state.events,
      goals: state.goals,
      stats: state.stats,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings', lang)}</h2>
      </div>

      {/* Language */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-sm font-medium text-[var(--text-primary)] mb-3">{t('language', lang)}</p>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ language: 'ru' })}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              lang === 'ru' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => updateSettings({ language: 'en' })}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              lang === 'en' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-sm font-medium text-[var(--text-primary)] mb-3">{t('theme', lang)}</p>
        <div className="flex gap-3 justify-center">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => updateSettings({ theme: th.id })}
              className={`w-14 h-14 rounded-2xl text-2xl transition-all flex items-center justify-center ${
                theme === th.id 
                  ? 'bg-[var(--accent)] text-white shadow-lg scale-110' 
                  : 'bg-[var(--hover)] text-[var(--text-secondary)] hover:scale-105'
              }`}
            >
              {th.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Export data */}
      <button
        onClick={handleExport}
        className="w-full py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-2 transition-all hover:border-[var(--accent)]/50"
      >
        <Download size={18} />
        {lang === 'ru' ? 'Экспорт данных' : 'Export Data'}
      </button>

      {/* Logout */}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-medium transition-all hover:bg-red-500/20"
      >
        {t('logout', lang)}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        message={t('logoutConfirm', lang)}
        onConfirm={() => { resetAll(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
