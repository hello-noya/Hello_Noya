// Notification system for habit reminders

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string; // HH:MM
  enabled: boolean;
}

export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(permission => {
      return permission === 'granted';
    });
  }

  return Promise.resolve(false);
}

export function sendNotification(title: string, body: string): void {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/bloom-icon.svg',
      badge: '/bloom-icon.svg',
      tag: 'bloom-habit-reminder',
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

export function scheduleHabitReminder(habitName: string, time: string): number | null {
  if (Notification.permission !== 'granted') {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const delay = reminderTime.getTime() - now.getTime();

  return window.setTimeout(() => {
    sendNotification(
      '⏰ Время привычки!',
      `${habitName} - не забудь выполнить!`
    );
  }, delay);
}

export function cancelReminder(timeoutId: number): void {
  clearTimeout(timeoutId);
}
