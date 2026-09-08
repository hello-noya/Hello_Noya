import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Bell, BellOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { requestNotificationPermission, sendNotification } from '../../utils/notifications';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { state, updateSettings, resetAll } = useApp();
  const lang = state.settings.language;
  const theme = state.settings.theme;
  const [showConfirm, setShowConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        sendNotification(
          lang === 'ru' ? '🎉 Уведомления включены!' : '🎉 Notifications enabled!',
          lang === 'ru' ? 'Вы будете получать напоминания о привычках' : 'You will receive habit reminders'
        );
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const themes: { id: 'pink' | 'lavender' | 'dark'; label: string; color: string }[] = [
    { id: 'pink', label: t('themePink', lang), color: '#ff4d8d' },
    { id: 'lavender', label: t('themeLavender', lang), color: '#8b5cf6' },
    { id: 'dark', label: t('themeDark', lang), color: '#a78bfa' },
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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings', lang)}</h2>
      </div>

      {/* Language */}
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

      {/* Theme - компактные карточки с SVG иконками */}
      <div className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">{t('theme', lang)}</p>
        <div className="flex gap-2">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => updateSettings({ theme: th.id })}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                theme === th.id 
                  ? 'bg-[var(--accent)] text-white shadow-md' 
                  : 'bg-[var(--hover)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/10'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={theme === th.id ? 'white' : th.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {th.id === 'pink' && (
                  <path d="M8 2C8 2 10 4 10 6C10 8 8 8 8 8C8 8 6 8 6 6C6 4 8 2 8 2Z"/>
                )}
                {th.id === 'lavender' && (
                  <circle cx="8" cy="8" r="5"/>
                )}
                {th.id === 'dark' && (
                  <path d="M8 2C5.24 2 3 4.24 3 7C3 9.76 5.24 12 8 12C10.76 12 13 9.76 13 7C13 6.5 12.9 6 12.75 5.5C12.25 6.5 11 7.25 9.5 7.25C7.5 7.25 6 5.75 6 3.75C6 3.25 6.1 2.75 6.25 2.25C5.75 2.1 5.25 2 4.75 2C3.75 2 2.75 2.5 2 3.25C3.5 2.5 5.5 2 8 2Z"/>
                )}
              </svg>
              <span>{th.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {notificationsEnabled ? (
              <Bell size={18} className="text-[var(--accent)]" />
            ) : (
              <BellOff size={18} className="text-[var(--text-muted)]" />
            )}
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {lang === 'ru' ? 'Уведомления' : 'Notifications'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'ru' ? 'Напоминания о привычках' : 'Habit reminders'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              notificationsEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--hover)]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                notificationsEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Export data */}
      <button
        onClick={handleExport}
        className="w-full py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium flex items-center justify-center gap-2 transition-all hover:border-[var(--accent)]/50"
      >
        <Download size={16} />
        {lang === 'ru' ? 'Экспорт данных' : 'Export Data'}
      </button>

      {/* Logout */}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium transition-all hover:bg-red-500/20"
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
