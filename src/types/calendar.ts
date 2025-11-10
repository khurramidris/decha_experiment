export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  dechaStart: {
    hours: number;
    minutes: number;
  };
  duration: number; // Duration in DECHA minutes
  date: string; // ISO date string (YYYY-MM-DD)
  category: 'work' | 'personal' | 'health' | 'other';
  color: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  createdAt: number;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface EventFormData {
  title: string;
  description: string;
  hours: string;
  minutes: string;
  duration: string;
  category: CalendarEvent['category'];
  repeat: CalendarEvent['repeat'];
}