import { useState, useEffect } from 'react';
import { useCalendarStore } from '../stores/calendarStore';
import { useStatsStore } from '../stores/statsStore';
import { analytics, AnalyticsEvents } from '../analytics';
import { EventFormData } from '../types/calendar';

interface EventFormProps {
  editingId: string | null;
  selectedDate: string;
  onClose: () => void;
}

export function EventForm({ editingId, selectedDate, onClose }: EventFormProps) {
  const addEvent = useCalendarStore(state => state.addEvent);
  const updateEvent = useCalendarStore(state => state.updateEvent);
  const events = useCalendarStore(state => state.events);
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  const editingEvent = editingId ? events.find(e => e.id === editingId) : null;

  const [formData, setFormData] = useState<EventFormData>({
    title: editingEvent?.title || '',
    description: editingEvent?.description || '',
    hours: editingEvent?.dechaStart.hours.toString() || '4',
    minutes: editingEvent?.dechaStart.minutes.toString() || '0',
    duration: editingEvent?.duration.toString() || '50',
    category: editingEvent?.category || 'work',
    repeat: editingEvent?.repeat || 'none',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const event = {
      title: formData.title,
      description: formData.description,
      dechaStart: {
        hours: parseInt(formData.hours) || 0,
        minutes: parseInt(formData.minutes) || 0,
      },
      duration: parseInt(formData.duration) || 50,
      date: selectedDate,
      category: formData.category,
      color: getCategoryColor(formData.category),
      repeat: formData.repeat,
      completed: false,
    };

    if (editingId) {
      updateEvent(editingId, event);
      analytics.trackEvent(AnalyticsEvents.EVENT_EDITED);
    } else {
      addEvent(event);
      analytics.trackEvent(AnalyticsEvents.EVENT_CREATED);
      incrementFeature('eventsCreated');
    }

    onClose();
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      work: '#3b82f6',
      personal: '#10b981',
      health: '#ec4899',
      other: '#8b5cf6',
    };
    return colors[category] || colors.other;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
          placeholder="Team Meeting"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Description (optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue resize-none"
          placeholder="Discuss Q4 goals..."
          rows={3}
        />
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm text-white/60 mb-2">DECHA Time</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="9"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            className="w-20 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-decha-blue"
            placeholder="H"
          />
          <span className="text-white/40">:</span>
          <input
            type="number"
            min="0"
            max="99"
            value={formData.minutes}
            onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
            className="w-20 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-decha-blue"
            placeholder="MM"
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Duration (DECHA minutes)</label>
        <input
          type="number"
          min="1"
          max="100"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-decha-blue"
          placeholder="50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Repeat */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Repeat</label>
        <select
          value={formData.repeat}
          onChange={(e) => setFormData({ ...formData, repeat: e.target.value as any })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-decha-blue hover:bg-decha-blue/80 rounded-lg text-white font-semibold transition-colors"
        >
          {editingId ? 'Update' : 'Create'} Event
        </button>
      </div>
    </form>
  );
}