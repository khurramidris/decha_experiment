import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  showValue?: boolean;
}

export function ProgressBar({ 
  label, 
  current, 
  max, 
  color, 
  showValue = true 
}: ProgressBarProps) {
  const percentage = (current / max) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/60 font-mono">{label}</span>
        {showValue && (
          <span className="text-sm text-white/80 font-mono">
            {current.toString().padStart(2, '0')} / {max}
          </span>
        )}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}