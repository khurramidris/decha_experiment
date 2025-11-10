import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Theme, DisplayFormat } from '../types/decha';

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  setDisplayFormat: (format: DisplayFormat) => void;
  toggleEarthTime: () => void;
  toggleProgressBars: () => void;
  toggleDayContext: () => void;
  toggle24HourEarth: () => void;
  toggleAppBadge: () => void;
  toggleHourlyNotifications: () => void;
  setNotificationFrequency: (frequency: Settings['notificationFrequency']) => void;
  toggleNotificationSound: () => void;
  toggleQuietHours: () => void;
  setQuietHoursStart: (hours: number, minutes: number) => void;
  setQuietHoursEnd: (hours: number, minutes: number) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'navy',
  displayFormat: 'standard',
  showEarthTime: true,
  showProgressBars: true,
  showDayContext: true,
  use24HourEarth: true,
  enableAppBadge: true,
  enableHourlyNotifications: false,
  notificationFrequency: 'every-hour',
  notificationSound: true,
  quietHoursEnabled: false,
  quietHoursStart: { hours: 9, minutes: 0 }, // Night period
  quietHoursEnd: { hours: 2, minutes: 0 },   // Before dawn
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setTheme: (theme) => set({ theme }),
      setDisplayFormat: (format) => set({ displayFormat: format }),
      toggleEarthTime: () => set((state) => ({
        showEarthTime: !state.showEarthTime
      })),
      toggleProgressBars: () => set((state) => ({
        showProgressBars: !state.showProgressBars
      })),
      toggleDayContext: () => set((state) => ({
        showDayContext: !state.showDayContext
      })),
      toggle24HourEarth: () => set((state) => ({
        use24HourEarth: !state.use24HourEarth
      })),
      toggleAppBadge: () => set((state) => ({
        enableAppBadge: !state.enableAppBadge
      })),
      toggleHourlyNotifications: () => set((state) => ({
        enableHourlyNotifications: !state.enableHourlyNotifications
      })),
      setNotificationFrequency: (frequency) => set({ notificationFrequency: frequency }),
      toggleNotificationSound: () => set((state) => ({
        notificationSound: !state.notificationSound
      })),
      toggleQuietHours: () => set((state) => ({
        quietHoursEnabled: !state.quietHoursEnabled
      })),
      setQuietHoursStart: (hours, minutes) => set({
        quietHoursStart: { hours, minutes }
      }),
      setQuietHoursEnd: (hours, minutes) => set({
        quietHoursEnd: { hours, minutes }
      }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'decha-settings',
    }
  )
);