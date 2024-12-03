---
title: Switch Between Expo Go and Expo CNG
description: Switch an Expo Go project to an Expo CNG project and visa versa
tags:
  - Expo
last_update:
  author: Justin Poliachik
publish_date: 2024-01-11
---

# Switch a Project Between Expo Go and Expo CNG

If you created an Ignite project using the Expo Go workflow and you need to transition to Expo CNG (Continuous Native Generation) or visa versa, this guide will teach you how to reconfigure your project.

## Expo Go -> Expo CNG

If you started with Expo Go but now need to add a library with native code, create your own custom native code, or modify native project configuration, you'll no longer be able to run your app inside Expo Go.

Thankfully, this is super easy thanks to [Expo's Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)!
We only need to slightly change how we build & run our app.

In `package.json`, modify scripts:

```diff
--"android": "npx expo start --android",
--"ios": "npx expo start --ios",
++"android": "npx expo run:android",
++"ios": "npx expo run:ios",
```

Expo handles the rest!

When you run `npm run ios` or `npm run android`, Expo will generate native projects and create `ios` and `android` directories, create a development build, and launch your standalone app. You are now successfully using Expo CNG!

To learn more, check out Expo's documentation on [adding custom native code](https://docs.expo.dev/workflow/customizing/).

## Expo CNG -> Expo Go

If you started with Expo CNG workflow, but your app isn't utilizing any custom native functionality and you want to use Expo Go for developing your app, follow these steps!

**Important Note**: To successfully run your app using Expo Go, your project must not contain _any_ custom native code, project configuration, or native libraries outside of the [Expo SDK](https://docs.expo.dev/versions/latest/). Your project also can't contain any `expo.plugins` inside your `app.json`. If your app contains native code, libraries, configuration, or plugins and you attempt to run inside Expo Go, expect your app to crash or not function properly.

### Steps

#### Update `package.json` scripts

```diff
--"android": "npx expo run:android",
--"ios": "npx expo run:ios",
++"android": "npx expo start --android",
++"ios": "npx expo start --ios",
```

#### Remove native directories

```bash
rm -rf android ios
```

#### Remove`react-native-mmkv` in favor of `@react-native-async-storage/async-storage`

1. Swap packages

```bash
yarn remove react-native-mmkv
npx expo install @react-native-async-storage/async-storage
```

2. Update the storage util in `app/utils/storage.ts`

#### Remove`react-native-keyboard-controller`

1. Remove the package

```bash
yarn remove react-native-keyboard-controller
```

2. Remove the `<KeyboardProvider>` in `app/app.tsx`

```diff
-import { KeyboardProvider } from "react-native-keyboard-controller"

// ...

return (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <ErrorBoundary catchErrors={Config.catchErrors}>
-      <KeyboardProvider>
        <AppNavigator
          linking={linking}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
-      </KeyboardProvider>
    </ErrorBoundary>
  </SafeAreaProvider>
)
```

3. Update `app/components/Screen.tsx`

<details>
  <summary>Screen.tsx (expand to copy)</summary>

```tsx title="/app/components/Screen.tsx"
import { useScrollToTop } from "@react-navigation/native";
import { StatusBar, StatusBarProps, StatusBarStyle } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { $styles } from "@/theme";
import { ExtendedEdge, useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle";
import { useAppTheme } from "@/utils/useAppTheme";

interface BaseScreenProps {
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Style for the outer content container useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Status bar setting. Defaults to dark.
   */
  statusBarStyle?: StatusBarStyle;
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  StatusBarProps?: StatusBarProps;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: "fixed";
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: "scroll";
  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: "handled" | "always" | "never";
  /**
   * Pass any additional props directly to the ScrollView component.
   */
  ScrollViewProps?: ScrollViewProps;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, "preset"> {
  preset?: "auto";
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps;

const isIos = Platform.OS === "ios";

type ScreenPreset = "fixed" | "scroll" | "auto";

/**
 * @param {ScreenPreset?} preset - The preset to check.
 * @returns {boolean} - Whether the preset is non-scrolling.
 */
function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === "fixed";
}

/**
 * Custom hook that handles the automatic enabling/disabling of scroll ability based on the content size and screen size.
 * @param {UseAutoPresetProps} props - The props for the `useAutoPreset` hook.
 * @returns {{boolean, Function, Function}} - The scroll state, and the `onContentSizeChange` and `onLayout` functions.
 */
function useAutoPreset(props: AutoScreenProps): {
  scrollEnabled: boolean;
  onContentSizeChange: (w: number, h: number) => void;
  onLayout: (e: LayoutChangeEvent) => void;
} {
  const { preset, scrollEnabledToggleThreshold } = props;
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = useRef<null | number>(null);
  const scrollViewContentHeight = useRef<null | number>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  function updateScrollState() {
    if (scrollViewHeight.current === null || scrollViewContentHeight.current === null) return;

    // check whether content fits the screen then toggle scroll state according to it
    const contentFitsScreen = (function () {
      if (point) {
        return scrollViewContentHeight.current < scrollViewHeight.current - point;
      } else {
        return scrollViewContentHeight.current < scrollViewHeight.current * percent;
      }
    })();

    // content is less than the size of the screen, so we can disable scrolling
    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);

    // content is greater than the size of the screen, so let's enable scrolling
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  }

  /**
   * @param {number} w - The width of the content.
   * @param {number} h - The height of the content.
   */
  function onContentSizeChange(w: number, h: number) {
    // update scroll-view content height
    scrollViewContentHeight.current = h;
    updateScrollState();
  }

  /**
   * @param {LayoutChangeEvent} e = The layout change event.
   */
  function onLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    // update scroll-view  height
    scrollViewHeight.current = height;
    updateScrollState();
  }

  // update scroll state on every render
  if (preset === "auto") updateScrollState();

  return {
    scrollEnabled: preset === "auto" ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
}

/**
 * @param {ScreenProps} props - The props for the `ScreenWithoutScrolling` component.
 * @returns {JSX.Element} - The rendered `ScreenWithoutScrolling` component.
 */
function ScreenWithoutScrolling(props: ScreenProps) {
  const { style, contentContainerStyle, children } = props;
  return (
    <View style={[$outerStyle, style]}>
      <View style={[$innerStyle, contentContainerStyle]}>{children}</View>
    </View>
  );
}

/**
 * @param {ScreenProps} props - The props for the `ScreenWithScrolling` component.
 * @returns {JSX.Element} - The rendered `ScreenWithScrolling` component.
 */
function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = "handled",
    contentContainerStyle,
    ScrollViewProps,
    style,
  } = props as ScrollScreenProps;

  const ref = useRef<ScrollView>(null);

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(props as AutoScreenProps);

  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
  useScrollToTop(ref);

  return (
    <ScrollView
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e);
        ScrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h);
        ScrollViewProps?.onContentSizeChange?.(w, h);
      }}
      style={[$outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

/**
 * Represents a screen component that provides a consistent layout and behavior for different screen presets.
 * The `Screen` component can be used with different presets such as "fixed", "scroll", or "auto".
 * It handles safe area insets, status bar settings, keyboard avoiding behavior, and scrollability based on the preset.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Screen/}
 * @param {ScreenProps} props - The props for the `Screen` component.
 * @returns {JSX.Element} The rendered `Screen` component.
 */
export function Screen(props: ScreenProps) {
  const {
    theme: { colors },
    themeContext,
  } = useAppTheme();
  const {
    backgroundColor,
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle,
  } = props;

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  return (
    <View
      style={[
        $containerStyle,
        { backgroundColor: backgroundColor || colors.background },
        $containerInsets,
      ]}
    >
      <StatusBar
        style={statusBarStyle || (themeContext === "dark" ? "light" : "dark")}
        {...StatusBarProps}
      />

      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[$styles.flex1, KeyboardAvoidingViewProps?.style]}
      >
        {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const $containerStyle: ViewStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
};

const $outerStyle: ViewStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
};

const $innerStyle: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "stretch",
};
```

</details>
<br />

#### Sync Expo packages to be compatible with Expo Go

Running `npx expo install --check` will check all of the expo packages in their SDK against the version of `expo` that is installed to ensure compatibility.

You can accept these changes or run `npx expo install --fix` to apply them directly without running the check.

#### Run the app!

That's it! You should be able to run `yarn start` and tap `i` or `a` in terminal to launch iOS or Android respectively in Expo Go.
