import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[420px] bg-[var(--card-bg)] rounded-t-3xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)] p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors"
          >
            <X size={20} className="text-[var(--text-secondary)]" />
          </button>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <div className="w-8"></div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
