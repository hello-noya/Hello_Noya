import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

  const themes: { id: 'pink' | 'lavender' | 'mint'; label: string }[] = [
    { id: 'pink', label: t('themePink', lang) },
    { id: 'lavender', label: t('themeLavender', lang) },
    { id: 'mint', label: t('themeMint', lang) },
  ];

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
        <div className="flex gap-2">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => updateSettings({ theme: th.id })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                theme === th.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--hover)] text-[var(--text-secondary)]'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>
      </div>

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
