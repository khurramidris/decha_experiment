// Custom Service Worker for Background Alarms
// This extends the Vite PWA service worker with alarm functionality

const ALARM_CHECK_INTERVAL = 1000; // Check every second
const ALARM_STORAGE_KEY = 'decha-alarms';

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  startAlarmChecker();
});

// Start checking for alarms
function startAlarmChecker() {
  setInterval(async () => {
    await checkAlarms();
  }, ALARM_CHECK_INTERVAL);
}

// Check alarms and trigger notifications
async function checkAlarms() {
  try {
    // Get alarms from storage
    const alarmsData = await getAlarmsFromStorage();
    if (!alarmsData || !Array.isArray(alarmsData)) return;

    const enabledAlarms = alarmsData.filter(alarm => alarm.enabled);
    if (enabledAlarms.length === 0) return;

    // Get current DECHA time
    const currentDechaTime = getCurrentDechaTime();
    
    // Check each alarm
    for (const alarm of enabledAlarms) {
      if (shouldTriggerAlarm(alarm, currentDechaTime)) {
        await triggerAlarm(alarm, currentDechaTime);
      }
    }
  } catch (error) {
    console.error('Error checking alarms:', error);
  }
}

// Get current DECHA time
function getCurrentDechaTime() {
  const now = new Date();
  const earthSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  
  // Convert to DECHA time
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

// Check if alarm should trigger
function shouldTriggerAlarm(alarm, currentTime) {
  // Check if time matches
  if (alarm.dechaTime.hours !== currentTime.hours ||
      alarm.dechaTime.minutes !== currentTime.minutes ||
      alarm.dechaTime.seconds !== currentTime.seconds) {
    return false;
  }

  // Check repeat logic
  const now = new Date();
  const today = now.getDay(); // 0-6 (Sunday-Saturday)

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

// Trigger alarm notification
async function triggerAlarm(alarm, currentTime) {
  const earthHours = Math.floor((currentTime.totalSeconds * 0.864) / 3600);
  const earthMins = Math.floor(((currentTime.totalSeconds * 0.864) % 3600) / 60);
  
  const title = `⏰ ${alarm.label}`;
  const body = `DECHA: ${currentTime.hours}:${String(currentTime.minutes).padStart(2, '0')}:${String(currentTime.seconds).padStart(2, '0')}\nEarth: ${String(earthHours).padStart(2, '0')}:${String(earthMins).padStart(2, '0')}`;

  await self.registration.showNotification(title, {
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

  // Notify all clients
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'ALARM_TRIGGERED',
      alarmId: alarm.id
    });
  });
}

// Get alarms from IndexedDB or localStorage
async function getAlarmsFromStorage() {
  try {
    // Try to get from IndexedDB first (more reliable for service workers)
    return new Promise((resolve) => {
      const request = indexedDB.open('decha-storage', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['alarms'], 'readonly');
        const store = transaction.objectStore('alarms');
        const getRequest = store.get(ALARM_STORAGE_KEY);
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          resolve(data ? JSON.parse(data) : null);
        };
        getRequest.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error('Error getting alarms from storage:', error);
    return null;
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Handle messages from main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

