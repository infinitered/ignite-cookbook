---
title: Pristine Expo Project
description: How to remove native related code from a unified Ignite project
tags:
  - Expo
last_update:
  author: Frank Calise
publish_date: 2018-01-01
---

# Pristine Expo Project

Ignite sets your project up ready to run both a bare React Native project or with Expo.

However, if you don't want to manage any of the native files going forward, you can follow these steps to get to an Expo only project structure.

## Notes

Keep in mind you may have to adopt the following steps for a different package manager or OS. The following are compatible for the `yarn` package manager while running on MacOS.

## Steps

### Project Initialization

- `npx ignite-cli new PizzaApp --yes`
- `cd PizzaApp`

### Filesystem Changes

- `rm -rf android`
- `rm -rf ios`
- `rm index.js` - Expo's entry point is App.js
- `rm metro.config.js` - Expo will use the default

### Package Changes

- `yarn remove react-native-bootsplash` - removes a native library pertaining to the splash screen (this will be handled via `expo-splash-screen`)
- `yarn remove expo-modules-core`

### package.json Script Updates

These changes are optional as you can continue to use the prefixed `expo:` commands, however you might just want a cleaned up `scripts` section of your `package.json`.

```json
{
  "name": "ignite-eas",
  "version": "0.0.1",
  "private": true,
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "compile": "tsc --noEmit -p . --pretty",
    "format": "prettier --write \"app/**/*.{js,jsx,json,md,ts,tsx}\"",
    "lint": "eslint App.js app test --fix --ext .js,.ts,.tsx && npm run format",
    "patch": "patch-package",
    "test": "jest",
    "test:watch": "jest --watch",
    "adb": "adb reverse tcp:9090 tcp:9090 && adb reverse tcp:3000 tcp:3000 && adb reverse tcp:9001 tcp:9001 && adb reverse tcp:8081 tcp:8081",
    "postinstall": "node ./bin/postInstall",
    "clean": "npx react-native-clean-project",
    "clean-all": "npx react-native clean-project-auto",
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:detox": "detox build -c ios.sim.expo",
    "test:detox": "./bin/downloadExpoApp.sh && detox test --configuration ios.sim.expo"
  },
  // ... more config ...
  "detox": {
    "test-runner": "jest",
    "runnerConfig": "./detox/config.json",
    "specs": "detox",
    "configurations": {
      "ios.sim.expo": {
        "binaryPath": "bin/Exponent.app",
        "type": "ios.simulator",
        "name": "iPhone 14"
      }
    }
  }
  // ... more config ...
}
```
