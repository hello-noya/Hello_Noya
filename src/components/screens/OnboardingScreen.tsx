import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createProfile, getExampleData } from '../../utils/storage';
import { PROFILE_ICONS } from '../../utils/storage';
import { t } from '../../utils/i18n';
import { renderIcon } from '../../utils/icons';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { setProfile, addHabit, addTask, addGoal } = useApp();
  const [step, setStep] = useState(0); // 0 = welcome, 1 = name, 2 = icon
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');

  const handleSocialLogin = (provider: string) => {
    const profile = createProfile('Пользователь', '', 'star');
    setProfile(profile);
    
    // Добавляем примеры данных
    const examples = getExampleData();
    examples.habits.forEach(h => addHabit(h));
    examples.tasks.forEach(t => addTask(t));
    examples.goals.forEach(g => addGoal(g));
    
    setTimeout(() => onComplete(), 100);
  };

  const handleGuestLogin = () => {
    const profile = createProfile('Гость', '', 'sparkles');
    setProfile(profile);
    
    // Добавляем примеры данных
    const examples = getExampleData();
    examples.habits.forEach(h => addHabit(h));
    examples.tasks.forEach(t => addTask(t));
    examples.goals.forEach(g => addGoal(g));
    
    setTimeout(() => onComplete(), 100);
  };

  const handleStartRegistration = () => {
    setStep(1);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleStart = () => {
    const profile = createProfile(name || 'Гость', motto, selectedIcon);
    setProfile(profile);
    
    // Добавляем примеры данных
    const examples = getExampleData();
    examples.habits.forEach(h => addHabit(h));
    examples.tasks.forEach(t => addTask(t));
    examples.goals.forEach(g => addGoal(g));
    
    setTimeout(() => onComplete(), 100);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        {/* Step 0: Welcome with social login */}
        {step === 0 && (
          <div className="animate-fade-in text-center">
            {/* Logo */}
            <div className="mb-6">
              <img src="/bloom-icon.svg" alt="Bloom" className="w-20 h-20 mx-auto rounded-2xl shadow-lg" />
            </div>
            <div className="flex items-center gap-2 mb-2 justify-center">
              <Sparkles size={18} className="text-[var(--accent)] animate-sparkle" />
              <span className="text-[var(--accent)] text-sm font-medium">{t('appName', 'ru')}</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('welcome', 'ru')}</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">{t('appSlogan', 'ru')}</p>

            {/* Social login buttons */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 rounded-xl bg-white border border-[var(--border)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-3 hover:bg-[var(--hover)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Продолжить с Google
              </button>
              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Продолжить с Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-muted)]">или</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Other options */}
            <button
              onClick={handleStartRegistration}
              className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] mb-3"
            >
              Создать аккаунт
            </button>
            <button
              onClick={handleGuestLogin}
              className="w-full py-2.5 text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)] transition-colors"
            >
              Войти как гость
            </button>
          </div>
        )}

        {/* Step 1: Name and motto */}
        {step === 1 && (
          <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="flex gap-2 mb-8 justify-center">
              <div className="h-1 w-12 rounded-full bg-[var(--accent)]" />
              <div className="h-1 w-12 rounded-full bg-[var(--hover)]" />
            </div>

            <div className="flex items-center gap-2 mb-2 justify-center">
              <Sparkles size={18} className="text-[var(--accent)] animate-sparkle" />
              <span className="text-[var(--accent)] text-sm font-medium">{t('appName', 'ru')}</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">{t('welcome', 'ru')}</h1>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('yourName', 'ru')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('namePlaceholder', 'ru')}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">{t('mottoLabel', 'ru')}</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder={t('mottoPlaceholder', 'ru')}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {t('next', 'ru')}
            </button>
          </div>
        )}

        {/* Step 2: Icon selection */}
        {step === 2 && (
          <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="flex gap-2 mb-8 justify-center">
              <div className="h-1 w-12 rounded-full bg-[var(--accent)]" />
              <div className="h-1 w-12 rounded-full bg-[var(--accent)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-6">{t('chooseIcon', 'ru')}</h2>
            
            <div className="grid grid-cols-6 gap-2 mb-8">
              {PROFILE_ICONS.map((iconKey) => (
                <button
                  key={iconKey}
                  onClick={() => setSelectedIcon(iconKey)}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === iconKey
                      ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)] scale-105'
                      : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                  title={t(`icon_${iconKey}`, 'ru')}
                >
                  {renderIcon(iconKey, 20, selectedIcon === iconKey ? 'var(--accent)' : 'var(--text-secondary)')}
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {t('start', 'ru')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
