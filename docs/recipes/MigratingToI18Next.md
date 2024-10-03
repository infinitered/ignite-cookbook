---
title: Migrating from i18n-js to react-i18next
description: How to migrate from i18n-js to react-i18next
tags:
  - i18n
last_update:
  author: Felipe Peña
publish_date: 2024-09-25
---

# Migrating from i18n-js to react-i18next within an Ignite

## Overview

In this guide, we will be going through the steps required to migrate your Ignite generated project from using `i18n-js` to the `react-i18next` library. It is meant specifically for projects generated with version 9 and below.

`i18next` will be included in Ignite's version 10. If you're using an earlier version, this guide provides the necessary steps to successfully complete the migration.

Finally, the steps outlined in this guide, are based on the changes outlined in the following two PRs:
* [Swap out i18n-js for react-18next](https://github.com/infinitered/ignite/pull/2770)
* [Fix language switching and update date-fns to v4](https://github.com/infinitered/ignite/pull/2778)

## Step 1: Set up initialization logic in app.tsx

To ensure that `i18next` finishes initializing before your app proceeds, we recommend adding state and logic to the `app.tsx` entry file:

1. Create a state variable, `isI18nInitialized`, to track initialization status.
2. Use the `useEffect` hook to set the state when initialization completes.

```js
const [isI18nInitialized, setIsI18nInitialized] = useState(false);

useEffect(() => {
  initI18n().then(() => setIsI18nInitialized(true));
}, []);
```

Additionally, consider including the new state variable in the rendering condition for the app.

```js
// error-line-start
if (!rehydrated || !isNavigationStateRestored || (!areFontsLoaded && !fontLoadError)) {
// error-line-end
// success-line-start
if (!rehydrated || !isNavigationStateRestored || !isI18nInitialized || (!areFontsLoaded && !fontLoadError)) {
// success-line-end
  return null
}
```

This ensures that your app will wait until `i18next` is fully initialized before continuing, preventing any issues with missing translations.

## Step 2: Update the i18n initialization method

Next, update your i18n initialization to use `react-i18next`, which also includes RTL (right-to-left) language support and handles locale selection. In a Ingnite generated project, this is located in `app/i18n/i18n.ts`.

```js

import * as i18next from "i18next"

const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: pickSupportedLocale()?.languageTag || fallbackLocale,
    fallbackLng: fallbackLocale,
    interpolation: { escapeValue: false },
  });

  const locale = pickSupportedLocale();
  if (locale?.textDirection === 'rtl') {
    I18nManager.allowRTL(true);
    isRTL = true;
  } else {
    I18nManager.allowRTL(false);
    isRTL = false;
  }

  return i18n;
};
```

This ensures that supported locales are chosen based on the device’s settings, and RTL is correctly applied when necessary. For more on detail on these changes, check the [this PR](https://github.com/infinitered/ignite/pull/2770).

## Step 3: Add intl-pluralrules for i18next and JSON v4

To support pluralization and `i18next`'s JSON v4 format, you’ll need to add the `intl-pluralrules` package:

```bash
yarn add intl-pluralrules
```

Make sure to import this package into your i18n configuration file (`app/i18n/i18n.ts`):

```js
import 'intl-pluralrules';
```