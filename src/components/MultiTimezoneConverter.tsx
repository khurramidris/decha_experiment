import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Trash2 } from 'lucide-react';
import { useViewport } from '../hooks/useViewport';
import { popularTimezones, getCurrentTimezone, formatTimeInTimezone } from '../utils/timezones';

interface MultiTimezoneConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MultiTimezoneConverter({ isOpen, onClose }: MultiTimezoneConverterProps) {
  const { isMobile } = useViewport();
  const [dechaInput, setDechaInput] = useState('5:00:00');
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    getCurrentTimezone(),
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);

  const parseDechaTime = (input: string) => {
    try {
      const parts = input.split(':').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return null;

      const [hours, minutes, seconds] = parts;
      if (hours < 0 || hours > 9 || minutes < 0 || minutes > 99 || seconds < 0 || seconds > 99) {
        return null;
      }
      
      return { hours, minutes, seconds };
    } catch {
      return null;
    }
  };

  const dechaTime = parseDechaTime(dechaInput);

  // Convert DECHA to Earth seconds
  const earthSeconds = dechaTime
    ? Math.floor((dechaTime.hours * 10000 + dechaTime.minutes * 100 + dechaTime.seconds) * 0.864)
    : null;

  const earthHours = earthSeconds ? Math.floor(earthSeconds / 3600) : 0;
  const earthMins = earthSeconds ? Math.floor((earthSeconds % 3600) / 60) : 0;
  const earthSecs = earthSeconds ? Math.floor(earthSeconds % 60) : 0;

  const addTimezone = (timezone: string) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezone: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  const availableTimezones = popularTimezones.filter(
    tz => !selectedTimezones.includes(tz.name)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`modal-centered bg-decha-slate border border-white/10 rounded-2xl p-4 sm:p-6 w-full mx-4 ${
              isMobile ? 'max-w-lg' : 'max-w-2xl'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-decha-blue" />
                <h2 className="text-2xl font-bold text-white">Multi-Timezone Converter</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* DECHA Time Input */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">DECHA Time</label>
              <input
                type="text"
                value={dechaInput}
                onChange={(e) => setDechaInput(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-2xl text-center focus:outline-none focus:border-decha-blue"
                placeholder="5:00:00"
              />
              <div className="text-center text-sm text-white/40 mt-2">
                Enter DECHA time to see conversions across timezones
              </div>
            </div>

            {/* Timezone Conversions */}
            {earthSeconds !== null && (
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {selectedTimezones.map((timezone) => {
                  const timeStr = formatTimeInTimezone(earthHours, earthMins, earthSecs, timezone);
                  const tzInfo = popularTimezones.find(tz => tz.name === timezone);
                  
                  return (
                    <motion.div
                      key={timezone}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">
                          {tzInfo?.label || timezone}
                        </div>
                        <div className="text-2xl font-mono text-decha-cyan">
                          {timeStr}
                        </div>
                      </div>
                      <button
                        onClick={() => removeTimezone(timezone)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white/60" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Add Timezone */}
            {availableTimezones.length > 0 && (
              <div>
                <label className="block text-sm text-white/60 mb-2">Add Timezone</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addTimezone(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
                >
                  <option value="">Select a timezone...</option>
                  {availableTimezones.map((tz) => (
                    <option key={tz.name} value={tz.name}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Example */}
            <div className="mt-6 p-4 bg-decha-blue/10 border border-decha-blue/30 rounded-lg">
              <div className="text-sm text-white/80">
                <strong>Example:</strong> If it's 5:00:00 DECHA in your timezone, 
                this shows what the equivalent Earth time is in other parts of the world.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}