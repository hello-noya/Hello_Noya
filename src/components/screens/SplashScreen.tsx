import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { t } from '../../utils/i18n';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Logo */}
      <div className="animate-fade-in flex flex-col items-center">
        <img 
          src="/bloom-icon.svg" 
          alt="Bloom" 
          className="w-24 h-24 rounded-3xl shadow-lg mb-4 animate-float" 
        />
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('appName', 'ru')}</h1>
          <Sparkles size={20} className="text-[var(--accent)] animate-sparkle" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">{t('appSlogan', 'ru')}</p>
      </div>

      {/* Loading indicator — 3 pulsing dots */}
      <div className="absolute bottom-20 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-soft" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
      </div>
    </div>
  );
}
