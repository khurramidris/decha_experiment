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
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...options,
        });
      });
    } else {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
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

export function playAlarmBeep() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {}
}
