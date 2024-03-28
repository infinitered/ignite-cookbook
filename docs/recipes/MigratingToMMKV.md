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

We'll get started by igniting a new application with the `cng` workflow. We must do this since `react-native-mmkv` contains native dependencies not included in the Expo SDK. Luckily with Ignite CLI, it's easy to jump into this workflow:

```bash
npx ignite-cli new PizzaApp --workflow=cng --yes
cd PizzaApp
```

## Project Dependencies

Install the `react-native-mmkv` dependency into the project and run prebuild again to let Expo take care of the necessary adjustments to the native template.

```bash
yarn remove @react-native-async-storage/async-storage
yarn add react-native-mmkv
yarn prebuild
```

_Note: For more information on Continuous Native Generation (CNG), you can read the [Expo docs here](https://docs.expo.dev/workflow/continuous-native-generation/)._

## Code Changes

Open `app/utils/storage.tsx` and modify the imports:

```tsx
// error-line
import AsyncStorage from "@react-native-async-storage/async-storage";
// success-line
import { MMKV } from "react-native-mmkv";
// success-line
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
// success-line
export function loadString(key: string): string | null {
  try {
    // error-line
    return await AsyncStorage.getItem(key)
    // success-line
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
// success-line
export function saveString(key: string, value: string): boolean {
  try {
    // error-line
    await AsyncStorage.setItem(key, value)
    // success-line
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
// success-line
export function load(key: string): any | null {
  try {
    // error-line
    const almostThere = await AsyncStorage.getItem(key)
    // success-line
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
// success-line
export function save(key: string, value: any): boolean {
  try {
    // error-line
    await AsyncStorage.setItem(key, JSON.stringify(value))
    // success-line
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
// success-line
export function remove(key: string): void {
  try {
    // error-line
    await AsyncStorage.removeItem(key)
    // success-line
    storage.delete(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
// error-line
export async function clear(): Promise<void> {
// success-line
export function clear(): void {
  try {
    // error-line
    await AsyncStorage.clear()
    // success-line
    storage.clearAll();
  } catch {}
}
```

::: info

Now that you've moved the base storage functions over to MMKV, you might want to update Reactotron to use it as well!

[Configuring Reactotron with MMKV](https://docs.infinite.red/reactotron/plugins/react-native-mmkv/)

:::

You may notice that the `storage.test.ts` test file will no longer pass. Replace the contents of this file with the following test data:

```tsx
import { load, loadString, save, saveString, clear, remove } from "./storage";
import { storage } from "./mmkv"; // <- wherever your global `new MMKV()` constant is

const VALUE_OBJECT = { x: 1 };
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

describe("MMKV Storage", () => {
  beforeEach(() => {
    storage.clearAll();
    storage.set("string", "string");
    storage.set("object", JSON.stringify(VALUE_OBJECT));
  });

  it("should be defined", () => {
    expect(storage).toBeDefined();
  });

  it("should have default keys", () => {
    expect(storage.getAllKeys()).toEqual(["string", "object"]);
  });

  it("should load data", () => {
    expect(load("object")).toEqual(VALUE_OBJECT);
    expect(loadString("object")).toEqual(VALUE_STRING);

    expect(load("string")).toEqual("string");
    expect(loadString("string")).toEqual("string");
  });

  it("should save strings", () => {
    saveString("string", "new string");
    expect(loadString("string")).toEqual("new string");
  });

  it("should save objects", () => {
    save("object", { y: 2 });
    expect(load("object")).toEqual({ y: 2 });
    save("object", { z: 3, also: true });
    expect(load("object")).toEqual({ z: 3, also: true });
  });

  it("should save strings and objects", () => {
    saveString("object", "new string");
    expect(loadString("object")).toEqual("new string");
  });

  it("should remove data", () => {
    remove("object");
    expect(load("object")).toBeUndefined();
    expect(storage.getAllKeys()).toEqual(["string"]);

    remove("string");
    expect(load("string")).toBeUndefined();
    expect(storage.getAllKeys()).toEqual([]);
  });

  it("should clear all data", () => {
    expect(storage.getAllKeys()).toEqual(["string", "object"]);
    clear();
    expect(storage.getAllKeys()).toEqual([]);
  });
});
```

Run the app in the iOS simulator to test the changes with `yarn ios`. Navigate to the Podcast List screen:

1. Press "Tap to sign in!"
2. Press "Let's go!"
3. Tap on the "Podcast"

Now let's swipe the app away to close it. Re-open the app to see if the navigation picks up where we left off (which shows our storage is working to remember the navigation key we were last on).

And that's it! Ignite is now configured with `react-native-mmkv` over `AsyncStorage`.
