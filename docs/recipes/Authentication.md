---
title: Authentication with Supabase
description: How to implement authentication with your React Native project using Supabase as the backend.
tags:
  - authentication
  - supabase
  - login
  - signup
  - session
last_update:
  author: Nick Morgan (@morganick)
  publish_date: 2024-04-12
---

## Overview

Many applications require an external service to authenticate the user. Setting up authentication for your application can feel daunting. Where do I start? What data do I need from my users? What service(s) should or could I use? What are the signup, signin, and other user flows that I'll need?

This recipe is going to use [Supabase](https://supabase.com) as the backend. We'll build some primitives that will allow you to customize the authentication to your needs or existing backend service as well.

## Requirements

Since we're using [Supabase](https://supabase.com) for our backend, it is assumed that you have an account there. We're going to need two pieces of information from that account the project URL and anonymous public key. (Inside your Supabase account, [visit the API credentials section](https://supabase.com/dashboard/project/_/settings/api).)

## Starting Point

We're going to start from a freshly ignited project without any of the boilerplate screens:

```bash title="Terminal"
bunx ignite-cli@latest new AuthRecipe --workflow=cng --remove-demo --git --install-deps --packager=bun
```

:::info
Notice we're using [Expo Continuous Native Generation (CNG)](https://docs.infinite.red/ignite-cli/expo/CNG/). We're also using `bun` in this recipe, but feel free to change that to the package manager of your choice. [Read more about `bun`](https://bun.sh)
:::

Once the app is ignited 🔥, we can make sure everything is working by running the app:

```bash title="Terminal"
cd AuthRecipe
bun run ios
```

✅ **Checkpoint:** The iOS simulator should open up to the welcome screen of the application.

## Build Initial Sign In Screen

We'll use the [ignite generators](https://docs.infinite.red/ignite-cli/concept/Generators/) to generate the Sign In screen:

```bash title="Terminal"
bunx ignite-cli@latest generate screen SignIn
```

:::info
`bunx` auto-installs and runs packages from npm. It's Bun's equivalent of `npx` or `yarn dlx`.
:::

Replace the contents of that screen with the following:

<details>
  <summary>SignInScreen.tsx</summary>

```typescript title="/app/screens/SignInScreen.tsx"
import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Image,
  ImageStyle,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField } from "app/components"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { colors, spacing } from "app/theme"

const logo = require("../../assets/images/logo.png")

interface SignInScreenProps extends AppStackScreenProps<"SignIn"> {}

export const SignInScreen: FC<SignInScreenProps> = observer(
  function SignInScreen() {
    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSignIn = () => {
      // Sign In Flow
      console.log("Sign In Flow", { email, password })
    }

    const onSignUp = () => {
      // Sign Up Flow
      console.log("Sign Up Flow")
    }

    const onForgotPassword = () => {
      // Forgot Password Flow
      console.log("Forgot Password Flow")
    }

    return (
      <Screen
        contentContainerStyle={$root}
        preset="auto"
        safeAreaEdges={["top"]}
      >
        <View style={$container}>
          <View style={$topContainer}>
            <Image style={$logo} source={logo} resizeMode="contain" />
          </View>
          <View style={[$bottomContainer, $bottomContainerInsets]}>
            <View>
              <TextField
                containerStyle={$textField}
                label="Email"
                autoCapitalize="none"
                defaultValue={email}
                onChangeText={setEmail}
              />
              <TextField
                containerStyle={$textField}
                label="Password"
                autoCapitalize="none"
                defaultValue={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>
            <View>
              <Button onPress={onSignIn}>Sign In</Button>
              <Pressable style={$forgotPassword} onPress={onForgotPassword}>
                <Text preset="bold">Forgot Password?</Text>
              </Pressable>
              <Text style={$buttonDivider}>- or -</Text>
              <Button preset="reversed" onPress={onSignUp}>
                Sign Up
              </Button>
            </View>
            <View style={$cap} />
          </View>
        </View>
      </Screen>
    )
  }
)

const $root: ViewStyle = {
  minHeight: "100%",
  backgroundColor: colors.palette.neutral100,
}

const $container: ViewStyle = {
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  height: 200,
  justifyContent: "center",
  alignItems: "center",
}

const $bottomContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $cap: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  height: spacing.xl,
  position: "absolute",
  top: -spacing.xl,
  left: 0,
  right: 0,
}

const $textField: ViewStyle = {
  marginBottom: spacing.md,
}

const $forgotPassword: ViewStyle = {
  marginVertical: spacing.md,
}

const $buttonDivider: TextStyle = {
  textAlign: "center",
  marginVertical: spacing.md,
}

const $logo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}
```

</details>

In order for us to be able to see this new Sign In screen, let's add an `isAuthenticated` conditional to show the "Welcome" screen when the user is signed in and the "Sign In" screen when they are not.

```typescript title="/app/navigators/AppNavigator.tsx"
const AppStack = observer(function AppStack() {
  // success-line
  const isAuthenticated = false
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
      }}
    >
      // success-line-start
      {isAuthenticated ? (
        <>
          {/** 🔥 Your screens go here */}
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
        </>
      ) : (
        <Stack.Screen name="SignIn" component={Screens.SignInScreen} />
      )}
      // success-line-end
    </Stack.Navigator>
  )
})
```

This should cause the application to refresh and display our new Sign In screen. A couple of things to notice here is that we already have `onPress` handlers for our buttons, `onSubmitEditing` handlers for our inputs, and `onChangeText` wired up for updating the `email` and `password` state.

:::info
For brevity, we're leaving out internationalization for this recipe. For `TextInput` labels, we would normally add those into our translation files under the common section as those words will likely be used often.
:::

## Environment Config

We're going to take the project URL and the anonymous public key that we gathered from the [Requirements section](#requirements) and add them to our environment.

```bash title="/.env"
EXPO_PUBLIC_SUPABASE_URL="https://<your-project-id>.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="<your-anon-public-key>"
```

:::tip
Why put these values inside of the environment config? When working on larger projects, it's common to have different URLs and keys for local, testing, staging, and production configurations. You may be thinking "But that's what the base config is for!" However, this assumes that every member of your team is using the same backend URL and key for development. Putting this information in the environment reduces code churn when these values change between the different environments and even team members.
:::

Typically `.env` is not commited to version control so let's update our `.gitignore` to ignore this file:

```git title="/.gitignore"
.env
```

:::info
Expo has great documentation on [using environment variables](https://docs.expo.dev/guides/environment-variables/) if you'd like to know more about how that works.
:::

This allows us to have different configurations for our development, staging, testing, and production environments. For our purposes, we're going to add these values to the base configuration as these props are required for every environment.

```typescript title="/app/config/config.base.ts"
export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  // success-line-start
  supabaseUrl: string
  supabaseAnonKey: string
  // success-line-end
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "dev",

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: "always",

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["Welcome"],
  // success-line-start
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  // success-line-end
}

export default BaseConfig
```

:::note
These new environment variables will not be available until the next time you restart metro either with `bun run ios` or `bun start`.
:::

## Dependencies

For this recipe we've made some specific choices around the packages that we'll use:

- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/installing) - Supabase client to handle authentication requests, sign up users, token refresh, etc.
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) - Fast key/value store we'll use for the session.

```bash title="Terminal"
bunx expo install @supabase/supabase-js react-native-mmkv
```

Since `react-native-mmkv` has a host platform dependency, we'll need to also rebuild the application with:

```bash title="Terminal"
bun ios
# or
bun android
```

## Session Storage

:::note
If you're already using Async Storage in your application, you can take advantage of that and skip this section.
:::

We need a place to store the user's session after they login. This will allow us to log them back in after they close the application or refresh their access token after it has expired. Supabase's client is already setup for Async Storage's API. (e.g. `getItem`, `setItem`, and `removeItem`) We're going to use `react-native-mmkv` as it is not only faster, but has some additional features that we can utilize.

<details>
  <summary>Example session storage implementation</summary>

```typescript title="/app/utils/storage/SessionStorage.ts"
import { MMKV } from "react-native-mmkv"

const storage = new MMKV({
  id: "session",
})

// TODO: Remove this workaround for encryption: https://github.com/mrousavy/react-native-mmkv/issues/665
storage.set("workaround", true)

/**
 * A simple wrapper around MMKV that provides a base API
 * that matches AsyncStorage for use with Supabase.
 */

/**
 * Get an item from storage by key
 *
 * @param {string} key of the item to fetch
 * @returns {Promise<string | null>} value for the key as a string or null if not found
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return storage.getString(key) ?? null
  } catch {
    console.warn(`Failed to get key "${key}" from secure storage`)
    return null
  }
}

/**
 * Sets an item in storage by key
 *
 * @param {string} key of the item to store
 * @param {string} value of the item to store
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    storage.set(key, value)
  } catch {
    console.warn(`Failed to set key "${key}" in secure storage`)
  }
}

/**
 * Removes a single item from storage by key
 *
 * @param {string} key of the item to remove
 */
export async function removeItem(key: string): Promise<void> {
  try {
    storage.delete(key)
  } catch {
    console.warn(`Failed to remove key "${key}" from secure storage`)
  }
}
```

</details>

### Encrypting the User Session

If you'd like to encrypt the user's session because it [contains sensitive information](https://reactnative.dev/docs/security#storing-sensitive-info), you can take advantage of Expo SecureStore and MMKV's encryption. Expo SecureStore will securely store key-value pairs locally on device in the iOS keychain or Android Keystore. The reason we need both is that [Expo SecureStore has a size limit of 2048 bytes](https://docs.expo.dev/versions/latest/sdk/securestore/). The Supabase session is already larger than 2048 bytes by default so we're going to generate a unique key with Expo Crypto to encrypt the Session Store with MMKV and store that key with Expo SecureStore.

First, we'll need to install those additional dependencies:

```bash title="Terminal"
bunx expo install expo-secure-store expo-crypto
```

We'll also need to add Expo SecureStorage to our [plugin configuration](https://docs.expo.dev/versions/latest/sdk/securestore/#configuration-in-appjsonappconfigjs):

```typescript title="/app.json"
...
    "plugins": [
      "expo-localization",
      // success-line
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": false,
            "flipper": false
          },
          "android": {
            "newArchEnabled": false
          }
        }
      ],
      "expo-font"
    ],
...
```

Rebuild the application with:

```bash title="Terminal"
bun ios
# or
bun android
```

Now, we can use Expo SecureStore and Expo Crypto to securely generate and store our encrypting key for MMKV:

```typescript title="/app/utils/storage/SessionStorage.ts"
import { MMKV } from "react-native-mmkv"
// success-line-start
import * as SecureStore from "expo-secure-store"
import * as Crypto from "expo-crypto"

const fetchOrGenerateEncryptionKey = (): string => {
  const encryptionKey = SecureStore.getItem("session-encryption-key")

  if (encryptionKey) {
    return encryptionKey
  } else {
    const uuid = Crypto.randomUUID()
    SecureStore.setItem("session-encryption-key", uuid)
    return uuid
  }
}
// success-line-end

const storage = new MMKV({
  id: "session",
  // success-line
  encryptionKey: fetchOrGenerateEncryptionKey(),
})
```

:::note
If you're using Async Storage and you'd also like to encrypt the user's session, refer to the [Encrypting the user session section](https://supabase.com/blog/react-native-authentication#encrypting-the-user-session) of the Supabase guide.
:::

## Creating and Managing the Session

There are three pieces that we're going to need to create and manage our session: a hook, context, and provider.

### Initializing the Supabase Client

Let's start by creating the file for the hook to initialize the Supabase client with our environment config and `SessionStorage` we set up earlier:

```typescript showLineNumbers title="/app/services/auth/supabase.ts"
import Config from "app/config"
import { createClient } from "@supabase/supabase-js"
import * as SessionStorage from "app/utils/storage/SessionStorage"
import { AppState } from "react-native"

export const supabase = createClient(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: SessionStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

export { type Session, type AuthError } from "@supabase/supabase-js"

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
```

:::note
If you've opted to use Async Storage, change line 11 above to `storage: AsyncStorage`.
:::

:::info
**Why not use PKCE (pronounced pixy) by setting the `flowType: "pkce"`?** It stands for "**P**roof **K**ey for **C**ode **E**xchange". [Read Supabase's write-up about why they did it and how it works](https://supabase.com/blog/supabase-auth-sso-pkce#server-side-and-mobile-auth). You'd ecounter this with doing email confirmation for your sign up process as well as password resets. If you decided to turn it on, sign up will produce the console warning "WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.", but it will still work. Since we currently have email confirmation disabled, we'll save email confirmation and password reset for a future recipe.
:::

Since we're allowing the Supabase client to manage session storage, it will automatically persist changes to the session. We've added an event listener to stop refreshing the session when the application is no longer in the foreground and restart it when it returns to the foreground. The Supabase client will then automatically refresh the session as necessary; one less thing that we'll need to handle manually. 😮‍💨

### Signing Up & Signing In

To keep this simple, we're going to use the same form for both. We'll need to create an `onPress` and `onSubmit` handler for the respective actions that are already stubbed out in the `SignInScreen` we created earlier. You may have more information you'd like to capture (e.g. name, phone number, password confirmation, etc.) when a user signs up. In such a case, create a separate "Sign Up" screen that captures the additional data.

#### Creating Authentication Context & Provider

We're going to be using the session across components, at different depths in our component tree, and with navigation. For this access pattern we'll create a context and provider. This way if that information changes, we'll re-render the entire tree. (e.g. If the user signs out, we'll navigate back to the "Sign In" screen automatically.)

:::tip
Be careful when using contexts as anything that depends on data in the context is going to cause a re-render when the data changes. This can have performance implications if you're re-rendering the entire tree frequently. In the case of authentication, we want to re-render the entire tree when the session is updated as we may need to navigate to the sign in screen if the user's session expires.
:::

Let's setup our `AuthContext` with our session state, add our `AuthProvider`, and create a `useAuth` hook that will return the value of our context:

```typescript title="/app/services/auth/useAuth.tsx"
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react"
import { Session, supabase } from "./supabase"
import { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js"

type AuthState = {
  isAuthenticated: boolean
  token?: Session["access_token"]
}

type SignInProps = {
  email: string
  password: string
}

type SignUpProps = {
  email: string
  password: string
}

type AuthContextType = {
  signIn: (props: SignInProps) => Promise<AuthTokenResponsePassword>
  signUp: (props: SignUpProps) => Promise<AuthResponse>
} & AuthState

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: undefined,
  signIn: () => new Promise(() => ({})),
  signUp: () => new Promise(() => ({})),
})

export function useAuth() {
  const value = useContext(AuthContext)

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuth must be used within an AuthProvider")
    }
  }

  return value
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<AuthState["token"]>(undefined)

  const signIn = useCallback(
    async ({ email, password }: SignInProps) => {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (result.data?.session?.access_token) {
        setToken(result.data.session.access_token)
      }

      return result
    },
    [supabase]
  )

  const signUp = useCallback(
    async ({ email, password }: SignUpProps) => {
      const result = await supabase.auth.signUp({
        email,
        password,
      })

      if (result.data?.session?.access_token) {
        setToken(result.data.session.access_token)
      }

      return result
    },
    [supabase]
  )

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        signIn,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

Now that we have those pieces in place, we can wrap our application with the `AuthProvider` so that we can access the `AuthContext` inside of our compontents and navigation:

```typescript title="/app/app.tsx"
...
import { ViewStyle } from "react-native"
// success-line
import { AuthProvider } from "./services/auth/useAuth"

...

  return (
    // success-line
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <GestureHandlerRootView style={$container}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </SafeAreaProvider>
    // success-line
    </AuthProvider>
  )
}
```

Next, we'll wire up the `isAuthenticated` to the `useAuth` hook inside our `AppStack` to show the "Sign In" screen when the user is not authenticated and the "Welcome" screen when the are:

```typescript title="/app/navigators/AppNavigator.tsx"
...

import { colors } from "app/theme"
// success-line
import { useAuth } from "app/services/auth/useAuth"

...

const AppStack = observer(function AppStack() {
  // error-line
  const isAuthenticated = false
  // success-line
  const { isAuthenticated } = useAuth()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      {isAuthenticated ? (
        <>
          {/** 🔥 Your screens go here */}
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
        </>
      ) : (
        <Stack.Screen name="SignIn" component={Screens.SignInScreen} />
      )}
    </Stack.Navigator>
  )
})

...
```

Lastly, let's wire up the `SignInScreen` to use `signIn` and `signUp` from the `useSession` hook:

```typescript title="/app/screens/SignInScreen.tsx"
...
import { colors, spacing } from "app/theme"
// success-line
import { useAuth } from "app/services/auth/useAuth"

...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  // success-line
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const passwordInput = React.useRef<TextInput>(null)

  const onSignIn = () => {
    // error-line-start
    // Sign In Flow
    console.log("Sign In Flow", { email, password })
    // error-line-end
    // success-line
    signIn({ email, password })
  }

  const onSignUp = () => {
    // error-line-start
    // Sign Up Flow
    console.log("Sign Up Flow")
    // error-line-end
    // success-line
    signUp({ email, password })
  }

...
```

:::warning
Before you try to sign in for the first time, we'll want to make sure that email confirmation is **turned off** inside of this Supabase project. With email confirmation turned on, creating a user will only return the user and **not return the session**. For now, [disable email confirmation in your project](https://supabase.com/dashboard/project/_/auth/providers) by clicking on Authentication > Providers > Email and toggling "Confirm Email" to off.
:::

✅ **Checkpoint:** With those changes you should be able to enter an email and password and press the "Sign Up" button which will create a user, return the session, and navigate you to the "Welcome" screen.

### Signing Out

Oh no! We're stuck in the signed in state. No dark patterns here! Let's fix that by adding the `signOut` action to our `useAuth` hook:

```typescript title="/app/services/auth/useAuth.tsx"
...
type AuthContextType = {
  signIn: (props: SignInProps) => Promise<AuthTokenResponsePassword>
  signUp: (props: SignUpProps) => Promise<AuthResponse>
  // success-line
  signOut: () => void
} & AuthState

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: undefined,
  signIn: () => new Promise(() => ({})),
  signUp: () => new Promise(() => ({})),
  // success-line
  signOut: () => undefined,
})
...
export const AuthProvider = ({ children }: PropsWithChildren) => {
...
  // success-line-start
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setToken(undefined)
  }, [supabase])
  // success-line-end

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        signIn,
        signUp,
        // success-line
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

Now, we'll add the "Sign Out" button and update the screen to show some data from the session:

```typescript title="/app/screens/WelcomeScreen.tsx"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
// error-line
import { Text } from "app/components"
// success-line
import { Button, Text } from "app/components"
import { isRTL } from "../i18n"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
// success-line
import { useAuth } from "app/services/auth/useAuth"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(
  function WelcomeScreen() {
    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
    const { signOut } = useAuth()

    return (
      <View style={$container}>
        <View style={$topContainer}>
          <Image
            style={$welcomeLogo}
            source={welcomeLogo}
            resizeMode="contain"
          />
          <Text
            testID="welcome-heading"
            style={$welcomeHeading}
            // error-line
            tx="welcomeScreen.readyForLaunch"
            // success-line
            text="Congratulations 🎉 You're signed in!"
            preset="heading"
          />
          <Text tx="welcomeScreen.exciting" preset="subheading" />
          <Image
            style={$welcomeFace}
            source={welcomeFace}
            resizeMode="contain"
          />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          // error-line
          <Text tx="welcomeScreen.postscript" size="md" />
          // success-line
          <Button onPress={signOut}>Sign Out</Button>
        </View>
      </View>
    )
  }
)
```

If you're anything like me, you may have noticed that the screen transition always sliding to the left seems off. The way we mentally feel about "Sign In" and "Sign Out" is entering and existing. The way the animations are working right now, it feels like we just keep signing in. Let's adjust that navigation transition:

```typescript title="/app/navigators/AppNavigator.tsx"
...
const AppStack = observer(function AppStack() {
  const { isAuthenticated } = useAuth()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      {isAuthenticated ? (
        <>
          {/** 🔥 Your screens go here */}
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
        </>
      ) : (
        <Stack.Screen
          name="SignIn"
          component={Screens.SignInScreen}
          // success-line
          options={{ animationTypeForReplace: "pop" }}
        />
      )}
    </Stack.Navigator>
  )
})
...
```

All is right with the world again. 😅

✅ **Checkpoint:** You should now be able to sign up, sign in, and sign out. This is a good time to commit what you have.

### Listening for Session Changes

As noted earlier, we're listening for changes in the `AppState` for when the application comes back to the foreground. However, there are other session events we should listen for such as signing out of all devices, user updates, password recovery, etc. [Checkout "Listen to Auth Events" in the Supabase docs for detailed information about each event.](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)

To listen for these authentication state changes, we can subscribe to those events when the application initially loads.

```typescript title="/app/services/auth/useAuth.tsx"
...
// error-line
import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from "react"
// success-line
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"
...
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<AuthState["token"]>(undefined)

  // success-line-start
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "SIGNED_OUT":
          setToken(undefined)
          break
        case "INITIAL_SESSION":
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          setToken(session?.access_token)
          break
        default:
        // no-op
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])
  // success-line-end
...
```

## Loading States

Those with a keen eye will notice that our `AuthContext` does not contain loading states. There's a reason for that. Loading states should be local to the UI that initiated them. Using loading states can make your application feel more responsive and set proper expectations for the user. You may have also noticed that our `signIn` function returns a promise. Let's add a loading state for the "Sign In" flow and (a)wait for the sign up request to complete:

```typescript title="/app/screens/SignInScreen.tsx"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // success-line
  const [isSigningIn, setIsSigningIn] = useState(false)

  // error-line-start
  const onSignIn = () => {
    signIn({ email, password })
  // error-line-end
  // success-line-start
  const onSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signIn({ email, password })
    } finally {
      setIsSigningIn(false)
    }
  // success-line-end
  }
  ...
            // error-line
            <Button onPress={onSignIn}>Sign In</Button>
            // success-line-start
            <Button onPress={onSignIn}>
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
            // success-line-end
            ...

```

🙌 Easy, let's do the same thing for sign up:

```typescript title="/app/screens/SignInScreen.tsx"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)
  // success-line
  const [isSigningUp, setIsSigningUp] = useState(false)

  const onSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signIn({ email, password })
    } finally {
      setIsSigningIn(false)
    }
  }

  // error-line-start
  const onSignUp = () => {
    signUp({ email, password })
  // error-line-end
  // success-line-start
  const onSignUp = async () => {
    try {
      setIsSigningUp(true)
      await signUp({ email, password })
    } finally {
      setIsSigningUp(false)
    }
  // success-line-end
  }
  ...
            // error-line
            <Button preset="reversed" onPress={onSignUp}>Sign Up</Button>
            // success-line-start
            <Button preset="reversed" onPress={onSignUp}>
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </Button>
            // success-line-end
            ...

```

Lastly, should a user be able to sign up and sign in at the same time? No. We can use a combined loading state to disable the buttons and make the text inputs read only while we are either signing in or signing up:

```typescript title="/app/screens/SignInScreen.tsx"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  // success-line
  const isLoading = isSigningIn || isSigningUp
...
          <View>
            <TextField
              containerStyle={$textField}
              label="Email"
              autoCapitalize="none"
              defaultValue={email}
              onChangeText={setEmail}
              // success-line
              readOnly={isLoading}
            />
            <TextField
              containerStyle={$textField}
              label="Password"
              autoCapitalize="none"
              defaultValue={password}
              secureTextEntry
              onChangeText={setPassword}
              // success-line
              readOnly={isLoading}
            />
          </View>
          <View>
            // success-line
            <Button onPress={onSignIn} disabled={isLoading}>
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
            // success-line
            <Pressable style={$forgotPassword} onPress={onForgotPassword} disabled={isLoading}>
              <Text preset="bold">Forgot Password?</Text>
            </Pressable>
            <Text style={$buttonDivider}>- or -</Text>
            // success-line
            <Button preset="reversed" onPress={onSignUp} disabled={isLoading}>
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </Button>
          </View>
        </View>
```

No more double sign up or sign in requests. This bit of defensive programming is minimal additional effort that saves you and your team time down the road as your users will not encounter that issue.

## Error Handling

What would you expect to happen if the user submitted an empty form for Sign In or Sign Up? What if they submit an email and no password or vice versa? What if there's a network issue? What if there's a service outage? How can we allow the user to self diagnose the issue if it's something they can correct? That's where good error handling comes in. So let's start with errors on form submission.

There's a reason that we return the result to the caller so we can present these errors locally to the user.

```typescript title="/app/screens/SignInScreen.tsx"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // success-line
  const [error, setError] = useState<string | undefined>(undefined)
...
  const onSignIn = async () => {
    try {
      setIsSigningIn(true)
      // success-line
      setError(undefined)

      // error-line
      await signIn({ email, password })
      // success-line-start
      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      }
      // success-line-end
    } finally {
      setIsSigningIn(false)
    }
  }

  const onSignUp = async () => {
    try {
      setIsSigningUp(true)
      // success-line
      setError(undefined)

      // error-line
      await signUp({ email, password })
      // success-line-start
      const { error } = await signUp({ email, password })
      if (error) {
        setError(error.message)
      }
      // success-line-end
    } finally {
      setIsSigningUp(false)
    }
  }
  ...
    return (
    <Screen
      contentContainerStyle={$root}
      preset="auto"
      safeAreaEdges={["top"]}
    >
      <View style={$container}>
        <View style={$topContainer}>
          <Image style={$logo} source={logo} resizeMode="contain" />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          // success-line
          {error && <Text style={$errorText}>{error}</Text>}
          <View>
...
```

Now if there is an issue with our authentication request, the user will be one step closer to understanding why. But why would we send authentication requests that we **know** are going to fail? We shouldn't and we'll fix that next. We're going to add some simple form validation to validate the values of our text inputs. We not only want to make sure that both text inputs have values, but that they are also valid values. (e.g. an email address)

```typescript title="/app/screens/SignInScreen.tsx"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // success-line
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(new Map())
...
  // success-line-start
  const validateForm = () => {
    const errors: Map<string, string> = new Map()

    if (!email || email.split("@").length !== 2) {
      errors.set("Email", "must be valid email")
    }

    if (!password) {
      errors.set("Password", "cannot be blank")
    }

    return errors
  }
  // success-line-end

  const onSignIn = async () => {
    try {
      setIsSigningIn(true)
      setError(undefined)

      // success-line-start
      const errors = validateForm()
      setValidationErrors(errors)
      if (errors.size > 0) return
      // success-line-end

      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  const onSignUp = async () => {
    try {
      setIsSigningUp(true)
      setError(undefined)

      // success-line-start
      const errors = validateForm()
      setValidationErrors(errors)
      if (errors.size > 0) return
      // success-line-end

      const { error } = await signUp({ email, password })
      if (error) {
        setError(error.message)
      }
    } finally {
      setIsSigningUp(false)
    }
  }
...
          <View>
            <TextField
              containerStyle={$textField}
              label="Email"
              autoCapitalize="none"
              defaultValue={email}
              onChangeText={setEmail}
              readOnly={isLoading}
              // success-line-start
              helper={validationErrors.get("Email")}
              status={validationErrors.get("Email") ? "error" : undefined}
              // success-line-end
            />
            <TextField
              containerStyle={$textField}
              label="Password"
              autoCapitalize="none"
              defaultValue={password}
              secureTextEntry
              onChangeText={setPassword}
              readOnly={isLoading}
              // success-line-start
              helper={validationErrors.get("Password")}
              status={validationErrors.get("Password") ? "error" : undefined}
              // success-line-end
            />
...
```

✅ **Checkpoint:** At this point, everything is working as expected and we're giving the user valuable feedback throughout the process.

Before we wrap this up, there is one more thing we should do for the user experience of our sign up and sign in form.

## Form & Input Affordances

These are the little details that help our UI be a bit more precise, reduce mistakes, and help guide the user through the process. Tweaks like these have outsized benefits for the size of the code change.

One such detail is already in place; `autoCapitalize="none"`. If you've ever tried to put in your email address only to frustratingly have the first character continually capitalized, this was the culprit.

### Keyboard Type & Auto Complete

We have an email address as our first text input. Let's use the keyboard that's specific for that by setting the `inputMode` and setup auto complete for these fields for use with autofill:

```typescript title="/app/screens/SignInScreen.tsx"
...
            <TextField
              autoCapitalize="none"
              // success-line-start
              autoComplete="email"
              autoCorrect={false}
              // success-line-end
              containerStyle={$textField}
              defaultValue={email}
              helper={validationErrors.get("Email")}
              // success-line
              inputMode="email"
              label="Email"
              onChangeText={setEmail}
              readOnly={isLoading}
              status={validationErrors.get("Email") ? "error" : undefined}
            />
             <TextField
              autoCapitalize="none"
              // success-line-start
              autoComplete="current-password"
              autoCorrect={false}
              // success-line-end
              containerStyle={$textField}
              defaultValue={password}
              helper={validationErrors.get("Password")}
              label="Password"
              onChangeText={setPassword}
              readOnly={isLoading}
              secureTextEntry
              status={validationErrors.get("Password") ? "error" : undefined}
            />
...
```

:::note
We're using `current-password` for auto complete for the password field since the sign in flow will be used more frequently by the user. If you split out the "Sign Up" into its own form, use `new-password` to give autofill a better cue for that flow. [Read the `autoComplete` docs for all of the available options and support](https://reactnative.dev/docs/textinput#autocomplete).
:::

### Keyboard Flow

We can also setup directives to display the "Next" and "Done" buttons on the keyboard (return key) when the user has certain fields focused. We can also direct the cursor around or trigger events when those buttons are pressed:

1. When the "Email" field is focused, set the return key to read "Next".
2. When the "Next" return key is pressed, focus the "Password" field.
3. When the "Password" field is focused, set the return key to read "Done"
4. When the "Done" return key is pressed, trigger the sign in process.

```typescript title="/app/screens/SignInScreen.tsx"
// error-line
import React, { FC, useState } from "react"
// success-line
import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
// error-line
import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
// success-line
import { Image, ImageStyle, Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native"
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  ...
  const isLoading = isSigningIn || isSigningUp

  // success-line
  const passwordInput = useRef<TextInput>(null)

  const onSignIn = async () => {
...
          <View>
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              containerStyle={$textField}
              defaultValue={email}
              helper={validationErrors.get("Email")}
              inputMode="email"
              label="Email"
              onChangeText={setEmail}
              // success-line
              onSubmitEditing={() => passwordInput.current?.focus()}
              readOnly={isLoading}
              // success-line
              returnKeyType="next"
              status={validationErrors.get("Email") ? "error" : undefined}
            />
            <TextField
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              containerStyle={$textField}
              defaultValue={password}
              helper={validationErrors.get("Password")}
              label="Password"
              onChangeText={setPassword}
              // success-line
              onSubmitEditing={onSignIn}
              readOnly={isLoading}
              ref={passwordInput}
              // success-line
              returnKeyType="done"
              secureTextEntry
              status={validationErrors.get("Password") ? "error" : undefined}
            />
          </View>
```

:::tip
Once the props for the component get long enough, alphabetizing them can help make that a bit more manageable.
:::

### Show Password

Thanks to Ignite's prebuilt components, adding this little bit of functionality is pretty simple. Here we'll use the demo code that Ignite projects generate with; unless you opt-out like we did.

```typescript title="/app/screens/SignInScreen.tsx"
// error-line
import React, { ComponentType, FC, useRef, useState } from "react"
// success-line
import React, { ComponentType, FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Image,
  ImageStyle,
  Pressable,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
// error-line
import { Button, Screen, Text, TextField } from "app/components"
// success-line-start
import {
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "app/components"
// success-line-end
...
export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  ...
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // success-line
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  ...
  // success-line-start
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          />
        )
      },
    [isPasswordHidden],
  )
  // success-line-end

  return (
    <Screen
      contentContainerStyle={$root}
      preset="auto"
      safeAreaEdges={["top"]}
    >
  ...
              <TextField
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              containerStyle={$textField}
              defaultValue={password}
              helper={validationErrors.get("Password")}
              labelTx="common.password"
              onChangeText={setPassword}
              onSubmitEditing={onSubmit}
              readOnly={isLoading}
              ref={passwordInput}
              returnKeyType="send"
              // error-line
              secureTextEntry
              // success-line-start
              RightAccessory={PasswordRightAccessory}
              secureTextEntry={isPasswordHidden}
              // success-line-end
              status={validationErrors.get("Password") ? "error" : undefined}
            />
  ...
```

## 🎉 Congratulations!

You now have an application that can sign users up, in, and out that handles token refresh, listens for background session changes, stores the user's session securely, handles error & loading states, and has the proper form affordances for your workflows.
