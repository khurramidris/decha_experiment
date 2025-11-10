export interface Alarm {
  id: string;
  dechaTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  label: string;
  enabled: boolean;
  repeat: 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[]; // 0-6 (Sunday-Saturday)
  sound: boolean;
  snoozeCount: number;
  lastTriggered?: number; // Timestamp
  createdAt: number;
}

export interface AlarmFormData {
  hours: string;
  minutes: string;
  seconds: string;
  label: string;
  repeat: Alarm['repeat'];
  customDays: number[];
  sound: boolean;
}