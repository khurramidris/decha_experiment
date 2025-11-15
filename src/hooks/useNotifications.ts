import { useEffect, useState } from 'react';
import { useAlarmsStore } from '../stores/alarmsStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useStatsStore } from '../stores/statsStore';
import { DechaTime } from '../types/decha';
import { showNotification, isQuietHours, playAlarmBeep } from '../utils/notifications';
import { getDayPeriod, getDayPeriodDescription } from '../utils/dechaCalculations';

export function useNotifications(currentTime: DechaTime) {
  const [lastChecked, setLastChecked] = useState<string>('');
  const [lastHourlyNotification, setLastHourlyNotification] = useState<number>(-1);
  
  const alarms = useAlarmsStore(state => state.alarms);
  const markTriggered = useAlarmsStore(state => state.markTriggered);
  
  const {
    enableHourlyNotifications,
    notificationFrequency,
    notificationSound,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
  } = useSettingsStore();
  
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  useEffect(() => {
    const currentKey = `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`;
    
    // Avoid checking the same second multiple times
    if (currentKey === lastChecked) return;
    setLastChecked(currentKey);

    // Check if in quiet hours
    const inQuietHours = isQuietHours(
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      currentTime
    );

    if (inQuietHours) return;

    // Check alarms
    alarms.forEach(alarm => {
      if (!alarm.enabled) return;

      const matches =
        alarm.dechaTime.hours === currentTime.hours &&
        alarm.dechaTime.minutes === currentTime.minutes &&
        alarm.dechaTime.seconds === currentTime.seconds;

      if (!matches) return;

      // Check if should repeat
      const now = new Date();
      const today = now.getDay(); // 0-6 (Sunday-Saturday)

      let shouldTrigger = false;

      switch (alarm.repeat) {
        case 'once':
          shouldTrigger = !alarm.lastTriggered;
          break;
        case 'daily':
          shouldTrigger = true;
          break;
        case 'weekdays':
          shouldTrigger = today >= 1 && today <= 5;
          break;
        case 'weekends':
          shouldTrigger = today === 0 || today === 6;
          break;
        case 'custom':
          shouldTrigger = alarm.customDays?.includes(today) || false;
          break;
      }

      // Don't trigger if already triggered today
      if (alarm.lastTriggered) {
        const lastDate = new Date(alarm.lastTriggered).toDateString();
        const nowDate = now.toDateString();
        if (lastDate === nowDate) {
          shouldTrigger = false;
        }
      }

      if (shouldTrigger) {
        const earthHours = Math.floor((currentTime.totalSeconds * 0.864) / 3600);
        const earthMins = Math.floor(((currentTime.totalSeconds * 0.864) % 3600) / 60);
        
        showNotification(`⏰ ${alarm.label}`, {
          body: `DECHA: ${currentTime.hours}:${String(currentTime.minutes).padStart(2, '0')}:${String(currentTime.seconds).padStart(2, '0')}\nEarth: ${String(earthHours).padStart(2, '0')}:${String(earthMins).padStart(2, '0')}`,
          tag: `alarm-${alarm.id}`,
          requireInteraction: true,
        });

        if (notificationSound) {
          playAlarmBeep();
        }

        markTriggered(alarm.id);
        incrementFeature('alarmsTriggered');
      }
    });

    // Check hourly notifications
    if (enableHourlyNotifications && currentTime.minutes === 0 && currentTime.seconds === 0) {
      let shouldNotify = false;

      switch (notificationFrequency) {
        case 'every-hour':
          shouldNotify = true;
          break;
        case 'every-2-hours':
          shouldNotify = currentTime.hours % 2 === 0;
          break;
        case 'every-3-hours':
          shouldNotify = currentTime.hours % 3 === 0;
          break;
      }

      if (shouldNotify && lastHourlyNotification !== currentTime.hours) {
        const period = getDayPeriod(currentTime);
        const description = getDayPeriodDescription(period);
        
        showNotification(`${currentTime.hours}:00:00 DECHA`, {
          body: description,
          tag: 'hourly-notification',
        });

        setLastHourlyNotification(currentTime.hours);
      }
    }
  }, [
    currentTime,
    alarms,
    enableHourlyNotifications,
    notificationFrequency,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    lastChecked,
    lastHourlyNotification,
    markTriggered,
    incrementFeature,
  ]);
}
