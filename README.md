# RSCS - Really Simple Cookie Solution 🍪

THIS IS A FORK OF: (https://github.com/francescomugnai/RSCS-Really-Simple-Cookie-Solution)
#### Changes
- CSS styles: removed the import font declaration to prevent loading external fonts, to make it more compliant with GDPR, especially for Germany
- Config: added a new attribute "closeButton" (boolean, default: true) to have control whether to display the close button or not
- **Google Consent Mode v2**: default denied state + preference-based `gtag('consent', 'update')` (marketing → ad_*; analytics → analytics_storage). Enabled by default via `consentMode`.
-------

RSCS is a lightweight, easy-to-use cookie consent management solution for your web projects. 
It's designed to be flexible, customizable, and compliant with GDPR and other cookie regulations.

![RSCS Screenshot](./images/rscs.jpg)

#### Features 🚀

- 🎨 Customizable banner and preference UI
- 🌐 Multi-language support
- 🔒 Automatic resource blocking for popular tracking and analytics services
- 🔧 Easy integration with Google Analytics
- ✅ Google Consent Mode v2 (`consent default` + preference-based `consent update`)
- 📱 Responsive design
- 🔍 Granular cookie type control
- 🎨 Customizable banner and preference UI with light and dark mode support
- 🚀 Lightweight and performant

#### Installation 📦

Install via npm:

```bash
npm install @mugnai/rscs
```

Alternatively, include via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@mugnai/rscs@latest/dist/cookie-banner-widget.umd.js"></script>
```

#### Quick start 🏃‍♂️

Npm:

```js
import CookieBannerWidget from '@mugnai/rscs';

CookieBannerWidget.init({
  language: 'en',
  autoBlock: true,
});
```

CDN:

```html
    <script src="https://cdn.jsdelivr.net/npm/@mugnai/rscs@latest/dist/cookie-banner-widget.umd.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.CookieBannerWidget) {
                window.CookieBannerWidget.init({
                    language: 'it', 
                });
            } 
        });
    </script>
```

#### Complete Configuration Example 🛠️

Here's an example of a more comprehensive configuration using many of the available options:

```js
import CookieBannerWidget from 'rscs';

CookieBannerWidget.init({
  language: 'en',
  colorMode: 'auto',
  preferencesButtonId: 'custom-preferences-button',
  bannerTitle: 'Privacy Settings',
  bannerDescription: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
  saveButtonText: 'Save Settings',
  acceptAllButtonText: 'Accept All',
  closeButton: true,
  closeButtonText: 'Close',
  scrollTopButton: 'Back to Top',
  logoUrl: 'https://example.com/logo-light.png',
  logoDarkUrl: 'https://example.com/logo-dark.png',
  privacyPolicyUrl: 'https://example.com/privacy-policy',
  useAnimations: true,
  placeholders: true,
  placeholdersText: 'Please accept cookies to view this content.',
  autoBlock: true,
  useDefaultBlockedDomains: true,
  blockedDomains: ['analytics.com', 'tracking.com'],
  googleAnalytics: {
    enabled: true,
    id: 'UA-XXXXXXXXX-X',
    category: 'analytics'
  },
  cookieTypes: {
    necessary: {
      title: 'Necessary',
      description: 'These cookies are essential for the website to function properly.'
    },
    functional: {
      title: 'Functional',
      description: 'These cookies enable personalized features and functionality.'
    },
    analytics: {
      title: 'Analytics',
      description: 'These cookies help us understand how visitors interact with the website.'
    },
    marketing: {
      title: 'Marketing',
      description: 'These cookies are used to deliver relevant ads and marketing campaigns.'
    }
  },
  onAccept: (preferences) => {
    console.log('Cookies accepted:', preferences);
  },
  onReject: (preferences) => {
    console.log('Cookies rejected:', preferences);
  },
  onPreferenceChange: (preferences) => {
    console.log('Cookie preferences changed:', preferences);
  }
});
```

#### Configuration Options 🛠️


| Option                   | Type    | Default                  | Description                                                  |
|--------------------------|---------|--------------------------|--------------------------------------------------------------|
| acceptAllButtonText      | string  | 'Accept All'             | Text for the accept all button in the banner                 |
| autoBlock                | boolean | true                     | Automatically block known tracking domains                   |
| bannerDescription        | string  | 'We use cookies to enhance your experience on our site.' | Description text of the cookie banner |
| bannerTitle              | string  | 'Cookie Settings'        | Title of the cookie banner                                   |
| blockedDomains           | array   | null                     | Custom list of domains to block                              |
| closeButton              | boolean | true                     | Whether to display the close button or not                   |
| closeButtonText          | string  | 'Close'                  | Text for the close button in the banner                      |
| colorMode                | string  | 'auto'                   | Color mode for the banner. Can be 'light', 'dark', or 'auto' |
| cookieTypes              | object  | See default below        | Define custom cookie categories and their descriptions       |
| desktopWidth             | string  | '380px'                  | Width of the banner on desktop devices                       |
| analytics                | object  | { enabled: false, provider: null, config: {}, category: 'analytics' } | Configuration for analytics integration |
| initiallyExpanded        | boolean | false                    | If true, the banner will be initially expanded with details visible |
| language                 | string  | 'en'                     | Language for the banner text. Supports multi-language configuration. |
| logoDarkUrl              | string  | null                     | URL for the logo to display in dark mode                     |
| logoUrl                  | string  | null                     | URL for the logo to display in the banner                    |
| preferencesButtonId      | string  | 'cookie-preferences-button' | ID of the preferences button                              |
| saveButtonText           | string  | 'Save Preferences'       | Text for the save button in the banner                       |
| scrollTopButton          | string  | 'Back to Top'            | Text for the scroll-to-top button                            |
| useAnimations            | boolean | true                     | Whether to use animations in the banner                      |
| useDefaultBlockedDomains | boolean | true                     | Whether to use the default list of blocked domains           |
| position                 | string  | 'bottom-right'           | Position of the banner. Can be 'bottom-right', 'bottom-left', or 'bottom-center' |
| preferencesButtonColor   | string  | '#4299e1'                | Color of the preferences button                              |
| showPreferencesButton    | boolean | true                     | If false, the preferences button will not be shown
| consentMode              | object  | See below                | Google Consent Mode v2 (`enabled` default true) |


#### Google Consent Mode v2 ✅

RSCS sets a Consent Mode **default** (all denied) and pushes a preference-based **update** on accept / reject / save and when returning visitors already have a cookie.

**Recommended:** call the default as early as possible in `<head>` (before GTM):

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  window.__rscsConsentDefaultSet = true;
</script>
<!-- GTM / other tags AFTER this -->
```

Or call the API before `init` once the UMD bundle is loaded:

```js
CookieBannerWidget.setConsentDefault({ waitForUpdate: 500 });
CookieBannerWidget.init({ /* … */ });
```

If the default was not set yet, `init()` sets it (idempotent via `__rscsConsentDefaultSet`).

**Mapping**

| Cookie category | Consent Mode signals |
|-----------------|----------------------|
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `analytics` | `analytics_storage` |

If preferences have no `marketing` key (site only exposes analytics), `analytics` also controls the ad_* signals.

```js
CookieBannerWidget.init({
  consentMode: {
    enabled: true,
    waitForUpdate: 500,
    setDefaultOnInit: true,
    updateOnInit: true,
    mapping: {
      analytics: 'analytics',
      marketing: 'marketing',
    },
  },
});
```

Public helpers: `setConsentDefault()`, `updateConsent(preferences)`, `mapPreferencesToConsentState(preferences)`.


#### Custom Preferences Button 🔘

If you want to provide a custom button to reopen the cookie preferences, you can add an element with the ID "cookie-preferences-button" to your HTML. RSCS will automatically attach the necessary event listener to this button. For example:

```html
<button id="cookie-preferences-button">Manage Cookie Preferences</button>
```

#### Customizing Banner Width on Desktop 📏

You can customize the width of the cookie banner on desktop devices using the `desktopWidth` option. This allows you to better integrate the banner with your website's design on larger screens. For example:

```js
CookieBannerWidget.init({
  language: 'en',
  desktopWidth: '500px',
  // ... other options ...
});
```

#### Language and Translations 🌐

RSCS supports multiple languages through built-in translations. You can specify a language using the `language` option:

```js
CookieBannerWidget.init({
  language: 'it',
  // ... other options ...
});
```
You can also override specific translation strings while still using a base language. This allows for fine-grained customization:

```js
CookieBannerWidget.init({
  language: 'en', 
  bannerTitle: 'Custom Banner Title',
  bannerDescription: 'Custom banner description.',
  saveButtonText: 'Custom Save Preferences',
  acceptAllButtonText: 'Custom Accept All',
  closeButtonText: 'Custom Close',
  // ... other options ...
});
```

In this example, the base language is English, but specific text elements are customized. Any text not explicitly overridden will use the default English translation.

#### Manual Resource Blocking 🛑

You can manually block specific resources by adding the data-cookie-type attribute to the HTML element and using data-src instead of src for the resource URL. RSCS will automatically manage the loading of these resources based on user preferences. For example:

```html
<iframe 
  style="border-radius:12px" 
  title="Spotify video player"
  data-cookie-type="marketing" 
  data-src="https://open.spotify.com/embed/track/2MBlKZ8cSN8OmsIhWBH9ci?utm_source=generator" 
  width="100%" 
  height="352" 
  frameBorder="0" 
  allowfullscreen="" 
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
  loading="lazy"
></iframe>
```

In this example, the Spotify embed will only load if the user has accepted marketing cookies.
When you add a title attribute to an HTML element with a data-cookie-type, the title will be displayed in the cookie banner under the relevant cookie category. This helps users understand which specific resources are being blocked and why. For instance, if you use the above iframe example, "Spotify video player" will be listed under the "Marketing" cookies category in the banner.

**Note**: While this method is generally effective, it may not work in all cases due to the way some third-party resources are loaded. However, it's still worth trying as it can provide a good level of control in many situations. 
For more reliable blocking of specific domains, consider using the blockedDomains configuration option.

#### Customizing Blocked Domains 🚫
RSCS comes with a predefined list of domains to block. You can customize this list by setting useDefaultBlockedDomains to false and passing an array of domains to blockedDomains:

```js
import CookieBannerWidget from 'rscs';

CookieBannerWidget.init({
  language: 'en',
  autoBlock: true,
  useDefaultBlockedDomains: false,
  blockedDomains: ['youtube.com', 'facebook.com', 'your-custom-domain.com']
});
```



#### Default cookieTypes Configuration

```js
cookieTypes: {
  necessary: {
    title: 'Necessary',
    description: 'Essential cookies for the site to function.'
  },
  functional: {
    title: 'Functionality',
    description: 'Cookies to improve site functionality.'
  },
  analytics: {
    title: 'Analytics',
    description: 'Cookies to analyze site usage.'
  },
  marketing: {
    title: 'Marketing',
    description: 'Cookies to show personalized ads.'
  }
}
```

#### Color Mode Configuration 🎨

RSCS supports light and dark color modes, as well as an automatic mode that follows the user's system preferences. You can configure this in the init options:

```js
CookieBannerWidget.init({
  // ... other options ...
  colorMode: 'light', // 'light', 'dark', or 'auto'
});
```

#### Analytics Integration 📊

RSCS provides easy integration with multiple analytics providers, including Google Analytics and Fathom Analytics. You can configure this in the init options:

```js
CookieBannerWidget.init({
  // ... other options ...
  analytics: {
    enabled: true,
    provider: 'googleAnalytics', // or 'fathom'
    config: {
      // For Google Analytics:
      id: 'UA-XXXXXXXXX-X', // Your Google Analytics ID
      // OR for Fathom:
      // siteId: 'ABCDEFGH' // Your Fathom site ID
    },
    category: 'analytics' // The cookie category for analytics
  }
});
```

#### Contributing 🤝
I welcome contributions to make RSCS even better. If you have any ideas or find any bugs, please open an issue or submit a pull request.

#### Font 🖋️

RSCS uses the Inter font, which is loaded from Bunny Fonts, a privacy-friendly alternative to Google Fonts. The Inter font is licensed under the SIL Open Font License 1.1.
[OFL-1.1](https://scripts.sil.org/OFL)
Copyright 2020 [The Inter Project Authors](https://github.com/rsms/inter)


#### Testing 🧪

RSCS uses Vitest and Testing Library for unit and integration testing. To run the tests:

1. Ensure you have all dependencies installed.
2. Run the tests:

```bash
npm run test
```




**Disclaimer:** 
RSCS is MIT licensed.
RSCS (Really Simple Cookie Solution) is an open-source tool designed to help website owners manage cookie consent and preferences. While RSCS simplifies cookie management, it does not guarantee full compliance with data privacy laws (e.g., GDPR, CCPA). Website owners are responsible for ensuring proper implementation, providing accurate cookie information, obtaining user consent, and maintaining compliance with applicable regulations. RSCS should be used as part of a comprehensive approach to data privacy and not as a substitute for legal advice.

The pre-configured list of blocked domains is provided solely as an example and should not be considered comprehensive or definitive. It is intended to serve as a basic demonstration of the auto-blocking feature's functionality. I strongly recommend that implementers thoroughly review, customize, and maintain their own list of domains based on their specific use case, legal requirements, and ethical considerations.
This example list should not be used as-is in a production environment. It is crucial to tailor the list to your particular needs and to keep it updated regularly. The responsibility for the selection and management of blocked domains lies entirely with the implementer.
I make no representations or warranties regarding the suitability, completeness, or accuracy of this example list. Users of this library assume full responsibility for the implementation, customization, and any consequences arising from the use of this feature.
Remember: A personalized and well-maintained list is key to effectively balancing user privacy with necessary functionality in your specific context.
