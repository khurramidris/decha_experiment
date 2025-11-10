import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Settings } from 'lucide-react';
import { requestNotificationPermission } from '../utils/serviceWorker';

export function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is not granted
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  };

  const handleRequestPermission = async () => {
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      setShowPrompt(false);
      
      if (result === 'granted') {
        console.log('Notification permission granted');
      } else if (result === 'denied') {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  const handleOpenSettings = () => {
    // Open browser settings for notifications
    if ('Notification' in window && Notification.permission === 'denied') {
      // For mobile, this might not work, but it's worth trying
      window.open('app-settings://notification', '_blank');
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-1">
              Enable Notifications
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              Get notified when your alarms go off, even when the app is in the background.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Enable
              </button>
              {permission === 'denied' && (
                <button
                  onClick={handleOpenSettings}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}