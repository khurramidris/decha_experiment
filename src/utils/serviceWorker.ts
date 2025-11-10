export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });

        // Request notification permission
        await requestNotificationPermission();
        
        // Setup background sync
        await setupBackgroundSync();
        
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  }
}

export async function requestNotificationPermission() {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Notification permission error:', error);
      return 'denied';
    }
  }
  return 'denied';
}

export async function setupBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.sync) {
        // Register background sync for alarms
        await registration.sync.register('alarm-sync');
        console.log('✅ Background sync registered');
      }
    } catch (error) {
      console.warn('⚠️ Background sync not available (expected in some browsers):', error);
    }
  }
}

export async function sendNotification(title: string, options: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
        // Use service worker notifications
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
      } else {
        // Fallback to regular notifications
        new Notification(title, options);
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  }
}

export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

export function promptForInstall(): void {
  // This will be handled by the PWA install prompt
  if ('BeforeInstallPromptEvent' in window) {
    // The browser will handle the install prompt automatically
    console.log('Install prompt will be shown by browser');
  }
}