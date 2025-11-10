import { Alarm } from '../types/alarm';
import { useAlarmsStore } from '../stores/alarmsStore';
import { Trash2, Edit, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlarmCardProps {
  alarm: Alarm;
  onEdit: () => void;
}

export function AlarmCard({ alarm, onEdit }: AlarmCardProps) {
  const toggleAlarm = useAlarmsStore(state => state.toggleAlarm);
  const deleteAlarm = useAlarmsStore(state => state.deleteAlarm);

  const earthSeconds = Math.floor(
    (alarm.dechaTime.hours * 10000 + alarm.dechaTime.minutes * 100 + alarm.dechaTime.seconds) * 0.864
  );
  const earthHours = Math.floor(earthSeconds / 3600);
  const earthMins = Math.floor((earthSeconds % 3600) / 60);

  const repeatLabels = {
    once: 'Once',
    daily: 'Daily',
    weekdays: 'Weekdays',
    weekends: 'Weekends',
    custom: 'Custom',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        alarm.enabled
          ? 'bg-white/5 border-white/10'
          : 'bg-white/5 border-white/5 opacity-50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl font-bold text-white font-mono">
              {alarm.dechaTime.hours}:{String(alarm.dechaTime.minutes).padStart(2, '0')}
            </span>
            <span className="text-sm text-white/40 font-mono">
              :{String(alarm.dechaTime.seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="text-sm text-white/60">
            {String(earthHours).padStart(2, '0')}:{String(earthMins).padStart(2, '0')} Earth
          </div>
          <div className="text-sm text-white/80 mt-1">{alarm.label}</div>
          <div className="text-xs text-white/40 mt-1">{repeatLabels[alarm.repeat]}</div>
        </div>

        <button
          onClick={() => toggleAlarm(alarm.id)}
          className={`p-2 rounded-lg transition-colors ${
            alarm.enabled
              ? 'text-decha-blue hover:bg-white/10'
              : 'text-white/40 hover:bg-white/10'
          }`}
        >
          {alarm.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/80">Edit</span>
        </button>
        <button
          onClick={() => deleteAlarm(alarm.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-300">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}