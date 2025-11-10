import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, CalendarView } from '../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  currentView: CalendarView;
  selectedDate: string; // ISO date
  
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventComplete: (id: string) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForWeek: (startDate: string) => CalendarEvent[];
  clearAllEvents: () => void;
  exportEvents: () => string;
  importEvents: (json: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      currentView: 'day',
      selectedDate: new Date().toISOString().split('T')[0],
      
      addEvent: (event) => set((state) => ({
        events: [...state.events, {
          ...event,
          id: uuidv4(),
          createdAt: Date.now(),
        }]
      })),
      
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(event =>
          event.id === id ? { ...event, ...updates } : event
        )
      })),
      
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(event => event.id !== id)
      })),
      
      toggleEventComplete: (id) => set((state) => ({
        events: state.events.map(event =>
          event.id === id ? { ...event, completed: !event.completed } : event
        )
      })),
      
      setView: (view) => set({ currentView: view }),
      
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      getEventsForDate: (date) => {
        return get().events.filter(event => event.date === date);
      },
      
      getEventsForWeek: (startDate) => {
        const start = new Date(startDate);
        const events: CalendarEvent[] = [];
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          events.push(...get().events.filter(e => e.date === dateStr));
        }
        
        return events;
      },
      
      clearAllEvents: () => set({ events: [] }),
      
      exportEvents: () => {
        return JSON.stringify(get().events, null, 2);
      },
      
      importEvents: (json) => {
        try {
          const imported = JSON.parse(json);
          if (Array.isArray(imported)) {
            set({ events: imported });
          }
        } catch (error) {
          console.error('Failed to import events:', error);
        }
      },
    }),
    {
      name: 'decha-calendar',
    }
  )
);