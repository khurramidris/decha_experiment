import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DechaTime, DisplayFormat } from '../types/decha';
import { formatDechaTime, formatDechaDecimal } from '../utils/dechaCalculations';
import { useViewport } from '../hooks/useViewport';

interface TimeDisplayProps {
  time: DechaTime;
  format: DisplayFormat;
}

export const TimeDisplay = memo(function TimeDisplay({ time, format }: TimeDisplayProps) {
  const { isMobile, isTablet, isLandscape } = useViewport();
  const showStandard = format === 'standard' || format === 'both';
  const showPercentage = format === 'percentage' || format === 'both';
  
  // Memoize the decimal formatting to prevent recalculation
  const dechaDecimal = useMemo(() => formatDechaDecimal(time), [time]);

  // Responsive font sizing based on viewport
  const getTimeFontSize = () => {
    if (isMobile) {
      return isLandscape ? 'clamp(2rem, 10vw, 4rem)' : 'clamp(2.5rem, 12vw, 5rem)';
    }
    if (isTablet) {
      return 'clamp(4rem, 10vw, 6rem)';
    }
    return 'clamp(5rem, 8vw, 9rem)';
  };

  const getPercentageFontSize = () => {
    if (isMobile) {
      return 'clamp(1rem, 4vw, 2rem)';
    }
    return 'clamp(1.5rem, 3vw, 3rem)';
  };

  const getInfoFontSize = () => {
    if (isMobile) {
      return '0.75rem';
    }
    return '1rem';
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-5 px-4 w-full max-w-full">
      {showStandard && (
        <motion.div 
          className="font-mono font-bold tracking-tighter leading-none"
          style={{ 
            fontSize: getTimeFontSize(),
            fontFeatureSettings: '"tnum"', // Tabular numbers for consistent width
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="text-white" style={{ textShadow: '0 2px 20px rgba(255, 255, 255, 0.1)' }}>
            {time.hours}
          </span>
          <span className="text-white/30 mx-1">:</span>
          <span className="text-white" style={{ textShadow: '0 2px 20px rgba(255, 255, 255, 0.1)' }}>
            {time.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-white/30 mx-1">:</span>
          <span className="text-white" style={{ textShadow: '0 2px 20px rgba(255, 255, 255, 0.1)' }}>
            {time.seconds.toString().padStart(2, '0')}
          </span>
        </motion.div>
      )}

      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="font-mono text-white/60"
          style={{ fontSize: getPercentageFontSize(), fontWeight: 500 }}
        >
          {dechaDecimal} <span className="text-white/35 text-sm">DECHA</span>
        </motion.div>
      )}

      {showStandard && (
        <motion.div 
          className="text-white/45 font-sans text-sm sm:text-base"
          style={{ fontSize: getInfoFontSize(), fontWeight: 400 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {time.percentage.toFixed(2)}% of day complete
        </motion.div>
      )}
    </div>
  );
});