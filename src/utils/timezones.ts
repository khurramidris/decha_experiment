export interface TimezoneInfo {
  name: string;
  label: string;
  offset: string;
}

export const popularTimezones: TimezoneInfo[] = [
  { name: 'America/New_York', label: 'New York (EST/EDT)', offset: 'UTC-5/-4' },
  { name: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: 'UTC-6/-5' },
  { name: 'America/Denver', label: 'Denver (MST/MDT)', offset: 'UTC-7/-6' },
  { name: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: 'UTC-8/-7' },
  { name: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+0/+1' },
  { name: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 'UTC+1/+2' },
  { name: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 'UTC+3' },
  { name: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },
  { name: 'Asia/Kolkata', label: 'India (IST)', offset: 'UTC+5:30' },
  { name: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 'UTC+8' },
  { name: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'UTC+9' },
  { name: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)', offset: 'UTC+10/+11' },
  { name: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)', offset: 'UTC+12/+13' },
];

export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneOffset(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  
  const parts = formatter.formatToParts(now);
  const tzPart = parts.find(part => part.type === 'timeZoneName');
  
  return tzPart?.value || '';
}

export function formatTimeInTimezone(
  earthHours: number,
  earthMinutes: number,
  earthSeconds: number,
  timezone: string
): string {
  const date = new Date();
  date.setHours(earthHours, earthMinutes, earthSeconds);
  
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}