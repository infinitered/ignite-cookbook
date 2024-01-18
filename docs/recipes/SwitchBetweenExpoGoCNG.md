---
title: Switch Between Expo Go and Expo CNG
description: Switch an Expo Go project to an Expo CNG project and visa versa
tags:
  - Expo
last_update:
  author: Justin Poliachik
publish_date: 2024-01-11
---

# Switch a Project Between Expo Go and Expo CNG

If you created an Ignite project using the Expo Go workflow and you need to transition to Expo CNG (Continuous Native Generation) or visa versa, this guide will teach you how to reconfigure your project.

## Expo Go -> Expo CNG

If you started with Expo Go but now need to add a library with native code, create your own custom native code, or modify native project configuration, you'll no longer be able to run your app inside Expo Go.

Thankfully, this is super easy thanks to [Expo's Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)!
We only need to slightly change how we build & run our app.

In `package.json`, modify scripts:

```diff
--"android": "npx expo start --android",
--"ios": "npx expo start --ios",
++"android": "npx expo run:android",
++"ios": "npx expo run:ios",
```

Expo handles the rest!

When you run `npm run ios` or `npm run android`, Expo will generate native projects and create `ios` and `android` directories, create a development build, and launch your standalone app. You are now successfully using Expo CNG!

To learn more, check out Expo's documentation on [adding custom native code](https://docs.expo.dev/workflow/customizing/).

## Expo CNG -> Expo Go

If you started with Expo CNG workflow, but your app isn't utilizing any custom native functionality and you want to use Expo Go for developing your app, follow these steps!

**Important Note**: To successfully run your app using Expo Go, your project must not contain _any_ custom native code, project configuration, or native libraries outside of the [Expo SDK](https://docs.expo.dev/versions/latest/). Your project also can't contain any `expo.plugins` inside your `app.json`. If your app contains native code, libraries, configuration, or plugins and you attempt to run inside Expo Go, expect your app to crash or not function properly.

### Steps

1. In `package.json`, modify scripts:

```diff
--"android": "npx expo run:android",
--"ios": "npx expo run:ios",
++"android": "npx expo start --android",
++"ios": "npx expo start --ios",
```

2. Some libraries may need to be downgraded in order to be compatible with Expo Go. In `package.json`, you may need to downgrade dependencies so they do not exceed the version supported by Expo Go.

```json
"@react-native-async-storage/async-storage": "1.18.2",
"@shopify/flash-list": "1.4.3",
"expo-application": "~5.3.0",
"expo-font": "~11.4.0",
"expo-localization": "~14.3.0",
"react-native": "0.72.6",
```

Note: View latest values in [Ignite - expoGoCompatibility.ts](https://github.com/infinitered/ignite/blob/6e8f84a786555504acc8751ceb617238f710bc26/src/tools/expoGoCompatibility.ts#L5C14-L5C42)
