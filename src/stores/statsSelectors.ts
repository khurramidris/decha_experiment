import { useStatsStore } from './statsStore';
import { Theme, DisplayFormat } from '../types/decha';

// Optimized selectors to prevent unnecessary re-renders
export const useTotalSessions = (): number => useStatsStore(state => state.totalSessions);
export const useTotalTimeSpent = (): number => useStatsStore(state => state.totalTimeSpent);
export const useLongestSession = (): number => useStatsStore(state => state.longestSession);
export const useCurrentSessionStart = (): number => useStatsStore(state => state.currentSessionStart);
export const useThemeUsage = () => useStatsStore(state => state.themeUsage);
export const useDisplayFormatUsage = () => useStatsStore(state => state.displayFormatUsage);
export const useFeaturesUsed = () => useStatsStore(state => state.featuresUsed);
export const useAchievements = () => useStatsStore(state => state.achievements);
export const useMilestones = () => useStatsStore(state => state.milestones);

// Action selectors
export const useStartSession = () => useStatsStore(state => state.startSession);
export const useEndSession = () => useStatsStore(state => state.endSession);
export const useIncrementFeature = () => useStatsStore(state => state.incrementFeature);
export const useTrackThemeUsage = () => useStatsStore(state => state.trackThemeUsage);
export const useTrackFormatUsage = () => useStatsStore(state => state.trackFormatUsage);
export const useUnlockAchievement = () => useStatsStore(state => state.unlockAchievement);
export const useCheckMilestones = () => useStatsStore(state => state.checkMilestones);
export const useResetStats = () => useStatsStore(state => state.resetStats);