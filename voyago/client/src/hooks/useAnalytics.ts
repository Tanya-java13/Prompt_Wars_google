declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
let initialized = false;

function init() {
  if (initialized || !GA_ID || GA_ID === 'G-XXXXXXXXXX') return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) { window.dataLayer!.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: true });
}

function track(eventName: string, params?: Record<string, unknown>) {
  init();
  if (window.gtag) {
    window.gtag('event', eventName, params ?? {});
  }
}

export function useAnalytics() {
  return {
    trackLogin: (method = 'google') =>
      track('login', { method }),

    trackItineraryGenerated: (destination: string, budget: string, travellers: string) =>
      track('itinerary_generated', { destination, budget, travellers, event_category: 'engagement' }),

    trackItineraryCustomized: (type: 'refine' | 'add_day') =>
      track('itinerary_customized', { customization_type: type, event_category: 'engagement' }),

    trackPaywallShown: (trigger: 'generation' | 'customization') =>
      track('paywall_shown', { trigger, event_category: 'monetization' }),

    trackSubscriptionStarted: () =>
      track('begin_checkout', { currency: 'INR', value: 49, event_category: 'monetization' }),

    trackSubscriptionCompleted: () =>
      track('purchase', { currency: 'INR', value: 49, event_category: 'monetization' }),

    trackSaveTrip: (destination: string) =>
      track('save_trip', { destination, event_category: 'engagement' }),
  };
}
