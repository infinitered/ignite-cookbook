---
title: TypeScript baseUrl Configuration
description: How to configure TypeScript's baseUrl module for rewriting relative imports
tags:
  - TypeScript
  - Babel
last_update:
  author: Frank Calise
publish_date: 2022-10-24
---

# TypeScript baseUrl Configuration

## Overview

Depending on your project structure, sometimes you'll end up with longer relative imports like this:

```tsx
import { Thing } from "../../../../../components/thing";
```

We can utilize TypeScript's `baseUrl` module to help resolve non-absolute module names. Doing so will allow us to change the above to:

```tsx
import { Thing } from "~/components/thing";
```

## Project Dependencies

```bash
yarn add -D babel-plugin-root-import
```

## TypeScript Configuration Changes

Open `tsconfig.json` and add the `baseUrl` and `path` properties:

```json
{
  // ...
  "baseUrl": "./",
  // the following assumes Ignite's app/ structure, however yours may differ
  "paths": { "~/*": ["app/*"] }
}
```

## Babel Configuration Changes

Open `babel.config.js` and add the following plugin array object:

```tsx
[
  "babel-plugin-root-import",
  {
    root: __dirname,
    rootPathPrefix: "~/",
    // mapping ~/ to the ./app directory (again, your app structure may differ here)
    rootPathSuffix: "app",
  },
],
```

## Taste Test in a Component!

Open up `./app/screens/DemoShowroomScreen.tsx` and let's update the relative imports from:

```tsx
import { ListItem, Screen, Text } from "../../components";
import { isRTL } from "../../i18n";
import { DemoTabScreenProps } from "../../navigators/DemoNavigator";
import { colors, spacing } from "../../theme";
```

to

```tsx
import { ListItem, Screen, Text } from "~/components";
import { isRTL } from "~/i18n";
import { DemoTabScreenProps } from "~/navigators/DemoNavigator";
import { colors, spacing } from "~/theme";
```

Fire up the app and make sure everything still works!

```bash
yarn expo:start
```

_Note: if you receive an error about not being able to resolve the components, you may have to clear your bundler cache via_

```bash
yarn expo:start --clear
```

## Resources

- [TypeScript baseUrl Documentation](https://www.typescriptlang.org/tsconfig#baseUrl)
