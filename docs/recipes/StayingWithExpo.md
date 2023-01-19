---
title: Staying With Expo
description: Setting up Ignite to build a custom Expo development client for use with Config Plugins
tags:
  - Expo
  - expo-dev-client
last_update:
  author: Frank Calise
publish_date: 2022-10-11
---

# Staying With Expo

This guide will teach you how to set up an [Expo development build](https://docs.expo.dev/development/getting-started/) which prepares your project for native code via [Config Plugins](https://docs.expo.dev/guides/config-plugins/), but keeps you in Expo's managed workflow.

## Appetizer

Follow the [Pristine Expo Project](./PristineExpoProject.md) recipe first to make sure you're starting with an Expo only project.

You'll also need `eas-cli` globally installed and and an [Expo account](https://expo.dev/signup) if you don't already have one.

`npm install -g eas-cli`

*Optional*: You can use EAS builds for free, however there is a queue time to wait for your build. It is possible to [build locally](https://docs.expo.dev/build-reference/local-builds/), however you'll need a couple of other dependencies installed for proper iOS and Android builds (if you can already build iOS/Android natively, you're probably good to go!)

**iOS**
`brew install cocoapods`
`brew install fastlane`

**Android**
SDK and NDK

## Steps

### 1. Project Setup

From within your project directory, run the following:

- `yarn add expo-dev-client`
- `eas build:configure`

### 2. Build Profile

Modify the newly generated `eas.json` to configure a `preview` build profile

```json
{
  "cli": {
    "version": ">= 0.60.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "developmentClient": true,
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Run the Build!

**Using EAS build servers**

`eas build --profile preview`

Once complete you can download the Android APK or iOS tar file.

**Build Locally**

`eas build --profile preview --local`

Your app will be saved in the root directory unless you specify the desired directory with the environment variable `EAS_LOCAL_BUILD_ARTIFACTS_DIR`, for example:

`EAS_LOCAL_BUILD_ARTIFACTS_DIR=build eas build --profile preview --local`

This will save your `*.apk` or `*.tar.gz` (containing the `.app`) in the `[project-dir]/build/` directory.

### 4. Run the Development Client

With the builds complete, let's add them to your emulator or simulator.

**Android**

Drag the APK onto your emulator or install it on a device (making sure your settings are appropriate for "Install unknown apps")

**iOS**

- `tar zxvf build/build-*.tar.gz -C build/` (adapt this command depending on where you saved it to)
- Drag the `PizzaApp.app` onto your iOS simulator

You can now develop locally like you normally would with Expo Go, with one last adjustment to the `start` script.

In `package.json` modify `"start": "expo start"` to `"start": "expo start --dev-client"`.

Run `yarn start` in your terminal so metro starts up. Follow the Expo CLI to boot up either the Android or iOS app. You'll notice Expo Go has not launched in this case, but something that looks very similar (you can still shake the device for developer menu, etc).
