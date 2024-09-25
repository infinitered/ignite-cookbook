---
title: Migrating from i18n-js to react-i18next
description: How to migrate from i18n-js to react-i18next
tags:
  - i18n
last_update:
  author: Felipe Peña
publish_date: 2024-09-25
---

# Migrating from i18n-js to react-i18next

## Overview

In this guide, we will be going through the steps required to migrate your project from `i18n-js` to the `react-i18next` library. The steps are based on the changes outlined in this [PR](https://github.com/infinitered/ignite/pull/2770).

`i18next` will be included in Ignite's version 10. If you're using an earlier version, this guide provides the necessary steps to successfully complete the migration.

## Key steps for migration

### Replace and install dependencies

Replace the `i18n-js` package with the required dependencies for `react-i18next`.

```bash
yarn remove i18n-js
yarn add react-i18next i18next
```

### Update translation initialization

Modify your translation initialization logic to use the `initReactI18next` from `i18next`.

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "welcome": "Welcome"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});
```

For more information on `i18next` itself and other init options, check their [Getting started](https://www.i18next.com/overview/getting-started) documentation.

### Refactor translation keys

Update all translation keys in your codebase from the `i18n-js` format to the new format used by `react-i18next`.

* Old format: `"common.ok"`
* New format: `"common:ok"`

### Replace translation calls

Refactor all instances of translation function calls from `i18n.t()` to `useTranslation` or the `t` function from `react-i18next`.

```javascript
// error-line-start
// Before
const okText = i18n.t('common.ok');
// error-line-end
// success-line-start
// After
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
const okText = t('common:ok');
// success-line-end
```

### Update tests

Ensure all unit tests reflect the changes made to the translation library. This may include modifying mock setups and expected outputs. For more information on testing with `i18next`, check their [documentation](https://react.i18next.com/misc/testing).

### Remove deprecated code

Clean up any references to `i18n-js` throughout your codebase and update documentation accordingly.

And that's it! For more details, refer to [PR #2770](https://github.com/infinitered/ignite/pull/2770) from Ingnite's framework code repository. Let us know if you have any questions.