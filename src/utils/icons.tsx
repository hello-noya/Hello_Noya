import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Hand-drawn pencil style icons - simple, clean, bright colors
export const IconComponents: Record<string, React.FC<IconProps>> = {
  // Habits
  water: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L6 10C4.5 13 5 17 8 19C11 21 14 20 16 17C18 14 17 10 15 8L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  book: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4C4 3 5 2 6 2H10L12 4L14 2H18C19 2 20 3 20 4V20C20 21 19 22 18 22H6C5 22 4 21 4 20V4Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="4" x2="12" y2="22" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  run: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="14" cy="4" r="2.5" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M9 22L11 14L15 18V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14L7 19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 10L13 13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  sleep: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M9 10L11 12L9 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 10L17 12L15 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  apple: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C10 3 8 4 7 6C5 8 5 13 7 16C9 19 11 21 12 21C13 21 15 19 17 16C19 13 19 8 17 6C16 4 14 3 12 3Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3C12 2 13 1 14 1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  brain: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C9 2 7 4 7 7C5 7 4 9 4 12C4 15 5 17 7 17C7 20 9 22 12 22C15 22 17 20 17 17C19 17 20 15 20 12C20 9 19 7 17 7C17 4 15 2 12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2V22" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  music: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="17" r="3" fill={color} stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="15" r="3" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M11 17V6L19 4V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gym: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="4" height="6" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
      <rect x="17" y="9" width="4" height="6" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
      <rect x="7" y="10" width="10" height="4" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  coffee: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 10H17V18C17 19.5 15.5 21 14 21H7C5.5 21 4 19.5 4 18V10Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 12H19C20 12 21 13 21 14V15C21 16 20 17 19 17H17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 6C8 5 9 4 10 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6C12 5 13 4 14 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  laptop: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="11" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M2 18H22V19C22 20 21 21 20 21H4C3 21 2 20 2 19V18Z" fill={color} stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  // Profile
  star: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 9L22 9.5L17 14.5L18 22L12 18L6 22L7 14.5L2 9.5L9 9L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  crown: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 18L5 10L9 13L12 8L15 13L19 10L21 18H3Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  flame: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 7 8 12C8 16 10 20 12 20C14 20 16 16 16 12C16 7 12 2 12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  diamond: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L20 9L12 22L4 9L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rocket: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 12L6 16L10 14L12 22L14 14L18 16L16 12C16 6 12 2 12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  heart: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21L10.55 19.7C5.4 15.1 2 12.1 2 8.5C2 5.4 4.4 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12.1 18.6 15.1 13.45 19.7L12 21Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  leaf: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 8C17 8 21 12 21 17C21 20 18 22 15 22C12 22 8 18 8 18C8 18 4 14 4 11C4 8 7 6 10 6C13 6 17 8 17 8Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  zap: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14H11L10 22L20 10H13L13 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sun: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill={color} stroke={color} strokeWidth="1.5"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  moon: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trophy: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 21H16M12 17V21M7 4H17V10C17 13.31 14.76 16 12 16C9.24 16 7 13.31 7 10V4Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 6H19C20.1 6 21 6.9 21 8V9C21 10.1 20.1 11 19 11H17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 6H5C3.9 6 3 6.9 3 8V9C3 10.1 3.9 11 5 11H7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  sparkles: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Events
  class: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="14" rx="2" fill={color} stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  meeting: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" fill={color} stroke={color} strokeWidth="1.5"/>
      <circle cx="15" cy="7" r="3" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M4 21V19C4 16.79 5.79 15 8 15H10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 21V19C20 16.79 18.21 15 16 15H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  workout: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="4" height="6" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
      <rect x="17" y="9" width="4" height="6" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
      <rect x="7" y="10" width="10" height="4" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  lunch: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} stroke={color} strokeWidth="1.5"/>
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  call: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C10.5 20.92 2 12.42 2 1.92C2 1.37 2.45 0.92 3 0.92H6C6.55 0.92 7 1.37 7 1.92C7 3.12 7.2 4.28 7.58 5.38L5.59 7.37C7.08 10.18 9.32 12.42 12.13 13.92L14.12 11.92C15.22 12.3 16.38 12.5 17.58 12.5C18.13 12.5 18.58 12.95 18.58 13.5V16.92H22Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  work: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" fill={color} stroke={color} strokeWidth="1.5"/>
      <path d="M16 21V5C16 3.88 15.12 3 14 3H10C8.88 3 8 3.88 8 5V21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  rest: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 9V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V9" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 11H22V15C22 16.1 21.1 17 20 17H4C2.9 17 2 16.1 2 15V11Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  travel: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17.8 19.2L16 11L19.5 7.5C21 6 21.5 4 21 3C20 2.5 18 3 16.5 4.5L13 8L4.8 6.2C4.3 6.1 3.9 6.3 3.7 6.7L3.4 7.2C3.2 7.7 3.3 8.2 3.7 8.5L9 12L7 15H4L3 16L6 18L8 20L9 19V16L12 14L17.3 19.7C17.6 20.1 18.1 20.2 18.5 19.9L19 19.4C19.4 19 19.5 18.5 19.2 18.1L17.8 19.2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export function renderIcon(name: string, size: number = 20, color: string = 'currentColor'): React.ReactNode {
  const IconComponent = IconComponents[name];
  if (!IconComponent) {
    return <span style={{ fontSize: size }}>{name}</span>;
  }
  return <IconComponent size={size} color={color} />;
}
