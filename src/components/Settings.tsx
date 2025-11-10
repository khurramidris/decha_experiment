import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Palette, Layout, Clock, BarChart3, Sun } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { Theme, DisplayFormat } from '../types/decha';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const {
    theme,
    displayFormat,
    showEarthTime,
    showProgressBars,
    showDayContext,
    use24HourEarth,
    setTheme,
    setDisplayFormat,
    toggleEarthTime,
    toggleProgressBars,
    toggleDayContext,
    toggle24HourEarth,
    resetSettings,
  } = useSettingsStore();

  const themes: { value: Theme; label: string; colors: string }[] = [
    { value: 'navy', label: 'Navy', colors: 'bg-gradient-to-r from-slate-900 to-blue-900' },
    { value: 'sunset', label: 'Sunset', colors: 'bg-gradient-to-r from-orange-600 to-pink-600' },
    { value: 'matrix', label: 'Matrix', colors: 'bg-gradient-to-r from-green-900 to-emerald-600' },
    { value: 'cosmic', label: 'Cosmic', colors: 'bg-gradient-to-r from-purple-900 to-indigo-600' },
    { value: 'minimal', label: 'Minimal', colors: 'bg-gradient-to-r from-gray-800 to-gray-600' },
  ];

  const displayFormats: { value: DisplayFormat; label: string }[] = [
    { value: 'standard', label: 'Standard (H:M:S)' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'both', label: 'Both' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-decha-slate border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-decha-blue" />
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-decha-cyan" />
                  <h3 className="text-lg font-semibold text-white">Theme</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === t.value
                          ? 'border-decha-blue scale-105'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`h-12 rounded-lg mb-2 ${t.colors}`} />
                      <span className="text-sm text-white/80">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Format */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-decha-purple" />
                  <h3 className="text-lg font-semibold text-white">Display Format</h3>
                </div>
                <div className="space-y-2">
                  {displayFormats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setDisplayFormat(format.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        displayFormat === format.value
                          ? 'border-decha-purple bg-decha-purple/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-white/80">{format.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-decha-pink" />
                  <h3 className="text-lg font-semibold text-white">Display Options</h3>
                </div>
                <div className="space-y-2">
                  <ToggleOption
                    label="Show Earth Time"
                    checked={showEarthTime}
                    onChange={toggleEarthTime}
                  />
                  <ToggleOption
                    label="Show Progress Bars"
                    checked={showProgressBars}
                    onChange={toggleProgressBars}
                  />
                  <ToggleOption
                    label="Show Day Context"
                    checked={showDayContext}
                    onChange={toggleDayContext}
                  />
                  <ToggleOption
                    label="24-Hour Earth Time"
                    checked={use24HourEarth}
                    onChange={toggle24HourEarth}
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-colors"
              >
                Reset to Defaults
              </button>

              {/* Info */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60 leading-relaxed">
                  DECHA Time v1.0.0 • Decimal Chronological Harmony
                  <br />
                  Built for the digital age 🚀
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleOption({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
    >
      <span className="text-white/80">{label}</span>
      <div
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-decha-blue' : 'bg-white/20'
        }`}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full m-0.5"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}