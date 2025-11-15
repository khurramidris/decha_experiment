import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Alarm } from '../types/alarm';
import { syncAlarmsToServiceWorker } from '../utils/serviceWorkerAlarms';

/**
 * Adds minutes to a Decha time
 */
function addMinutesToDechaTime(
  dechaTime: { hours: number; minutes: number; seconds: number },
  minutesToAdd: number
): { hours: number; minutes: number; seconds: number } {
  let totalSeconds = dechaTime.hours * 10000 + dechaTime.minutes * 100 + dechaTime.seconds;
  totalSeconds += minutesToAdd * 100; // Add minutes (each minute = 100 seconds in Decha)
  
  // Handle overflow
  const maxSeconds = 100000; // 10 hours * 10000 seconds/hour
  if (totalSeconds >= maxSeconds) {
    totalSeconds = totalSeconds % maxSeconds;
  }
  if (totalSeconds < 0) {
    totalSeconds = maxSeconds + totalSeconds;
  }
  
  const hours = Math.floor(totalSeconds / 10000);
  const minutes = Math.floor((totalSeconds % 10000) / 100);
  const seconds = totalSeconds % 100;
  
  return { hours, minutes, seconds };
}

interface AlarmsState {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt' | 'snoozeCount'>) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  snoozeAlarm: (id: string, minutes: number) => void;
  markTriggered: (id: string) => void;
  markAsTriggered: (id: string) => void;
  clearAllAlarms: () => void;
  exportAlarms: () => string;
  importAlarms: (json: string) => void;
}

export const useAlarmsStore = create<AlarmsState>()(
  persist(
    (set, get) => ({
      alarms: [],
      
      addAlarm: (alarm) => {
        const newAlarms = [...get().alarms, {
          ...alarm,
          id: uuidv4(),
          createdAt: Date.now(),
          snoozeCount: 0,
        }].sort((a, b) => {
          const aTime = a.dechaTime.hours * 10000 + a.dechaTime.minutes * 100 + a.dechaTime.seconds;
          const bTime = b.dechaTime.hours * 10000 + b.dechaTime.minutes * 100 + b.dechaTime.seconds;
          return aTime - bTime;
        });
        
        // Sync to service worker for background alarms
        syncAlarmsToServiceWorker(newAlarms);
        
        set({ alarms: newAlarms });
      },
      
      updateAlarm: (id, updates) => {
        const updatedAlarms = get().alarms.map(alarm =>
          alarm.id === id ? { ...alarm, ...updates } : alarm
        );
        
        // Sync to service worker
        syncAlarmsToServiceWorker(updatedAlarms);
        
        set({ alarms: updatedAlarms });
      },
      
      deleteAlarm: (id) => {
        const filteredAlarms = get().alarms.filter(alarm => alarm.id !== id);
        
        // Sync to service worker
        syncAlarmsToServiceWorker(filteredAlarms);
        
        set({ alarms: filteredAlarms });
      },
      
      toggleAlarm: (id) => {
        const toggledAlarms = get().alarms.map(alarm =>
          alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        );
        
        // Sync to service worker
        syncAlarmsToServiceWorker(toggledAlarms);
        
        set({ alarms: toggledAlarms });
      },
      
      snoozeAlarm: (id, minutes) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id ? {
            ...alarm,
            dechaTime: addMinutesToDechaTime(alarm.dechaTime, minutes),
            triggered: false
          } : alarm
        )
      })),
      
      markTriggered: (id) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id ? {
            ...alarm,
            lastTriggered: Date.now(),
            snoozeCount: 0,
          } : alarm
        )
      })),
      
      markAsTriggered: (id) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id
            ? { ...alarm, lastTriggered: Date.now() }
            : alarm
        )
      })),
      
      clearAllAlarms: () => set({ alarms: [] }),
      
      exportAlarms: () => {
        return JSON.stringify(get().alarms, null, 2);
      },
      
      importAlarms: (json) => {
        try {
          const imported = JSON.parse(json);
          if (Array.isArray(imported)) {
            set({ alarms: imported });
          }
        } catch (error) {
          console.error('Failed to import alarms:', error);
        }
      },
    }),
    {
      name: 'decha-alarms',
    }
  )
);