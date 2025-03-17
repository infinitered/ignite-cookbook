---
title: Localization with TranslateSheet
description: The easiest way to translate and localize your app
tags:
  - i18n
  - translation
  - localization
  - internationalization
  - community

last_update:
  author: Brandon Austin
---
## Overview

Adding localization is a crucial step in serving your app to users worldwide. TranslateSheet is a developer-friendly localization tool for React Native apps intended to be used alongside i18next. It lets you define translations inline within your components, so you can keep everything organized without managing bulky external files. Enjoy instant text updates with hot reloading, full TypeScript support, and AI-powered translation in over 200 languages. Plus, its Translation CRM simplifies managing your translation files—whether you’re pushing updates, pulling new ones, or collaborating with professional translators.

This guide walks you through setting up your app with both i18next and TranslateSheet, ensuring a seamless and optimized developer experience.

## Installation


We'll start by installing the translate-sheet package and it's peer dependencies

```sh
npm install translate-sheet i18next react-i18next intl-pluralrules
```

In this example, we'll also need to install a package to help us access the locale data on the users native device for customizing the app's experience for specific regions and languages.

```sh
npx expo install expo-localization
```

<!-- TODO: add a special block giving other library recommendations -->

## Project Configuration

You'll want to make sure you have an **i18n/i18n.ts** initialization file:

```tsx
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "intl-pluralrules";
import resources from "./resources";

export const fallbackLocale = "en-US";

const systemLocales = Localization.getLocales();

const supportedTags = Object.keys(resources);

// Checks to see if the device locale matches any of the supported locales
// Device locale may be more specific and still match (e.g., en-US matches en)
const systemTagMatchesSupportedTags = (deviceTag: string) => {
  const primaryTag = deviceTag.split("-")[0];
  console.log({ primaryTag });
  return supportedTags.includes(primaryTag);
};

const pickSupportedLocale: () => Localization.Locale | undefined = () => {
  return systemLocales.find((locale) =>
    systemTagMatchesSupportedTags(locale.languageTag),
  );
};

export const locale = pickSupportedLocale();

export let isRTL = false;

// Need to set RTL ASAP to ensure the app is rendered correctly. Waiting for i18n to init is too late.
if (locale?.languageTag && locale?.textDirection === "rtl") {
  I18nManager.allowRTL(true);
  isRTL = true;
} else {
  I18nManager.allowRTL(false);
}

export const lng = locale?.languageTag ?? fallbackLocale;

export const initI18n = async () => {
  i18n.use(initReactI18next);

  await i18n.init({
    resources,
    lng: locale?.languageTag ?? fallbackLocale,
    fallbackLng: fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
  })

  console.log(`[initI18n] i18n initialized with language: ${i18n.language}`);
};

```
Next we'll create a **resources.ts** file inside our i18n folder to initialize our primary language:
```tsx
const resources = {
  "en": { language: "isPrimary" },
};

export default resources;
```

We'll need a **translateSheetConfig.js** file at the root of our project:

```tsx
/**
 * @type {Object} TranslateSheetConfig
 * @property {string} apiKey - The API key used for authenticating with the TranslateSheet backend.
 * @property {string} output - The directory where the generated translation files will be saved.
 * @property {string} primaryLanguage - The primary language of the project (e.g., "en" for English).
 * @property {string} fileExtension - The file extension for the generated translation files (e.g., ".js" for JavaScript files).
 * @property {string[]} languages - An array of target languages for translation (e.g., ["es"] for Spanish).
 * @property {boolean} generatePrimaryLanguageFile - An optional flag to generate a translation file for the primary language.
 */
const translateSheetConfig = {
  // Create a project and get an API key: https://www.translatesheet.co/dashboard
  apiKey: "",
  output: "./i18n",
  primaryLanguage: "en",
  fileExtension: ".ts",
  // We'll be translating our app to Spanish and Japanese in this example:
  languages: ["es", "ja"],
  generatePrimaryLanguageFile: false,
};

module.exports = translateSheetConfig;
```

And lastly we'll want to initialize i18n at the root of our application: 
```tsx
const YourAppRoot = () => {
const [isI18nInitialized, setIsI18nInitialized] = useState<boolean>(false);

  useEffect(() => {
    initI18n().then(() => {
      setIsI18nInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (isI18nInitialized) {
      SplashScreen.hideAsync();
    }
  }, [isI18nInitialized]);

  if (!loaded) {
    return null;
  }

  return // your app
}
```

## Usage

We are now setup to use i18next and TranslateSheet in our application 🎉

Let's use it in a component:

```tsx
import { View, Text } from "react-native"
import TranslateSheet from "translate-sheet"

const Example = () => {
  return (
    <View>
      <Text>
        {translations.helloWorld}
        {translations.bestBoilerPlate({ boilerPlate: "Ignite" })}
      </Text>
    </View>
  )
}

const translations = TranslateSheet.create("ExampleComponent", {
  helloWorld: "Hello World!"
  bestBoilerPlate: "The worlds best RN boilerplate is {{boilerPlate}}"
})
```

The example above demonstrates how to use TranslateSheet with both constant and interpolated values.

## Translating Our App

Now that we are using **TranslateSheet.create** in our app, we can easily translate our apps' content.

In your terminal, simply run a single command: 

```bash
npx run translate-sheet generate
```

This command will look for all of the **TranslateSheet.create** declarations in your application, send your text strings to the TranslateSheet translation service, and create a new language file for each desired translated language that you've specified in your translateSheetConfig.js file. If you're using TypeScript, you will also be given a **translations.types.ts** file.

In this example, two new language files were created for us which now live in our i18n folder:

```tsx
// es.ts
const es: Translations = {
  ExampleComponent: {
    helloWorld: "Hola Mundo!"
    bestBoilerPlate: "El mejor texto repetitivo de RN del mundo es {{boilerPlate}}"
  }
}
```

```tsx
// ja.ts
const ja: Translations = {
  ExampleComponent: {
    helloWorld: "「こんにちは世界」"
    bestBoilerPlate: "世界最高のRN定型文は {{boilerPlate}}"
  }
}
```

Within seconds, the power of TranslateSheet has allowed us to translate our app with the help of AI!

## Updating Translations

You can access your translated strings in the [TranslateSheet Dashboard](https://www.translatesheet.co/dashboard).

You have the power to view and edit your applications translated content in the dashboard either by yourself or a professional. 

Once you make a change, either open a pull request directly in the dashboard, or run the command:

```bash
npx run translate-sheet pull
```
this will fetch your latest translation updates and update your project locally.

## 🎉 Congratulations!

And just like that, our app is now ready to be served to millions of new users in other parts of the world.

For frequently asked questions or more details on advanced usage, head over to the official [TranslateSheet Documentation](https://docs.translatesheet.co).




