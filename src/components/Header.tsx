import { Clock, Settings as SettingsIcon, Github, Calculator, AlarmClock, Calendar as CalendarIcon, BarChart3, Globe, Keyboard, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewport } from '../hooks/useViewport';
import { useState } from 'react';

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
  const { isMobile } = useViewport();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mobileMenuItems = [
    { id: 'converter', icon: Calculator, label: 'Converter', action: onConverterClick, shortcut: 'C' },
    { id: 'alarms', icon: AlarmClock, label: 'Alarms', action: onAlarmsClick, shortcut: 'A' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar', action: onCalendarClick, shortcut: 'L' },
    { id: 'stats', icon: BarChart3, label: 'Stats', action: onStatsClick, shortcut: 'D' },
    { id: 'timezone', icon: Globe, label: 'Timezone', action: onMultiTimezoneClick, shortcut: 'M' },
    { id: 'help', icon: Keyboard, label: 'Shortcuts', action: onHelpClick, shortcut: 'K' },
  ];

  if (isMobile) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-decha-blue" />
          <div>
            <h1 className="text-2xl font-bold text-white">DECHA Time</h1>
            <p className="text-xs text-white/40">Decimal Chronological Harmony</p>
          </div>
        </div>

        <button
          onClick={() => setShowMobileMenu(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-white/60" />
        </button>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-7 h-7 text-white/80" />
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">DECHA Time</h1>
          <p className="text-xs text-white/35 font-normal">Decimal Chronological Harmony</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onConverterClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Time Converter"
          title="Time Converter (C)"
        >
          <Calculator className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onAlarmsClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Alarms"
          title="Alarms (A)"
        >
          <AlarmClock className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onCalendarClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Calendar"
          title="Calendar (L)"
        >
          <CalendarIcon className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onStatsClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Stats"
          title="Stats (D)"
        >
          <BarChart3 className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onMultiTimezoneClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Multi-Timezone"
          title="Multi-Timezone (M)"
        >
          <Globe className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onHelpClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Keyboard Shortcuts"
          title="Keyboard Shortcuts (K)"
        >
          <Keyboard className="w-5 h-5 text-white/70" />
        </button>

        <button
          onClick={onSettingsClick}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
          aria-label="Settings"
          title="Settings (Space)"
        >
          <SettingsIcon className="w-5 h-5 text-white/70" />
        </button>
      </div>
    </motion.header>
  );
}