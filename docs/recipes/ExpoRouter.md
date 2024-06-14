---
title: Expo Router
description: How to convert Ignite v9 demo app to utilize `expo-router`
tags:
  - Expo
  - expo-router
  - react-navigation
last_update:
  author: Frank Calise & Justin Poliachik
publish_date: 2024-01-25
---

# Expo Router

## Overview

Expo Router brings file-based routing to React Native and web applications allowing you to easily create universal apps. Whenever a file is added to your `src/app` directory, a new path is automatically added to your navigation.

For the full documentation by [Expo](https://expo.dev), head on over to the [Introduction to Expo Router](https://docs.expo.dev/routing/introduction/).

Ignite v9 is fully equipped to utilize `expo-router` after dependency installation and some directory structure updates! In this recipe, we'll convert the demo app's auth and tab navigators from `react-navigation` to use `expo-router`.

:::tip

This recipe is using Expo Router v3, which became available in Expo SDK 50. If you're using an older version of Expo, you can find more information about implementing it in your app in the [Expo Router documentation](https://docs.expo.dev/router/installation/).

:::

## Installation and Project Configuration

Bootstrap a new Ignite project:

```bash
npx ignite-cli@next new pizza-router --yes
cd pizza-router
```

Add the missing dependencies `expo-router` needs:

```bash
npx expo install expo-router expo-constants
```

Add `expo-router` to `app.json` plugins list if necessary:

```json
"plugins": [
   ...
  "expo-font",
  // success-line
  "expo-router"
],
```

Change the entry point that `expo-router` expects in `package.json`:

```json
// error-line
"main": "node_modules/expo/AppEntry.js",
// success-line
"main": "expo-router/entry",
```

`expo-router` has great [TypeScript support](https://docs.expo.dev/router/reference/typed-routes/), so let's enable that in `app.json` under `experiments`.

```json
{
  "expo": {
    "experiments": {
      "tsconfigPaths": true,
      // success-line
      "typedRoutes": true
    }
  }
}
```

## Reworking the Directory Structure

Expo Router requires route files to live in either `app` or `src/app` directories. But since our Ignite project is already using `app`, we'll need to rename it to `src`. We'll create `src/app` to contain all the file-base routing files from here on out, and models, components and other shared files will be located in the `src` directory now. We'll also remove `App.tsx` as this is no longer the entry point of the application.

```bash
rm App.tsx
mv app src
mkdir src/app
```

Let's update the TS alias and include paths over in `tsconfig.json`

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      // error-line
      "app/*": ["./app/*"],
      // success-line
      "src/*": ["./src/*"],
      // ...
    },
  }
  // error-line-start
   "include": [
    "index.js",
    "App.tsx",
    "app",
    "types",
    "plugins",
    "app.config.ts",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  // error-line-end
  // success-line
  "include": ["**/*.ts", "**/*.tsx"],
  // ...
}
```

### Fix Imports

We also need to fix up a few imports to use `src/` instead of `app/`.
Ignite's Demo App only contains a few files we need to update, but an existing app could contain more.

**`package.json`**

```json
// error-line-start
"format": "prettier --write \"app/**/*.{js,jsx,json,md,ts,tsx}\"",
"lint": "eslint App.tsx app test --fix --ext .js,.ts,.tsx && npm run format",
// error-line-end
// success-line-start
"format": "prettier --write \"src/**/*.{js,jsx,json,md,ts,tsx}\"",
"lint": "eslint src test --fix --ext .js,.ts,.tsx && npm run format",
// success-line-end
```

**`src/devtools/ReactotronConfig.ts`**

```ts
// error-line-start
import { clear } from "app/utils/storage";
import { goBack, resetRoot, navigate } from "app/navigators/navigationUtilities";
// error-line-end
// success-line-start
import { clear } from "src/utils/storage";
import { goBack, resetRoot, navigate } from "src/navigators/navigationUtilities";
// success-line-end
```

**`src/components/ListView.ts`**

```ts
// error-line
import { isRTL } from "app/i18n";
// success-line
import { isRTL } from "src/i18n";
```

**`src/components/Toggle.ts`**

```ts
// error-line
import { isRTL } from "app/i18n";
// success-line
import { isRTL } from "src/i18n";
```


<details>
  <summary>(optional) Additional files to update</summary>

**`test/i18n.test.ts`**

```ts
// error-line
import en from "../app/i18n/en";
// success-line
import en from "../src/i18n/en";
import { exec } from "child_process";
```

**`ignite/templates/component/NAME.tsx.ejs`**

```js
---
patch:
  // error-line
  path: "app/components/index.ts"
  // success-line
  path: "src/components/index.ts"
  append: "export * from \"./<%= props.subdirectory %><%= props.pascalCaseName %>\"\n"
  skip: <%= props.skipIndexFile %>
---
import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
// error-line-start
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
// error-line-end
// success-line-start
import { colors, typography } from "src/theme"
import { Text } from "src/components/Text"
// success-line-end
```

**`ignite/templates/model/NAME.tsx.ejs`**

```js
---
patches:
// error-line
- path: "app/models/RootStore.ts"
// success-line
- path: "src/models/RootStore.ts"
  after: "from \"mobx-state-tree\"\n"
  insert: "import { <%= props.pascalCaseName %>Model } from \"./<%= props.pascalCaseName %>\"\n"
  skip: <%= !props.pascalCaseName.endsWith('Store') %>
// error-line
- path: "app/models/RootStore.ts"
// success-line
- path: "src/models/RootStore.ts"
  after: "types.model(\"RootStore\").props({\n"
  insert: "  <%= props.camelCaseName %>: types.optional(<%= props.pascalCaseName %>Model, {} as any),\n"
  skip: <%= !props.pascalCaseName.endsWith('Store') %>
// error-line
- path: "app/models/index.ts"
// success-line
- path: "src/models/index.ts"

```

</details>

## Creating File-based Routes

### src/app/\_layout.tsx

We're now ready to start setting up navigation for the app! If you're familiar with Ignite, `app.tsx` is where our root navigator lives, however, with `expo-router`, we'll use `src/app/_layout.tsx` for that. We'll add the providers here that any route would need within the app.

```tsx
// app/_layout.tsx
import React from "react";
import { ViewStyle } from "react-native"
import { Slot, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useInitialRootStore } from "src/models";

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts");
}

export { ErrorBoundary } from "src/components/ErrorBoundary/ErrorBoundary";

export default function Root() {
  // Wait for stores to load and render our layout inside of it so we have access
  // to auth info etc
  const { rehydrated } = useInitialRootStore();
  if (!rehydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={$root}>
        <Slot />
    </GestureHandlerRootView>
  )
}

const $root: ViewStyle = { flex: 1 }
```

Move `ErrorBoundary` out of `screens/ErrorScreen` and into `src/components/ErrorBoundary`:

```bash
mkdir src/components/ErrorBoundary
mv src/screens/ErrorScreen/* src/components/ErrorBoundary
```

For starters, this sets up our error boundary for the app and handles waiting on our stores to rehydrate. `<Slot />` comes from `expo-router`, you can think of it like the `children` prop in `React`. This component can be wrapped with others to help create a layout.

Next, we'll convert the conditional part of authentication from `react-navigation` to `expo-router`, deciding on whether or not to display the login form or get to the welcome screen experience.

### src/app/(app)/\_layout.tsx

Create another `_layout.tsx` but this time inside of a new directory, `src/app/(app)`. This route wrapped in parentheses is called a [Group](https://docs.expo.dev/routing/layouts/#groups). Groups can be used to add layouts and/or help organize sections of the app without adding additional segments to the URL. Remember, each directory is a route in this new mental model of file-based routing - but sometimes we don't want that, that's when you'll call upon groups.

In this layout is where we'll determine if the user is authenticated by checking our MST store. We'll also wait here while assets are loaded and then hide the splash screen when finished.

```tsx
import React from "react";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { observer } from "mobx-react-lite";
import { useStores } from "src/models";
import { useFonts } from "expo-font";
import { customFontsToLoad } from "src/theme";

export default observer(function Layout() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores();

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/log-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
});
```

As you can see, if the user is not authenticated we redirect them to the `/log-in` route, otherwise we'll render a stack navigator. TypeScript is probably telling us that route doesn't exist yet, so let's fix that.

### src/app/log-in.tsx

To redirect the user to the login form, create `src/app/log-in.tsx`. We'll copy over the contents from the original boilerplate `src/screens/LoginScreen.tsx` to help the UI layout of this page.

<details>
  <summary>src/app/log-in.tsx</summary>

```tsx
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TextStyle, ViewStyle } from "react-native";
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "src/components";
import { useStores } from "src/models";
import { colors, spacing } from "src/theme";

export default observer(function Login(_props) {
  const authPasswordInput = useRef<TextInput>(null);

  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores();

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red");
    setAuthPassword("ign1teIsAwes0m3");

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("");
      setAuthEmail("");
    };
  }, []);

  const error = isSubmitted ? validationError : "";

  function login() {
    setIsSubmitted(true);
    setAttemptsCount(attemptsCount + 1);

    if (validationError) return;

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false);
    setAuthPassword("");
    setAuthEmail("");

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()));

    // navigate to the main screen
    router.replace("/");
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        );
      },
    [isAuthPasswordHidden]
  );

  return (
    <Screen preset="auto" contentContainerStyle={$screenContentContainer} safeAreaEdges={["top", "bottom"]}>
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button testID="login-button" tx="loginScreen.tapToSignIn" style={$tapButton} preset="reversed" onPress={login} />
    </Screen>
  );
});

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
};

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
};

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
};
```

</details>

If you're familiar with the Ignite boilerplate, this is the same authentication screen you are used to - the only difference here is some of the imports now from from `src/*` rather than the relative paths. So keep that in mind if you're upgrading an existing application.

### src/app/(app)/index.tsx

If the user is successfully authenticated, we'll show them the welcome screen. Can you guess what the route will be by looking at the directory structure?

Just the root route! Think about it in terms of web URLs, if arriving at `http://localhost:8081/` (in this case of local development), we'd expect to see the welcome screen. However, if we're not authenticated, we'll be redirected to `/log-in` to ask the user to log in.

This JSX will be the same exact contents from `WelcomeScreen.tsx` in the original Ignite boilerplate with the exception of some import paths (using the TS aliases) and a simple update to `goNext`.

Since we'll no longer use the `navigation` prop, we utilize `expo-router`'s [Imperative navigation](https://docs.expo.dev/routing/navigating-pages/#imperative-navigation) to navigate to the component demo Showroom next. We're using `.replace` since we don't need to get back to this route. You can read more about [Navigating between pages](https://docs.expo.dev/routing/navigating-pages/) at Expo's documentation.

<details>
  <summary>src/app/(app)/index.tsx</summary>

```tsx
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";
import { Button, Text } from "src/components";
import { isRTL } from "src/i18n";
import { useStores } from "src/models";
import { colors, spacing } from "src/theme";
import { useHeader } from "src/utils/useHeader";
import { useSafeAreaInsetsStyle } from "src/utils/useSafeAreaInsetsStyle";

const welcomeLogo = require("assets/images/logo.png");
const welcomeFace = require("assets/images/welcome-face.png");

export default observer(function WelcomeScreen() {
  const {
    authenticationStore: { logout },
  } = useStores();

  function goNext() {
    router.replace("/showroom");
  }

  useHeader(
    {
      rightTx: "common.logOut",
      onRightPress: logout,
    },
    [logout]
  );

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"]);

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text testID="welcome-heading" style={$welcomeHeading} tx="welcomeScreen.readyForLaunch" preset="heading" />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text tx="welcomeScreen.postscript" size="md" />
        <Button testID="next-screen-button" preset="reversed" tx="welcomeScreen.letsGo" onPress={goNext} />
      </View>
    </View>
  );
});

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
};

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
};

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
};
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
};

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
};

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
};
```

</details>

### Checkpoint

Build and run your app using `yarn run ios`. You should see the log-in route, be able to authenticate, and navigate to the main "welcome" screen. But we aren't done yet - we still need to add the remaining screens in a Tab Navigator.

## Adding Tab Navigation

First, we'll create another route group to help contain where these routes live and set the layout for the tabs.

Create `src/app/(app)/(tabs)/_layout.tsx` and we'll convert Ignite's previous `app/navigators/DemoNavigator.tsx` to live here.

<details>
  <summary>src/app/(app)/(tabs)/_layout.tsx</summary>

```tsx
import React from "react";
import { Tabs } from "expo-router/tabs";
import { observer } from "mobx-react-lite";
import { Icon } from "src/components";
import { translate } from "src/i18n";
import { colors, spacing, typography } from "src/theme";
import { TextStyle, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default observer(function Layout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tabs.Screen
        name="showroom"
        options={{
          href: "/showroom",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.componentsTab"),
          tabBarIcon: ({ focused }) => <Icon icon="components" color={focused ? colors.tint : undefined} size={30} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: "/community",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.communityTab"),
          tabBarIcon: ({ focused }) => <Icon icon="community" color={focused ? colors.tint : undefined} size={30} />,
        }}
      />
      <Tabs.Screen
        name="podcasts"
        options={{
          href: "/podcasts",
          headerShown: false,
          tabBarAccessibilityLabel: translate("demoNavigator.podcastListTab"),
          tabBarLabel: translate("demoNavigator.podcastListTab"),
          tabBarIcon: ({ focused }) => <Icon icon="podcast" color={focused ? colors.tint : undefined} size={30} />,
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          href: "/debug",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.debugTab"),
          tabBarIcon: ({ focused }) => <Icon icon="debug" color={focused ? colors.tint : undefined} size={30} />,
        }}
      />
    </Tabs>
  );
});

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
};

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
};

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
};
```

</details>

### Creating Tab Screens

Now to create screens for each tabs, you simply just add `[screen].tsx` under the `(tabs)` group. Let's bring over the 3 simpler screens first - Community, Podcasts and Debug. Those will mostly be copy 🍝 aside from changing the exports to default and import from our TS paths.

<details>
  <summary>src/app/(app)/(tabs)/community.tsx</summary>

```tsx
import React from "react";
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";
import { ListItem, Screen, Text } from "src/components";
import { spacing } from "src/theme";
import { openLinkInBrowser } from "src/utils/openLinkInBrowser";
import { isRTL } from "src/i18n";

const chainReactLogo = require("assets/images/demo/cr-logo.png");
const reactNativeLiveLogo = require("assets/images/demo/rnl-logo.png");
const reactNativeRadioLogo = require("assets/images/demo/rnr-logo.png");
const reactNativeNewsletterLogo = require("assets/images/demo/rnn-logo.png");

export default function DemoCommunityScreen() {
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="demoCommunityScreen.title" style={$title} />
      <Text tx="demoCommunityScreen.tagLine" style={$tagline} />

      <Text preset="subheading" tx="demoCommunityScreen.joinUsOnSlackTitle" />
      <Text tx="demoCommunityScreen.joinUsOnSlack" style={$description} />
      <ListItem
        tx="demoCommunityScreen.joinSlackLink"
        leftIcon="slack"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://community.infinite.red/")}
      />
      <Text preset="subheading" tx="demoCommunityScreen.makeIgniteEvenBetterTitle" style={$sectionTitle} />
      <Text tx="demoCommunityScreen.makeIgniteEvenBetter" style={$description} />
      <ListItem
        tx="demoCommunityScreen.contributeToIgniteLink"
        leftIcon="github"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite")}
      />

      <Text preset="subheading" tx="demoCommunityScreen.theLatestInReactNativeTitle" style={$sectionTitle} />
      <Text tx="demoCommunityScreen.theLatestInReactNative" style={$description} />
      <ListItem
        tx="demoCommunityScreen.reactNativeRadioLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeRadioLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativeradio.com/")}
      />
      <ListItem
        tx="demoCommunityScreen.reactNativeNewsletterLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeNewsletterLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativenewsletter.com/")}
      />
      <ListItem
        tx="demoCommunityScreen.reactNativeLiveLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeLiveLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://rn.live/")}
      />
      <ListItem
        tx="demoCommunityScreen.chainReactConferenceLink"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={chainReactLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://cr.infinite.red/")}
      />
      <Text preset="subheading" tx="demoCommunityScreen.hireUsTitle" style={$sectionTitle} />
      <Text tx="demoCommunityScreen.hireUs" style={$description} />
      <ListItem
        tx="demoCommunityScreen.hireUsLink"
        leftIcon="clap"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://infinite.red/contact")}
      />
    </Screen>
  );
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
};

const $title: TextStyle = {
  marginBottom: spacing.sm,
};

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
};

const $description: TextStyle = {
  marginBottom: spacing.lg,
};

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
};

const $logoContainer: ViewStyle = {
  marginEnd: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
};

const $logo: ImageStyle = {
  height: 38,
  width: 38,
};
```

</details>

<details>
  <summary>src/app/(app)/(tabs)/podcasts.tsx</summary>

```tsx
import { observer } from "mobx-react-lite";
import React, { ComponentType, useEffect, useMemo } from "react";
import {
  AccessibilityProps,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { type ContentStyle } from "@shopify/flash-list";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Button, ButtonAccessoryProps, Card, EmptyState, Icon, ListView, Screen, Text, Toggle } from "src/components";
import { isRTL, translate } from "src/i18n";
import { useStores } from "src/models";
import { Episode } from "src/models/Episode";
import { colors, spacing } from "src/theme";
import { delay } from "src/utils/delay";
import { openLinkInBrowser } from "src/utils/openLinkInBrowser";

const ICON_SIZE = 14;

const rnrImage1 = require("assets/images/demo/rnr-image-1.png");
const rnrImage2 = require("assets/images/demo/rnr-image-2.png");
const rnrImage3 = require("assets/images/demo/rnr-image-3.png");
const rnrImages = [rnrImage1, rnrImage2, rnrImage3];

export default observer(function DemoPodcastListScreen(_props) {
  const { episodeStore } = useStores();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    (async function load() {
      setIsLoading(true);
      await episodeStore.fetchEpisodes();
      setIsLoading(false);
    })();
  }, [episodeStore]);

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true);
    await Promise.all([episodeStore.fetchEpisodes(), delay(750)]);
    setRefreshing(false);
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <ListView<Episode>
        contentContainerStyle={$listContentContainer}
        data={episodeStore.episodesForList.slice()}
        extraData={episodeStore.favorites.length + episodeStore.episodes.length}
        refreshing={refreshing}
        estimatedItemSize={177}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={episodeStore.favoritesOnly ? "demoPodcastListScreen.noFavoritesEmptyState.heading" : undefined}
              contentTx={episodeStore.favoritesOnly ? "demoPodcastListScreen.noFavoritesEmptyState.content" : undefined}
              button={episodeStore.favoritesOnly ? "" : undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="demoPodcastListScreen.title" />
            {(episodeStore.favoritesOnly || episodeStore.episodesForList.length > 0) && (
              <View style={$toggle}>
                <Toggle
                  value={episodeStore.favoritesOnly}
                  onValueChange={() => episodeStore.setProp("favoritesOnly", !episodeStore.favoritesOnly)}
                  variant="switch"
                  labelTx="demoPodcastListScreen.onlyFavorites"
                  labelPosition="left"
                  labelStyle={$labelStyle}
                  accessibilityLabel={translate("demoPodcastListScreen.accessibility.switch")}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <EpisodeCard
            episode={item}
            isFavorite={episodeStore.hasFavorite(item)}
            onPressFavorite={() => episodeStore.toggleFavorite(item)}
          />
        )}
      />
    </Screen>
  );
});

const EpisodeCard = observer(function EpisodeCard({
  episode,
  isFavorite,
  onPressFavorite,
}: {
  episode: Episode;
  onPressFavorite: () => void;
  isFavorite: boolean;
}) {
  const liked = useSharedValue(isFavorite ? 1 : 0);

  const imageUri = useMemo<ImageSourcePropType>(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)];
  }, []);

  // Grey heart
  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    };
  });

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });

  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: episode.title,
          accessibilityHint: translate("demoPodcastListScreen.accessibility.cardHint", {
            action: isFavorite ? "unfavorite" : "favorite",
          }),
        },
        android: {
          accessibilityLabel: episode.title,
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("demoPodcastListScreen.accessibility.favoriteAction"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              handlePressFavorite();
            }
          },
        },
      }),
    [episode, isFavorite]
  );

  const handlePressFavorite = () => {
    onPressFavorite();
    liked.value = withSpring(liked.value ? 0 : 1);
  };

  const handlePressCard = () => {
    openLinkInBrowser(episode.enclosure.link);
  };

  const ButtonLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View>
            <Animated.View style={[$iconContainer, StyleSheet.absoluteFill, animatedLikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.neutral800} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.primary400} // pink
              />
            </Animated.View>
          </View>
        );
      },
    []
  );

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text style={$metadataText} size="xxs" accessibilityLabel={episode.datePublished.accessibilityLabel}>
            {episode.datePublished.textLabel}
          </Text>
          <Text style={$metadataText} size="xxs" accessibilityLabel={episode.duration.accessibilityLabel}>
            {episode.duration.textLabel}
          </Text>
        </View>
      }
      content={`${episode.parsedTitleAndSubtitle.title} - ${episode.parsedTitleAndSubtitle.subtitle}`}
      {...accessibilityHintProps}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
      FooterComponent={
        <Button
          onPress={handlePressFavorite}
          onLongPress={handlePressFavorite}
          style={[$favoriteButton, isFavorite && $unFavoriteButton]}
          accessibilityLabel={
            isFavorite
              ? translate("demoPodcastListScreen.accessibility.unfavoriteIcon")
              : translate("demoPodcastListScreen.accessibility.favoriteIcon")
          }
          LeftAccessory={ButtonLeftAccessory}
        >
          <Text
            size="xxs"
            accessibilityLabel={episode.duration.accessibilityLabel}
            weight="medium"
            text={
              isFavorite
                ? translate("demoPodcastListScreen.unfavoriteButton")
                : translate("demoPodcastListScreen.favoriteButton")
            }
          />
        </Button>
      }
    />
  );
});

const $screenContentContainer: ViewStyle = {
  flex: 1,
};

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.md,
};

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
};

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: "flex-start",
};

const $toggle: ViewStyle = {
  marginTop: spacing.md,
};

const $labelStyle: TextStyle = {
  textAlign: "left",
};

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.sm,
};

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
};

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
};

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
};

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
};

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
};

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
};
```

</details>

<details>
  <summary>src/app/(app)/(tabs)/debug.tsx</summary>

```tsx
import React from "react";
import * as Application from "expo-application";
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native";
import { Button, ListItem, Screen, Text } from "src/components";
import { colors, spacing } from "src/theme";
import { isRTL } from "src/i18n";
import { useStores } from "src/models";

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export default function DemoDebugScreen() {
  const {
    authenticationStore: { logout },
  } = useStores();

  const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null;
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null;

  const demoReactotron = React.useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        });
      }
    },
    []
  );

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")}
      />
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Version</Text>
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Hermes Enabled</Text>
              <Text>{String(usingHermes)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Fabric Enabled</Text>
              <Text>{String(usingFabric)}</Text>
            </View>
          }
        />
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="demoDebugScreen.reactotron" onPress={demoReactotron} />
        <Text style={$hint} tx={`demoDebugScreen.${Platform.OS}ReactotronHint` as const} />
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View>
    </Screen>
  );
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $title: TextStyle = {
  marginBottom: spacing.xxl,
};

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
};

const $item: ViewStyle = {
  marginBottom: spacing.md,
};

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
};

const $button: ViewStyle = {
  marginBottom: spacing.xs,
};

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
};

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
};
```

</details>

These will all be navigable by routing to `/community`, `/podcasts` or `/debug`. Next we'll cover the Showroom which is a bit more involved, since we have to add some supporting components that only apply to that route.

### Showroom Screen

The Showroom screen has some supporting components it needs that only applies to that route. Ignite used to colocate these next to the screen file itself, in the `src/app/screens/DemoShowroomScreen` directory. However, `expo-router` wants to keep the `app` directory strictly for app routes.

To adhere to this, we'll move the supporting components to `src/components/Showroom` and import them from their in our `src/app/(app)/(tabs)/showroom.tsx`.

```bash
mv src/screens/DemoShowroomScreen src/components/Showroom
rm src/components/Showroom/DemoShowroomScreen.tsx
```

> **Note**: There is a type that gets removed by the above command. Add the following to the top of `src/components/Showroom/demos/index.ts`
>
> ```tsx
> import { ReactElement } from "react";
>
> export interface Demo {
>   name: string;
>   description: string;
>   data: ReactElement[];
> }
> ```
>
> You'll need to update the imports in the `src/components/Showroom/demos/Demo*.ts` files.
> A project-wide search and replace should do the trick:
>
> - Project-wide search for `from "../DemoShowroomScreen"`
> - Replace with `from "."`

We've deleted the screen file because we'll make a few `expo-router` specific changes to it over in the `app` directory. One improvement we can make to the Showroom screen is that we can reduce the platform specific code with regards to the `renderItem` of `SectionList`.

Before, we had an implementation for both web and mobile to help with some specific web routing for deep links:

```tsx
const WebListItem: FC<DemoListItem> = ({ item, sectionIndex }) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map((u) => {
        const itemSlug = slugify(u);

        return (
          <Link key={`section${sectionIndex}-${u}`} to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        );
      })}
    </View>
  );
};

const NativeListItem: FC<DemoListItem> = ({ item, sectionIndex, handleScroll }) => (
  <View>
    <Text onPress={() => handleScroll?.(sectionIndex)} preset="bold" style={$menuContainer}>
      {item.name}
    </Text>
    {item.useCases.map((u, index) => (
      <ListItem
        key={`section${sectionIndex}-${u}`}
        onPress={() => handleScroll?.(sectionIndex, index + 1)}
        text={u}
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
      />
    ))}
  </View>
);

const ShowroomListItem = Platform.select({
  web: WebListItem,
  default: NativeListItem,
});
```

However, we don't have to worry about this anymore. We can implement this as follows:

```tsx
const ShowroomListItem: FC<DemoListItem> = ({ item, sectionIndex }) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link href={{ pathname: "/showroom", params: { sectionSlug } }}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map((u) => {
        const itemSlug = slugify(u);
        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            href={{ pathname: "/showroom", params: { sectionSlug, itemSlug } }}
            asChild
          >
            <ListItem text={u} rightIcon={isRTL ? "caretLeft" : "caretRight"} />
          </Link>
        );
      })}
    </View>
  );
};
```

Note the `Link` wrapper provided by `expo-router`. We link to the `/showroom` route and provide the extra search params for a section or specific component we want to navigate to. We can then extract (and type) these params using `useLocalSearchParams`

The snippet below contains the entire file for reference:

<details>
  <summary>src/app/(app)/(tabs)/showroom.tsx</summary>

```tsx
import React, { FC, useEffect, useRef, useState } from "react";
import { Image, ImageStyle, SectionList, TextStyle, View, ViewStyle } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { type ContentStyle } from "@shopify/flash-list";
import { ListItem, ListView, ListViewRef, Screen, Text } from "src/components";
import { isRTL } from "src/i18n";
import { colors, spacing } from "src/theme";
import { useSafeAreaInsetsStyle } from "src/utils/useSafeAreaInsetsStyle";
import * as Demos from "src/components/Showroom/demos";
import { DrawerIconButton } from "src/components/Showroom/DrawerIconButton";
import { Link, useLocalSearchParams } from "expo-router";

const logo = require("assets/images/logo.png");

interface DemoListItem {
  item: { name: string; useCases: string[] };
  sectionIndex: number;
  onPress?: () => void;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ShowroomListItem: FC<DemoListItem> = ({ item, sectionIndex, onPress }) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link href={{ pathname: "/showroom", params: { sectionSlug } }} onPress={onPress}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map((u) => {
        const itemSlug = slugify(u);
        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            href={{ pathname: "/showroom", params: { sectionSlug, itemSlug } }}
            onPress={onPress}
            asChild
          >
            <ListItem text={u} rightIcon={isRTL ? "caretLeft" : "caretRight"} />
          </Link>
        );
      })}
    </View>
  );
};

export default function DemoShowroomScreen() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const listRef = useRef<SectionList>(null);
  const menuRef = useRef<ListViewRef<DemoListItem["item"]>>(null);

  const params = useLocalSearchParams<{
    sectionSlug?: string;
    itemSlug?: string;
  }>();

  // handle scroll when section/item params change
  React.useEffect(() => {
    if (Object.keys(params).length > 0) {
      const demoValues = Object.values(Demos);
      const findSectionIndex = demoValues.findIndex((x) => x.name.toLowerCase() === params.sectionSlug);
      let findItemIndex = 0;
      if (params.itemSlug) {
        try {
          findItemIndex =
            demoValues[findSectionIndex].data.findIndex((u) => slugify(u.props.name) === params.itemSlug) + 1;
        } catch (err) {
          console.error(err);
        }
      }
      handleScroll(findSectionIndex, findItemIndex);
    }
  }, [params]);

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleScroll = (sectionIndex: number, itemIndex = 0) => {
    listRef.current?.scrollToLocation({
      animated: true,
      itemIndex,
      sectionIndex,
    });
  };

  const scrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd();
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50
    );
  };

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  const $drawerInsets = useSafeAreaInsetsStyle(["top"]);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={"slide"}
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>

          <ListView<DemoListItem["item"]>
            ref={menuRef}
            contentContainerStyle={$listContentContainer}
            estimatedItemSize={250}
            data={Object.values(Demos).map((d) => ({
              name: d.name,
              useCases: d.data.map((u) => u.props.name as string),
            }))}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index: sectionIndex, onPress }) => (
              <ShowroomListItem {...{ item, sectionIndex, onPress }} />
            )}
          />
        </View>
      )}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
        <DrawerIconButton onPress={toggleDrawer} {...{ open }} />

        <SectionList
          ref={listRef}
          contentContainerStyle={$sectionListContentContainer}
          stickySectionHeadersEnabled={false}
          sections={Object.values(Demos)}
          renderItem={({ item }) => item}
          renderSectionFooter={() => <View style={$demoUseCasesSpacer} />}
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoShowroomScreen.jumpStart" />
            </View>
          }
          onScrollToIndexFailed={scrollToIndexFailed}
          renderSectionHeader={({ section }) => {
            return (
              <View>
                <Text preset="heading" style={$demoItemName}>
                  {section.name}
                </Text>
                <Text style={$demoItemDescription}>{section.description}</Text>
              </View>
            );
          }}
        />
      </Screen>
    </Drawer>
  );
}

const $screenContainer: ViewStyle = {
  flex: 1,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
};

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
};

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
};

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
};

const $demoItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
};

const $demoItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
};

const $demoUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
};
```

</details>

If you head on over to the web app at `http://localhost:8081/showroom?itemSlug=variants&sectionSlug=toggle`, you'll see the Showroom screen will open and scroll down to the appropriate section.

We can emulate [deep links in Expo Go](https://docs.expo.dev/guides/linking/#testing-urls) with the command:

```bash
npx uri-scheme open exp://localhost:8081/--/showroom --ios
```

Observe the simulator opens the mobile app and navigates to the Showroom screen.

We get that universal linking for free with `expo-router`!

## Code Cleanup

Now that we have the boilerplate up and running again, let's clean some of the screen and navigation files that are no longer needed.

```bash
rm src/app.tsx
rm -rf src/screens
rm -rf src/navigators
```

In doing so, we'll need to fix some `Reactotron` code for custom commands. We'll drop the `resetNavigation` one (logging out is really the same thing) and update the `navigateTo` and `goBack`. Open up `src/devtools/ReactotronConfig.ts` to edit these.

```ts
// error-line
import { goBack, resetRoot, navigate } from "src/navigators/navigationUtilities";
// success-line
import { router } from "expo-router";
// ...
// error-line-start
reactotron.onCustomCommand({
  title: "Reset Navigation State",
  description: "Resets the navigation state",
  command: "resetNavigation",
  handler: () => {
    Reactotron.log("resetting navigation state");
    resetRoot({ index: 0, routes: [] });
  },
});
// error-line-end

reactotron.onCustomCommand<[{ name: "route"; type: ArgType.String }]>({
  command: "navigateTo",
  handler: (args) => {
    const { route } = args ?? {};
    if (route) {
      Reactotron.log(`Navigating to: ${route}`);
      // error-line
      navigate(route as any); // this should be tied to the navigator, but since this is for debugging, we can navigate to illegal routes
      // success-line-start
      // @ts-ignore - bypass Expo Router Typed Routes
      router.push(route);
      // success-line-end
    } else {
      Reactotron.log("Could not navigate. No route provided.");
    }
  },
  title: "Navigate To Screen",
  description: "Navigates to a screen by name.",
  args: [{ name: "route", type: ArgType.String }],
});

reactotron.onCustomCommand({
  title: "Go Back",
  description: "Goes back",
  command: "goBack",
  handler: () => {
    Reactotron.log("Going back");
    // error-line
    goBack();
    // success-line
    router.back();
  },
});
```

When navigating to the showroom, you may notice an error in the console:
  
```terminal
ERROR  Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

This is because the `expo-router`'s `<Link>` component passes a ref to it's children. To address this we can update our `ListItem.tsx` to correctly handle the 
ref passed to it.

<details>
  <summary>src/components/ListItem.tsx</summary>

```tsx
/**
 * A styled row component that can be used in FlatList, SectionList, or by itself.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/ListItem/}
 * @param {ListItemProps} props - The props for the `ListItem` component.
 * @returns {JSX.Element} The rendered `ListItem` component.
 */
// error-line
  export function ListItem(props: ListItemProps) {
// success-line-start
  export const ListItem = React.forwardRef<View, ListItemProps>(function ListItem(
  props: ListItemProps,
  ref,
) {
// success-line-end
  const {
    bottomSeparator,
    children,
    height = 56,
    LeftComponent,
    leftIcon,
    leftIconColor,
    RightComponent,
    rightIcon,
    rightIconColor,
    style,
    text,
    TextProps,
    topSeparator,
    tx,
    txOptions,
    textStyle: $textStyleOverride,
    containerStyle: $containerStyleOverride,
    ...TouchableOpacityProps
  } = props

  const $textStyles = [$textStyle, $textStyleOverride, TextProps?.style]

  const $containerStyles = [
    topSeparator && $separatorTop,
    bottomSeparator && $separatorBottom,
    $containerStyleOverride,
  ]

  const $touchableStyles = [$touchableStyle, { minHeight: height }, style]

  return (
    // error-line
   <View style={$containerStyles}>
    // success-line
   <View ref={ref} style={$containerStyles}>
      <TouchableOpacity {...TouchableOpacityProps} style={$touchableStyles}>
        <ListItemAction
          side="left"
          size={height}
          icon={leftIcon}
          iconColor={leftIconColor}
          Component={LeftComponent}
        />

        <Text {...TextProps} tx={tx} text={text} txOptions={txOptions} style={$textStyles}>
          {children}
        </Text>

        <ListItemAction
          side="right"
          size={height}
          icon={rightIcon}
          iconColor={rightIconColor}
          Component={RightComponent}
        />
      </TouchableOpacity>
    </View>
  )
  //error-line
}
  //success-line
})

```
</details>

## Summary

There you have it, a culinary masterpiece of Ignite and Expo Router, shipped in one pizza box. What we achieved here:

- Simplified navigation code
- Typed routing
- Examples of many aspects of `expo-router`, such as authentication, tab navigation, search params
- Deep linking that Just Works<sup>TM</sup> on both web and mobile
- Reduced Platform specific code

[Full Example Repo](https://github.com/Jpoliachik/ignite-expo-router)

## Additional Resources

To go more in-depth on `expo-router`, check out the official documentation at [Expo.dev](https://docs.expo.dev/routing/introduction/).

You can also follow Evan Bacon, the author of Expo Router, on [GitHub](https://github.com/EvanBacon/expo-router-twitter/blob/main/app/_layout.tsx) and check out his applications or demos using the navigation library.

- [Pillar Valley](https://github.com/EvanBacon/pillar-valley/) - a game built in Expo using `expo-router``
- [Twitter routing demo](https://github.com/EvanBacon/expo-router-twitter/) - a demo of how an `expo-router` application would look if rebuilding Twitter's routes

Additionally, here is an Ignite repo with `expo-router` added in for reference on my [GitHub](https://github.com/Jpoliachik/ignite-expo-router)
