import { useEffect } from 'react';

export function useAppBadge(dechaHour: number, isEnabled: boolean = true) {
  useEffect(() => {
    if (!isEnabled) {
      clearBadge();
      return;
    }

    // Check if App Badge API is supported
    if ('setAppBadge' in navigator) {
      try {
        // Set badge to current DECHA hour (0-9)
        (navigator as any).setAppBadge(dechaHour);
        console.log(`📛 App badge set to: ${dechaHour}`);
      } catch (error) {
        console.error('App badge error:', error);
      }
    }

    // Clear badge when component unmounts
    return () => {
      clearBadge();
    };
  }, [dechaHour, isEnabled]);

  // Clear badge when app is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearBadge();
      } else if (document.visibilityState === 'hidden' && isEnabled) {
        if ('setAppBadge' in navigator) {
          (navigator as any).setAppBadge(dechaHour);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dechaHour, isEnabled]);
}

function clearBadge() {
  if ('clearAppBadge' in navigator) {
    try {
      (navigator as any).clearAppBadge();
    } catch (error) {
      console.error('Clear badge error:', error);
    }
  }
}