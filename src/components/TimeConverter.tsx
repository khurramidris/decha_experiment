import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { earthSecondsToDechaTime, formatDechaTime, formatEarthTime } from '../utils/dechaCalculations';
import { analytics, AnalyticsEvents } from '../analytics';
import { useStatsStore } from '../stores/statsStore';
import { useViewport } from '../hooks/useViewport';

interface TimeConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimeConverter({ isOpen, onClose }: TimeConverterProps) {
  const { isMobile } = useViewport();
  const [mode, setMode] = useState<'earth-to-decha' | 'decha-to-earth'>('earth-to-decha');
  const [earthInput, setEarthInput] = useState('12:00:00');
  const [dechaInput, setDechaInput] = useState('5:00:00');
  const [copied, setCopied] = useState(false);
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  const convertEarthToDecha = (earthTime: string) => {
    try {
      const parts = earthTime.split(':').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return null;

      const [hours, minutes, seconds] = parts;
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null;
      }
      
      const earthSeconds = hours * 3600 + minutes * 60 + seconds;
      const dechaTime = earthSecondsToDechaTime(earthSeconds);
      return formatDechaTime(dechaTime);
    } catch {
      return null;
    }
  };

  const convertDechaToEarth = (dechaTime: string) => {
    try {
      const parts = dechaTime.split(':').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return null;

      const [hours, minutes, seconds] = parts;
      if (hours < 0 || hours > 9 || minutes < 0 || minutes > 99 || seconds < 0 || seconds > 99) {
        return null;
      }
      
      const dechaSeconds = hours * 10000 + minutes * 100 + seconds;
      const earthSeconds = Math.floor(dechaSeconds * 0.864);
      const h = Math.floor(earthSeconds / 3600);
      const m = Math.floor((earthSeconds % 3600) / 60);
      const s = Math.floor(earthSeconds % 60);
      
      return formatEarthTime({ hours: h, minutes: m, seconds: s }, true);
    } catch {
      return null;
    }
  };

  const result = mode === 'earth-to-decha'
    ? convertEarthToDecha(earthInput)
    : convertDechaToEarth(dechaInput);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      analytics.trackEvent(AnalyticsEvents.CONVERTER_USED, { mode });
      incrementFeature('converterOpened');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'earth-to-decha' ? 'decha-to-earth' : 'earth-to-decha');
  };

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
              isMobile ? 'max-w-sm' : 'max-w-md'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-decha-blue" />
                <h2 className="text-2xl font-bold text-white">Time Converter</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Mode Toggle */}
              <button
                onClick={toggleMode}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <span className="text-white/80 font-mono">
                  {mode === 'earth-to-decha' ? 'Earth → DECHA' : 'DECHA → Earth'}
                </span>
                <ArrowRightLeft className="w-5 h-5 text-decha-cyan" />
              </button>

              {/* Input */}
              <div>
                <label className="block text-sm text-white/60 mb-2 font-mono">
                  {mode === 'earth-to-decha' ? 'Earth Time (HH:MM:SS)' : 'DECHA Time (H:MM:SS)'}
                </label>
                <input
                  type="text"
                  value={mode === 'earth-to-decha' ? earthInput : dechaInput}
                  onChange={(e) => mode === 'earth-to-decha' 
                    ? setEarthInput(e.target.value)
                    : setDechaInput(e.target.value)
                  }
                  placeholder={mode === 'earth-to-decha' ? '12:00:00' : '5:00:00'}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-decha-blue transition-colors"
                />
              </div>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-decha-blue/20 border border-decha-blue/50 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Result:</div>
                      <div className="text-2xl font-mono text-white">{result}</div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/60" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Examples */}
              <div className="text-xs text-white/40 space-y-1">
                <div>Example conversions:</div>
                <div>• 12:00:00 Earth → 5:00:00 DECHA (Noon)</div>
                <div>• 00:00:00 Earth → 0:00:00 DECHA (Midnight)</div>
                <div>• 06:00:00 Earth → 2:50:00 DECHA (6 AM)</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}