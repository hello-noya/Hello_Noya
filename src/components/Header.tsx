import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../utils/i18n';

export function Header() {
  const { state } = useApp();
  const lang = state.settings.language;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = formatDate(time, lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[var(--text-primary)] text-lg">{t('appName', lang)}</span>
            <Sparkles size={14} className="text-[var(--accent)] animate-pulse" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-full px-3 py-1.5">
          <Clock size={14} className="text-[var(--text-secondary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
