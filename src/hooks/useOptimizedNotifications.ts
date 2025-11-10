import { useCallback, useRef, useEffect } from 'react';

export function useOptimizedNotifications() {
  const notificationQueue = useRef<Set<string>>(new Set());
  const pendingNotifications = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAllNotifications();
    };
  }, [cancelAllNotifications]);

  const sendNotification = useCallback(async (title: string, options: NotificationOptions) => {
    const notificationId = `${title}-${options.tag || Date.now()}`;
    
    // Prevent duplicate notifications
    if (notificationQueue.current.has(notificationId)) {
      return;
    }
    
    notificationQueue.current.add(notificationId);
    
    try {
      // Check if we have permission
      if ('Notification' in window && Notification.permission === 'granted') {
        // Use service worker notifications if available
        if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(title, options);
        } else {
          // Fallback to regular notifications
          new Notification(title, options);
        }
        
        // Clear from queue after successful notification
        notificationQueue.current.delete(notificationId);
      }
    } catch (error) {
      console.error('Notification error:', error);
      notificationQueue.current.delete(notificationId);
    }
  }, []);

  const scheduleNotification = useCallback(async (
    title: string, 
    options: NotificationOptions, 
    delay: number
  ) => {
    const notificationId = `${title}-${options.tag || Date.now()}`;
    
    // Clear any existing scheduled notification with the same ID
    const existingTimeout = pendingNotifications.current.get(notificationId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    const timeout = setTimeout(() => {
      sendNotification(title, options);
      pendingNotifications.current.delete(notificationId);
    }, delay);
    
    pendingNotifications.current.set(notificationId, timeout);
  }, [sendNotification]);

  const cancelNotification = useCallback((notificationId: string) => {
    // Remove from queue
    notificationQueue.current.delete(notificationId);
    
    // Cancel scheduled notification
    const timeout = pendingNotifications.current.get(notificationId);
    if (timeout) {
      clearTimeout(timeout);
      pendingNotifications.current.delete(notificationId);
    }
  }, []);

  const cancelAllNotifications = useCallback(() => {
    // Clear all scheduled notifications
    pendingNotifications.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    pendingNotifications.current.clear();
    notificationQueue.current.clear();
  }, []);

  return {
    sendNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications
  };
}