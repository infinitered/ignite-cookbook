---
title: React Native Vision Camera
description: How to integrate VisionCamera in Ignite v9+
tags:
  - Expo
  - VisionCamera
  - react-native-vision-camera
last_update:
  author: Frank Calise
publish_date: 2023-10-23
---

# VisionCamera

## Overview

VisionCamera is a powerful, high-performance React Native Camera library. It's both feature-rich and flexible! The library provides the necessary hooks and functions to easily integrate camera functionality in your app.

In this example, we'll take a look at wiring up a barcode scanner. This tutorial is written for the Ignite v9 Prebuild workflow, however it generally still applies to DIY or even a bare react-native project.

## Installation

If you haven't already, spin up a new Ignite application:

```bash
npx ignite-cli@latest new PizzaApp --remove-demo --workflow=prebuild --yes
cd PizzaApp
```

Next, let's install the necessary dependencies. You can see complete installation instructions for `react-native-vision-camera` [here](https://react-native-vision-camera.com/docs/guides).

```bash
npx expo install react-native-vision-camera
```

Add the plugin to `app.json` as per the documentation. It'll look like the following if you have the default Ignite template:

```json
"plugins": [
  "expo-localization",
  [
    "expo-build-properties",
    {
      "ios": {
        "newArchEnabled": false
      },
      "android": {
        "newArchEnabled": false
      }
    }
  ],
  [
    "react-native-vision-camera",
    {
      "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera.",
      "enableCodeScanner": true
    }
  ]
],
```

> **Note:** `$(PRODUCT_NAME)` comes from the iOS project build configuration, this will be populated with the app name at runtime as long as it's configured properly (in this case, it is in the Ignite boilerplate)

To get this native dependency working in our project, we'll need to run prebuild so Expo can execute the proper native code changes for us. Then we can boot up the app on a device.

```bash
npx expo prebuild
yarn android
```

Since the simulators do not offer a good way of testing the camera for this recipe, we'll be creating an Android build to test on an actual device. This is for convenience, as it's a bit easier to achieve than running on an iOS device, however both would work.

## Permissions

Before we can get to using the camera on the device, we must get permission from the user to do so. Let's edit the Welcome screen in Ignite to reflect the current permission status and a way to prompt the user.

```tsx
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { AppStackScreenProps } from "../navigators";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import { Linking, View, ViewStyle } from "react-native";
import { Button, Screen, Text } from "app/components";

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(
  function WelcomeScreen(_props) {
    const [cameraPermission, setCameraPermission] =
      React.useState<CameraPermissionStatus>();

    React.useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    const promptForCameraPermissions = React.useCallback(async () => {
      const permission = await Camera.requestCameraPermission();
      Camera.getCameraPermissionStatus().then(setCameraPermission);

      if (permission === "denied") await Linking.openSettings();
    }, [cameraPermission]);

    if (cameraPermission == null) {
      // still loading
      return null;
    }

    return (
      <Screen contentContainerStyle={$container}>
        <View>
          <Text>
            Camera Permission:{" "}
            {cameraPermission === null ? "Loading..." : cameraPermission}
          </Text>
          {cameraPermission !== "granted" && (
            <Button
              onPress={promptForCameraPermissions}
              text="Request Camera Permission"
            />
          )}
        </View>
      </Screen>
    );
  }
);

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  justifyContent: "space-evenly",
};
```

<details>
  <summary>Demo Preview</summary>

  <img src="https://github.com/frankcalise/CookbookVisionCamera/assets/374022/cbbae841-3b45-44ee-87dd-5bca69b5980b" width="320" height="240" />

</details>

## Codes Store &amp; Screen

Before we get to displaying the camera for scanning, let's quickly set up a new store in MST for keeping our list of codes and a screen to view them. Generate the commands using the Ignite CLI:

```bash
npx ignite-cli@next g model CodeStore
npx ignite-cli@next g screen Codes
```

If you're not familiar with generators, head on over to the [Ignite Generators](https://docs.infinite.red/ignite/concept/generators) documentation to learn more!

Open the generated `models/CodeStore.ts`. Our Code Store will just have a simple string array and an action to add a new code:

```typescript
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";

/**
 * Model description here for TypeScript hints.
 */
export const CodeStoreModel = types
  .model("CodeStore")
  .props({
    codes: types.array(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addCode(code: string) {
      self.codes.push(code);
    },
  }));

export interface CodeStore extends Instance<typeof CodeStoreModel> {}
export interface CodeStoreSnapshotOut
  extends SnapshotOut<typeof CodeStoreModel> {}
export interface CodeStoreSnapshotIn
  extends SnapshotIn<typeof CodeStoreModel> {}
export const createCodeStoreDefaultModel = () =>
  types.optional(CodeStoreModel, {});
```

Next we'll utilize this store on our `screens/CodesScreen.tsx`. This will just list all of the previously scanned codes and a way to get back to the main screen:

```tsx
import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { View, ViewStyle } from "react-native";
import { AppStackScreenProps } from "app/navigators";
import { Button, Screen, Text } from "app/components";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "app/models";
import { spacing } from "app/theme";

interface CodesScreenProps extends AppStackScreenProps<"Codes"> {}

export const CodesScreen: FC<CodesScreenProps> = observer(
  function CodesScreen() {
    // Pull in one of our MST stores
    const { codeStore } = useStores();

    // Pull in navigation via hook
    const navigation = useNavigation();
    return (
      <Screen
        safeAreaEdges={["top", "bottom"]}
        style={$root}
        preset="scroll"
        contentContainerStyle={$container}
      >
        <View>
          <Text text={`${codeStore.codes.length} codes scanned`} />

          {codeStore.codes.map((code, index) => (
            <Text key={`code-index-${index}`} text={code} />
          ))}
        </View>

        <Button text="Go back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }
);

const $root: ViewStyle = {
  flex: 1,
};

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
};
```

## Displaying the Camera

We have the dough prepped, we added the sauce - now it's time for the pizza toppings! Back in `screens/Welcome.tsx`, we'll begin adding more of the camera code by adding the `Camera` component and wire it up to the `useCodeScanner` hook, both of which are provided by `react-native-vision-camera`.

```tsx
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { AppStackScreenProps } from "../navigators";
// success-line-start
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Button, Icon, Screen, Text } from "app/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStores } from "app/models";
import { spacing } from "app/theme";
// success-line-end

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(
  function WelcomeScreen(_props) {
    const [cameraPermission, setCameraPermission] =
      React.useState<CameraPermissionStatus>();
    // success-line-start
    const [showScanner, setShowScanner] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const { codeStore } = useStores();
    // success-line-end

    React.useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    const promptForCameraPermissions = React.useCallback(async () => {
      const permission = await Camera.requestCameraPermission();
      Camera.getCameraPermissionStatus().then(setCameraPermission);

      if (permission === "denied") await Linking.openSettings();
    }, [cameraPermission]);

    // success-line-start
    const codeScanner = useCodeScanner({
      codeTypes: ["qr", "ean-13"],
      onCodeScanned: (codes) => {
        setIsActive(false);

        codes.every((code) => {
          if (code.value) {
            codeStore.addCode(code.value);
          }
          return true;
        });

        setShowScanner(false);
        Alert.alert("Code scanned!");
      },
    });

    const device = useCameraDevice("back");

    const { right, top } = useSafeAreaInsets();
    // success-line-end

    if (cameraPermission == null) {
      // still loading
      return null;
    }

    // success-line-start
    if (showScanner && device) {
      return (
        <View style={$cameraContainer}>
          <Camera
            isActive={isActive}
            device={device}
            codeScanner={codeScanner}
            style={StyleSheet.absoluteFill}
            photo
            video
          />
          <View
            style={[
              $cameraButtons,
              { right: right + spacing.md, top: top + spacing.md },
            ]}
          >
            <TouchableOpacity
              style={$closeCamera}
              onPress={() => setShowScanner(false)}
            >
              <Icon icon="x" size={50} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    // success-line-end

    return (
      <Screen contentContainerStyle={$container}>
        <View>
          <Text>
            Camera Permission:{" "}
            {cameraPermission === null ? "Loading..." : cameraPermission}
          </Text>
          {cameraPermission !== "granted" && (
            <Button
              onPress={promptForCameraPermissions}
              text="Request Camera Permission"
            />
          )}
        </View>
        // success-line-start
        <View>
          <Button
            onPress={() => {
              setIsActive(true);
              setShowScanner(true);
            }}
            text="Scan Barcodes"
          />
        </View>
        <View>
          <Button
            onPress={() => _props.navigation.navigate("Codes")}
            text={`View Scans (${codeStore.codes.length})`}
          />
          // success-line-end
        </View>
      </Screen>
    );
  }
);

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  justifyContent: "space-evenly",
};

// success-line-start
const $cameraContainer: ViewStyle = {
  flex: 1,
};

const $cameraButtons: ViewStyle = {
  position: "absolute",
};

const $closeCamera: ViewStyle = {
  marginBottom: spacing.md,
  width: 100,
  height: 100,
  borderRadius: 100 / 2,
  backgroundColor: "rgba(140, 140, 140, 0.3)",
  justifyContent: "center",
  alignItems: "center",
};
// success-line-end
```

And that's everything! Check out the Demo Preview to see it in action.

<details>
  <summary>Demo Preview</summary>

  <video width="320" height="240" controls>
    <source src="https://github.com/frankcalise/CookbookVisionCamera/assets/374022/93a732bf-f6a4-4a7f-8a65-24e6af101a90" type="video/mp4" />
  </video>

</details>
