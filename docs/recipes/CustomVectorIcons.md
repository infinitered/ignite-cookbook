---
title: Using Custom Vector Icons
description: How to use your own vector icons using @expo/vector-icons
tags:
  - Expo
  - VectorIcons
  - FontAwesome
  - Icons
last_update:
  author: Jovanni Lo
publish_date: 2023-11-10
---

# Custom Vector Icons

## Overview

As trendy as it is these days, not every app has to use emojis for all icons. Perhaps you want to incorporate a popular set through an icon font, such as FontAwesome, Glyphicons, or Ionicons, or maybe even use your own custom icons.

In this example, we will be implementing FontAwesome 6. This tutorial is written for the Ignite v9 CNG workflow; however, it generally still applies to a DIY or even a bare React Native project

## Installation

If you haven't already, spin up a new Ignite application:

```sh
npx ignite-cli@next new PizzaApp --remove-demo --workflow=cng --yes
cd PizzaApp
```

Next, let's install the necessary dependencies. You can see complete installation instructions for `@expo/vector-icons` [here](https://docs.expo.dev/guides/icons/).

```sh
npx expo install @expo/vector-icons
```

## Font Assets

Once everything is installed, it's now time to download the actual fonts that we're going to use to render our icons. First, download your font and place all `.ttf` files in our `assets/fonts` folder.

```
ignite-project
├── app
├── ...
├── assets
│   ├── icons
│   ├── images
│   └── fonts
│       ├── fa-light-300.ttf
│       ├── fa-regular-400.ttf
│       ├── fa-solid-900.ttf
│       ├── fa-thin-100.ttf
│       └── fa-brands-400.ttf
├── ...
└── package.json

```
## Import our fonts

It's now time to implement these icons to our `Icon.tsx` component. We will be modifying the `iconRegistry` object to map our icon names and all other changes explained below.


First, open `app/components/Icon.tsx` and then import `createMultiStyleIconSet` from `@expo/vector-icons`.

```patch
 import {
// error-line
-  Image,
   ImageStyle,
   StyleProp,
   TouchableOpacity,
   TouchableOpacityProps,
   View,
   ViewStyle,
// success-line-start
+  TextProps,
+  Platform,
// success-line-end
 } from "react-native"
// success-line
+import { createMultiStyleIconSet } from '@expo/vector-icons'
```

Next, we will re-define our `iconRegistry` and create our own custom `Icon` component. We have our handy function to do it below.

```ts
const iconFonts = {
  thin: require('../../assets/fonts/fa-thin-100.ttf'),
  light: require('../../assets/fonts/fa-light-300.ttf'),
  regular: require('../../assets/fonts/fa-regular-400.ttf'),
  solid: require('../../assets/fonts/fa-solid-900.ttf'),
  brand: require('../../assets/fonts/fa-brands-400.ttf'),
}

/**
 * We are not using icon names
 * Why?
 *  - Reduce bundle size
 *  - Flexible & consistent names
 *  - Performance(?)
 *
 * How to add icons?
 *  1. Goto https://fontawesome.com/search
 *  2. Search for the icon you need
 *  3. Open the icon and copy the Unicode value
 *  4. Finally, map it below with a friendly name
 */
export const iconRegistry = {
  back: 'f060',
  bell: 'f0f3',
  caretLeft: 'f0d9',
  caretRight: 'f0da',
  check: 'f00c',
  clap: 'e1a8',
  community: 'f500',
  components: 'f5fd',
  debug: 'f120',
  github: 'f09b',
  heart: 'f004',
  hidden: 'f070',
  ladybug: 'f188',
  lock: 'f023',
  menu: 'f0c9',
  more: 'f141',
  pin: 'f3c5',
  podcast: 'f2ce',
  settings: 'f013',
  slack: 'f198',
  view: 'f06e',
  x: 'f00d',
}

const createFontAwesomeStyle = (style: IconStyle, fontWeight: string) => {
  const fontFile = iconFonts[style]
  return {
    fontFamily: `Font Awesome 6 Pro ${style}`,
    fontFile,
    fontStyle: Platform.select({
      ios: {
        fontWeight,
      },
      default: {},
    }),
    glyphMap: Object.entries(iconRegistry).reduce<{ [key: string]: number }>((acc, [name, unicode]) => {
      acc[name] = parseInt(unicode, 16)
      return acc
    }, {}),
  }
}
```

## VectorIcon Component

Now, it's time to create our custom `VectorIcon` component. Take note of the available styles for our icon. These are specific to FontAwesome, and we're defining the theme here.

```ts
export type IconStyle = keyof typeof iconFonts
interface VectorIconProps extends TextProps, Partial<Record<IconStyle, boolean>> {
  name?: IconTypes
  size?: number
  color?: string
  width?: string | number
  height?: string | number
}

export const VectorIcon: ComponentType<VectorIconProps> & {
  font: { [x: string]: string }
} = createMultiStyleIconSet(
  {
    thin: createFontAwesomeStyle('thin', '100'),
    light: createFontAwesomeStyle('light', '300'),
    regular: createFontAwesomeStyle('regular', '400'),
    solid: createFontAwesomeStyle('solid', '900'),
    brand: createFontAwesomeStyle('brand', '400'),
  },
  // Default font style
  { defaultStyle: 'regular' },
)
```

### Preloading our Fonts
Let's modify our `app/app.tsx ` to pre-load our fonts during hyrdration. You can learn more [here](https://docs.expo.dev/guides/icons/#custom-icon-fonts)

```patch
// success-line
+import { VectorIcon } from "./components"

// error-line
-  const [areFontsLoaded] = useFonts(customFontsToLoad)
// success-line-start
+  const [areFontsLoaded] = useFonts({
+    ...customFontsToLoad,
+    ...VectorIcon.font,
+  })
// success-line-end
```


## Icon Component
Now that we have our `VectorIcon`, it's time to use it within our `Icon` component! Let's modify our `IconProps` to include the styles extension, making it easier to set when using the component.

```patch
// error-line
-interface IconProps extends TouchableOpacityProps
// success-line
+interface IconProps extends TouchableOpacityProps, Partial<Record<IconStyle, boolean>>
```

```patch
const {
   icon,
   color,
   size,
// error-line
-    style: $imageStyleOverride,
// success-line
+    style: $iconStyleOverride,
   containerStyle: $containerStyleOverride,
// success-line-start
+    thin,
+    light,
+    regular,
+    solid,
+    brand,
// success-line-end
   ...WrapperProps
 } = props
```

```patch
  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
// error-line-start
-      <Image
-        style={[
-          $imageStyle,
-          color && { tintColor: color },
-          size && { width: size, height: size },
-          $imageStyleOverride,
-        ]}
-        source={iconRegistry[icon]}
// error-line-end
// success-line-start
+      <VectorIcon
+        name={icon}
+        size={size}
+        color={color}
+        style={$iconStyleOverride}
+        thin={thin}
+        light={light}
+        regular={regular}
+        solid={solid}
+        brand={brand}
// success-line-end
       />
     </Wrapper>
  )

```

## Conclusion

Here's the modified `app/components/Icon.tsx`.


```ts
import * as React from "react"
import { ComponentType } from "react"
import {
  ImageStyle,
  StyleProp,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  Platform,
} from "react-native"
import { createMultiStyleIconSet } from '@expo/vector-icons'

export type IconStyle = keyof typeof iconFonts
export type IconTypes = keyof typeof iconRegistry

// Downloaded from our FA pro-ness pack
const iconFonts = {
  thin: require('../../assets/fonts/fa-thin-100.ttf'),
  light: require('../../assets/fonts/fa-light-300.ttf'),
  regular: require('../../assets/fonts/fa-regular-400.ttf'),
  solid: require('../../assets/fonts/fa-solid-900.ttf'),
  brand: require('../../assets/fonts/fa-brands-400.ttf'),
}

const createFontAwesomeStyle = (style: IconStyle, fontWeight: string) => {
  const fontFile = iconFonts[style]
  return {
    fontFamily: `Font Awesome 6 Pro ${style}`,
    fontFile,
    fontStyle: Platform.select({
      ios: {
        fontWeight,
      },
      default: {},
    }),
    glyphMap: Object.entries(iconRegistry).reduce<{ [key: string]: number }>((acc, [name, unicode]) => {
      acc[name] = parseInt(unicode, 16)
      return acc
    }, {}),
  }
}

interface IconProps extends TouchableOpacityProps, Partial<Record<IconStyle, boolean>> {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

interface VectorIconProps extends TextProps, Partial<Record<IconStyle, boolean>> {
  name?: IconTypes
  size?: number
  color?: string
  width?: string | number
  height?: string | number
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $iconStyleOverride,
    containerStyle: $containerStyleOverride,
    thin,
    light,
    regular,
    solid,
    brand,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <VectorIcon
        name={icon}
        size={size}
        color={color}
        style={$iconStyleOverride}
        thin={thin}
        light={light}
        regular={regular}
        solid={solid}
        brand={brand}

      />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: 'f060',
  bell: 'f0f3',
  caretLeft: 'f0d9',
  caretRight: 'f0da',
  check: 'f00c',
  clap: 'e1a8',
  community: 'f500',
  components: 'f5fd',
  debug: 'f120',
  github: 'f09b',
  heart: 'f004',
  hidden: 'f070',
  ladybug: 'f188',
  lock: 'f023',
  menu: 'f0c9',
  more: 'f141',
  pin: 'f3c5',
  podcast: 'f2ce',
  settings: 'f013',
  slack: 'f198',
  view: 'f06e',
  x: 'f00d',
}

export const VectorIcon: ComponentType<VectorIconProps> & {
  font: { [x: string]: string }
} = createMultiStyleIconSet(
  {
    thin: createFontAwesomeStyle('thin', '100'),
    light: createFontAwesomeStyle('light', '300'),
    regular: createFontAwesomeStyle('regular', '400'),
    solid: createFontAwesomeStyle('solid', '900'),
    brand: createFontAwesomeStyle('brand', '400'),
  },
  // Default font style
  { defaultStyle: 'regular' },
)
```

That's all there is to it! We only added the optional styles prop so if you're using Ignite, things should work.

```ts
<Icon solid icon="community" color={colors.tint} size={24} />
```

```ts
<Icon light icon="check" color={colors.tint} size={24} />
```


### Pro tip
It is recommend to put the config under `app/themes/icons.ts` to keep things organized.

## FAQ

### How about `@expo/vector-icons` built-in icons?

Instead of our custom `VectorIcon`, we just need to use the default exported vector icon like so.
```ts
import VectorIcon from '@expo/vector-icons/Ionicons'
```