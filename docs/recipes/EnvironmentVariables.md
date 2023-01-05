---
title: Environment Variables
description: A universal way to set up environment variables for bare and Expo projects
tags:
  - Guide
  - Environment Variables
last_update:
  author: Frank Calise
---

# Environment Variables

## Setup

### Install

```bash
yarn add -D dotenv babel-plugin-inline-dotenv
```

### Configure

Add `inline-dotenv` to your `babel.config.js` or `.babelrc`, for example:

```javascript
// babel.config.js

const plugins = [
  [
    "@babel/plugin-proposal-decorators",
    {
      legacy: true,
    },
  ],
  ["@babel/plugin-proposal-optional-catch-binding"],
  "inline-dotenv",
  "react-native-reanimated/plugin", // NOTE: this must be last in the plugins
]

const expoConfig = {
  presets: ["babel-preset-expo"],
  env: {
    production: {},
  },
  plugins,
}
```

_Note: this configuration also works for a bare react-native app_

## Usage

Create a `.env` file in the root of your project

```bash
MY_VAR="MY_VALUE"
KEEP_IN_MIND="THESE ARE NOT SECURE"
```

You'll now have access to your values from the `.env` file

```javascript
console.log(process.env.MY_VAR)        // results in: MY_VALUE
console.log(process.env.KEEP_IN_MIND)  // results in: THESE ARE NOT SECURE
```

If making changes to the environment variables, you'll have to restart your metro server (and possibly clear cache)
