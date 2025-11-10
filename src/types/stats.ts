import { Theme, DisplayFormat } from './decha';

export interface Stats {
  firstUse: number;
  totalSessions: number;
  totalTimeSpent: number; // Total seconds
  longestSession: number; // Seconds
  currentSessionStart: number;
  
  themeUsage: Record<Theme, number>; // Seconds per theme
  displayFormatUsage: Record<DisplayFormat, number>;
  
  featuresUsed: {
    converterOpened: number;
    timeShared: number;
    alarmsCreated: number;
    alarmsTriggered: number;
    eventsCreated: number;
    wakeLockActivated: number;
    calendarOpened: number;
    statsViewed: number;
  };
  
  achievements: string[];
  milestones: {
    days7: boolean;
    days30: boolean;
    days100: boolean;
    alarms10: boolean;
    events50: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}