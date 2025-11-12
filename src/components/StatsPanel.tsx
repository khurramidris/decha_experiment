import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Award, TrendingUp } from 'lucide-react';
import { useViewport } from '../hooks/useViewport';
import { useStatsStore } from '../stores/statsStore';
import { achievements } from '../utils/achievements';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsPanel({ isOpen, onClose }: StatsPanelProps) {
  const { isMobile } = useViewport();
  const stats = useStatsStore();

  const daysUsed = Math.floor((Date.now() - stats.firstUse) / (1000 * 60 * 60 * 24));
  const hoursSpent = Math.floor(stats.totalTimeSpent / 3600);
  const minutesSpent = Math.floor((stats.totalTimeSpent % 3600) / 60);

  const favoriteTheme = Object.entries(stats.themeUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'navy';
  const unlockedAchievements = achievements.filter(a => stats.achievements.includes(a.id));

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
            className={`fixed right-0 top-0 h-full bg-decha-slate border-l border-white/10 z-50 overflow-y-auto ${
              isMobile ? 'w-full' : 'w-full max-w-md'
            }`}
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-decha-blue" />
                  <h2 className="text-2xl font-bold text-white">Stats</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Usage Stats */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-decha-cyan" />
                  Usage
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Days Used" value={daysUsed.toString()} />
                  <StatCard label="Sessions" value={stats.totalSessions.toString()} />
                  <StatCard label="Time Spent" value={`${hoursSpent}h ${minutesSpent}m`} />
                  <StatCard label="Longest Session" value={`${Math.floor(stats.longestSession / 60)}m`} />
                </div>
              </div>

              {/* Feature Usage */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Features</h3>
                
                <div className="space-y-2">
                  <FeatureStat label="Alarms Created" value={stats.featuresUsed.alarmsCreated} />
                  <FeatureStat label="Alarms Triggered" value={stats.featuresUsed.alarmsTriggered} />
                  <FeatureStat label="Events Created" value={stats.featuresUsed.eventsCreated} />
                  <FeatureStat label="Times Shared" value={stats.featuresUsed.timeShared} />
                  <FeatureStat label="Converter Used" value={stats.featuresUsed.converterOpened} />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-sm text-white/60 mb-1">Favorite Theme</div>
                  <div className="text-xl font-semibold text-white capitalize">{favoriteTheme}</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-decha-pink" />
                  Achievements ({unlockedAchievements.length}/{achievements.length})
                </h3>
                
                <div className="space-y-2">
                  {achievements.map((achievement) => {
                    const unlocked = stats.achievements.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border ${
                          unlocked
                            ? 'bg-white/5 border-white/10'
                            : 'bg-white/5 border-white/5 opacity-40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-white text-sm">{achievement.name}</div>
                            <div className="text-xs text-white/60">{achievement.description}</div>
                          </div>
                          {unlocked && <Award className="w-4 h-4 text-decha-blue" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="text-sm text-white/60 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function FeatureStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <span className="text-white/80 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}