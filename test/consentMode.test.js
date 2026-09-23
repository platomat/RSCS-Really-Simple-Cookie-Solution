import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CONSENT_DEFAULT_FLAG,
  applyConsentModeOnInit,
  ensureGtag,
  mapPreferencesToConsentState,
  setConsentDefault,
  updateConsentFromPreferences,
} from '../src/utils/consentMode';

describe('consentMode', () => {
  beforeEach(() => {
    delete window[CONSENT_DEFAULT_FLAG];
    delete window.gtag;
    delete window.dataLayer;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ensureGtag creates dataLayer and gtag stub', () => {
    ensureGtag();
    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(typeof window.gtag).toBe('function');
  });

  it('setConsentDefault pushes denied defaults once', () => {
    const pushed = [];
    window.dataLayer = [];
    window.gtag = function () {
      pushed.push([...arguments]);
    };

    expect(setConsentDefault({ waitForUpdate: 500 })).toBe(true);
    expect(setConsentDefault()).toBe(false);

    expect(pushed).toHaveLength(1);
    expect(pushed[0][0]).toBe('consent');
    expect(pushed[0][1]).toBe('default');
    expect(pushed[0][2]).toMatchObject({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
    });
    expect(window[CONSENT_DEFAULT_FLAG]).toBe(true);
  });

  it('maps marketing + analytics categories separately', () => {
    expect(
      mapPreferencesToConsentState({
        necessary: true,
        analytics: true,
        marketing: false,
      }),
    ).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    });

    expect(
      mapPreferencesToConsentState({
        necessary: true,
        analytics: false,
        marketing: true,
      }),
    ).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'denied',
    });
  });

  it('falls back to analytics for ad signals when marketing key is absent', () => {
    expect(
      mapPreferencesToConsentState({
        necessary: true,
        analytics: true,
      }),
    ).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('updateConsentFromPreferences pushes consent update', () => {
    const pushed = [];
    window.dataLayer = [];
    window.gtag = function () {
      pushed.push([...arguments]);
    };

    updateConsentFromPreferences({ analytics: true, marketing: true });

    expect(pushed[0][0]).toBe('consent');
    expect(pushed[0][1]).toBe('update');
    expect(pushed[0][2].ad_storage).toBe('granted');
    expect(pushed[0][2].analytics_storage).toBe('granted');
  });

  it('applyConsentModeOnInit sets default and updates stored prefs', () => {
    const pushed = [];
    window.dataLayer = [];
    window.gtag = function () {
      pushed.push([...arguments]);
    };

    const result = applyConsentModeOnInit(
      { enabled: true },
      { necessary: true, analytics: true, marketing: true },
    );

    expect(result.defaultSet).toBe(true);
    expect(result.updated).toBe(true);
    expect(pushed[0][1]).toBe('default');
    expect(pushed[1][1]).toBe('update');
  });

  it('applyConsentModeOnInit is a no-op when disabled', () => {
    const result = applyConsentModeOnInit({ enabled: false }, { analytics: true });
    expect(result).toEqual({ defaultSet: false, updated: false });
    expect(window.gtag).toBeUndefined();
  });
});
