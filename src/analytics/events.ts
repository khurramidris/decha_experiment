// All events we'll track across the app
export const AnalyticsEvents = {
  // Installation
  PWA_INSTALL_PROMPTED: 'pwa_install_prompted',
  PWA_INSTALLED: 'pwa_installed',
  PWA_INSTALL_DISMISSED: 'pwa_install_dismissed',
  
  // Features
  THEME_CHANGED: 'theme_changed',
  DISPLAY_FORMAT_CHANGED: 'display_format_changed',
  TIME_SHARED: 'time_shared',
  
  // Alarms
  ALARM_CREATED: 'alarm_created',
  ALARM_EDITED: 'alarm_edited',
  ALARM_DELETED: 'alarm_deleted',
  ALARM_TRIGGERED: 'alarm_triggered',
  ALARM_SNOOZED: 'alarm_snoozed',
  
  // Calendar
  EVENT_CREATED: 'event_created',
  EVENT_EDITED: 'event_edited',
  EVENT_DELETED: 'event_deleted',
  CALENDAR_OPENED: 'calendar_opened',
  
  // Converter
  CONVERTER_OPENED: 'converter_opened',
  CONVERTER_USED: 'converter_used',
  MULTI_TIMEZONE_OPENED: 'multi_timezone_opened',
  
  // Settings
  EARTH_TIME_TOGGLED: 'earth_time_toggled',
  PROGRESS_BARS_TOGGLED: 'progress_bars_toggled',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  WAKE_LOCK_ENABLED: 'wake_lock_enabled',
  WAKE_LOCK_DISABLED: 'wake_lock_disabled',
  
  // Stats
  STATS_VIEWED: 'stats_viewed',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // Engagement
  SESSION_START: 'session_start',
  FEATURE_DISCOVERED: 'feature_discovered',
  KEYBOARD_SHORTCUT_USED: 'keyboard_shortcut_used',
} as const;

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];