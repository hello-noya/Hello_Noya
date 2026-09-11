import React from 'react';
import { Music, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { Header } from '../Header';

interface ToolsContentProps {
  lang: 'ru' | 'en';
  onClose: () => void;
}

export function ToolsContent({ lang }: ToolsContentProps) {
  const { state } = useApp();

  return (
    <div className="space-y-4">
      <Header />
      
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <Music size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {lang === 'ru' ? 'Lo-fi плеер' : 'Lo-fi Player'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {state.toolsState?.lofiPlaying ? (lang === 'ru' ? 'Играет' : 'Playing') : (lang === 'ru' ? 'Остановлен' : 'Stopped')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <Timer size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {lang === 'ru' ? 'Помодоро таймер' : 'Pomodoro Timer'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {state.toolsState.pomodoroRunning 
                ? (lang === 'ru' ? 'Работает' : 'Running')
                : (lang === 'ru' ? 'Остановлен' : 'Stopped')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
