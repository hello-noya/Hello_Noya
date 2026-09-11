import React, { useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { PROFILE_ICONS } from '../../utils/storage';
import { renderIcon } from '../../utils/icons';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Header } from '../Header';

interface ProfileContentProps {
  lang: 'ru' | 'en';
  state: any;
  onClose: () => void;
}

export function ProfileContent({ lang, state, onClose }: ProfileContentProps) {
  const { updateProfile, showToast, logout } = useApp();
  const profile = state.profile;

  const [name, setName] = useState(profile?.name || '');
  const [icon, setIcon] = useState(profile?.icon || 'star');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = () => {
    updateProfile({ name, icon });
    showToast(t('saved', lang));
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="space-y-4">
      <Header />
      
      <div className="space-y-3">
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
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
