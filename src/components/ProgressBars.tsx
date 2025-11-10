import { DechaTime } from '../types/decha';
import { ProgressBar } from './ProgressBar';
import { motion } from 'framer-motion';

interface ProgressBarsProps {
  time: DechaTime;
}

export function ProgressBars({ time }: ProgressBarsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-2xl space-y-4 px-6"
    >
      <ProgressBar
        label="Day Progress"
        current={time.totalSeconds}
        max={100000}
        color="bg-gradient-to-r from-decha-blue to-decha-cyan"
        showValue={false}
      />
      <ProgressBar
        label="Current Hour"
        current={time.minutes}
        max={100}
        color="bg-gradient-to-r from-decha-cyan to-decha-purple"
      />
      <ProgressBar
        label="Current Minute"
        current={time.seconds}
        max={100}
        color="bg-gradient-to-r from-decha-purple to-decha-pink"
      />
    </motion.div>
  );
}