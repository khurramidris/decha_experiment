import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../stores/settingsSelectors';
import { X, AlarmClock, Plus } from 'lucide-react';
import { useAlarmsStore } from '../stores/alarmsStore';
import { useWakeLock } from '../hooks/useWakeLock';
import { AlarmCard } from './AlarmCard';
import { AlarmForm } from './AlarmForm';
import { useViewport } from '../hooks/useViewport';
import { requestBackgroundAlarmPermission, syncAlarmsToServiceWorker } from '../utils/serviceWorkerAlarms';
import { startBackgroundAlarmSync, stopBackgroundAlarmSync } from '../utils/backgroundAlarmSync';

interface AlarmManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlarmManager({ isOpen, onClose }: AlarmManagerProps) {
  const { isMobile } = useViewport();
  const reducedMotion = useReducedMotion();
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, markAsTriggered } = useAlarmsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isWakeLockActive, requestWakeLock, setShouldReacquire } = useWakeLock();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  useEffect(() => {
    // Request background alarm permission and start sync when component mounts
    if (isOpen && alarms.length > 0) {
      requestBackgroundAlarmPermission();
      syncAlarmsToServiceWorker(alarms);
      startBackgroundAlarmSync();
    }
    
    return () => {
      // Clean up when component unmounts
      if (!isOpen) {
        stopBackgroundAlarmSync();
      }
    };
  }, [isOpen, alarms.length]);

  const handleToggle = (id: string) => {
    toggleAlarm(id);
    
    // Check if any alarms are enabled and manage wake lock accordingly
    const hasActiveAlarms = alarms.some(alarm => alarm.enabled);
    if (hasActiveAlarms && !isWakeLockActive) {
      setShouldReacquire(true);
      requestWakeLock();
      // Request background permission for locked screen alarms
      requestBackgroundAlarmPermission();
    } else if (!hasActiveAlarms && isWakeLockActive) {
      setShouldReacquire(false);
    }
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
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 300 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 300 }}
            transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 25 }}
            role="dialog" aria-modal="true" aria-labelledby="alarms-title" tabIndex={-1}
            className={`fixed right-0 top-0 h-full h-dvh bg-black/95 backdrop-blur-2xl border-l border-white/5 z-50 overflow-y-auto ${
              isMobile ? 'w-full' : 'w-full max-w-md'
            }`}
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlarmClock className="w-6 h-6 text-decha-blue" />
                  <h2 id="alarms-title" className="text-2xl font-bold text-white">Alarms</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Add Button - Apple style */}
              {!showForm && (
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/15 rounded-2xl transition-all backdrop-blur-sm border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-base">New Alarm</span>
                </motion.button>
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
