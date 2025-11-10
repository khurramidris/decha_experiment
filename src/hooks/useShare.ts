import { DechaTime, EarthTime } from '../types/decha';
import { formatDechaTime, formatEarthTime } from '../utils/dechaCalculations';

export function useShare() {
  const shareTime = async (dechaTime: DechaTime, earthTime: EarthTime): Promise<boolean> => {
    const dechaStr = formatDechaTime(dechaTime);
    const earthStr = formatEarthTime(earthTime, true);
    
    const text = `It's ${dechaStr} DECHA (${earthStr} Earth Time) ⏰\n\nCheck out DECHA Time - Decimal time for the digital age!`;
    const url = window.location.origin;

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DECHA Time',
          text: text,
          url: url,
        });
        return true;
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', error);
        return false;
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
      }
    }
  };

  return { shareTime };
}