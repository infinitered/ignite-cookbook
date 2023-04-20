---
title: Migrating to FlashList
description: How to migrate over to Shopify's FlashList in an Ignite project
tags:
  - Shopify
  - FlashList
last_update:
  author: Frank Calise
publish_date: 2022-10-13
---

# Migrating to FlashList

## Overview

[Shopify's FlashList](https://shopify.github.io/flash-list/) provides a drop-in replacement for React Native's FlatList component. It's an easy refactor and your lists will perform better within your app!

We'll start with the demo project provided by Ignite, so if you need a new one fire away with:

```nodejs
npx ignite-cli new PizzaApp --yes
cd PizzaApp
```

## Project Dependencies

Whether you're sticking with Expo or running with bare React Native workflow, our install steps are the same:

```nodejs
npx expo install @shopify/flash-list
```

_Note: No `pod install` was run here because the scripts set up in an Ignite project take care of that for you!_

## Code Changes

Open `DemoPodcastListScreen.tsx` and add the new import:

```tsx
import { FlashList } from "@shopify/flash-list";
```

Find the `FlatList` being used in the returned JSX and swap it out for `FlashList`

```tsx
return (
  <Screen
    preset="fixed"
    safeAreaEdges={["top"]}
    contentContainerStyle={$screenContentContainer}
  >
    // highlight-next-line
    <FlashList<Episode>
      data={episodeStore.episodesForList}
      extraData={episodeStore.favorites.length + episodeStore.episodes.length}
      contentContainerStyle={$flatListContentContainer}
      refreshing={refreshing}
      onRefresh={manualRefresh}
      // ...
    />
    // ...
  </Screen>
)
```

Run the app in the iOS simulator to test the changes, either `yarn expo:ios` or `yarn ios`. Navigate to the Podcast List screen:

1. Press "Tap to sign in!"
2. Press "Let's go!"
3. Tap on the "Podcast"

You'll get a warning out in the terminal, something similar to:

```console
 WARN  estimatedItemSize FlashList prop is not defined - based on current configuration you can set
 it to 184 to optimize list performance. Refer to FlashList documentation for more details.
```

Simply add that prop to the `FlashList` component with the suggested values:

```tsx
<FlashList<Episode>
 data={episodeStore.episodesForList}
 // highlight-next-line
 estimatedItemSize={184}
 // ...
/>
```

Reload the app and take note that the warning message has changed this time:

```console
 WARN  FlashList will ignore horizontal padding in case of vertical lists and vertical padding
 if the list is horizontal. If you need to have it apply relevant padding to your items instead.
```

This happens to be style related for the case of the demo screen, but let's solve it since you'll likely encounter something in your actual application. Update the styles near the bottom of the file:

```tsx
const $flatListContentContainer: ViewStyle = {
  // highlight-next-line
  // removed paddingHoriztonal here
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
};

// ...

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
  // updated style for our item as the library suggested
  marginHorizontal: spacing.large,
};
```

Now everything looks like it did before, while also gaining all of the performance boosts from FlashList! It's a pretty straight forward approach and Shopify has done a good job helping the developer along with the useful console warnings as a guide.
