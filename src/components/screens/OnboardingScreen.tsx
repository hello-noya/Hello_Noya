import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createProfile } from '../../utils/storage';
import { PROFILE_ICONS } from '../../utils/storage';
import { t } from '../../utils/i18n';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { setProfile } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('✨');

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleStart = () => {
    const profile = createProfile(name || 'Гость', motto, selectedIcon);
    setProfile(profile);
    onComplete();
  };

  const handleSkip = () => {
    const profile = createProfile('Гость', '', '✨');
    setProfile(profile);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          <div className={`h-1 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-[var(--accent)]' : 'bg-[var(--hover)]'}`} />
          <div className={`h-1 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-[var(--accent)]' : 'bg-[var(--hover)]'}`} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <Sparkles size={18} className="text-[var(--accent)] animate-pulse" />
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

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-6">{t('chooseIcon', 'ru')}</h2>
            
            <div className="grid grid-cols-4 gap-3 mb-8">
              {PROFILE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                    selectedIcon === icon
                      ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)] scale-105'
                      : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {t('start', 'ru')}
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full mt-3 py-2 text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)] transition-colors"
            >
              {t('skip', 'ru')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
