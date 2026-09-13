import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Header } from '../Header';

interface SettingsContentProps {
  lang: 'ru' | 'en';
  state: any;
  onClose: () => void;
}

export function SettingsContent({ lang, state, onClose }: SettingsContentProps) {
  const { updateSettings, resetAll } = useApp();
  const theme = state.settings.theme;
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const themes: { id: 'lavender' | 'dark'; label: string }[] = [
    { id: 'lavender', label: lang === 'ru' ? 'Лавандовый' : 'Lavender' },
    { id: 'dark', label: lang === 'ru' ? 'Тёмный' : 'Dark' },
  ];

  const handleClearData = () => {
    resetAll();
    onClose();
  };

  return (
    <div className="space-y-4">
      <Header />
      
      <div className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">{t('language', lang)}</p>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ language: 'ru' })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              lang === 'ru' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => updateSettings({ language: 'en' })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              lang === 'en' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">{t('theme', lang)}</p>
        <div className="flex gap-2">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => updateSettings({ theme: th.id })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === th.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowClearConfirm(true)}
        className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-medium flex items-center justify-center gap-2 transition-all hover:bg-red-500/20"
      >
        <Trash2 size={18} />
        {lang === 'ru' ? 'Стереть все данные' : 'Clear All Data'}
      </button>

      <ConfirmDialog
        isOpen={showClearConfirm}
        message={lang === 'ru' ? 'Вы уверены? Все данные будут удалены навсегда.' : 'Are you sure? All data will be permanently deleted.'}
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
