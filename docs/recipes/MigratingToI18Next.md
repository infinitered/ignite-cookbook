---
title: Migrating from i18n-js to react-i18next
description: How to migrate from i18n-js to react-i18next
tags:
  - i18n
last_update:
  author: Felipe Peña
publish_date: 2024-09-25
---

# Migrating from i18n-js to react-i18next within an Ignite

## Overview

In this guide, we will be going through the steps required to migrate your Ignite generated project from using `i18n-js` to the `react-i18next` library. It is meant specifically for projects generated with version 9 and below.

`i18next` will be included in Ignite's version 10. If you're using an earlier version, this guide provides the necessary steps to successfully complete the migration.

Finally, the steps outlined in this guide, are based on the changes outlined in the following two PRs:
*  [Swap out i18n-js for react-18next](https://github.com/infinitered/ignite/pull/2770)
* [Fix language switching and update date-fns to v4](https://github.com/infinitered/ignite/pull/2778)

## Step 1: Set up initialization logic in App.js

To ensure that `i18next` finishes initializing before your app proceeds, we recommend adding state and logic to the `App.js` entry file:

1. Create a state variable, `isI18nInitialized`, to track initialization status.
2. Use the `useEffect` hook to set the state when initialization completes.

```js
const [isI18nInitialized, setIsI18nInitialized] = useState(false);

useEffect(() => {
  initI18n().then(() => setIsI18nInitialized(true));
}, []);
```

This ensures that your app will wait until i18next is fully initialized before continuing, preventing any issues with missing translations.
