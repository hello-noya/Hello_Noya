import React, { useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { PROFILE_ICONS } from '../../utils/storage';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { renderIcon } from '../../utils/icons';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { state, updateProfile, showToast, logout } = useApp();
  const lang = state.settings.language;
  const profile = state.profile;

  const [name, setName] = useState(profile?.name || '');
  const [motto, setMotto] = useState(profile?.motto || '');
  const [icon, setIcon] = useState(profile?.icon || 'star');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = () => {
    updateProfile({ name, motto, icon });
    showToast(t('saved', lang));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('profile', lang)}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('name', lang)}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('motto', lang)}</label>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('iconLabel', lang)}</label>
          <div className="grid grid-cols-6 gap-2">
            {PROFILE_ICONS.map((iconKey) => (
              <button
                key={iconKey}
                onClick={() => setIcon(iconKey)}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                  icon === iconKey
                    ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]'
                    : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                }`}
                title={t(`icon_${iconKey}`, lang)}
              >
                {renderIcon(iconKey, 20, icon === iconKey ? 'var(--accent)' : 'var(--text-secondary)')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {t('save', lang)}
        </button>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">{t('achievements', lang)}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{state.stats.habitsCompleted}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('habitsDone', lang)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{state.stats.bestStreak}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('bestStreak', lang)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{state.stats.tasksToday}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('tasksTodayLabel', lang)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{state.stats.goalsAchieved}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('goalsReached', lang)}</p>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-medium flex items-center justify-center gap-2 transition-all hover:bg-red-500/20"
      >
        <LogOut size={18} />
        {t('logoutAccount', lang)}
      </button>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        message={t('logoutConfirm', lang)}
        onConfirm={() => {
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
