import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DechaTime, DisplayFormat } from '../types/decha';
import { formatDechaTime, formatDechaDecimal } from '../utils/dechaCalculations';

interface TimeDisplayProps {
  time: DechaTime;
  format: DisplayFormat;
}

export const TimeDisplay = memo(function TimeDisplay({ time, format }: TimeDisplayProps) {
  const showStandard = format === 'standard' || format === 'both';
  const showPercentage = format === 'percentage' || format === 'both';
  
  // Memoize the decimal formatting to prevent recalculation
  const dechaDecimal = useMemo(() => formatDechaDecimal(time), [time]);

  return (
    <div className="flex flex-col items-center gap-4">
      {showStandard && (
        <div className="font-mono text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight">
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
          className="font-mono text-2xl md:text-3xl text-white/70"
        >
          {dechaDecimal} <span className="text-white/40">DECHA</span>
        </motion.div>
      )}

      {showStandard && (
        <div className="text-sm md:text-base text-white/40 font-mono">
          {time.percentage.toFixed(2)}% of day complete
        </div>
      )}
    </div>
  );
});