import { useSettingsStore } from './settingsStore';
import { Settings, Theme, DisplayFormat } from '../types/decha';

// Optimized selectors to prevent unnecessary re-renders
export const useTheme = (): Theme => useSettingsStore(state => state.theme);
export const useDisplayFormat = (): DisplayFormat => useSettingsStore(state => state.displayFormat);
export const useShowEarthTime = (): boolean => useSettingsStore(state => state.showEarthTime);
export const useShowProgressBars = (): boolean => useSettingsStore(state => state.showProgressBars);
export const useShowDayContext = (): boolean => useSettingsStore(state => state.showDayContext);
export const useUse24HourEarth = (): boolean => useSettingsStore(state => state.use24HourEarth);
export const useEnableAppBadge = (): boolean => useSettingsStore(state => state.enableAppBadge);
export const useEnableAnalytics = (): boolean => useSettingsStore(state => state.enableAnalytics);
export const useReducedMotion = (): boolean => useSettingsStore(state => state.reducedMotion);
export const useEnableHourlyNotifications = (): boolean => useSettingsStore(state => state.enableHourlyNotifications);
export const useNotificationFrequency = (): Settings['notificationFrequency'] => useSettingsStore(state => state.notificationFrequency);
export const useNotificationSound = (): boolean => useSettingsStore(state => state.notificationSound);
export const useQuietHoursEnabled = (): boolean => useSettingsStore(state => state.quietHoursEnabled);
export const useQuietHoursStart = (): Settings['quietHoursStart'] => useSettingsStore(state => state.quietHoursStart);
export const useQuietHoursEnd = (): Settings['quietHoursEnd'] => useSettingsStore(state => state.quietHoursEnd);

// Action selectors
export const useSetTheme = () => useSettingsStore(state => state.setTheme);
export const useSetDisplayFormat = () => useSettingsStore(state => state.setDisplayFormat);
export const useToggleEarthTime = () => useSettingsStore(state => state.toggleEarthTime);
export const useToggleProgressBars = () => useSettingsStore(state => state.toggleProgressBars);
export const useToggleDayContext = () => useSettingsStore(state => state.toggleDayContext);
export const useToggle24HourEarth = () => useSettingsStore(state => state.toggle24HourEarth);
export const useToggleAppBadge = () => useSettingsStore(state => state.toggleAppBadge);
export const useToggleAnalytics = () => useSettingsStore(state => state.toggleAnalytics);
export const useToggleReducedMotion = () => useSettingsStore(state => state.toggleReducedMotion);
export const useToggleHourlyNotifications = () => useSettingsStore(state => state.toggleHourlyNotifications);
export const useSetNotificationFrequency = () => useSettingsStore(state => state.setNotificationFrequency);
export const useToggleNotificationSound = () => useSettingsStore(state => state.toggleNotificationSound);
export const useToggleQuietHours = () => useSettingsStore(state => state.toggleQuietHours);
export const useSetQuietHoursStart = () => useSettingsStore(state => state.setQuietHoursStart);
export const useSetQuietHoursEnd = () => useSettingsStore(state => state.setQuietHoursEnd);
export const useResetSettings = () => useSettingsStore(state => state.resetSettings);
