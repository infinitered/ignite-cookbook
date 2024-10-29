---
title: Migrating from i18n-js to react-i18next
description: How to migrate from i18n-js to react-i18next
tags:
  - i18n
last_update:
  author: Felipe Peña
publish_date: 2024-09-25
---

# Migrating from i18n-js to react-i18next within an Ignite project

## Overview

In this guide, we will be going through the steps required to migrate your Ignite generated project from using `i18n-js` to the `react-i18next` library. It is meant specifically for projects generated with version 9 and below.

`react-i18next` will be included in Ignite's version 10. If you're using an earlier version, this guide provides the necessary steps to successfully complete the migration.

Finally, the steps outlined in this guide, are based on the changes outlined in the following two PRs:
* [Swap out i18n-js for react-18next](https://github.com/infinitered/ignite/pull/2770)
* [Fix language switching and update date-fns to v4](https://github.com/infinitered/ignite/pull/2788)

## Step 1: Manage dependencies

Remove the `i18n-js` package and its types:

```bash
yarn remove i18n-js @types/i18n-js@types/i18n-js
```

Add the two new dependencies:

```bash
yarn add react-i18next i18next
```

## Step 2: Set up initialization logic in app.tsx

To ensure that `react-i18next` finishes initializing before your app proceeds, we recommend adding state and logic to the `app.tsx` entry file:

1. Create a state variable, `isI18nInitialized`, to track initialization status.
2. Use the `useEffect` hook to set the state when initialization completes.

```js

// error-line
import "./i18n"
// success-line
import { initI18n } from "./i18n"

// ...extra file logic

// success-line-start
const [isI18nInitialized, setIsI18nInitialized] = useState(false);

useEffect(() => {
  initI18n().then(() => setIsI18nInitialized(true));
}, []);
// success-line-end
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

This ensures that your app will wait until `react-i18next` is fully initialized before continuing, preventing any issues with missing translations.

## Step 3: Remove i18n-js from project

In `app/i18n/i18n.ts`, delete the import line for i18n-js.

```js
// error-line
import { I18n } from "i18n-js"
```

## Step 4: Update the i18n initialization method

Next, update your i18n initialization to use `react-i18next`, which also includes RTL (right-to-left) language support and handles locale selection. In a Ingnite generated project, this is located in `app/i18n/i18n.ts`.

```js

// success-line-start
import * as i18next from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en"
import ar from "./ar"
import ko from "./ko"
import es from "./es"
import fr from "./fr"
import ja from "./ja"
import hi from "./hi"
// success-line-end

// ...extra file logic


// error-line-start
export const i18n = new I18n(
  { ar, en, "en-US": en, ko, fr, ja, hi },
  { locale: fallbackLocale, defaultLocale: fallbackLocale, enableFallback: true },
)
// error-line-end
// success-line-start
const resources = { ar, en, ko, es, fr, ja, hi }

const pickSupportedLocale: () => Localization.Locale | undefined = () => {
  return systemLocales.find((locale) => systemTagMatchesSupportedTags(locale.languageTag))
}

const locale = pickSupportedLocale()

export const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: locale?.languageTag ?? fallbackLocale,
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
// success-line-end
```

This ensures that supported locales are chosen based on the device’s settings, and RTL is correctly applied when necessary. For more on detail on these changes, check the [this PR](https://github.com/infinitered/ignite/pull/2770).

## Step 5: Add intl-pluralrules for react-i18next and JSON v4

To support pluralization and `react-i18next`'s JSON v4 format, you’ll need to add the `intl-pluralrules` package:

```bash
yarn add intl-pluralrules
```

Make sure to import this package into your i18n configuration file (`app/i18n/i18n.ts`):

```js
// success-line
import 'intl-pluralrules';
```

## Step 6: Update the translate function

The next step is to replace your old translate function with the one provided by `react-i18next`. This is located in `app/i18n/translate.ts`:

```js
// error-line
import { TranslateOptions } from "i18n-js"
// success-line-start
import { TOptions } from "i18next"
import { TxKeyPath } from "./i18n"
// success-line-end

// error-line-start
export function translate(key: TxKeyPath, options?: TranslateOptions): string {
  return i18n.t(key, options)
// error-line-end
// success-line-start
export function translate(key: TxKeyPath, options?: TOptions) {
  return i18n.isInitialized ? i18n.t(key, options) : key;
// success-line-end
}
```

## Step 7: Update translation keys from dots (.) to colons (:)

`react-i18next` uses different types of separators for translation keys. Colons (:) are used for first-level translations within an object, while dots (.) are used for nested translations. As a result, you’ll need to update all translation keys in your app accordingly. For example:

```js
translate("common.ok")
```

Should be changed to:

```js
translate("common:ok")
```

### Example

Using Ignite’s boilerplate code, here’s an example of how to replace the separator in `i18next`. We’ll use the `WelcomeScreen` component as a reference:

```js
// error-line-start
useHeader(
  {
    rightTx: "common.logOut",
    onRightPress: logout,
  },
  [logout],
)
// error-line-end
// success-line-start
useHeader(
  {
    rightTx: "common:logOut",
    onRightPress: logout,
  },
  [logout],
)
// success-line-end
```

Or from the return statement itself:

```tsx
// error-line-start
return (
  <View style={$container}>
    <View style={$topContainer}>
      <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      <Text
        testID="welcome-heading"
        style={$welcomeHeading}
        tx="welcomeScreen.readyForLaunch"
        preset="heading"
      />
      <Text tx="welcomeScreen.exciting" preset="subheading" />
      <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
    </View>

    <View style={[$bottomContainer, $bottomContainerInsets]}>
      <Text tx="welcomeScreen.postscript" size="md" />

      <Button
        testID="next-screen-button"
        preset="reversed"
        tx="welcomeScreen.letsGo"
        onPress={goNext}
      />
    </View>
  </View>
)
})
// error-line-end
// success-line-start
return (
  <View style={$container}>
    <View style={$topContainer}>
      <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      <Text
        testID="welcome-heading"
        style={$welcomeHeading}
        tx="welcomeScreen:readyForLaunch"
        preset="heading"
      />
      <Text tx="welcomeScreen:exciting" preset="subheading" />
      <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
    </View>

    <View style={[$bottomContainer, $bottomContainerInsets]}>
      <Text tx="welcomeScreen:postscript" size="md" />

      <Button
        testID="next-screen-button"
        preset="reversed"
        tx="welcomeScreen:letsGo"
        onPress={goNext}
      />
    </View>
  </View>
)
})
// success-line-end
```

## Step 8: Update types in i18n.ts

To prevent errors related to the `tx` property and accommodate `i18next`'s use of `:` as the primary separator, we need to update the types in `app/i18n/i18n.ts`.

```js
// error-line-start
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text
// error-line-end
// success-line-start
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, true>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, false>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
    ? IsFirstLevel extends true
      ? Text | `${Text}:${RecursiveKeyOfInner<TValue>}`
      : Text | `${Text}.${RecursiveKeyOfInner<TValue>}`
    : Text
// success-line-end
```

---

Lastly, update the usage of `i18n`'s `locale` method to `language` instead. For example in `app/utils/formatDate.ts`:

```js
// error-line
import { i18n } from "app/i18n"
// success-line
import i18next from "i18next"

// ...extra file logic

// error-line
const locale = i18n.locale.split("-")[0]
// success-line
const locale = i18next.language.split("-")[0]
```

For detailed code changes, including initialization updates, translation function updates, and testing, refer to the following PRs on the Ignite Github repo:

* [Swap out i18n-js for react-18next](https://github.com/infinitered/ignite/pull/2770)
* [Fix language switching and update date-fns to v4](https://github.com/infinitered/ignite/pull/2788)

By following this guide, you will be able to seamlessly transition your React Native app from `i18n-js` to `react-i18next`, ensuring improved localization features and support for modern internationalization practices. Let us know if you have any questions!