/**
 * Google Consent Mode v2 helpers for RSCS.
 *
 * Part A — call setConsentDefault() as early as possible in <head>, before GTM/gtag.
 * Part B — call updateConsentFromPreferences() on banner choice and on return visits.
 */

export const CONSENT_DEFAULT_FLAG = '__rscsConsentDefaultSet';

const DENIED = 'denied';
const GRANTED = 'granted';

/**
 * @typedef {{
 *   analytics?: string,
 *   marketing?: string,
 * }} ConsentCategoryMapping
 */

/**
 * @typedef {{
 *   enabled?: boolean,
 *   waitForUpdate?: number,
 *   setDefaultOnInit?: boolean,
 *   updateOnInit?: boolean,
 *   mapping?: ConsentCategoryMapping,
 * }} ConsentModeConfig
 */

/**
 * Ensure dataLayer + gtag stub exist (safe before GTM loads).
 */
export function ensureGtag() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
}

/**
 * @param {ConsentModeConfig} [config]
 * @returns {Required<Pick<ConsentModeConfig, 'enabled' | 'waitForUpdate' | 'setDefaultOnInit' | 'updateOnInit'>> & { mapping: Required<ConsentCategoryMapping> }}
 */
export function normalizeConsentModeConfig(config = {}) {
  return {
    enabled: config.enabled !== false,
    waitForUpdate: typeof config.waitForUpdate === 'number' ? config.waitForUpdate : 500,
    setDefaultOnInit: config.setDefaultOnInit !== false,
    updateOnInit: config.updateOnInit !== false,
    mapping: {
      analytics: config.mapping?.analytics || 'analytics',
      marketing: config.mapping?.marketing || 'marketing',
    },
  };
}

/**
 * Part A: default consent state (all denied). Idempotent per page load.
 *
 * @param {{ waitForUpdate?: number, [key: string]: string | number }} [options]
 * @returns {boolean} true if default was pushed, false if already set
 */
export function setConsentDefault(options = {}) {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window[CONSENT_DEFAULT_FLAG]) {
    return false;
  }

  ensureGtag();

  const { waitForUpdate = 500, ...extra } = options;

  window.gtag('consent', 'default', {
    ad_storage: DENIED,
    ad_user_data: DENIED,
    ad_personalization: DENIED,
    analytics_storage: DENIED,
    wait_for_update: waitForUpdate,
    ...extra,
  });

  window[CONSENT_DEFAULT_FLAG] = true;
  return true;
}

/**
 * Map RSCS cookie preferences → Consent Mode v2 signals.
 *
 * - marketing → ad_storage, ad_user_data, ad_personalization
 * - analytics → analytics_storage
 *
 * If the marketing key is absent from preferences (site only exposes analytics),
 * analytics also controls the ad_* signals — common when GTM/Ads share one category.
 *
 * @param {Record<string, boolean> | null | undefined} preferences
 * @param {ConsentCategoryMapping} [mapping]
 */
export function mapPreferencesToConsentState(preferences, mapping = {}) {
  const analyticsKey = mapping.analytics || 'analytics';
  const marketingKey = mapping.marketing || 'marketing';

  const analyticsGranted = preferences?.[analyticsKey] === true;
  const hasMarketingKey =
    preferences != null && Object.prototype.hasOwnProperty.call(preferences, marketingKey);
  const adsGranted = hasMarketingKey
    ? preferences[marketingKey] === true
    : analyticsGranted;

  return {
    ad_storage: adsGranted ? GRANTED : DENIED,
    ad_user_data: adsGranted ? GRANTED : DENIED,
    ad_personalization: adsGranted ? GRANTED : DENIED,
    analytics_storage: analyticsGranted ? GRANTED : DENIED,
  };
}

/**
 * Part B: consent update from banner preferences / stored cookie.
 *
 * @param {Record<string, boolean> | null | undefined} preferences
 * @param {{ mapping?: ConsentCategoryMapping }} [options]
 * @returns {ReturnType<typeof mapPreferencesToConsentState> | null}
 */
export function updateConsentFromPreferences(preferences, options = {}) {
  if (typeof window === 'undefined') {
    return null;
  }

  ensureGtag();

  const state = mapPreferencesToConsentState(preferences, options.mapping);
  window.gtag('consent', 'update', state);
  return state;
}

/**
 * Apply Consent Mode for init: optional default + update from stored preferences.
 *
 * @param {ConsentModeConfig} [config]
 * @param {Record<string, boolean> | null} [preferences]
 */
export function applyConsentModeOnInit(config = {}, preferences = null) {
  const normalized = normalizeConsentModeConfig(config);
  if (!normalized.enabled) {
    return { defaultSet: false, updated: false };
  }

  let defaultSet = false;
  if (normalized.setDefaultOnInit) {
    defaultSet = setConsentDefault({ waitForUpdate: normalized.waitForUpdate });
  }

  let updated = false;
  if (normalized.updateOnInit && preferences) {
    updateConsentFromPreferences(preferences, { mapping: normalized.mapping });
    updated = true;
  }

  return { defaultSet, updated };
}
