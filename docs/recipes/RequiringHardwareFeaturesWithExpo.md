---
title: Requiring Hardware Features with Expo
description: How to specify hardware requirements for your app
tags:
  - Hardware
  - UIRequiredDeviceCapabilities
  - uses-feature
  - prebuild
  - cng
last_update:
  author: Mark Rickert
publish_date: 2024-02-28
---

# Requiring Hardware Features with Expo

## Overview

iOS and Android allow you to specify specific hardware that your app needs in order to be able to run. When users go to download your app from the respective app stores, if their device doesn't meet this hardware requirement, the store will not allow the user to download the app to that device.

For this recipe, we're going to be creating an expo config plugin to add the required properties to our app's prebuild system so that users with devices that DO NOT have a front-facing camera or a microphone won't be able to download our app.

We'll get started by igniting a new application with the `cng` workflow.

```bash
npx ignite-cli new PizzaApp --workflow=cng --yes
cd PizzaApp
```

## Add the plugin file

Create a new file called `plugins/withRequiredHardware.ts` and put the following content in it. 

You can see that we've defined every possible value for iOS and Android.

```tsx
import {
  withInfoPlist,
  withAndroidManifest,
  type ConfigPlugin,
  type AndroidConfig,
  type IOSConfig,
} from "@expo/config-plugins"

// More info: https://developer.android.com/guide/topics/manifest/uses-feature-element
const validAndroidFeatures = [
  "android.hardware.audio.low_latency",
  "android.hardware.audio.output",
  "android.hardware.audio.pro",
  "android.hardware.bluetooth",
  "android.hardware.bluetooth_le",
  "android.hardware.camera",
  "android.hardware.camera.any",
  "android.hardware.camera.autofocus",
  "android.hardware.camera.capability.manual_post_processing",
  "android.hardware.camera.capability.manual_sensor",
  "android.hardware.camera.capability.raw",
  "android.hardware.camera.external",
  "android.hardware.camera.flash",
  "android.hardware.camera.front",
  "android.hardware.camera.level.full",
  "android.hardware.consumerir",
  "android.hardware.faketouch",
  "android.hardware.faketouch.multitouch.distinct",
  "android.hardware.faketouch.multitouch.jazzhand",
  "android.hardware.fingerprint",
  "android.hardware.gamepad",
  "android.hardware.location",
  "android.hardware.location.gps",
  "android.hardware.location.network",
  "android.hardware.microphone",
  "android.hardware.nfc",
  "android.hardware.nfc.hce",
  "android.hardware.opengles.aep",
  "android.hardware.screen.landscape",
  "android.hardware.screen.portrait",
  "android.hardware.sensor.accelerometer",
  "android.hardware.sensor.ambient_temperature",
  "android.hardware.sensor.barometer",
  "android.hardware.sensor.compass",
  "android.hardware.sensor.gyroscope",
  "android.hardware.sensor.heartrate",
  "android.hardware.sensor.heartrate.ecg",
  "android.hardware.sensor.hifi_sensors",
  "android.hardware.sensor.light",
  "android.hardware.sensor.proximity",
  "android.hardware.sensor.relative_humidity",
  "android.hardware.sensor.stepcounter",
  "android.hardware.sensor.stepdetector",
  "android.hardware.telephony",
  "android.hardware.telephony.cdma",
  "android.hardware.telephony.gsm",
  "android.hardware.touchscreen",
  "android.hardware.touchscreen.multitouch",
  "android.hardware.touchscreen.multitouch.distinct",
  "android.hardware.touchscreen.multitouch.jazzhand",
  "android.hardware.type.automotive",
  "android.hardware.type.pc",
  "android.hardware.type.television",
  "android.hardware.type.watch",
  "android.hardware.usb.accessory",
  "android.hardware.usb.host",
  "android.hardware.vulkan.compute",
  "android.hardware.vulkan.level",
  "android.hardware.vulkan.version",
  "android.hardware.wifi",
  "android.hardware.wifi.direct",
] as const

// More info: https://developer.apple.com/documentation/bundleresources/information_property_list/uirequireddevicecapabilities/
const validIOSFeatures = [
  "accelerometer",
  "arkit",
  "arm64",
  "armv7",
  "auto-focus-camera",
  "bluetooth-le",
  "camera-flash",
  "driverkit",
  "front-facing-camera",
  "gamekit",
  "gps",
  "gyroscope",
  "healthkit",
  "iphone-ipad-minimum-performance-a12",
  "iphone-performance-gaming-tier",
  "location-services",
  "magnetometer",
  "metal",
  "microphone",
  "nfc",
  "opengles-1",
  "opengles-2",
  "opengles-3",
  "peer-peer",
  "sms",
  "still-camera",
  "telephony",
  "video-camera",
  "wifi",
] as const

type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number]
type HardwareFeatureIOS = (typeof validIOSFeatures)[number]

export const withRequiredHardware: ConfigPlugin<{
  ios: Array<HardwareFeatureIOS>
  android: Array<HardwareFeatureAndroid>
}> = (config, { android, ios }) => {
  // Add android required hardware
  config = withAndroidManifest(config, (config) => {
    config.modResults = addHardwareFeaturesToAndroidManifestManifest(config.modResults, android)
    return config
  })

  // Add ios required hardware
  config = withInfoPlist(config, (config) => {
    config.modResults = addRequiredDeviceCapabilitiesToInfoPlist(config.modResults, ios)
    return config
  })

  return config
}

export function addHardwareFeaturesToAndroidManifestManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  requiredFeatures: Array<HardwareFeatureAndroid>,
) {
  // Add `<uses-feature android:name="android.hardware.camera.front" android:required="true"/>` to the AndroidManifest.xml
  if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
    androidManifest.manifest["uses-feature"] = []
  }

  // Here we add the feature to the manifest:
  // loop through the array of features and add them to the manifest if they don't exist
  for (const feature of requiredFeatures) {
    if (
      !androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === feature)
    ) {
      androidManifest.manifest["uses-feature"]?.push({
        $: {
          "android:name": feature,
          "android:required": "true",
        },
      })
    }
  }

  return androidManifest
}

export function addRequiredDeviceCapabilitiesToInfoPlist(
  infoPlist: IOSConfig.InfoPlist,
  requiredFeatures: Array<HardwareFeatureIOS>,
) {
  if (!infoPlist.UIRequiredDeviceCapabilities) {
    infoPlist.UIRequiredDeviceCapabilities = []
  }
  const existingFeatures = infoPlist.UIRequiredDeviceCapabilities as Array<HardwareFeatureIOS>
  for (const f of requiredFeatures) {
    if (!existingFeatures.includes(f)) {
      existingFeatures.push(f)
    }
  }

  infoPlist.UIRequiredDeviceCapabilities = existingFeatures
  return infoPlist
}
```

## Enable the plugin

To enable the new plugin, open the `app.config.ts` file and where you see `plugins:` add the new plugin:

```tsx
  return {
    ...config,
    plugins: [
      ...existingPlugins,
      require("./plugins/withSplashScreen").withSplashScreen,
      require("./plugins/withFlipperDisabled").withFlipperDisabled,
      // success-line-start
      [
        require("./plugins/withRequiredHardware").withRequiredHardware,
        {
          // More info: https://developer.apple.com/documentation/bundleresources/information_property_list/uirequireddevicecapabilities/
          ios: ["front-facing-camera", "microphone"],
          // More info: https://developer.android.com/guide/topics/manifest/uses-feature-element
          android: ["android.hardware.camera.front", "android.hardware.microphone"],
        },
      ],
      // success-line-end
    ],
  }
```

:::warning

Note that this plugin is an array. The first element of the array is the plugin and the second is an object representing the required hardware you want for both iOS and Android.

:::

## Check that your install worked

Now run `yarn prebuild:clean` and then check that the following files have the changes yous specified in the plugin configuration:

### For iOS:

In `./ios/[ProjectName]/Info.plist`:

You should see new entries in the `UIRequiredDeviceCapabilities` array:

```xml
<key>UIRequiredDeviceCapabilities</key>
<array>
  <string>armv7</string>
  // success-line-start
  <string>front-facing-camera</string>
  <string>microphone</string>
  // success-line-end
</array>
```

### For Android:

In `./android/app/src/main/AndroidManifest.xml`

You should see new `<uses-feature ` entries corresponding to the configuration:

```xml
// success-line
<uses-feature android:name="android.hardware.camera.front" android:required="true"/>
// success-line
<uses-feature android:name="android.hardware.microphone" android:required="true"/>
```

---

And that's it! 

When you publish your app to both app stores, the new hardware requirements will prevent users from downloading your app if their device doesn't meet these specifications.