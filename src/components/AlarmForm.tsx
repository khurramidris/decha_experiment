import { useState, useEffect } from 'react';
import { useAlarmsStore } from '../stores/alarmsStore';
import { useStatsStore } from '../stores/statsStore';
import { analytics, AnalyticsEvents } from '../analytics';
import { AlarmFormData } from '../types/alarm';
import { Check } from 'lucide-react';

interface AlarmFormProps {
  editingId: string | null;
  onClose: () => void;
}

export function AlarmForm({ editingId, onClose }: AlarmFormProps) {
  const addAlarm = useAlarmsStore(state => state.addAlarm);
  const updateAlarm = useAlarmsStore(state => state.updateAlarm);
  const alarms = useAlarmsStore(state => state.alarms);
  const incrementFeature = useStatsStore(state => state.incrementFeature);

  const editingAlarm = editingId ? alarms.find(a => a.id === editingId) : null;

  const [formData, setFormData] = useState<AlarmFormData>({
    hours: editingAlarm?.dechaTime.hours.toString() || '7',
    minutes: editingAlarm?.dechaTime.minutes.toString() || '0',
    seconds: editingAlarm?.dechaTime.seconds.toString() || '0',
    label: editingAlarm?.label || 'Wake Up',
    repeat: editingAlarm?.repeat || 'daily',
    customDays: editingAlarm?.customDays || [],
    sound: editingAlarm?.sound ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const alarm = {
      dechaTime: {
        hours: parseInt(formData.hours) || 0,
        minutes: parseInt(formData.minutes) || 0,
        seconds: parseInt(formData.seconds) || 0,
      },
      label: formData.label,
      enabled: true,
      repeat: formData.repeat,
      customDays: formData.repeat === 'custom' ? formData.customDays : undefined,
      sound: formData.sound,
    };

    if (editingId) {
      updateAlarm(editingId, alarm);
      analytics.trackEvent(AnalyticsEvents.ALARM_EDITED);
    } else {
      addAlarm(alarm);
      analytics.trackEvent(AnalyticsEvents.ALARM_CREATED);
      incrementFeature('alarmsCreated');
    }

    onClose();
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day].sort(),
    }));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Time Input */}
      <div>
        <label className="block text-sm text-white/60 mb-2">DECHA Time</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="9"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-decha-blue"
            placeholder="H"
          />
          <span className="text-white/40 text-2xl">:</span>
          <input
            type="number"
            min="0"
            max="99"
            value={formData.minutes}
            onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-decha-blue"
            placeholder="MM"
          />
          <span className="text-white/40 text-2xl">:</span>
          <input
            type="number"
            min="0"
            max="99"
            value={formData.seconds}
            onChange={(e) => setFormData({ ...formData, seconds: e.target.value })}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-decha-blue"
            placeholder="SS"
          />
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
          placeholder="Wake Up"
        />
      </div>

      {/* Repeat */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Repeat</label>
        <select
          value={formData.repeat}
          onChange={(e) => setFormData({ ...formData, repeat: e.target.value as any })}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-decha-blue"
        >
          <option value="once">Once</option>
          <option value="daily">Daily</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Custom Days */}
      {formData.repeat === 'custom' && (
        <div>
          <label className="block text-sm text-white/60 mb-2">Select Days</label>
          <div className="flex gap-2">
            {days.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  formData.customDays.includes(index)
                    ? 'bg-decha-blue border-decha-blue text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sound Toggle */}
      <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer">
        <span className="text-white/80">Sound</span>
        <div
          className={`w-12 h-6 rounded-full transition-colors ${
            formData.sound ? 'bg-decha-blue' : 'bg-white/20'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${
              formData.sound ? 'translate-x-6' : ''
            }`}
          />
        </div>
        <input
          type="checkbox"
          checked={formData.sound}
          onChange={(e) => setFormData({ ...formData, sound: e.target.checked })}
          className="hidden"
        />
      </label>

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
          {editingId ? 'Update' : 'Create'} Alarm
        </button>
      </div>
    </form>
  );
}