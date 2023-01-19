---
title: Accessiblity Font Sizes
description: Dealing With Accessibility Font Sizes in React Native
tags:
  - Accessibility
last_update:
  author: Mark Rickert
publish_date: 2022-10-09
---

# Dealing With Accessibility Font Sizes in React Native

Modern phones have a lot of accessibility options. Users can make the font size on Android GIGANTIC. This is a way you can allow users to scale their fonts larger and smaller, but only to a certain point. We wanted the accessibility but not the extreme ends of it, just to keep things readable without turning off font scaling completely.

```jsx
import * as React from "react";
import { View, TextProps, PixelRatio, AppState } from "react-native";
import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { StackNavigationOptions } from "@react-navigation/stack";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { Text } from "./Text";

// These constants determine mow much bigger the font size should get based on the user's
// accessibility settings. Even if they turn the dial all the way to 11, we will only ever
// scale the fonts by these factors. This is to prevent the font size from getting too large
// and completely breaking the layout.
const MAX_FONT_SCALE = 1.2;
const MIN_FONT_SCALE = 0.8;

// Returns fontScaling props for Text and TextInput components
// Usage:
// const fontProps = useFontScaling();
// return <Text {...fontProps}>Text Here</Text>;
export const useFontScaling = (): Partial<TextProps> => {
  // You probably want to get this value from your user's preferences
  const [allowFontScaling,] = React.useState(true);

  const fontScaling: Partial<TextProps> = React.useMemo(() => {
    return {
      minimumFontScale: allowFontScaling ? MIN_FONT_SCALE : 1, // This prevents the font from getting too small.
      maxFontSizeMultiplier: allowFontScaling ? MAX_FONT_SCALE : 1, // This prevents the font from getting too big.
      allowFontScaling, // This allows the font to be scaled or not.
    };
  }, [allowFontScaling]);

  return fontScaling;
};

// Returns fontScaling props for Navigator components
export const useNavigatorFontScalingScreenOptions =
  (): Partial<StackNavigationOptions> => {
    // You probably want to get this value from your user's preferences
    const [allowFontScaling,] = React.useState(true);

    const fontScaling: Partial<StackNavigationOptions> = React.useMemo(() => {
      return {
        headerBackAllowFontScaling: allowFontScaling,
        headerTitleAllowFontScaling: allowFontScaling,
      };
    }, [allowFontScaling]);

    return fontScaling;
  };

// Returns fontScaling props for Top Tab Navigator components
export const useTopTabNavigatorFontScalingScreenOptions =
  (): Partial<MaterialTopTabNavigationOptions> => {
    // You probably want to get this value from your user's preferences
    const [allowFontScaling,] = React.useState(true);

    const fontScaling: Partial<MaterialTopTabNavigationOptions> =
      React.useMemo(() => {
        return {
          tabBarAllowFontScaling: allowFontScaling,
        };
      }, [allowFontScaling]);

    return fontScaling;
  };

// Returns fontScaling props for Tab Navigator components
export const useTabNavigatorFontScalingScreenOptions =
  (): Partial<BottomTabNavigationOptions> => {
    // You probably want to get this value from your user's preferences
    const [allowFontScaling,] = React.useState(true);

    const fontScaling: Partial<BottomTabNavigationOptions> =
      React.useMemo(() => {
        return {
          tabBarAllowFontScaling: fontScaling,
          headerTitleAllowFontScaling: fontScaling,
        };
      }, [allowFontScaling]);

    return fontScaling;
  };

// Returns fontScaling props for Tab Navigator components
export const useDrawerNavigatorFontScalingScreenOptions =
  (): Partial<DrawerNavigationOptions> => {
    const [allowFontScaling,] = React.useState(true);

    const fontScaling: Partial<DrawerNavigationOptions> = React.useMemo(() => {
      return {
        drawerAllowFontScaling: allowFontScaling,
        headerTitleAllowFontScaling: allowFontScaling,
      };
    }, [allowFontScaling]);

    return fontScaling;
  };

// Use this handy __DEV__ mode only component to figure out what the font size is actually doing.
export const DevFontSize = () => {
  const [allowFontScaling,] = React.useState(true);
  const [appStateVisible, setAppStateVisible] = React.useState(
    AppState.currentState
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppStateVisible(nextAppState);
    });

    return () => subscription.remove();
  }, []);

  // This memo has to listen to appStateVisible even though it's not a direct dependency
  // so that we can reload the font size when the app switches back from user settings.
  const fontSize = React.useMemo(() => {
    if (allowFontScaling) {
      return Math.min(
        Math.max(PixelRatio.getFontScale(), MIN_FONT_SCALE),
        MAX_FONT_SCALE
      );
    } else {
      return 1.0;
    }
  }, [allowFontScaling, appStateVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return __DEV__ ? (
    <View style={{
      backgroundColor: '#E58F83',
      padding: 10,
      margin: 10,
      borderRadius: 5,
      borderColor: '#000,
      borderWidth: 1,
    }}>
      <Text>
        User Font Setting: {Math.trunc(PixelRatio.getFontScale() * 100) / 100}
      </Text>
      <Text>
        Currently limiting ratio to: {Math.trunc(fontSize * 100) / 100}
      </Text>
    </View>
  ) : null;
};
```
