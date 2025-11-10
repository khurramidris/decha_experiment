import { useEffect, useRef } from 'react';
import { useStatsStore } from '../stores/statsStore';
import { useSettingsStore } from '../stores/settingsStore';

export function useStats() {
  const startSession = useStatsStore(state => state.startSession);
  const endSession = useStatsStore(state => state.endSession);
  const trackThemeUsage = useStatsStore(state => state.trackThemeUsage);
  const trackFormatUsage = useStatsStore(state => state.trackFormatUsage);
  const checkMilestones = useStatsStore(state => state.checkMilestones);
  
  const theme = useSettingsStore(state => state.theme);
  const displayFormat = useSettingsStore(state => state.displayFormat);
  
  const lastThemeRef = useRef(theme);
  const lastFormatRef = useRef(displayFormat);
  const lastTrackRef = useRef(Date.now());

  // Start session on mount
  useEffect(() => {
    startSession();
    
    // End session on unmount
    return () => {
      endSession();
    };
  }, [startSession, endSession]);

  // Track theme and format usage every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTrackRef.current) / 1000);
      
      if (elapsed > 0) {
        trackThemeUsage(theme, elapsed);
        trackFormatUsage(displayFormat, elapsed);
        lastTrackRef.current = now;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [theme, displayFormat, trackThemeUsage, trackFormatUsage]);

  // Check milestones daily
  useEffect(() => {
    checkMilestones();
    
    const interval = setInterval(() => {
      checkMilestones();
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    return () => clearInterval(interval);
  }, [checkMilestones]);
}