export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }
  
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }
  
  try {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

export function isQuietHours(
  quietHoursEnabled: boolean,
  quietStart: { hours: number; minutes: number },
  quietEnd: { hours: number; minutes: number },
  currentDechaTime: { hours: number; minutes: number }
): boolean {
  if (!quietHoursEnabled) return false;
  
  const current = currentDechaTime.hours * 100 + currentDechaTime.minutes;
  const start = quietStart.hours * 100 + quietStart.minutes;
  const end = quietEnd.hours * 100 + quietEnd.minutes;
  
  if (start <= end) {
    return current >= start && current < end;
  } else {
    // Quiet hours span midnight
    return current >= start || current < end;
  }
}