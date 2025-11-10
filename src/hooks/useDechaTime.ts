import { useState, useEffect } from 'react';
import { DechaTime, EarthTime } from '../types/decha';
import { getCurrentDechaTime, getCurrentEarthTime } from '../utils/dechaCalculations';

export function useDechaTime() {
  const [dechaTime, setDechaTime] = useState<DechaTime>(getCurrentDechaTime());
  const [earthTime, setEarthTime] = useState<EarthTime>(getCurrentEarthTime());

  useEffect(() => {
    const updateTime = () => {
      setDechaTime(getCurrentDechaTime());
      setEarthTime(getCurrentEarthTime());
    };

    // Update immediately
    updateTime();

    // Update every 100ms for smooth seconds animation
    const interval = setInterval(updateTime, 100);

    return () => clearInterval(interval);
  }, []);

  return { dechaTime, earthTime };
}