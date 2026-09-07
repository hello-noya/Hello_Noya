import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { t } from '../../utils/i18n';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-center transition-opacity duration-500">
      <div className={`flex flex-col items-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('appName', 'ru')}</h1>
          <Sparkles size={20} className="text-[var(--accent)] animate-pulse" />
        </div>
        <p className="text-[var(--text-secondary)] text-sm">{t('appSlogan', 'ru')}</p>
      </div>
      <div className={`absolute bottom-20 flex gap-2 transition-opacity duration-700 delay-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
