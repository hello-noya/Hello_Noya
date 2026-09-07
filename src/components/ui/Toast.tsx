import React from 'react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
      <div className="bg-[var(--accent)] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
