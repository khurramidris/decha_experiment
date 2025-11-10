import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from '../stores/calendarStore';
import { CalendarDay } from './CalendarDay';
import { EventForm } from './EventForm';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Calendar({ isOpen, onClose }: CalendarProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedDate = useCalendarStore(state => state.selectedDate);
  const setSelectedDate = useCalendarStore(state => state.setSelectedDate);
  const getEventsForDate = useCalendarStore(state => state.getEventsForDate);

  const events = getEventsForDate(selectedDate);

  const currentDate = new Date(selectedDate);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
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
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="modal-side-panel w-full max-w-md bg-decha-slate border-l border-white/10"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-decha-blue" />
                  <h2 className="text-2xl font-bold text-white">Calendar</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Date Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevDay}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white/60" />
                </button>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {currentDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-white/60">
                    {currentDate.toLocaleDateString('en-US', { year: 'numeric' })}
                  </div>
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <button
                onClick={handleToday}
                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 text-sm transition-colors"
              >
                Today
              </button>

              {/* Add Event Button */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-decha-blue hover:bg-decha-blue/80 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">New Event</span>
                </button>
              )}

              {/* Event Form */}
              {showForm && (
                <EventForm
                  editingId={editingId}
                  selectedDate={selectedDate}
                  onClose={handleCloseForm}
                />
              )}

              {/* Day View */}
              <CalendarDay
                date={selectedDate}
                events={events}
                onEdit={handleEdit}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}