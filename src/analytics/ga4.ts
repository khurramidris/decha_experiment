import ReactGA from 'react-ga4';

// Replace with your actual GA4 Measurement ID (format: G-XXXXXXXXXX)
// Get this from analytics.google.com after creating property
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // CHANGE THIS LATER

let isInitialized = false;

export function initializeGA4() {
  if (isInitialized) return;
  
  // Temporarily disabled - replace GA4_MEASUREMENT_ID with actual ID when ready
  console.log('📊 Google Analytics disabled (no measurement ID configured)');
  return;
  
  try {
    ReactGA.initialize(GA4_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true, // Privacy friendly
      },
    });
    isInitialized = true;
    console.log('✅ Google Analytics initialized');
  } catch (error) {
    console.error('❌ GA4 initialization failed:', error);
  }
}

export function trackGA4Event(eventName: string, parameters?: Record<string, any>) {
  if (!isInitialized) return;
  
  try {
    ReactGA.event(eventName, parameters);
  } catch (error) {
    console.error('❌ GA4 event tracking failed:', error);
  }
}

export function trackGA4PageView(path: string) {
  if (!isInitialized) return;
  
  try {
    ReactGA.send({ hitType: 'pageview', page: path });
  } catch (error) {
    console.error('❌ GA4 pageview tracking failed:', error);
  }
}