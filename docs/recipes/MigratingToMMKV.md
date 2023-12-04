---
title: Migrating to MMKV
description: How to migrate from React Native's AsyncStorage to MMKV
tags:
  - MMKV
  - AsyncStorage
last_update:
  author: Frank Calise
publish_date: 2022-12-28
---

# Migrating to MMKV

## Overview

[MMKV](https://github.com/mrousavy/react-native-mmkv) is said to be the fastest key/value storage for React Native. It has encryption support for secure local storage and also uses synchronous storage to simplify your application code.

In this recipe, we'll convert our the Ignite demo project from using `AsyncStorage` to `MMKV`.

We'll get started by igniting a new application with the `prebuild` workflow. We must do this since `react-native-mmkv` contains native dependencies not included in the Expo SDK. Luckily with Ignite CLI, it's easy to jump into this workflow:

```nodejs
npx ignite-cli new PizzaApp --workflow=prebuild --yes
cd PizzaApp
```

## Project Dependencies

Install the `react-native-mmkv` dependency into the project and run prebuild again to let Expo take care of the necessary adjustments to the native template.

```nodejs
yarn add react-native-mmkv
yarn prebuild
```

_Note: For more information on prebuild, you can read the [Expo docs here](https://docs.expo.dev/workflow/prebuild/)._

## Code Changes

Open `app/utils/storage.tsx` and modify the imports:

```tsx
// error-line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();
```

Now we'll remove any reference to `AsyncStorage` and replace it with the proper API from `MMKV`

```tsx
/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
// error-line
export async function loadString(key: string): Promise<string | null> {
export function loadString(key: string): string | null {
  try {
    // error-line
    return await AsyncStorage.getItem(key)
    return storage.getString(key);
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
// error-line
export async function saveString(key: string, value: string): Promise<boolean> {
export function saveString(key: string, value: string): boolean {
  try {
    // error-line
    await AsyncStorage.setItem(key, value)
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
// error-line
export async function load(key: string): Promise<any | null> {
export function load(key: string): any | null {
  try {
    // error-line
    const almostThere = await AsyncStorage.getItem(key)
    const almostThere = storage.getString(key);
    return JSON.parse(almostThere);
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
// error-line
export async function save(key: string, value: any): Promise<boolean> {
export function save(key: string, value: any): boolean {
  try {
    // error-line
    await AsyncStorage.setItem(key, JSON.stringify(value))
    saveString(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
// error-line
export async function remove(key: string): Promise<void> {
export function remove(key: string): void {
  try {
    // error-line
    await AsyncStorage.removeItem(key)
    storage.delete(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
// error-line
export async function clear(): Promise<void> {
export function clear(): void {
  try {
    // error-line
    await AsyncStorage.clear()
    storage.clearAll();
  } catch {}
}
```

Run the app in the iOS simulator to test the changes with `yarn ios`. Navigate to the Podcast List screen:

1. Press "Tap to sign in!"
2. Press "Let's go!"
3. Tap on the "Podcast"

Now let's swipe the app away to close it. Re-open the app to see if the navigation picks up where we left off (which shows our storage is working to remember the navigation key we were last on).

And that's it! Ignite is now configured with `react-native-mmkv` over `AsyncStorage`.
