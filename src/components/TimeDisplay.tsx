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
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      {showStandard && (
        <div 
          className="font-mono font-bold tracking-tight leading-tight"
          style={{ fontSize: getTimeFontSize() }}
        >
          <span className="text-decha-blue">{time.hours}</span>
          <span className="text-white/50">:</span>
          <span className="text-decha-cyan">{time.minutes.toString().padStart(2, '0')}</span>
          <span className="text-white/50">:</span>
          <span className="text-decha-purple">{time.seconds.toString().padStart(2, '0')}</span>
        </div>
      )}

      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-white/70"
          style={{ fontSize: getPercentageFontSize() }}
        >
          {dechaDecimal} <span className="text-white/40">DECHA</span>
        </motion.div>
      )}

      {showStandard && (
        <div 
          className="text-white/40 font-mono"
          style={{ fontSize: getInfoFontSize() }}
        >
          {time.percentage.toFixed(2)}% of day complete
        </div>
      )}
    </div>
  );
});