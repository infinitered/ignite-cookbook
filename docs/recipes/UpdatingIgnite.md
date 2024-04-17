---
title: Updating Ignite boilerplate with ignite-diff-purge
tags:
  - Guide
  - Dependencies
last_update:
  author: David Leuliette
publish_date: 2023-01-17
---

Many React Native developers aks this question:

> How can I update my Ignite boilerplate with the latest changes from the Ignite boilerplate?

We follow the same technique as [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/), basically it's a [diff between 2 versions](https://github.com/react-native-community/rn-diff-purge) you can apply manually.

Thanks to Niclas Söderström, we can use the [ignite-diff-purge](https://github.com/nirre7/ignite-diff-purge) tool to update your Ignited app.

## Usage

1. Got to [`ignite-diff-purge` website](https://nirre7.github.io/ignite-diff-purge/)
2. Select the version you want to update from. Example from [8.8.4 to 9.0.0](https://github.com/nirre7/ignite-diff-purge/compare/release/8.8.4..release/9.0.0)
3. Work through the changes and apply them to your project
