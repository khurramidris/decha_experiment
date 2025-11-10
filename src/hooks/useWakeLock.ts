import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const releaseHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      console.warn('Wake Lock API not supported');
      return false;
    }

    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);

      const releaseHandler = () => {
        console.log('Wake Lock released');
        setIsActive(false);
      };
      
      lock.addEventListener('release', releaseHandler);
      releaseHandlerRef.current = releaseHandler;

      console.log('Wake Lock acquired');
      return true;
    } catch (error) {
      console.error('Failed to acquire Wake Lock:', error);
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        // Remove event listener before releasing
        if (releaseHandlerRef.current) {
          wakeLock.removeEventListener('release', releaseHandlerRef.current);
          releaseHandlerRef.current = null;
        }
        
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        console.log('Wake Lock manually released');
      } catch (error) {
        console.error('Failed to release Wake Lock:', error);
      }
    }
  }, [wakeLock]);

  const toggleWakeLock = useCallback(async () => {
    if (isActive) {
      await releaseWakeLock();
    } else {
      await requestWakeLock();
    }
  }, [isActive, requestWakeLock, releaseWakeLock]);

  // Auto-release when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock && document.visibilityState === 'hidden') {
        releaseWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        // Remove event listener before releasing
        if (releaseHandlerRef.current) {
          wakeLock.removeEventListener('release', releaseHandlerRef.current);
          releaseHandlerRef.current = null;
        }
        wakeLock.release();
      }
    };
  }, [wakeLock, releaseWakeLock]);

  return {
    isSupported,
    isActive,
    toggleWakeLock,
    releaseWakeLock,
  };
}