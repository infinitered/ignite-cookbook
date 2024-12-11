---
title: Setting up a Yarn monorepo with Ignite
description: How to set up a Yarn monorepo using Ignite and two extra shared utilities
tags:
  - Ignite
  - Monorepo
  - Yarn
last_update:
  author: Felipe Peña
publish_date: 2024-08-22
---

# Setting up a Yarn monorepo with Ignite

👋 Hello and welcome to this monorepo guide! We know setting up a project using a monorepo structure can be sometimes challenging, therefore we created this guide to lead you through process. We'll be focusing on [React Native](https://reactnative.dev/) projects using the [Ignite](https://github.com/infinitered/ignite) framework and the [Yarn](https://yarnpkg.com) tool.

This guide starts by setting up the monorepo structure, then create a React Native app using the Ignite CLI, to finally end up generating two shared utilities: a form-validator utility and a shared UI library, that we will be integrate into the app.

## Prerequisites

Before we begin, we want to ensure you have these standard tools installed on your machine:

- [Node.js](https://nodejs.org/en) (version 18 or later)
- [Yarn](https://yarnpkg.com) (version 3.8 or later)

Now, let’s dive into the specific use case this guide will address.

## Use case

In a monorepo setup with multiple applications, like a React Native mobile app and a React web app, can share common functionalities.

In this guide we will be focusing on that premise and creating/utilizing shared utilities within the monorepo. For instance, if you have several apps that need to share an ESLint configuration or UI components, you can create reusable packages that can be integrated across all your apps.


:::info

Wait! How do I even know if my project will benefit from a monorepo structure? No worries! We have more documentation on monorepo tools and whether you want to choose this way of organization. You can find it [here](/docs/recipes/MonoreposOverview).

:::

By centralizing these kind of utilities, you can reduce code duplication and simplify maintenance work, ensuring any updates or bug fixes are immediately available in all your apps within the monorepo.

**So in summary we’ll create a React Native app along with two shared packages: one for holding a common ESLint configuration and another for shared UI components, to finally integrate those back into the app.**

Let's begin!

## Step 1: Setting up the monorepo

First, read carefully what [Expo documentation on setting up monorepos](https://docs.expo.dev/guides/monorepos/) says.

After this step, you'll get a folder with a `packages/` and `apps/` directories and a `package.json` file with basic workspace configuration.

1. Initialize the monorepo:

```shell
mkdir monorepo-example
cd monorepo-example
yarn init -y
```

2. Configure workspaces in `package.json`:

```json
{
  "name": "monorepo-example",
  // error-line
  "packageManager": "yarn@3.8.4"
  // success-line-start
  "packageManager": "yarn@3.8.4",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
  // success-line-end
}
```

:::info

We recommend organizing your monorepo's folder structure in a way that best suits the needs of your project. While this guide suggests using `apps/` and `packages/`, you can rename or add directories like, for example, `services/` or `libs/` to fit your workflow.

The key here is to keep your monorepo clear and organized, ensuring that it’s easy to manage and navigate for you and your team 🤜🏻.

:::

3. Create directory structure:

```shell
mkdir apps packages
```

## Step 2: Create mobile app using Ignite

[Ignite](https://github.com/infinitered/ignite) is Infinite's Red battle-tested React Native boilerplate. We're proud to say we use it every time we start a new project.

In this step we'll take advantage of Ignite's CLI and create a React Native app within the monorepo.

1. Install the [Ignite CLI](https://www.npmjs.com/package/ignite-cli) (if you haven't already):

```shell
npx ignite-cli@latest
```

2. Generate a new app:
   Navigate to the `apps/` directory and run the following command to create a new app:

```shell
cd apps
npx ignite-cli new mobile
```

We recommend the following answers to the CLI prompts:

```
📝 Do you want to use Expo?: Expo - Recommended for almost all apps [Default]
📝 Which Expo workflow?: Expo Go - For simple apps that don't need custom native code [Default]
📝 Do you want to initialize a git repository?: No
📝 Remove demo code? We recommend leaving it in if it's your first time using Ignite: No
📝 Which package manager do you want to use?: yarn
📝 Do you want to install dependencies?: No
```

3. Open the `metro.config.js` file:

```shell
touch mobile/metro.config.js
```

4. In order to fit a monorepo structurem we need to adjust the Metro configuration. Let's do that by updating these lines in the `metro.config.js` file (this changes are taken from the [Expo guide](https://docs.expo.dev/guides/monorepos/)):

```js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// success-line-start
// Get monorepo root folder
const monorepoRoot = path.resolve(projectRoot, '../..');
// success-line-end

/** @type {import('expo/metro-config').MetroConfig} */
// error-line
const config = getDefaultConfig(__dirname);
// success-line
const config = getDefaultConfig(projectRoot);

config.transformer.getTransformOptions = async () => ({
  transform: {
    // Inline requires are very useful for deferring loading of large dependencies/components.
    // For example, we use it in app.tsx to conditionally load Reactotron.
    // However, this comes with some gotchas.
    // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
    // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
    inlineRequires: true,
  },
});

// success-line-start
// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
// success-line-end

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
config.resolver.sourceExts.push("cjs")

module.exports = config;
```

Awesome! We have our mobile app created ⭐️.

## Step 3: Install dependencies

Let's make sure all of our dependencies are installed for the mobile app.

1. Run `yarn` at the root of the project:

```shell
cd ..
yarn install
```

## Step 4: Add a shared ESLint configuration with TypeScript

Maintaining consistent code quality across TypeScript and JavaScript projects within a monorepo is crucial for a project's long-term success.

**A good first step we recommend is to share a single ESLint configuration file between apps to ensure consistency and streamline the development process.**

Let's create a shared utility for that purpose.

1. Create a shared ESLint configuration package:

Inside your monorepo, create a new package for your shared ESLint configuration.

```shell
mkdir packages/eslint-config
cd packages/eslint-config
```

2. Initialize the package:

Initialize the package with a `package.json` file.

```shell
yarn init -y
```

3. Install ESLint and TypeScript dependencies:

Install ESLint, TypeScript, and any shared plugins or configurations that you want to use across the apps. We recommend the follow:

```shell
yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-native eslint-plugin-reactotron eslint-config-standard eslint-config-prettier --dev
```

4. Create the `tsconfig.json` file:

`packages/eslint-config/tsconfig.json`

```json
// success-line-start
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "lib": ["es6", "dom"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
 }
 // success-line-end
 ```

5. Create the shared ESLint configuration file:

Create an `index.ts` file in the root of your `eslint-config` package.

For this guide we will reuse Ignite’s boilerplate ESLint configuration and then replace the original configuration with it.

`packages/eslint-config/index.ts`

```typescript
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "standard",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-native",
    "reactotron",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  globals: {
    __DEV__: false,
    jasmine: false,
    beforeAll: false,
    afterAll: false,
    beforeEach: false,
    afterEach: false,
    test: false,
    expect: false,
    describe: false,
    jest: false,
    it: false,
  },
  rules: {
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "comma-dangle": 0,
    "multiline-ternary": 0,
    "no-undef": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 0,
    "no-global-assign": 0,
    "quotes": 0,
    "react-native/no-raw-text": 0,
    "react/no-unescaped-entities": 0,
    "react/prop-types": 0,
    "space-before-function-paren": 0,
    "reactotron/no-tron-in-production": "error",
  },
}
// success-line-end
```

This configuration (originally sourced from [Ignite](https://github.com/infinitered/ignite)) will provide a strong foundation for TypeScript, React and React Native projects. You can always refine the rules later to align with the specific requirements of your project.

5. Compile the TypeScript configuration:

```shell
npx tsc
```

This will generate a `index.js` file from your `index.ts` file.

## Step 6: Use the shared ESLint configuration in the mobile app

Now we'll use the utility we just made and add it to the React Native app. Let’s get started!

1. Navigate to the mobile app:

```shell
cd ..
cd ..
cd apps/mobile
```

2. Add the ESLint shared package to the `package.json` file:

`apps/mobile/package.json`

```json
"eslint": "8.17.0",
// success-line
 "eslint-config": "workspace:^",
 "eslint-config-prettier": "8.5.0",
```

:::info

This guide mainly focuses on a private monorepo, but let’s also talk about publishing packages publicly. If your monorepo includes packages meant for public release, avoid using `workspace:^` for dependencies. Instead, set specific package versions to make sure everything works as expected. To handle versioning and publishing for multiple packages, we recommend trying out [changesets](https://github.com/changesets/changesets) — it makes the process much easier!

:::

3. Replace the shared ESLint configuration in `package.json`:

`apps/mobile/package.json`

```json
// error-line-start
"eslintConfig": {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "extends": [
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-native/all",
      "standard",
      "prettier"
    ],
    "plugins": [
      "@typescript-eslint",
      "react",
      "react-native",
      "reactotron"
    ],
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "settings": {
      "react": {
        "pragma": "React",
        "version": "detect"
      }
    },
    "globals": {
      "__DEV__": false,
      "jasmine": false,
      "beforeAll": false,
      "afterAll": false,
      "beforeEach": false,
      "afterEach": false,
      "test": false,
      "expect": false,
      "describe": false,
      "jest": false,
      "it": false
    },
    "rules": {
      "@typescript-eslint/ban-ts-ignore": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/explicit-member-accessibility": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/indent": 0,
      "@typescript-eslint/member-delimiter-style": 0,
      "@typescript-eslint/no-empty-interface": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-object-literal-type-assertion": 0,
      "@typescript-eslint/no-var-requires": 0,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "comma-dangle": 0,
      "multiline-ternary": 0,
      "no-undef": 0,
      "no-unused-vars": 0,
      "no-use-before-define": 0,
      "no-global-assign": 0,
      "quotes": 0,
      "react-native/no-raw-text": 0,
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "space-before-function-paren": 0,
      "reactotron/no-tron-in-production": "error"
    }
  }
// error-line-end
// success-line-start
"eslintConfig": {
  extends: ["@monorepo-example/eslint-config"],
}
// success-line-end
```

:::warning

In this guide, we use `@monorepo-example` as the placeholder name for the monorepo. Be sure to replace it with your actual monorepo name if it’s different.

:::

By completing this step, you now have an app (and maybe more in the future) that benefits from a shared ESLint configuration. Great work!

## Step 7: Create a shared UI components package

Now that we are familiarized with the creation of shared package, let's go ahead and create another one.

As we mentioned earlier, a common need in projects is sharing UI components across multiple apps. In this step, we’ll create a shared UI package featuring a Badge component. A Badge is a simple yet versatile element often used to show small pieces of information, like notifications, statuses, or labels.

1. Navigate to the packages folder:

```shell
cd ..
cd ..
cd packages
```

2. Create the package directory:

```shell
mkdir ui-components
cd ui-components
```

3. Initialize the package:

Initialize the package with a `package.json` file.

```shell
yarn init -y
```

4. Install dependencies:

Install any necessary dependencies, such as React, React Native, and TypeScript, which will be used across both platforms.

```shell
yarn add react react-native typescript --peer
yarn add @types/react @types/react-native --dev
```

4. Create the `tsconfig.json` file:

`packages/ui-components/tsconfig.json`

```json
// success-line-start
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es2017"],
    "module": "commonjs",
    "jsx": "react",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
 // success-line-end
 ```

5.  Now let's create the badge component:

Inside the `packages/ui-components` directory, create a `src` folder and add your Badge component.

```shell
mkdir src
touch src/Badge.tsx
```

6. Build the badge component:

`packages/ui-component/src/Badge.tsx`

```tsx
// success-line-start
import React, { FC } from "react"
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"

interface BadgeProps {
  label: string
  color?: string
  backgroundColor?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Badge: FC<BadgeProps> = ({ label, color = "white", backgroundColor = "red", style, textStyle }) => {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color }, textStyle]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  } satisfies ViewStyle,
  text: {
    fontSize: 12,
    fontWeight: "bold",
  } satisfies TextStyle,
})
// success-line-end
```

A `Badge` component, as defined above, is a simple UI element designed to display a label with customizable colors. This makes it versatile and useful in various parts of your app, like showing notification counts, statuses, or category labels.

7. Export the badge component:

Ensure that your component is exported in the package's main entry file.

`packages/ui-component/src/index.ts`

```ts
// success-line-start
export * from "./Badge"
// success-line-end
```

8. Compile the package:

Compile your TypeScript code to ensure it's ready for consumption by other packages.

```shell
npx tsc
```

Awesome! We have now a second package within our monorepo, and a UI component we can share across apps. Let's go ahead

## Step 8: Use the shared UI package in the mobile app

To finish integrating our shared UI package, we also need to include it in the mobile app.

1. Navigate now to the mobile app:

```shell
cd ..
cd ..
cd apps/mobile
```

2. Add the shared UI package to the `package.json` file:

`apps/mobile/package.json`

```json
    "react-native-screens": "3.31.1",
    // error-line
    "react-native-web": "~0.19.6"
    // success-line-start
    "react-native-web": "~0.19.6",
    "ui-components": "workspace:^"
    // success-line-end
  },
```

3. Add the Badge component to the UI

Now, let’s add the `Badge` component to the app! For this example, we’ll place it on the login screen—right below the heading and above the form fields—to show the number of login attempts if they go over a certain limit.

`apps/mobile/apps/screens/LoginScreen.tsx`

```tsx
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
// success-line
import { Badge } from "ui-components"

...

<Text testID="login-heading" tx="loginScreen.logIn" preset="heading" style={themed($logIn)} />
// success-line-start
{attemptsCount > 0 && (
  <Badge
    label={`Attempt ${attemptsCount}`}
    backgroundColor={attemptsCount > 2 ? "red" : "blue"}
  />
)}
// success-line-end
```

Great work! Now the mobile app is using the `Badge` component from the shared UI library.

## Step 9: Run mobile app to make sure logic was added

Alright, we’re almost done! The final step is to make sure everything is set up correctly. Let’s do this by running the mobile app.

1. Navigate to the root of the project:

```shell
cd ..
cd ..
```

2. Make sure dependencies are installed:

```shell
yarn
```

3. Run the React Native app (make sure you have your [environment setup](https://reactnative.dev/docs/set-up-your-environment)):

For iOS:

```shell
cd apps/mobile
yarn ios
```

For Android:

```shell
cd apps/mobile
yarn android
```

You should now see the login screen with a `Badge` displayed between the heading and the form fields. Amazing! 🎉

## Step 10: Add Yarn global scripts (optional)

Just when we thought we were done! If you're still with us, here's an extra step that can make your workflow even smoother.

One of the great features of Yarn Workspaces is the ability to define and run scripts globally across all packages in your monorepo. This means you can handle tasks like testing, building, or linting right from the root of your project—no need to dive into individual packages.

In this optional section, we’ll show you how to set up and use global scripts with Yarn. To start, let's add a global script for the mobile app to run both iOS and Android projects.


1. Add a global script to the mobile app `package.json` file:

`apps/mobile/package.json`

```json
  "scripts": {
    ...
    "serve:web": "npx server dist",
    // error-line
    "prebuild:clean": "npx expo prebuild --clean"
    // success-line-start
    "prebuild:clean": "npx expo prebuild --clean",
    "mobile:ios" : "yarn workspace mobile ios",
    "mobile:android" : "yarn workspace mobile android"
    // success-line-end
  },
```

Even though this script is locally defined within the app's `package.json` file, it will available everywhere within the monorepo by running `yarn mobile:ios` or `yarn mobile:android`. Very neat!

:::info
For more information on Yarn's global scripts, check [this link](https://yarnpkg.com/features/workspaces#global-scripts).
:::

## Conclusion

🎉 Congratulations on reaching the end of this guide! You’ve set up a powerful monorepo with shared utilities, learned how to integrate them into a React Native app created using [Ignite](https://github.com/infinitered/ignite), and even explored optional enhancements to streamline your workflow.

We hope this guide has been helpful and gives you more confidence when working with a monorepo setup!

For more information, you can check the following resources:
* [Choosing the right monorepo strategy for your project](/docs/MonoreposOverview.md)
* [Expo: Work with monorepos](https://docs.expo.dev/guides/monorepos/)