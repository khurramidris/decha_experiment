import { useCalendarStore } from './calendarStore';
import { CalendarEvent, CalendarView } from '../types/calendar';

// Optimized selectors to prevent unnecessary re-renders
export const useEvents = (): CalendarEvent[] => useCalendarStore(state => state.events);
export const useCurrentView = (): CalendarView => useCalendarStore(state => state.currentView);
export const useSelectedDate = (): string => useCalendarStore(state => state.selectedDate);
export const useEventCount = (): number => useCalendarStore(state => state.events.length);

// Computed selectors
export const useEventsForDate = (date: string): CalendarEvent[] => 
  useCalendarStore(state => state.events.filter(event => event.date === date));

export const useEventsForWeek = (startDate: string): CalendarEvent[] => 
  useCalendarStore(state => {
    const start = new Date(startDate);
    const events: CalendarEvent[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      events.push(...state.events.filter(e => e.date === dateStr));
    }
    
    return events;
  });

// Action selectors
export const useAddEvent = () => useCalendarStore(state => state.addEvent);
export const useUpdateEvent = () => useCalendarStore(state => state.updateEvent);
export const useDeleteEvent = () => useCalendarStore(state => state.deleteEvent);
export const useToggleEventComplete = () => useCalendarStore(state => state.toggleEventComplete);
export const useSetView = () => useCalendarStore(state => state.setView);
export const useSetSelectedDate = () => useCalendarStore(state => state.setSelectedDate);
export const useClearAllEvents = () => useCalendarStore(state => state.clearAllEvents);
export const useExportEvents = () => useCalendarStore(state => state.exportEvents);
export const useImportEvents = () => useCalendarStore(state => state.importEvents);