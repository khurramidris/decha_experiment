import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWakeLock } from '../hooks/useWakeLock';
import { analytics, AnalyticsEvents } from '../analytics';
import { useStatsStore } from '../stores/statsStore';

export function WakeLockButton() {
  const { isSupported, isActive, toggleWakeLock } = useWakeLock();
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  if (!isSupported) return null;

  const handleToggle = async () => {
    const wasActive = isActive;
    await toggleWakeLock();
    
    if (!wasActive) {
      analytics.trackEvent(AnalyticsEvents.WAKE_LOCK_ENABLED);
      incrementFeature('wakeLockActivated');
    } else {
      analytics.trackEvent(AnalyticsEvents.WAKE_LOCK_DISABLED);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
        isActive
          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
      }`}
      title={isActive ? 'Screen will stay awake' : 'Keep screen awake'}
    >
      {isActive ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
      <span className="text-sm">
        {isActive ? 'Awake' : 'Keep Awake'}
      </span>
    </motion.button>
  );
}