import { Achievement } from '../types/stats';

export const achievements: Achievement[] = [
  {
    id: 'first-use',
    name: 'DECHA Pioneer',
    description: 'Used DECHA Time for the first time',
    icon: '🚀',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Used DECHA Time for 7 consecutive days',
    icon: '🔥',
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Used DECHA Time for 30 days',
    icon: '⭐',
  },
  {
    id: 'century',
    name: 'Century Club',
    description: 'Used DECHA Time for 100 days',
    icon: '💯',
  },
  {
    id: 'alarm-setter',
    name: 'Alarm Setter',
    description: 'Created 10 alarms',
    icon: '⏰',
  },
  {
    id: 'event-planner',
    name: 'Event Planner',
    description: 'Created 50 calendar events',
    icon: '📅',
  },
  {
    id: 'theme-explorer',
    name: 'Theme Explorer',
    description: 'Tried all themes',
    icon: '🎨',
  },
  {
    id: 'converter-pro',
    name: 'Converter Pro',
    description: 'Used the time converter 100 times',
    icon: '🔄',
  },
  {
    id: 'share-master',
    name: 'Share Master',
    description: 'Shared DECHA time 20 times',
    icon: '📤',
  },
];

export function checkAchievements(stats: any): string[] {
  const unlocked: string[] = [...stats.achievements];
  
  // Days milestones
  const daysUsed = Math.floor((Date.now() - stats.firstUse) / (1000 * 60 * 60 * 24));
  
  if (daysUsed >= 7 && !unlocked.includes('week-warrior')) {
    unlocked.push('week-warrior');
  }
  
  if (daysUsed >= 30 && !unlocked.includes('month-master')) {
    unlocked.push('month-master');
  }
  
  if (daysUsed >= 100 && !unlocked.includes('century')) {
    unlocked.push('century');
  }
  
  // Feature usage
  if (stats.featuresUsed.alarmsCreated >= 10 && !unlocked.includes('alarm-setter')) {
    unlocked.push('alarm-setter');
  }
  
  if (stats.featuresUsed.eventsCreated >= 50 && !unlocked.includes('event-planner')) {
    unlocked.push('event-planner');
  }
  
  if (stats.featuresUsed.converterOpened >= 100 && !unlocked.includes('converter-pro')) {
    unlocked.push('converter-pro');
  }
  
  if (stats.featuresUsed.timeShared >= 20 && !unlocked.includes('share-master')) {
    unlocked.push('share-master');
  }
  
  return unlocked;
}