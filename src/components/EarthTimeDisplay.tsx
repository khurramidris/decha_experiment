import { motion } from 'framer-motion';
import { EarthTime } from '../types/decha';
import { formatEarthTime } from '../utils/dechaCalculations';
import { Globe } from 'lucide-react';

interface EarthTimeDisplayProps {
  time: EarthTime;
  use24Hour: boolean;
}

export function EarthTimeDisplay({ time, use24Hour }: EarthTimeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"
    >
      <Globe className="w-5 h-5 text-decha-cyan" />
      <div className="flex flex-col">
        <span className="text-xs text-white/40 font-mono">Earth Time</span>
        <span className="text-lg font-mono text-white/80">
          {formatEarthTime(time, use24Hour)}
        </span>
      </div>
    </motion.div>
  );
}