// Service Worker Alarm Sync Utility
// Ensures alarms are accessible to service worker for background notifications

import { storeAlarmsInIndexedDB } from './backgroundAlarmSync';

export async function syncAlarmsToServiceWorker(alarms: any[]) {
  if (!('serviceWorker' in navigator)) return;

  try {
    // Store alarms in IndexedDB for background access
    await storeAlarmsInIndexedDB(alarms);
    
    const registration = await navigator.serviceWorker.ready;
    
    // Also send to service worker via message
    registration.active?.postMessage({
      type: 'SYNC_ALARMS',
      alarms: alarms
    });
  } catch (error) {
    console.error('Failed to sync alarms to service worker:', error);
  }
}

// storeAlarmsInIndexedDB is now imported from backgroundAlarmSync

export async function requestBackgroundAlarmPermission() {
  if (!('serviceWorker' in navigator)) return false;
  
  try {
    // Request notification permission first
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;
    
    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.ready;
    
    // Request periodic background sync (if supported)
    if ('periodicSync' in (registration as any)) {
      try {
        const status = await (navigator as any).permissions.query({
          name: 'periodic-background-sync' as PermissionName
        });
        
        if (status.state === 'granted') {
          await (registration as any).periodicSync.register('alarm-sync', {
            minInterval: 60000 // Check every minute
          });
        }
      } catch (error) {
        // Periodic sync not supported, fall back to regular service worker
        console.log('Periodic background sync not available');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to request background alarm permission:', error);
    return false;
  }
}

