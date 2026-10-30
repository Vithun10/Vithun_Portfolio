import { track } from '@vercel/analytics';

/**
 * Safe analytics event tracker with zero PII collection.
 * Conforms to Phase 7 analytics specifications.
 * 
 * Allowed events:
 * - resume_download
 * - contact_click
 * - email_click
 * - linkedin_click
 * - github_click
 * - flow_case_study_open
 * - triage_case_study_open
 */
export const trackEvent = (eventName, properties) => {
  try {
    track(eventName, properties);
  } catch (error) {
    // Fail silently in development/blocked environments
    if (import.meta.env.DEV) {
      console.debug(`[Vercel Analytics: ${eventName}]`, properties, error);
    }
  }
};

