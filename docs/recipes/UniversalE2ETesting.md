---
title: Universal E2E Testing with Detox and Playwright
description: How to re-use tests across iOS, Android, and Web with Detox and Playwright.
tags:
  - Detox
  - Playwright
  - testing
last_update:
  author: Joshua Yoes
publish_date: 2025-02-12
---

# Universal E2E Testing with Detox and Playwright

So we all know that writing UI E2E tests suck right? It's hard to know if an assertion failure is a bug in your app or a bug in your test. They are slow to run, and they are brittle against changes as new features get developed. And as they grow in number, they often become a mess because they do not have a planned architecture.

But they can also be too useful to ignore. A lot of bad deployments have been stopped by a single E2E test that caught a critical bug. So how can we make maintaining them less painful?

This recipe uses a boring but easy to understand design pattern, called the Page Object Model. If you give it [a Google search](https://www.google.com/search?q=page+object+model), you will find that most testing tool have a documentation page dedicated to this pattern. We can leverage this fact to write our tests so that multiple testing frameworks can run the same test files, so we can re-use our tests across iOS, Android, and web.

In order to accomplish this, we are going to setup Playwright and Detox to co-exist in the same Ignite project. We'll add an `e2e` folder containing shared page-object models and test fixtures. Then we'll configure our test files so we can run the same test code in **iOS** and **Android** (Detox) or **Web** (Playwright). After we are done, we will be left with some basic tests and a clear architecture for writing new tests and page object models.

## Should you cook this up?

This recipe is for you if:

- You have tests for one platform using page object models and you want to re-use them on another platform
- You are starting to add tests to a new project and both web and mobile are critical flows for your users.
- You have a large team and want to use an simple testing architecture that is familiar to many developers.
- You want to write all your tests for each platforms in a single language (JavaScript / TypeScript).

## Getting Started

You can start with an existing Ignite project, or create a new one using:

```bash
npx ignite-cli@latest new PizzaApp
cd PizzaApp
```

## Install Detox

Follow the official [Detox Getting Started Guide](https://wix.github.io/Detox/docs/introduction/project-setup). As of writing this, you will:

1. Install the Detox CLI as a dev dependency (`yarn add -D detox`)
2. Init via `yarn detox init` to get the necessary config files like `.detoxrc.js` and `e2e/jest.config.js`
3. Remove any generated test files, we will create our own later.

:::note

This guide assumes that you will use yarn 1 as your package manager. But if don't use that, you can use ChatGPT or your brain to convert the commands to your package manager of choice.

:::


## Install Playwright

Follow the official [Playwright Intro Guide](https://playwright.dev/docs/intro#installing-playwright). This typically looks like:

1. Init via `yarn create playwright`, which should create a `playwright.config.ts`, updates your `package.json` scripts, and optionally install browsers. `Make sure to set Where to put your end-to-end tests?` to `e2e/tests`
2. Run `yarn playwright install` to install browsers if you haven't already
3. Make sure your `playwright.config.ts` has the `testDir` to point to a `e2e/tests` folder, we will create this next:

```diff
 export default defineConfig({
-  testDir: "./tests/playwright",
+  testDir: "./e2e/tests",
   /* Run tests in files in parallel */
   fullyParallel: true,
```

## Add `e2e` Folder Changes for `Login.test.ts`

Below is a minimal example of our test setup. The structure uses a single test definition that references environment-agnostic fixtures. Detox code lives in `e2e/detox/`, Playwright code in `e2e/playwright/`, and shared interfaces in `e2e/screens.ts`. Then each test file imports from a single `entry.ts` which picks Detox or Playwright at runtime.

### Folder Structure (simplified)

```
e2e
├─ detox
│  ├─ screens
│  │  ├─ LoginScreen.ts
│  │  └─ WelcomeScreen.ts
│  ├─ entry.ts
│  └─ setup.ts
├─ playwright
│  ├─ screens
│  │  ├─ LoginScreen.ts
│  │  └─ WelcomeScreen.ts
│  ├─ entry.ts
│  └─ setup.ts
├─ tests
│  └─ Login.test.ts
├─ screens.ts
├─ entry.ts
└─ jest.config.js
```

### Login Tests

Notice how there aren't a lot of imports here, instead our page object model "imports" are provided to the test function as an object. This is the secret sauce to using the same test files across multiple environments. More on that later!

```ts title="e2e/tests/Login.test.ts"
import { test } from "../entry";

test("Open up our app and use the default credentials to login and navigate to the demo screen", async ({
  loadApp,
  loginScreen,
  welcomeScreen,
}) => {
  await loadApp();
  await loginScreen.login();
  await welcomeScreen.launch();
});
```

### Shared Entry 

A single entry point chooses which environment to load. It has a utility `test` that's either Detox's or Playwright's "test" function:

```ts title="e2e/entry.ts"
import type { Fixtures } from "./screens";

/** Check for runtime globals that we are in a detox environment  */
export const isDetoxTestEnv = () =>
  // @ts-ignore
  typeof device !== "undefined";

/** Check for runtime globals that we are in a playwright environment */
export const isPlaywrightTestEnv = () =>
  // @ts-ignore
  globalThis._playwrightInstance !== undefined;

/** Our library-agnostic test function */
export type Test = (
  name: string,
  fn: (fixtures: Fixtures) => Promise<void>
) => void;

/**
 * This test function is a little funky, but it ensures that we don't accidentally
 * import playwright code into a detox environment, or vice versa.
 */
export const test: Test = (() => {
  const testEnvsLoaded = [isDetoxTestEnv(), isPlaywrightTestEnv()].filter(
    Boolean
  ).length;

  if (testEnvsLoaded !== 1) {
    throw new Error(
      `${testEnvsLoaded} test environments loaded. Only one is allowed. Check the isTestEnv functions to make sure they check for globals that are specific only to their test environment`
    );
  }

  if (isDetoxTestEnv()) {
    return require("./detox/entry").test;
  }
  if (isPlaywrightTestEnv()) {
    return require("./playwright/entry").test;
  }

  throw new Error(
    "Unknown test environment. Check the isTestEnv functions to make sure they check for globals that are specific only to their test environment"
  );
})();
```

### Screen interfaces

Define your "agnostic" page objects as TypeScript interfaces. You should eventually have a page object model interface for each screen in your app, but for now we just have a login screen and a welcome screen.

```ts title="e2e/screens.ts"
export interface ILoginScreen {
  login(): Promise<void>;
}

export interface IWelcomeScreen {
  launch(): Promise<void>;
}

/** A fixture of all the page object models we can use in our tests */
export type Fixtures = {
  loadApp: () => Promise<void>;
  loginScreen: ILoginScreen;
  welcomeScreen: IWelcomeScreen;
  // ... you can add more as needed
};
```

### Detox Login Screen

Behold! An implementation! This is where we implement the actual logic of our page object model. Because we are in the detox directory and we are careful loading only one test environment at a time in our `e2e/entry.ts` file, we can import Detox specific code here.

```ts title="e2e/detox/screens/LoginScreen.ts"
import { expect, element, by } from "detox";
import type { ILoginScreen } from "../../screens";

export class DetoxLoginScreen implements ILoginScreen {
  async login() {
    await expect(element(by.text("Log In"))).toBeVisible();
    await element(by.text("Tap to log in!")).tap();
  }
}
```

### Detox Welcome Screen

Behold! Another implementation!

```ts title="e2e/detox/screens/WelcomeScreen.ts"
import { expect, element, by } from "detox";
import type { IWelcomeScreen } from "../../screens";

export class DetoxWelcomeScreen implements IWelcomeScreen {
  async launch() {
    await expect(
      element(by.text("Your app, almost ready for launch!"))
    ).toBeVisible();
    await element(by.text("Let's go!")).tap();
    await expect(
      element(by.text("Components to jump start your project!"))
    ).toBeVisible();
  }
}
```

### Detox Setup

This file handles launching the app differently based on your build configuration:

- For release builds: Simply launches the app normally
- For debug builds: Handles launching through Expo Dev Client and deep linking
  - For local development: Links to the local Metro bundler
  - For testing EAS updates: Links to the published update URL
  - Handles platform-specific launch requirements (iOS needs an extra step)

```ts title="e2e/detox/setup.ts"
import { device } from "detox";
import { resolveConfig } from "detox/internals";
import type { AppJSONConfig } from "@expo/config";
const appConfig: AppJSONConfig = require("../../app.json");

type Platform = ReturnType<typeof device.getPlatform>;

export async function detoxLoadApp() {
  const config = await resolveConfig();
  const platform = device.getPlatform();
  const isDebugConfig = config.configurationName.split(".").at(-1) === "debug";
  if (isDebugConfig) {
    return await openAppForDebugBuild(platform);
  } else {
    return await device.launchApp({
      newInstance: true,
    });
  }
}

async function openAppForDebugBuild(platform: Platform) {
  const deepLinkUrl = process.env.EXPO_USE_UPDATES
    ? // Testing latest published EAS update for the test_debug channel
      getDeepLinkUrl(getLatestUpdateUrl())
    : // Local testing with packager
      getDeepLinkUrl(getDevLauncherPackagerUrl(platform));

  if (platform === "ios") {
    await device.launchApp({
      newInstance: true,
    });
    await sleep(1000);
    await device.openURL({
      url: deepLinkUrl,
    });
  } else {
    await device.launchApp({
      newInstance: true,
      url: deepLinkUrl,
    });
  }

  await sleep(1000);
}

const getAppId = () => appConfig?.expo?.extra?.eas?.projectId ?? "";

const getAppSchema = () => appConfig?.expo?.scheme ?? "";

const getDeepLinkUrl = (url: string) =>
  `exp+${getAppSchema()}://expo-development-client/?url=${encodeURIComponent(
    url
  )}`;

const getDevLauncherPackagerUrl = (platform: Platform) =>
  `http://localhost:8081/index.bundle?platform=${platform}&dev=true&minify=false&disableOnboarding=1`;

const getLatestUpdateUrl = () =>
  `https://u.expo.dev/${getAppId()}?channel-name=test_debug&disableOnboarding=1`;

const sleep = (t: number) => new Promise((res) => setTimeout(res, t));
```

### Detox Test Entry

This is the magic for how to run the test files in Detox! We create a "fixture" of all the page objects that our tests can use and provides them to the test function. Since Detox uses Jest as the test runner, we want to use the global test function and then wrap it to provide the fixtures.

```ts title="e2e/detox/entry.ts"
import { DetoxWelcomeScreen } from "./screens/WelcomeScreen";
import { DetoxLoginScreen } from "./screens/LoginScreen";
import type { Fixtures } from "../screens";
import type { Test } from "../entry";
import { detoxLoadApp } from "./setup";

const fixtures: Fixtures = {
  loadApp: detoxLoadApp,
  loginScreen: new DetoxLoginScreen(),
  welcomeScreen: new DetoxWelcomeScreen(),
};

export const test: Test = (name, fn) =>
  globalThis.test(name, (done) => {
    fn(fixtures)
      .then(() => done())
      .catch(done.fail);
  });
```

### Playwright Login Screen

Our detox code is setup! If you like, you can skip to `Run Detox Tests` section to make sure your tests run and come back to Playwright later. But if you want to see how the other half lives, read on!

```ts title="e2e/playwright/screens/LoginScreen.ts"
import { expect, Page } from "@playwright/test";
import type { ILoginScreen } from "../../screens";

export class PlaywrightLoginScreen implements ILoginScreen {
  constructor(private page: Page) {}

  async login() {
    await expect(this.page.locator("[data-testid='login-heading']")).toHaveText(
      "Log In"
    );
    await this.page.locator("[data-testid='login-button']").click();
  }
}
```

### Playwright Welcome Screen

This is pretty similar to the Detox implementation, but we are using Playwright specific code.

:::tip

Pro-tip: if you use AI tool to help with coding, they are often pretty good at translating one page object implementation to another. `Please translate this Detox page object to Playwright` is a good prompt to start with.

:::

```ts title="e2e/playwright/screens/WelcomeScreen.ts"
import { expect, Page } from "@playwright/test";
import type { IWelcomeScreen } from "../../screens";

export class PlaywrightWelcomeScreen implements IWelcomeScreen {
  constructor(private page: Page) {}

  async launch() {
    await expect(
      this.page.getByText("Your app, almost ready for launch!")
    ).toBeVisible();
    await this.page.getByText("Let's go!").click();
    await expect(
      this.page.getByText("Components to jump start your project!")
    ).toBeVisible();
  }
}
```

### Playwright Test Entry

Now let's wrap it all together into a fixture! Playwright can do a **lot** with fixtures. You can [read more about it in their documentation](https://playwright.dev/docs/test-fixtures). But we are going to keep it pretty simple for now.

```ts title="e2e/playwright/entry.ts"
import { test as base } from "@playwright/test";
import { playwrightLoadApp } from "./setup";
import { PlaywrightLoginScreen } from "./screens/LoginScreen";
import { PlaywrightWelcomeScreen } from "./screens/WelcomeScreen";
import type { Fixtures } from "../screens";

export const test = base.extend<Fixtures>({
  loadApp: async ({ page }, use) => {
    await use(() => playwrightLoadApp(page));
  },
  loginScreen: async ({ page }, use) => {
    await use(new PlaywrightLoginScreen(page));
  },
  welcomeScreen: async ({ page }, use) => {
    await use(new PlaywrightWelcomeScreen(page));
  },
});
```

### Playwright Setup

Wow! This is easy. But it's pretty easy to navigate to a web page, so we don't need to do anything fancy here.

```ts title="e2e/playwright/setup.ts"
import type { Page } from "@playwright/test";

export async function playwrightLoadApp(page: Page) {
  await page.goto("http://localhost:3000");
}
```

## Run Detox Tests

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

:::note

If you have any issues, check [the environment setup](https://wix.github.io/Detox/docs/introduction/environment-setup) or the [How to Debug](https://wix.github.io/Detox/docs/introduction/debugging) articles in the Detox docs.

:::

## Run Playwright Tests

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

If you want to use a test runner with a nice UI, you can run:

```bash
yarn playwright:test --ui
```

:::note

If you have any issues, check the [Installation](https://playwright.dev/docs/intro) or [Running and debugging tests](https://playwright.dev/docs/test-intro) articles in the Playwright docs.

:::

## Gotchas to look out for

The `jest.config.js` for your unit tests may get a little eager and start running the tests in the `e2e` folder. You can add this to your `jest.config.js` to ignore the `e2e` folder:

```diff
 module.exports = {
   preset: "jest-expo",
   setupFiles: ["<rootDir>/test/setup.ts"],
+  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/e2e/"],
 }
```

As of writing this, `app/config/config.prod.ts` has a placeholder value. For the purposes of this recipe, you can copy the existing `app/config/config.dev.ts` file to `app/config/config.prod.ts` so that the app uses the right `API_URL` in your tests.

```diff
export default {
-  API_URL: "CHANGEME",
+  API_URL: "https://api.rss2json.com/v1/",
}
```

## That's it! Write more tests!

That wasn't so bad, was it? You now have an E2E test architecture that runs on iOS, Android, and Web! You can add more tests to the `e2e/tests` folder and more page object models to the `e2e/detox/screens` and `e2e/playwright/screens` folders.
