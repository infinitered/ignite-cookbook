---
title: Migrating to MMKV
description: How to migrate from React Native's AsyncStorage to MMKV
tags:
  - MMKV
  - AsyncStorage
last_update:
  author: Frank Calise, Mark Rickert
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

:::warning
If you're working in the [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page), you'll want to specifically install `react-native-mmkv@beta`, which at the time of this writing is major version 3 and up.
:::

```bash
yarn remove @react-native-async-storage/async-storage
yarn add react-native-mmkv
yarn prebuild
```

_Note: For more information on Continuous Native Generation (CNG), you can read the [Expo docs here](https://docs.expo.dev/workflow/continuous-native-generation/)._

## Code Changes

Open `app/utils/storage.ts` and modify the the file to use `MMKV` instead of `AsyncStorage`:

```tsx {1-10} show-lines
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | undefined {
  try {
    return storage.getString(key)
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return undefined
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.set(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load(key: string): unknown | undefined {
  try {
    const almostThere = loadString(key)
    if (almostThere) {
      try {
        return JSON.parse(almostThere)
      } catch {
        return almostThere // Return the string if it's not a valid JSON
      }
    }
    return undefined
  } catch {
    return undefined
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key: string, value: unknown): boolean {
  try {
    saveString(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    storage.delete(key)
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    storage.clearAll()
  } catch {}
}
```

:::info

Now that you've moved the base storage functions over to MMKV, you might want to update Reactotron to use it as well!

[Configuring Reactotron with MMKV](https://docs.infinite.red/reactotron/plugins/react-native-mmkv/)

:::

You may notice that the `storage.test.ts` test file will no longer pass. Replace the contents of this file with the following test data:

```tsx
import {
  storage,
  load,
  loadString,
  save,
  saveString,
  clear,
  remove,
} from "./storage";

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
