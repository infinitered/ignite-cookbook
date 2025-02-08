---
title: Universal E2E Testing with Detox and Playwright
description: How to re-use tests across iOS, Android, and Web with Detox and Playwright.
tags:
  - Detox
  - Playwright
  - testing
last_update:
  author: Joshua Yoes
publish_date: 2025-02-10
---

# Universal E2E Testing with Detox and Playwright

This recipe shows how to use Playwright and Detox together in the same Ignite project. We’ll add an `e2e` folder containing shared page-object models and test fixtures. Then we’ll configure our test files so we can run the same test code in **iOS** and **Android** (Detox) or **Web** (Playwright). In the end, you’ll have a flexible, cohesive setup for E2E tests across all targets.

# 1. Install Detox

Follow the official [Detox Getting Started Guide](https://wix.github.io/Detox/docs/introduction/project-setup). At a high level, you will:

1. Install the Detox CLI as a dev dependency (`yarn add -D detox`)
2. Init via `yarn detox init` to get the necessary config files like `.detoxrc.js` and `e2e/jest.config.js`
3. Remove any generated test files, we will create our own later.

# 2. Install Playwright

Follow the official [Playwright Intro Guide](https://playwright.dev/docs/intro#installing-playwright). This typically looks like:

1. Init via `yarn create playwright`, which should create a `playwright.config.ts`, update your `package.json` scripts, and optionally install browsers. `Make sure to set Where to put your end-to-end tests?` to `e2e/tests`
2. Run `yarn playwright install` to install browsers if you haven't already
3. Make sure your `playwright.config.ts` has the `testDir` to point to your `e2e/tests` folder:

```diff
 export default defineConfig({
-  testDir: "./tests/playwright",
+  testDir: "./e2e/tests",
   /* Run tests in files in parallel */
   fullyParallel: true,
```

# 3. Add `e2e` Folder Changes for `Login.test.ts`

Below is a minimal example of our test setup. The structure uses a single test definition that references environment-agnostic fixtures. Detox code lives in `e2e/detox/`, Playwright code in `e2e/playwright/`, and shared interfaces in `e2e/screens.ts`. Then each test file imports from a single `env.ts` which picks Detox or Playwright at runtime.

### Folder Structure (simplified)

```
e2e
├─ detox
│  ├─ screens
│  │  ├─ LoginScreen.ts
│  │  ├─ WelcomeScreen.ts
│  │  └─ ...
│  ├─ env.ts
│  └─ setup.ts
├─ playwright
│  ├─ screens
│  │  ├─ LoginScreen.ts
│  │  ├─ WelcomeScreen.ts
│  │  └─ ...
│  ├─ env.ts
│  └─ setup.ts
├─ tests
│  └─ Login.test.ts
├─ screens.ts
├─ env.ts
└─ jest.config.js
```

### Test Definition – `e2e/tests/Login.test.ts`

```ts
import { test } from "../env"

test("Open up our app and use the default credentials to login and navigate to the demo screen", async ({
  loadApp,
  loginScreen,
  welcomeScreen,
}) => {
  await loadApp()
  await loginScreen.login()
  await welcomeScreen.launch()
})
```

### Shared Test Env – `e2e/env.ts`

A single entry point chooses which environment to load. It has a utility `test` that’s either Detox’s or Playwright’s “test” function:

```ts
// e2e/env.ts
import type { Fixtures } from "./screens"

/** Check for runtime globals that we are in a detox environment  */
export function isDetoxTestEnv() {
  return typeof device !== "undefined"
}

/** Check for runtime globals that we are in a playwright environment */
export function isPlaywrightTestEnv() {
  // @ts-ignore
  return globalThis._playwrightInstance !== undefined
}

/** Our library-agnostic test function */
export type Test = (name: string, fn: (fixtures: Fixtures) => Promise<void>) => void

export const test: Test = (() => {
  if (isDetoxTestEnv()) {
    return require("./detox/env").test
  } else if (isPlaywrightTestEnv()) {
    return require("./playwright/env").test
  } else {
    throw new Error("Unknown test env")
  }
})()
```

### Page Object Interfaces – `e2e/screens.ts`

Define your “agnostic” page objects as TypeScript interfaces:

```ts
// e2e/screens.ts
export interface ILoginScreen {
  login(): Promise<void>
}

export interface IWelcomeScreen {
  launch(): Promise<void>
}

/** A fixture of all the page object models we can use in our tests */
export type Fixtures = {
  loadApp: () => Promise<void>
  loginScreen: ILoginScreen
  welcomeScreen: IWelcomeScreen
  // ... you can add more as needed
}
```

### Detox Test Env – `e2e/detox/env.ts`

```ts
import { DetoxWelcomeScreen } from "./screens/WelcomeScreen"
import { DetoxLoginScreen } from "./screens/LoginScreen"
import type { Fixtures } from "../screens"
import type { Test } from "../env"
import { detoxLoadApp } from "./setup"

const fixtures: Fixtures = {
  loadApp: detoxLoadApp,
  loginScreen: new DetoxLoginScreen(),
  welcomeScreen: new DetoxWelcomeScreen(),
}

export const test: Test = (name, fn) =>
  globalThis.test(name, (done) => {
    fn(fixtures)
      .then(() => done())
      .catch(done.fail)
  })
```

### Detox Setup – `e2e/detox/setup.ts`

```ts
// e2e/detox/setup.ts
import { device } from "detox"
import { resolveConfig } from "detox/internals"
import type { AppJSONConfig } from "@expo/config"
const appConfig: AppJSONConfig = require("../../app.json")

type Platform = ReturnType<typeof device.getPlatform>

export async function detoxLoadApp() {
  const config = await resolveConfig()
  const platform = device.getPlatform()
  const isDebugConfig = config.configurationName.split(".").at(-1) === "debug"
  if (isDebugConfig) {
    return await openAppForDebugBuild(platform)
  } else {
    return await device.launchApp({
      newInstance: true,
    })
  }
}

async function openAppForDebugBuild(platform: Platform) {
  const deepLinkUrl = process.env.EXPO_USE_UPDATES
    ? // Testing latest published EAS update for the test_debug channel
      getDeepLinkUrl(getLatestUpdateUrl())
    : // Local testing with packager
      getDeepLinkUrl(getDevLauncherPackagerUrl(platform))

  if (platform === "ios") {
    await device.launchApp({
      newInstance: true,
    })
    await sleep(1000)
    await device.openURL({
      url: deepLinkUrl,
    })
  } else {
    await device.launchApp({
      newInstance: true,
      url: deepLinkUrl,
    })
  }

  await sleep(1000)
}

const getAppId = () => appConfig?.expo?.extra?.eas?.projectId ?? ""

const getAppSchema = () => appConfig?.expo?.scheme ?? ""

const getDeepLinkUrl = (url: string) =>
  `exp+${getAppSchema()}://expo-development-client/?url=${encodeURIComponent(url)}`

const getDevLauncherPackagerUrl = (platform: Platform) =>
  `http://localhost:8081/index.bundle?platform=${platform}&dev=true&minify=false&disableOnboarding=1`

const getLatestUpdateUrl = () =>
  `https://u.expo.dev/${getAppId()}?channel-name=test_debug&disableOnboarding=1`

const sleep = (t: number) => new Promise((res) => setTimeout(res, t))
```

### Detox Implementation – `e2e/detox/screens/LoginScreen.ts`

```ts
// e2e/detox/screens/LoginScreen.ts
import { expect, element, by } from "detox"
import type { ILoginScreen } from "../../screens"

export class DetoxLoginScreen implements ILoginScreen {
  async login() {
    await expect(element(by.text("Log In"))).toBeVisible()
    await element(by.text("Tap to log in!")).tap()
  }
}
```

### Playwright Test Env – `e2e/playwright/env.ts`

```ts
import { test as base } from "@playwright/test"
import { playwrightLoadApp } from "./setup"
import { PlaywrightLoginScreen } from "./screens/LoginScreen"
import { PlaywrightWelcomeScreen } from "./screens/WelcomeScreen"
import type { Fixtures } from "../screens"

export const test = base.extend<Fixtures>({
  loadApp: async ({ page }, use) => {
    await use(() => playwrightLoadApp(page))
  },
  loginScreen: async ({ page }, use) => {
    await use(new PlaywrightLoginScreen(page))
  },
  welcomeScreen: async ({ page }, use) => {
    await use(new PlaywrightWelcomeScreen(page))
  },
})
```

### Playwright Setup – `e2e/playwright/setup.ts`

```ts
// e2e/playwright/setup.ts
import type { Page } from "@playwright/test"

export async function playwrightLoadApp(page: Page) {
  await page.goto("http://localhost:3000")
}
```

### Playwright Implementation – `e2e/playwright/screens/LoginScreen.ts`

```ts
// e2e/playwright/screens/LoginScreen.ts
import { expect, Page } from "@playwright/test"
import type { ILoginScreen } from "e2e/screens"

export class PlaywrightLoginScreen implements ILoginScreen {
  constructor(private page: Page) {}

  async login() {
    await expect(this.page.locator("[data-testid='login-heading']")).toHaveText("Log In")
    await this.page.locator("[data-testid='login-button']").click()
  }
}
```

# 4. Run Detox Tests

In your `package.json`, add these scripts:

```json
{
  "scripts": {
    "detox:build:ios:debug": "detox build --c ios.sim.debug",
    "detox:test:debug": "detox test --configuration ios.sim.debug"
  }
}
```

Make sure your iOS simulator is running.

Then you can build and test:

```bash
yarn detox:build:ios:debug
yarn start
yarn detox:test:debug
```

> If you have any issues, check [the environment setup guide for Detox](https://wix.github.io/Detox/docs/introduction/environment-setup).

# 5. Run Playwright Tests

In your `package.json`, add these scripts:

```json
{
  "scripts": {
    "playwright:build": "yarn bundle:web && yarn serve:web",
    "playwright:test": "yarn playwright test"
  }
}
```

Then run:

```bash
yarn playwright:build
yarn playwright:test
```

This will execute your tests in a browser environment.

If you want to run them with a nice UI, you can run:

```bash
yarn playwright:test --ui
```

---

That’s it! You now have an E2E test structure that runs on **iOS** and **Android** devices with Detox and also covers **Web** with Playwright. The same test files and page-object patterns can be reused across all targets—enjoy your cross-platform test suite!
