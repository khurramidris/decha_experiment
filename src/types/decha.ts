export interface DechaTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentage: number;
}

export interface EarthTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export type Theme = 'navy' | 'sunset' | 'matrix' | 'cosmic' | 'minimal';

export type DisplayFormat = 'standard' | 'percentage' | 'both';

export interface Settings {
  theme: Theme;
  displayFormat: DisplayFormat;
  showEarthTime: boolean;
  showProgressBars: boolean;
  showDayContext: boolean;
  use24HourEarth: boolean;
  enableAppBadge: boolean;
  enableAnalytics: boolean;
  reducedMotion: boolean;
  // Notification settings
  enableHourlyNotifications: boolean;
  notificationFrequency: 'every-hour' | 'every-2-hours' | 'every-3-hours';
  notificationSound: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: { hours: number; minutes: number };
  quietHoursEnd: { hours: number; minutes: number };
}

export type DayPeriod = 'night' | 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening';
