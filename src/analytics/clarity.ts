declare global {
  interface Window {
    clarity: (action: string, ...args: any[]) => void;
  }
}

// Replace with your Clarity Project ID
// Get this from clarity.microsoft.com after creating project
const CLARITY_PROJECT_ID = 'YOUR_CLARITY_ID'; // CHANGE THIS LATER

let isInitialized = false;

export function initializeClarity() {
  if (isInitialized || typeof window === 'undefined') return;
  
  // Temporarily disabled - replace CLARITY_PROJECT_ID with actual ID when ready
  console.log('📊 Clarity analytics disabled (no project ID configured)');
  return;
  
  try {
    // Clarity initialization script
    (function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
    
    isInitialized = true;
    console.log('✅ Microsoft Clarity initialized');
  } catch (error) {
    console.error('❌ Clarity initialization failed:', error);
  }
}

export function trackClarityEvent(eventName: string, data?: Record<string, any>) {
  if (!isInitialized || typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('event', eventName);
    if (data) {
      window.clarity('set', eventName, JSON.stringify(data));
    }
  } catch (error) {
    console.error('❌ Clarity event tracking failed:', error);
  }
}