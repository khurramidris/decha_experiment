// Background Alarm Sync - Ensures alarms work when screen is locked
// Uses IndexedDB for service worker access and periodic checks

let alarmCheckInterval: number | null = null;

export async function startBackgroundAlarmSync() {
  if (!('serviceWorker' in navigator)) return;
  
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    // Ensure service worker is ready
    const registration = await navigator.serviceWorker.ready;
    
    // Set up periodic alarm checking (every 5 seconds)
    // This works even when app is in background
    if (alarmCheckInterval) {
      clearInterval(alarmCheckInterval);
    }
    
    alarmCheckInterval = window.setInterval(async () => {
      await checkAndTriggerAlarms(registration);
    }, 5000);
    
    // Also check immediately
    await checkAndTriggerAlarms(registration);
    
    console.log('Background alarm sync started');
  } catch (error) {
    console.error('Failed to start background alarm sync:', error);
  }
}

export function stopBackgroundAlarmSync() {
  if (alarmCheckInterval) {
    clearInterval(alarmCheckInterval);
    alarmCheckInterval = null;
  }
}

async function checkAndTriggerAlarms(registration: ServiceWorkerRegistration) {
  try {
    // Get alarms from IndexedDB
    const alarms = await getAlarmsFromIndexedDB();
    if (!alarms || alarms.length === 0) return;
    
    const enabledAlarms = alarms.filter((alarm: any) => alarm.enabled);
    if (enabledAlarms.length === 0) return;
    
    // Get current DECHA time
    const currentDechaTime = getCurrentDechaTime();
    
    // Check each alarm
    for (const alarm of enabledAlarms) {
      if (shouldTriggerAlarm(alarm, currentDechaTime)) {
        await triggerAlarmNotification(registration, alarm, currentDechaTime);
      }
    }
  } catch (error) {
    console.error('Error checking alarms:', error);
  }
}

function getCurrentDechaTime() {
  const now = new Date();
  const earthSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  
  const DECHA_SECOND_IN_EARTH_SECONDS = 86400 / 100000;
  const dechaSecondsPrecise = earthSeconds / DECHA_SECOND_IN_EARTH_SECONDS;
  const totalDechaSeconds = Math.floor(dechaSecondsPrecise);
  
  return {
    hours: Math.floor(totalDechaSeconds / 10000),
    minutes: Math.floor((totalDechaSeconds % 10000) / 100),
    seconds: Math.floor(totalDechaSeconds % 100),
    totalSeconds: totalDechaSeconds
  };
}

function shouldTriggerAlarm(alarm: any, currentTime: any): boolean {
  // Check if time matches
  if (alarm.dechaTime.hours !== currentTime.hours ||
      alarm.dechaTime.minutes !== currentTime.minutes ||
      alarm.dechaTime.seconds !== currentTime.seconds) {
    return false;
  }

  // Check repeat logic
  const now = new Date();
  const today = now.getDay();
  const lastTriggered = alarm.lastTriggered ? new Date(alarm.lastTriggered) : null;
  const lastTriggeredDate = lastTriggered ? lastTriggered.toDateString() : null;
  const todayDate = now.toDateString();

  // Don't trigger if already triggered today (unless it's a daily repeat)
  if (lastTriggeredDate === todayDate && alarm.repeat !== 'daily') {
    return false;
  }

  switch (alarm.repeat) {
    case 'once':
      return !alarm.lastTriggered;
    case 'daily':
      return true;
    case 'weekdays':
      return today >= 1 && today <= 5;
    case 'weekends':
      return today === 0 || today === 6;
    case 'custom':
      return alarm.customDays && alarm.customDays.includes(today);
    default:
      return true;
  }
}

async function triggerAlarmNotification(
  registration: ServiceWorkerRegistration,
  alarm: any,
  currentTime: any
) {
  const earthHours = Math.floor((currentTime.totalSeconds * 0.864) / 3600);
  const earthMins = Math.floor(((currentTime.totalSeconds * 0.864) % 3600) / 60);
  
  const title = `⏰ ${alarm.label}`;
  const body = `DECHA: ${currentTime.hours}:${String(currentTime.minutes).padStart(2, '0')}:${String(currentTime.seconds).padStart(2, '0')}\nEarth: ${String(earthHours).padStart(2, '0')}:${String(earthMins).padStart(2, '0')}`;

  try {
    await registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `alarm-${alarm.id}`,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: {
        alarmId: alarm.id,
        timestamp: Date.now()
      }
    });
    
    // Update lastTriggered in IndexedDB
    await updateAlarmLastTriggered(alarm.id);
  } catch (error) {
    console.error('Failed to show alarm notification:', error);
  }
}

async function getAlarmsFromIndexedDB(): Promise<any[]> {
  return new Promise((resolve) => {
    const request = indexedDB.open('decha-storage', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('alarms')) {
        resolve([]);
        return;
      }
      
      const transaction = db.transaction(['alarms'], 'readonly');
      const store = transaction.objectStore('alarms');
      const getRequest = store.get('decha-alarms');
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        resolve(data ? JSON.parse(data) : []);
      };
      
      getRequest.onerror = () => resolve([]);
    };
    
    request.onerror = () => resolve([]);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('alarms')) {
        db.createObjectStore('alarms');
      }
    };
  });
}

async function updateAlarmLastTriggered(alarmId: string) {
  const alarms = await getAlarmsFromIndexedDB();
  const updatedAlarms = alarms.map((alarm: any) =>
    alarm.id === alarmId ? { ...alarm, lastTriggered: Date.now() } : alarm
  );
  
  await storeAlarmsInIndexedDB(updatedAlarms);
}

export async function storeAlarmsInIndexedDB(alarms: any[]) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('decha-storage', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('alarms')) {
        db.createObjectStore('alarms');
      }
      
      const transaction = db.transaction(['alarms'], 'readwrite');
      const store = transaction.objectStore('alarms');
      store.put(JSON.stringify(alarms), 'decha-alarms');
      
      transaction.oncomplete = () => resolve(undefined);
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('alarms')) {
        db.createObjectStore('alarms');
      }
    };
  });
}

