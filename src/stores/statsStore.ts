import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stats } from '../types/stats';
import { Theme, DisplayFormat } from '../types/decha';

interface StatsState extends Stats {
  startSession: () => void;
  endSession: () => void;
  incrementFeature: (feature: keyof Stats['featuresUsed']) => void;
  trackThemeUsage: (theme: Theme, seconds: number) => void;
  trackFormatUsage: (format: DisplayFormat, seconds: number) => void;
  unlockAchievement: (achievementId: string) => void;
  checkMilestones: () => void;
  resetStats: () => void;
}

const defaultStats: Stats = {
  firstUse: Date.now(),
  totalSessions: 0,
  totalTimeSpent: 0,
  longestSession: 0,
  currentSessionStart: Date.now(),
  
  themeUsage: {
    navy: 0,
    sunset: 0,
    matrix: 0,
    cosmic: 0,
    minimal: 0,
  },
  
  displayFormatUsage: {
    standard: 0,
    percentage: 0,
    both: 0,
  },
  
  featuresUsed: {
    converterOpened: 0,
    timeShared: 0,
    alarmsCreated: 0,
    alarmsTriggered: 0,
    eventsCreated: 0,
    wakeLockActivated: 0,
    calendarOpened: 0,
    statsViewed: 0,
  },
  
  achievements: ['first-use'],
  
  milestones: {
    days7: false,
    days30: false,
    days100: false,
    alarms10: false,
    events50: false,
  },
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      ...defaultStats,
      
      startSession: () => set((state) => ({
        totalSessions: state.totalSessions + 1,
        currentSessionStart: Date.now(),
      })),
      
      endSession: () => set((state) => {
        const sessionDuration = Math.floor((Date.now() - state.currentSessionStart) / 1000);
        return {
          totalTimeSpent: state.totalTimeSpent + sessionDuration,
          longestSession: Math.max(state.longestSession, sessionDuration),
        };
      }),
      
      incrementFeature: (feature) => set((state) => ({
        featuresUsed: {
          ...state.featuresUsed,
          [feature]: state.featuresUsed[feature] + 1,
        }
      })),
      
      trackThemeUsage: (theme, seconds) => set((state) => ({
        themeUsage: {
          ...state.themeUsage,
          [theme]: state.themeUsage[theme] + seconds,
        }
      })),
      
      trackFormatUsage: (format, seconds) => set((state) => ({
        displayFormatUsage: {
          ...state.displayFormatUsage,
          [format]: state.displayFormatUsage[format] + seconds,
        }
      })),
      
      unlockAchievement: (achievementId) => set((state) => {
        if (state.achievements.includes(achievementId)) return state;
        return {
          achievements: [...state.achievements, achievementId],
        };
      }),
      
      checkMilestones: () => set((state) => {
        const daysUsed = Math.floor((Date.now() - state.firstUse) / (1000 * 60 * 60 * 24));
        
        return {
          milestones: {
            days7: daysUsed >= 7,
            days30: daysUsed >= 30,
            days100: daysUsed >= 100,
            alarms10: state.featuresUsed.alarmsCreated >= 10,
            events50: state.featuresUsed.eventsCreated >= 50,
          }
        };
      }),
      
      resetStats: () => set({
        ...defaultStats,
        firstUse: Date.now(),
        currentSessionStart: Date.now(),
      }),
    }),
    {
      name: 'decha-stats',
    }
  )
);