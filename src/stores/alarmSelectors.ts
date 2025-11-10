import { useAlarmsStore } from './alarmsStore';
import { Alarm } from '../types/alarm';

// Optimized selectors to prevent unnecessary re-renders
export const useAlarms = (): Alarm[] => useAlarmsStore(state => state.alarms);
export const useEnabledAlarms = (): Alarm[] => useAlarmsStore(state => state.alarms.filter(alarm => alarm.enabled));
export const useAlarmCount = (): number => useAlarmsStore(state => state.alarms.length);
export const useEnabledAlarmCount = (): number => useAlarmsStore(state => state.alarms.filter(alarm => alarm.enabled).length);

// Action selectors
export const useAddAlarm = () => useAlarmsStore(state => state.addAlarm);
export const useUpdateAlarm = () => useAlarmsStore(state => state.updateAlarm);
export const useDeleteAlarm = () => useAlarmsStore(state => state.deleteAlarm);
export const useToggleAlarm = () => useAlarmsStore(state => state.toggleAlarm);
export const useSnoozeAlarm = () => useAlarmsStore(state => state.snoozeAlarm);
export const useMarkTriggered = () => useAlarmsStore(state => state.markTriggered);
export const useMarkAsTriggered = () => useAlarmsStore(state => state.markAsTriggered);
export const useClearAllAlarms = () => useAlarmsStore(state => state.clearAllAlarms);
export const useExportAlarms = () => useAlarmsStore(state => state.exportAlarms);
export const useImportAlarms = () => useAlarmsStore(state => state.importAlarms);