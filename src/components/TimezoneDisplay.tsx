import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentTimezone } from '../utils/timezones';

export function TimezoneDisplay() {
  const timezone = getCurrentTimezone();
  const now = new Date();
  const offset = -now.getTimezoneOffset() / 60;
  const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`;

  // Format timezone name (remove region prefix)
  const displayName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2 text-white/40 text-sm"
    >
      <Globe className="w-4 h-4" />
      <span>{displayName} ({offsetStr})</span>
    </motion.div>
  );
}