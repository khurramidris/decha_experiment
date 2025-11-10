import { initializeGA4, trackGA4Event, trackGA4PageView } from './ga4';
import { initializeClarity, trackClarityEvent } from './clarity';
import { AnalyticsEvent } from './events';

// Unified analytics interface
class Analytics {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    
    // Initialize all analytics platforms
    initializeGA4();
    initializeClarity();
    
    this.isInitialized = true;
    this.trackEvent('SESSION_START');
    
    console.log('🎯 Analytics initialized');
  }

  trackEvent(eventName: AnalyticsEvent | string, parameters?: Record<string, any>) {
    if (!this.isInitialized) return;
    
    // Track on all platforms
    trackGA4Event(eventName, parameters);
    trackClarityEvent(eventName, parameters);
    
    console.log('📊 Event tracked:', eventName, parameters);
  }

  trackPageView(path: string) {
    if (!this.isInitialized) return;
    
    trackGA4PageView(path);
  }
}

export const analytics = new Analytics();
export { AnalyticsEvents } from './events';