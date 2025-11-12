import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Clock, Calendar, Bell, BarChart3, Globe, Keyboard, Settings, Github } from 'lucide-react';
import { useViewport } from '../hooks/useViewport';

interface MobileNavigationProps {
  onFeatureClick: (feature: string) => void;
}

export function MobileNavigation({ onFeatureClick }: MobileNavigationProps) {
  const { isMobile } = useViewport();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

  const navigationSections = [
    {
      title: 'Time & Display',
      items: [
        { id: 'converter', icon: Clock, label: 'Time Converter', shortcut: 'C' },
        { id: 'multi-timezone', icon: Globe, label: 'Multi-Timezone', shortcut: 'M' },
        { id: 'earth-time', icon: Clock, label: 'Earth Time', shortcut: 'T' },
      ]
    },
    {
      title: 'Alarms & Reminders',
      items: [
        { id: 'alarms', icon: Bell, label: 'Alarms', shortcut: 'A' },
      ]
    },
    {
      title: 'Calendar & Stats',
      items: [
        { id: 'calendar', icon: Calendar, label: 'Calendar', shortcut: 'L' },
        { id: 'stats', icon: BarChart3, label: 'Statistics', shortcut: 'D' },
      ]
    },
    {
      title: 'Help & Support',
      items: [
        { id: 'keyboard', icon: Keyboard, label: 'Keyboard Shortcuts', shortcut: 'K' },
        { id: 'settings', icon: Settings, label: 'Settings', shortcut: 'Space' },
        { id: 'github', icon: Github, label: 'GitHub Repository', shortcut: '' },
      ]
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    onFeatureClick(featureId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-decha-blue hover:bg-decha-blue/80 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 safe-bottom safe-right ${
          isMenuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 safe-area"
          >
            <div className="h-full flex flex-col p-6 safe-area">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Navigation Sections */}
              <div className="flex-1 overflow-y-auto space-y-8">
                {navigationSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                          onClick={() => handleFeatureClick(item.id)}
                          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-decha-blue" />
                            <span className="text-white font-medium">{item.label}</span>
                          </div>
                          {item.shortcut && (
                            <span className="text-xs text-white/40 font-mono group-hover:text-white/60 transition-colors">
                              {item.shortcut}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-center text-xs text-white/40">
                  Press Escape or tap outside to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}