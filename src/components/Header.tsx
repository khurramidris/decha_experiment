import { Clock, Settings as SettingsIcon, Github, Calculator, AlarmClock, Calendar as CalendarIcon, BarChart3, Globe, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onSettingsClick: () => void;
  onConverterClick: () => void;
  onAlarmsClick: () => void;
  onCalendarClick: () => void;
  onStatsClick: () => void;
  onMultiTimezoneClick: () => void;
  onHelpClick: () => void;
}

export function Header({
  onSettingsClick,
  onConverterClick,
  onAlarmsClick,
  onCalendarClick,
  onStatsClick,
  onMultiTimezoneClick,
  onHelpClick,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-decha-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">DECHA Time</h1>
          <p className="text-xs text-white/40">Decimal Chronological Harmony</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onConverterClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Time Converter"
          title="Time Converter (C)"
        >
          <Calculator className="w-5 h-5 text-white/60" />
        </button>

        <button
          onClick={onAlarmsClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Alarms"
          title="Alarms (A)"
        >
          <AlarmClock className="w-5 h-5 text-white/60" />
        </button>

        <button
          onClick={onCalendarClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Calendar"
          title="Calendar (L)"
        >
          <CalendarIcon className="w-5 h-5 text-white/60" />
        </button>

        <button
          onClick={onStatsClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Stats"
          title="Stats (D)"
        >
          <BarChart3 className="w-5 h-5 text-white/60" />
        </button>

        <button
          onClick={onMultiTimezoneClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Multi-Timezone"
          title="Multi-Timezone (M)"
        >
          <Globe className="w-5 h-5 text-white/60" />
        </button>

        <button
          onClick={onHelpClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Keyboard Shortcuts"
          title="Keyboard Shortcuts (K)"
        >
          <Keyboard className="w-5 h-5 text-white/60" />
        </button>

        <a
          href="https://github.com/yourusername/decha-time"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="GitHub Repository"
        >
          <Github className="w-5 h-5 text-white/60" />
        </a>

        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Settings"
          title="Settings (Space)"
        >
          <SettingsIcon className="w-5 h-5 text-white/60" />
        </button>
      </div>
    </motion.header>
  );
}