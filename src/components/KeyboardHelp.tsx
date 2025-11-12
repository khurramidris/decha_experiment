import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useViewport } from '../hooks/useViewport';

interface KeyboardHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Space / Esc', action: 'Open/Close Settings' },
  { key: 'C', action: 'Open Time Converter' },
  { key: 'A', action: 'Open Alarms' },
  { key: 'L', action: 'Open Calendar' },
  { key: 'D', action: 'Open Stats Dashboard' },
  { key: 'M', action: 'Open Multi-Timezone Converter' },
  { key: 'S', action: 'Share Current Time' },
  { key: 'T', action: 'Toggle Earth Time Display' },
  { key: 'W', action: 'Toggle Wake Lock' },
  { key: 'K / ?', action: 'Show Keyboard Shortcuts (this)' },
];

export function KeyboardHelp({ isOpen, onClose }: KeyboardHelpProps) {
  const { isMobile } = useViewport();
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
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-decha-blue" />
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/80">{shortcut.action}</span>
                  <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white/60 font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-xs text-white/40 text-center">
              Press Escape or click outside to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}