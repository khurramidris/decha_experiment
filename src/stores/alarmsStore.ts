import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Alarm } from '../types/alarm';

export interface Alarm {
  id: string;
  label: string;
  time: string; // HH:MM format
  enabled: boolean;
  sound: boolean;
  repeat: string[]; // e.g., ['mon', 'tue', 'wed']
  createdAt: Date;
  triggered: boolean;
  lastTriggered?: Date;
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
      
      addAlarm: (alarm) => set((state) => ({
        alarms: [...state.alarms, {
          ...alarm,
          id: uuidv4(),
          createdAt: Date.now(),
          snoozeCount: 0,
        }].sort((a, b) => {
          const aTime = a.dechaTime.hours * 10000 + a.dechaTime.minutes * 100 + a.dechaTime.seconds;
          const bTime = b.dechaTime.hours * 10000 + b.dechaTime.minutes * 100 + b.dechaTime.seconds;
          return aTime - bTime;
        })
      })),
      
      updateAlarm: (id, updates) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id ? { ...alarm, ...updates } : alarm
        )
      })),
      
      deleteAlarm: (id) => set((state) => ({
        alarms: state.alarms.filter(alarm => alarm.id !== id)
      })),
      
      toggleAlarm: (id) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        )
      })),
      
      snoozeAlarm: (id, minutes) => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id ? {
            ...alarm,
            time: addMinutesToTime(alarm.time, minutes),
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
            ? { ...alarm, triggered: true, lastTriggered: new Date() }
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