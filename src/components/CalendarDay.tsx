import { CalendarEvent } from '../types/calendar';
import { useCalendarStore } from '../stores/calendarStore';
import { Trash2, Edit, CheckCircle, Circle, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarDayProps {
  date: string;
  events: CalendarEvent[];
  onEdit: (id: string) => void;
}

export function CalendarDay({ date, events, onEdit }: CalendarDayProps) {
  const deleteEvent = useCalendarStore(state => state.deleteEvent);
  const toggleEventComplete = useCalendarStore(state => state.toggleEventComplete);

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    const aTime = a.dechaStart.hours * 100 + a.dechaStart.minutes;
    const bTime = b.dechaStart.hours * 100 + b.dechaStart.minutes;
    return aTime - bTime;
  });

  // Create time blocks for the day (0-9 hours)
  const timeBlocks = Array.from({ length: 10 }, (_, i) => i);

  const categoryColors: Record<CalendarEvent['category'], string> = {
    work: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    personal: 'bg-green-500/20 border-green-500/50 text-green-300',
    health: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
    other: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  };

  return (
    <div className="space-y-4">
      {/* Time Blocks */}
      <div className="space-y-2">
        {timeBlocks.map((hour) => {
          const hourEvents = sortedEvents.filter(e => e.dechaStart.hours === hour);

          return (
            <div key={hour} className="flex gap-3">
              <div className="w-12 text-right text-white/40 text-sm font-mono pt-1">
                {hour}:00
              </div>
              <div className="flex-1 space-y-2">
                {hourEvents.length > 0 ? (
                  hourEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${categoryColors[event.category]} ${
                        event.completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => toggleEventComplete(event.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              {event.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <span className={`font-semibold ${event.completed ? 'line-through' : ''}`}>
                              {event.title}
                            </span>
                          </div>
                          <div className="text-xs opacity-80 ml-6">
                            {event.dechaStart.hours}:{String(event.dechaStart.minutes).padStart(2, '0')} 
                            {' • '}
                            {event.duration} min
                          </div>
                          {event.description && (
                            <div className="text-xs opacity-60 mt-1 ml-6">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-6">
                        <button
                          onClick={() => onEdit(event.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-8 border-l-2 border-white/5 ml-2"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedEvents.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No events for this day</p>
          <p className="text-sm mt-1">Create your first DECHA event</p>
        </div>
      )}
    </div>
  );
}