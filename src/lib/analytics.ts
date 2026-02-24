/**
 * Google Analytics Utilities
 * Track page views, events, and user interactions
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

const GA_TRACKING_ID = 'G-YH87NZPSKB';

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Track chat message sent
 */
export function trackChatMessage(modelUsed: string, messageLength: number) {
  trackEvent('chat_message_sent', {
    model: modelUsed,
    message_length: messageLength,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track model selection
 */
export function trackModelSelection(modelId: string, category?: string) {
  trackEvent('model_selected', {
    model_id: modelId,
    category: category || 'unknown',
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName: string, details?: Record<string, any>) {
  trackEvent('feature_used', {
    feature: featureName,
    ...details,
  });
}

/**
 * Track PDF upload
 */
export function trackPdfUpload(fileSize: number) {
  trackEvent('pdf_uploaded', {
    file_size: fileSize,
    file_size_mb: (fileSize / (1024 * 1024)).toFixed(2),
  });
}

/**
 * Track image upload (math solver)
 */
export function trackImageUpload(fileSize: number) {
  trackEvent('image_uploaded', {
    file_size: fileSize,
    file_size_kb: (fileSize / 1024).toFixed(2),
  });
}

/**
 * Track voice synthesis
 */
export function trackVoiceSynthesis(voice: string, textLength: number) {
  trackEvent('voice_synthesis', {
    voice: voice,
    text_length: textLength,
  });
}

/**
 * Track export action
 */
export function trackExport(format: 'txt' | 'md' | 'pdf') {
  trackEvent('export_action', {
    format: format,
  });
}

/**
 * Track share action
 */
export function trackShare(method: 'copy' | 'social') {
  trackEvent('share_action', {
    method: method,
  });
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
}

/**
 * Track user signup
 */
export function trackSignup(method: 'email' | 'google') {
  trackEvent('sign_up', {
    method: method,
  });
}

/**
 * Track user login
 */
export function trackLogin(method: 'email' | 'google') {
  trackEvent('login', {
    method: method,
  });
}

/**
 * Track error
 */
export function trackError(errorType: string, errorMessage: string) {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    page: window.location.pathname,
  });
}

/**
 * Track timing (performance)
 */
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
    });
  }
}

/**
 * Track API response time
 */
export function trackApiResponseTime(endpoint: string, duration: number) {
  trackTiming('API', endpoint, duration);
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || window.location.pathname,
  });
}

/**
 * Track link click
 */
export function trackLinkClick(linkUrl: string, linkText?: string) {
  trackEvent('link_click', {
    link_url: linkUrl,
    link_text: linkText,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number) {
  trackEvent('scroll_depth', {
    percentage: percentage,
    page: window.location.pathname,
  });
}

/**
 * Track video play (if you add video content)
 */
export function trackVideoPlay(videoTitle: string) {
  trackEvent('video_play', {
    video_title: videoTitle,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent('form_submission', {
    form_name: formName,
    success: success,
  });
}

/**
 * Track outbound link
 */
export function trackOutboundLink(url: string) {
  trackEvent('outbound_link', {
    url: url,
  });
}

/**
 * Track file download
 */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
}

/**
 * Set user ID (for logged-in users)
 */
export function setUserId(userId: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      user_id: userId,
    });
  }
}
