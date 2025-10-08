---
title: Inline Expo Config Plugins
description: Creating and setting up inline Expo config plugins within the Ignite Boilerplate
tags:
  - Expo
  - Config Plugins
  - TypeScript
  - Android
  - iOS
last_update:
  author: Frank Calise
publish_date: 2025-10-07
---

# Inline Expo Config Plugins

This guide will teach you how to create and set up inline Expo config plugins within an Ignite project. Config plugins allow you to modify your native iOS and Android projects programmatically, letting you stay in the CNG workflow while still customizing native behavior.

## Appetizer

You'll need an Ignite app set up with the `cng` workflow to use config plugins:

```bash
npx ignite-cli@latest new PizzaApp --workflow=cng --yes
```

## Steps

### 1. Project Structure Setup

First, let's create the folder structure for our config plugins. From your project root:

```bash
mkdir plugins
```

Your project structure should now look like this:

```
├── app/
├── plugins/          # ← New folder for config plugins
├── app.config.ts
├── package.json
└── ...
```

### 2. Create Your First Config Plugin

Let's create an example config plugin to address the double splash screen issue with `expo-splash-screen`. Create a new file at `plugins/withSplashScreen.ts`:

```typescript
import {
  ConfigPlugin,
  withStringsXml,
  AndroidConfig,
  withAndroidStyles,
} from "expo/config-plugins";

/**
 *
 * Expo Config Plugin to help address the double splash screen issue with `expo-splash-screen`
 * See more information about this issue here: https://github.com/expo/expo/issues/16084
 *
 * How it works:
 *   1) Replace the default splash screen with a transparent screen
 *   2) Set the splash screen status bar to translucent
 */
export const withSplashScreen: ConfigPlugin = (config) => {
  config = withAndroidSplashScreen(config);
  return config;
};

/**
 * Android implementation of the config plugin - the only platform needed for this plugin.
 * However, it is good practice to break up your config plugins from the exported
 * function into parts by platform. For example, if it was needed, we would also
 * add `withIosSplashScreen` for the iOS implementation.
 */
const withAndroidSplashScreen: ConfigPlugin = (config) => {
  config = withCustomStylesXml(config);
  config = withCustomStringsXml(config);
  return config;
};

/**
 * Modifies the `android/app/src/main/res/values/strings.xml` file to add the following string:
 *
 * <string name="expo_splash_screen_status_bar_translucent" translatable="false">true</string>
 */
const withCustomStringsXml: ConfigPlugin = (config) =>
  withStringsXml(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Strings.setStringItem(
      [
        {
          _: "true",
          $: {
            name: "expo_splash_screen_status_bar_translucent",
            translatable: "false",
          },
        },
      ],
      modConfig.modResults
    );
    return modConfig;
  });

/**
 * Modifies the `android/app/src/main/res/values/styles.xml` file to append the
 * the following to the Theme.App.SplashScreen style:
 *
 * <item name="android:windowIsTranslucent">true</item>
 */
const withCustomStylesXml: ConfigPlugin = (config) =>
  withAndroidStyles(config, async (modConfig) => {
    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      name: "android:windowIsTranslucent",
      value: "true",
      parent: {
        name: "Theme.App.SplashScreen",
        parent: "AppTheme",
      },
    });
    return modConfig;
  });
```

### 3. Register the Config Plugin

Now we need to register our config plugin in the `app.config.ts` file. Update the plugins array:

```typescript
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? [];

  return {
    ...config,
    plugins: [...existingPlugins, require("./plugins/withSplashScreen").withSplashScreen],
  };
};
```

### 4. Apply the Changes

To see your config plugin in action, you'll need to regenerate the native code:

```bash
npx expo prebuild --clean
```

The `--clean` flag ensures that any previous native modifications are cleared and your config plugin changes are applied fresh.

### 5. Verify the Changes

After running prebuild, you can verify that your config plugin worked by checking the generated files:

**Android Strings** (`android/app/src/main/res/values/strings.xml`):

```xml
<string name="expo_splash_screen_status_bar_translucent" translatable="false">true</string>
```

**Android Styles** (`android/app/src/main/res/values/styles.xml`):

```xml
<style name="Theme.App.SplashScreen" parent="AppTheme">
  <!-- ... existing styles ... -->
  <item name="android:windowIsTranslucent">true</item>
</style>
```

## Best Practices

### Plugin Structure

Follow these conventions when creating config plugins:

1. **Platform Separation**: Break up complex plugins into platform-specific functions (`withAndroidFeature`, `withIosFeature`)
2. **Clear Documentation**: Add JSDoc comments explaining what each function does and what files it modifies
3. **Descriptive Naming**: Use clear, descriptive names that indicate the plugin's purpose

### Multiple Plugins

If you need multiple config plugins, create separate files for each and register them all:

```typescript
// plugins/withCustomFonts.ts
export const withCustomFonts: ConfigPlugin = (config) => {
  // Implementation here
  return config;
};

// plugins/withDeepLinking.ts
export const withDeepLinking: ConfigPlugin = (config) => {
  // Implementation here
  return config;
};

// app.config.ts
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? [];

  return {
    ...config,
    plugins: [
      ...existingPlugins,
      require("./plugins/withSplashScreen").withSplashScreen,
      require("./plugins/withCustomFonts").withCustomFonts,
      require("./plugins/withDeepLinking").withDeepLinking,
    ],
  };
};
```

### Development Workflow

1. **Create/Modify Plugin**: Make changes to your config plugin files
2. **Prebuild**: Run `npx expo prebuild --clean` to apply changes
3. **Test**: Build and test your app to ensure the native modifications work as expected
4. **Iterate**: Repeat as needed for additional modifications

## Common Use Cases

Config plugins are perfect for:

- **Customizing splash screens** (like our example)
- **Modifying app icons** or other assets
- **Adding native dependencies** that require configuration
- **Customizing build settings** for specific requirements

## Dessert

You now have inline config plugins set up in your Ignite project! This opens up a whole world of native customization possibilities while keeping you in Expo's managed workflow. Remember to always test your changes thoroughly, especially when modifying native behavior.

For more advanced config plugin examples and APIs, check out the [Expo Config Plugins documentation](https://docs.expo.dev/guides/config-plugins/).

Buon appetito!
