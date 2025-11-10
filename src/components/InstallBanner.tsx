import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { analytics, AnalyticsEvents } from '../analytics';

export function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  // Check localStorage for previous dismissals
  useEffect(() => {
    const dismissed = localStorage.getItem('install-banner-dismissed');
    const count = parseInt(localStorage.getItem('install-dismiss-count') || '0');
    
    setDismissCount(count);
    
    if (dismissed === 'true' && count >= 3) {
      setIsDismissed(true); // Permanently hide after 3 dismissals
    }
  }, []);

  const handleInstall = async () => {
    analytics.trackEvent(AnalyticsEvents.PWA_INSTALL_PROMPTED);
    
    const accepted = await promptInstall();
    
    if (accepted) {
      analytics.trackEvent(AnalyticsEvents.PWA_INSTALLED);
      setIsDismissed(true);
    } else {
      analytics.trackEvent(AnalyticsEvents.PWA_INSTALL_DISMISSED);
    }
  };

  const handleDismiss = () => {
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    setIsDismissed(true);
    
    localStorage.setItem('install-banner-dismissed', 'true');
    localStorage.setItem('install-dismiss-count', newCount.toString());
    
    analytics.trackEvent(AnalyticsEvents.PWA_INSTALL_DISMISSED, {
      dismissCount: newCount,
    });
  };

  // Don't show if installed, dismissed, or not installable
  if (!isInstallable || isInstalled || isDismissed || dismissCount >= 3) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
      >
        <div className="bg-decha-slate border border-decha-blue/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-decha-blue/20 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-decha-blue" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                Install DECHA Time
              </h3>
              <p className="text-white/60 text-sm mb-3">
                Get offline access and a faster experience
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-decha-blue hover:bg-decha-blue/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}