import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-[var(--card-bg)] rounded-2xl p-6 max-w-xs w-full shadow-xl animate-scale-in">
        <p className="text-[var(--text-primary)] text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] font-medium transition-colors hover:opacity-80"
          >
            {t('no', lang)}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium transition-colors hover:bg-red-600"
          >
            {t('yes', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
