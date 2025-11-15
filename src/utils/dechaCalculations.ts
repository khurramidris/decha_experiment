import { DechaTime, EarthTime, DayPeriod } from '../types/decha';

// Constants
const SECONDS_PER_EARTH_DAY = 86400;
const SECONDS_PER_DECHA_DAY = 100000;
const EARTH_TO_DECHA_RATIO = SECONDS_PER_DECHA_DAY / SECONDS_PER_EARTH_DAY;
const DECHA_SECOND_IN_EARTH_SECONDS = SECONDS_PER_EARTH_DAY / SECONDS_PER_DECHA_DAY;

/**
 * Converts Earth seconds since midnight to DECHA time
 */
export function earthSecondsToDechaTime(earthSeconds: number): DechaTime {
  // Calculate total DECHA seconds since midnight (precise)
  const dechaSecondsPrecise = earthSeconds / DECHA_SECOND_IN_EARTH_SECONDS;
  const totalDechaSeconds = Math.floor(dechaSecondsPrecise);

  // Calculate DECHA components
  const hours = Math.floor(totalDechaSeconds / 10000);
  const minutes = Math.floor((totalDechaSeconds % 10000) / 100);
  const seconds = Math.floor(totalDechaSeconds % 100);

  // Calculate percentage of day completed (smooth)
  const percentage = (dechaSecondsPrecise / SECONDS_PER_DECHA_DAY) * 100;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds: totalDechaSeconds,
    percentage
  };
}

/**
 * Gets current Earth time
 */
export function getCurrentEarthTime(): EarthTime {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };
}

/**
 * Gets Earth seconds since midnight
 */
export function getEarthSecondsSinceMidnight(): number {
  const now = new Date();
  return (
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds() +
    now.getMilliseconds() / 1000
  );
}

/**
 * Gets current DECHA time
 */
export function getCurrentDechaTime(): DechaTime {
  const earthSeconds = getEarthSecondsSinceMidnight();
  return earthSecondsToDechaTime(earthSeconds);
}

/**
 * Formats DECHA time as string
 */
export function formatDechaTime(time: DechaTime, includeSeconds: boolean = true): string {
  const h = time.hours.toString().padStart(1, '0');
  const m = time.minutes.toString().padStart(2, '0');
  const s = time.seconds.toString().padStart(2, '0');
  
  return includeSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}

/**
 * Formats DECHA time as decimal
 */
export function formatDechaDecimal(time: DechaTime): string {
  const decimal = time.hours + (time.minutes / 100) + (time.seconds / 10000);
  return decimal.toFixed(4);
}

/**
 * Formats Earth time as string
 */
export function formatEarthTime(time: EarthTime, use24Hour: boolean = true): string {
  let hours = time.hours;
  let suffix = '';
  
  if (!use24Hour) {
    suffix = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }
  
  const h = hours.toString().padStart(2, '0');
  const m = time.minutes.toString().padStart(2, '0');
  const s = time.seconds.toString().padStart(2, '0');
  
  return `${h}:${m}:${s}${suffix}`;
}

/**
 * Gets day period based on DECHA time
 */
export function getDayPeriod(dechaTime: DechaTime): DayPeriod {
  const hour = dechaTime.hours;
  
  if (hour < 1) return 'night';
  if (hour < 2) return 'dawn';
  if (hour < 4) return 'morning';
  if (hour < 5) return 'midday';
  if (hour < 7) return 'afternoon';
  if (hour < 9) return 'evening';
  return 'night';
}

/**
 * Gets description for current day period
 */
export function getDayPeriodDescription(period: DayPeriod): string {
  const descriptions: Record<DayPeriod, string> = {
    night: 'Deep Night • Rest & Renewal',
    dawn: 'Early Dawn • New Beginnings',
    morning: 'Morning Rise • Peak Energy',
    midday: 'Midday Peak • Maximum Focus',
    afternoon: 'Afternoon Flow • Sustained Work',
    evening: 'Evening Wind • Reflection Time',
  };
  
  return descriptions[period];
}

/**
 * Calculates progress percentage for a component
 */
export function calculateProgress(current: number, max: number): number {
  return (current / max) * 100;
}
