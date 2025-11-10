import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlarmClock, Plus } from 'lucide-react';
import { useAlarmsStore } from '../stores/alarmsStore';
import { useWakeLock } from '../hooks/useWakeLock';
import { useOptimizedNotifications } from '../hooks/useOptimizedNotifications';
import { AlarmCard } from './AlarmCard';
import { AlarmForm } from './AlarmForm';

interface AlarmManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlarmManager({ isOpen, onClose }: AlarmManagerProps) {
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, markAsTriggered } = useAlarmsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isWakeLockActive, requestWakeLock, setShouldReacquire } = useWakeLock();
  const { sendNotification } = useOptimizedNotifications();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleToggle = (id: string) => {
    toggleAlarm(id);
    
    // Check if any alarms are enabled and manage wake lock accordingly
    const hasActiveAlarms = alarms.some(alarm => alarm.enabled);
    if (hasActiveAlarms && !isWakeLockActive) {
      setShouldReacquire(true);
      requestWakeLock();
    } else if (!hasActiveAlarms && isWakeLockActive) {
      setShouldReacquire(false);
    }
  };

  // Check for due alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      alarms.forEach(alarm => {
        if (alarm.enabled && !alarm.triggered) {
          const alarmTime = new Date();
          const [hours, minutes] = alarm.time.split(':').map(Number);
          alarmTime.setHours(hours, minutes, 0, 0);
          
          // Check if alarm should trigger (within 1 minute window)
          if (Math.abs(now.getTime() - alarmTime.getTime()) < 60000) {
            triggerAlarm(alarm);
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [alarms]);

  const triggerAlarm = async (alarm: any) => {
    try {
      // Mark as triggered
      markAsTriggered(alarm.id);
      
      // Request wake lock if not active
      if (!isWakeLockActive) {
        setShouldReacquire(true);
        requestWakeLock();
      }
      
      // Send notification
      await sendNotification('DECHA Alarm', {
        body: alarm.label || `Alarm at ${alarm.time}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `alarm-${alarm.id}`,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'dismiss',
            title: 'Dismiss'
          },
          {
            action: 'snooze',
            title: 'Snooze (5 min)'
          }
        ]
      });
      
      // Play sound if enabled
      if (alarm.sound) {
        playAlarmSound();
      }
    } catch (error) {
      console.error('Failed to trigger alarm:', error);
    }
  };

  const playAlarmSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
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
                  <AlarmClock className="w-6 h-6 text-decha-blue" />
                  <h2 className="text-2xl font-bold text-white">Alarms</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Add Button */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-decha-blue hover:bg-decha-blue/80 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">New Alarm</span>
                </button>
              )}

              {/* Alarm Form */}
              {showForm && (
                <AlarmForm
                  editingId={editingId}
                  onClose={handleCloseForm}
                />
              )}

              {/* Alarm List */}
              <div className="space-y-3">
                {alarms.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <AlarmClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No alarms yet</p>
                    <p className="text-sm mt-1">Create your first DECHA alarm</p>
                  </div>
                ) : (
                  alarms.map((alarm) => (
                    <AlarmCard
                      key={alarm.id}
                      alarm={alarm}
                      onEdit={() => handleEdit(alarm.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}