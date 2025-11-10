import { motion } from 'framer-motion';
import { DechaTime, DayPeriod } from '../types/decha';
import { getDayPeriod, getDayPeriodDescription } from '../utils/dechaCalculations';
import { Sun, Moon, Sunrise, Sunset, CloudSun, Stars } from 'lucide-react';

interface DayContextProps {
  time: DechaTime;
}

const periodIcons: Record<DayPeriod, React.ReactNode> = {
  night: <Moon className="w-6 h-6" />,
  dawn: <Sunrise className="w-6 h-6" />,
  morning: <Sun className="w-6 h-6" />,
  midday: <Sun className="w-6 h-6" />,
  afternoon: <CloudSun className="w-6 h-6" />,
  evening: <Sunset className="w-6 h-6" />,
};

const periodColors: Record<DayPeriod, string> = {
  night: 'from-indigo-500/20 to-purple-500/20 border-purple-500/30',
  dawn: 'from-orange-500/20 to-pink-500/20 border-orange-500/30',
  morning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  midday: 'from-yellow-400/20 to-white/20 border-yellow-400/30',
  afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  evening: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
};

export function DayContext({ time }: DayContextProps) {
  const period = getDayPeriod(time);
  const description = getDayPeriodDescription(period);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-sm border bg-gradient-to-r ${periodColors[period]}`}
    >
      <div className="text-white/80">
        {periodIcons[period]}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white/90 capitalize">
          {period}
        </span>
        <span className="text-xs text-white/60">
          {description}
        </span>
      </div>
    </motion.div>
  );
}