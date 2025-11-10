import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShare } from '../hooks/useShare';
import { DechaTime, EarthTime } from '../types/decha';
import { analytics, AnalyticsEvents } from '../analytics';
import { useStatsStore } from '../stores/statsStore';

interface ShareButtonProps {
  dechaTime: DechaTime;
  earthTime: EarthTime;
}

export function ShareButton({ dechaTime, earthTime }: ShareButtonProps) {
  const { shareTime } = useShare();
  const [shared, setShared] = useState(false);
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  const handleShare = async () => {
    const success = await shareTime(dechaTime, earthTime);
    if (success) {
      setShared(true);
      analytics.trackEvent(AnalyticsEvents.TIME_SHARED);
      incrementFeature('timeShared');
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
    >
      <AnimatePresence mode="wait">
        {shared ? (
          <motion.div
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="w-5 h-5 text-green-400" />
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Share2 className="w-5 h-5 text-white/60" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-white/80 text-sm">
        {shared ? 'Shared!' : 'Share Time'}
      </span>
    </motion.button>
  );
}