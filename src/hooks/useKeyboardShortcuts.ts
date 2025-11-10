import { useEffect } from 'react';

export interface ShortcutHandlers {
  onSettings?: () => void;
  onConverter?: () => void;
  onAlarms?: () => void;
  onCalendar?: () => void;
  onStats?: () => void;
  onShare?: () => void;
  onToggleEarthTime?: () => void;
  onHelp?: () => void;
  onWakeLock?: () => void;
  onMultiTimezone?: () => void;
  onClose?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Don't trigger if modifier keys are pressed (except Shift for ?)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'escape':
          e.preventDefault();
          if (e.key === 'Escape') {
            handlers.onClose?.();
          } else {
            handlers.onSettings?.();
          }
          break;
        case 'c':
          e.preventDefault();
          handlers.onConverter?.();
          break;
        case 'a':
          e.preventDefault();
          handlers.onAlarms?.();
          break;
        case 'l':
          e.preventDefault();
          handlers.onCalendar?.();
          break;
        case 'd':
          e.preventDefault();
          handlers.onStats?.();
          break;
        case 's':
          e.preventDefault();
          handlers.onShare?.();
          break;
        case 't':
          e.preventDefault();
          handlers.onToggleEarthTime?.();
          break;
        case 'k':
        case '?':
          e.preventDefault();
          handlers.onHelp?.();
          break;
        case 'w':
          e.preventDefault();
          handlers.onWakeLock?.();
          break;
        case 'm':
          e.preventDefault();
          handlers.onMultiTimezone?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}