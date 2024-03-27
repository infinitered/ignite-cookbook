---
title: PowerSync and Supabase for Local-First Data Management
description: Enhance your app with PowerSync and Supabase for efficient data synchronization between your app's local database and backend
tags:
  - PowerSync
  - React Native
  - Backend
  - State management
  - Database
  - Data Synchronization
  - Offline Support
last_update:
  author: Trevor Coleman
publish_date: 2024-03-22
---

# PowerSync and Supabase for Local-First Data Management

## Introduction

This guide helps you integrate PowerSync with Supabase in an Ignite app for efficient local-first data management.

[PowerSync](https://www.powersync.com/) allows your app to work smoothly offline while keeping the data in sync with your backend database.

### What is Powersync?

PowerSync is a service which synchronizes local data with your Postgres SQL back end. It lets your app work with a local copy of the users' data and automatically syncs changes to and from your backend.

Because your application interacts with the data in a local instance of SQLite, it means you'll always have fast, responsive access -- no fetching, no spinners. It also means
your users will have a seamless, consistent experience even if they are offline.

In the background, Powersync queues any changes and syncs the local data with the server whenever an internet connection becomes available. That means the data stays up to date across all of their devices.

### Benefits of Using Powersync

* **Handles Intermittent Network Connectivity**: Powersync allows your app to remain operational even in areas with
  unreliable internet access. Users can continue their tasks without interruption, with automatic syncing when the
  connection is restored.
* **Enables Offline Operation**: With Powersync, your application can fully function offline, allowing users to access
  and interact with their data regardless of their internet connection status.
* **Eliminates Loading Delays**: Leveraging local data minimizes the need for loading indicators, offering a smoother,
  faster experience for the user.
* **Supports Multi-device Sync**: Powersync ensures data consistency across all of a user's devices, enabling seamless
  access and transition between different platforms.
  By integrating Powersync into your Ignite project, you provide a more reliable and user-friendly experience, ensuring
  your application remains functional and responsive under various network conditions.

### Using Other Backends

While this recipe uses Supabase for the backend, PowerSync can connect to almost any Postgres SQL backend and the process will be largely identical for other types of Postgres backends.

The major difference is that when the time comes, you will need to implement a `PowerSyncBackendConnector` for your database in place of the `SupabaseConnector`.

Check the [PowerSync documentation](https://docs.powersync.com/) for more information on connecting your database to PowerSync.

## Prerequisites

To complete this recipe you'll need:

1. **An Ignite app using `Expo CNG` or `Bare` workflow**

   PowerSync requires native modules, so you cannot use Expo Go

   You can create a new Ignite app using the Ignite CLI::
   ```bash
   npx ignite-cli@latest new PowerSyncIgnire --remove-demo --workflow=cng --yes
   ```

2. **A Supabase Project set up and connected to a PowerSync**

  - Follow the [PowerSync + Supabase Integration Guide](https://docs.powersync.com/integration-guides/supabase-+-powersync) to get this set up -- both PowerSync and Supabase have free tiers that you can use to get started.

3. **Configure or Disable Supabase Email Verification**

  - By default, Supabase requires email verification for new users. This should be configured for any production apps.
  - For the purposes of this recipe, you can disable this in the Supabase dashboard under:
    - **Authentication** > **Providers** > **Email** > **Confirm Email**

## Installing SDK and Dependencies

### Install necessary dependencies for PowerSync.

First install the PowerSync SDK and its dependencies.

```shell
npx expo install \
  @journeyapps/powersync-sdk-react-native \
  @journeyapps/react-native-quick-sqlite \
```

Powersync [requires polyfills](https://github.com/powersync-ja/powersync-js/blob/main/packages/powersync-sdk-react-native/README.md#install-polyfills)
to replace browser-specific APIs with their React Native equivalents. These are listed as peer-dependencies so we need
to install them ourselves.

```shell
npx expo install \
  react-native-fetch-api \
  react-native-polyfill-globals \
  react-native-url-polyfill \
  text-encoding \
  web-streams-polyfill@^3.2.1 \
  base-64 \
  @azure/core-asynciterator-polyfill \
  react-native-get-random-values
```

:::note
At the time of writing the PowerSync SDK is not compatible with `web-streams-polyfill@4.0.0`, so be sure to specify version `^3.2.1`.
:::

:::note
These dependencies include native modules so you'll need to rebuild your app after installing.
:::

### Install necessary dependencies for Supabase

First we need to install the Supabase SDK.

```shell
npx expo install @supabase/supabase-js
```

and we'll also need to install `@react-native-async-storage/async-storage` for persisting the Supabase session.

```shell
npx expo install @react-native-async-storage/async-storage
```

### Configuring Babel and Polyfills

#### Import polyfills at App entry

Ensure polyfills are imported in your app's entry file, typically `App.tsx`:

```ts
import "react-native-polyfill-globals/auto";
import "@azure/core-asynciterator-polyfill";
```

:::tip
In a fresh Ignite app, this would be in `app/app.tsx`. and placed at the top of the list of imports, right after
the Reactotron config.
:::

#### Add Babel Plugin

Update `babel.config.js` to include the `transform-async-generator-functions` plugin:

```js
/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
        //... other plugins
        // success-line
        '@babel/plugin-transform-async-generator-functions',  // <-- Add this
        /** NOTE: This must be last in the plugins @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin */
        "react-native-reanimated/plugin",
    ]

```

## Authenticating with Supabase

PowerSync requires a valid session token to connect to the Supabase backend, so we'll need to set up some basic authentication.

### Add Supabase Config Variables to Your App Config

First add your Supabase config to your app's configuration. In ignite apps, config is kept in `app/config/config.base.ts`.

You'll need:

- **supabaseUrl**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project URL**.
- **supabaseAnonKey**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project API
  keys**.

```ts
// `app/config/config.base.ts`:

// update the interface to include the new properties
export interface ConfigBaseProps {
  // Existing config properties
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Add the new properties to the config object
const BaseConfig: ConfigBaseProps = {
  // Existing config values
  supabaseUrl: '<<YOUR_SUPABASE_URL>>',
  supabaseAnonKey: '<<YOUR_SUPABASE_ANON_KEY>>',
};
```

:::tip
If you have different configurations for different environments, you can add these properties to `config.dev.ts` and `config.prod.ts` as needed.
:::

### Initializing the Supabase Client

Create `app/services/database/supabase.ts` and add the following code to initialize the Supabase client:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from "@supabase/supabase-js"

export const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
  auth: {
    persistSession: true, storage: AsyncStorage,
  },
})
```

:::info Persisting the Supabase Session
Unlike web environments where `localStorage` is available, in React Native Supabase requires us to provide a key-value store to hold the session token.

We're using `AsyncStorage` here for simplicity, but for encrypted storage, supabase provides an example of encrypting the session token using `expo-secure-storage` in their [React Native Auth example](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?auth-store=secure-store#initialize-a-react-native-app)
:::

### Authenticating with Supabase

Powersync needs a valid session token to connect to the Supabase, so We'll need a hook and context to manage our authentication state.

This is a basic example that uses a context to manage the authentication state and a hook to access that state in your components.

Add the following code to `app/services/database/use-auth.tsx`:

```tsx
// app/services/database/use-auth.tsx
import {User} from "@supabase/supabase-js"
import {supabase} from "app/services/database/supabase"
import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from "react"

type AuthContext = {
  signIn: (email: string, password: string) => void
  signUp: (email: string, password: string) => void
  signOut: () => void
  signedIn: boolean
  loading: boolean
  error: string
  user: User | null
}

// We initialize the context with null to ensure that it is not used outside of the provider
const AuthContext = createContext<AuthContext | null>(null)

/**
 * AuthProvider manages the authentication state and provides the necessary methods to sign in, sign up and sign out.
 */
export const AuthProvider = ({children}: PropsWithChildren<any>) => {
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)


  // Sign in with provided email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError("")
    setUser(null)
    try {
      const {data: {session, user}, error} = await supabase.auth.signInWithPassword({email, password})
      if (error) {
        setSignedIn(false)
        setError(error.message)
      } else if (session && user) {
        setSignedIn(true)
        setUser(user)
      }
    } catch (error: any) {
      setError(error?.message ?? "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [
    setSignedIn, setLoading, setError, setUser, supabase
  ])

  // Create a new account with provided email and password
  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError("")
    setUser(null)
    try {
      const {data, error} = await supabase.auth.signUp({email, password})
      if (error) {
        setSignedIn(false)
        setError(error.message)
      } else if (data.session) {
        await supabase.auth.setSession(data.session)
        setSignedIn(true)
        setUser(data.user)
      }
    } catch (error: any) {
      setUser(null)
      setSignedIn(false)
      setError(error?.message ?? "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [
    setSignedIn, setLoading, setError, setUser, supabase
  ])

  // Sign out the current user
  const signOut = useCallback(async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setError("")
    setSignedIn(false)
    setLoading(false)
    setUser(null)
  }, [
    setSignedIn, setLoading, setError, setUser, supabase
  ])

  // Always memoize context values as they can cause unnecessary re-renders if they aren't stable!
  const value = useMemo(() => ({
    signIn, signOut, signUp, signedIn, loading, error, user
  }), [
    signIn, signOut, signUp, signedIn, loading, error, user
  ])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  // It's a good idea to throw an error if the context is null, as it means the hook is being used outside of the provider
  if (context === null) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}

```

:::tip
For more information on setting up authentication with Supabase (including setting up for OAuth providers like Github, Google and Facebook), refer to the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).
:::

### Providing Auth State to Your Application

Wrap your app with the `AuthProvider` to provide the authentication state to your app:

```tsx
// app/app.tsx
// ...other imports
// success-line
import {AuthProvider} from "app/services/database/use-auth"

// ...
function App(props: AppProps) {
  // ...
  return (
    // success-line
    <AuthProvider>
      <SafeAreaProvider>
        {/* ... */}
      </SafeAreaProvider>
      // success-line
    </AuthProvider>
  );
}


```

### Create a Sign-In Screen

First use the Ignite CLI to generate a new screen for signing in:

```shell
npx ignite-cli generate screen Auth
```

:::note
This will:

* create a new screen in `app/screens/AuthScreen.tsx`,
* add that screen to the `AppNavigator` in `app/navigators/AppNavigator.tsx`, and
* update the `Params` and `ScreenProps` types
  :::

Then open `app/screens/AuthScreen.tsx` and update the `AuthScreen` component to use the `useAuth` hook to sign in.

When the user signs in successfully, the app will automatically navigate to the `Welcome` screen.

```tsx
import {Button, Text, TextField} from "app/components"
import {AppStackScreenProps} from "app/navigators"
import {useAuth} from "app/services/auth/use-auth"
import React, {useEffect, useState} from "react"
import {ActivityIndicator, Modal, TextStyle, View, ViewStyle} from "react-native"
import {colors, spacing} from "../theme"

interface AuthScreenProps extends AppStackScreenProps<"Auth"> {}

export const AuthScreen: React.FC<AuthScreenProps> = ({navigation}) => {
  const {signUp, signIn, loading, error, user} = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async () => {
    signIn(email, password)
  }

  const handleSignUp = async () => {
    signUp(email, password)
  }

  useEffect(() => {
    if (user) {
      navigation.navigate("Welcome")
    }
  }, [user])

  return (
    <View style={$container}>
      <Text preset={"heading"}>Sign in or Create Account</Text>
      <TextField
        inputWrapperStyle={$inputWrapper}
        containerStyle={$inputContainer}
        label={"Email"}
        value={email}
        inputMode={"email"}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize={"none"}
      />
      <TextField
        containerStyle={$inputContainer}
        inputWrapperStyle={$inputWrapper}
        label={"Password"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={$buttonContainer}>
        <Button
          disabled={loading}
          text={"Sign In"}
          onPress={handleSignIn}
          style={$button}
          preset={"reversed"}
        />

        <Button disabled={loading}
                text={"Register New Account"}
                onPress={handleSignUp}
                style={$button}
        /></View>
      {error
       ? <Text style={$error} text={error}/>
       : null}
      <Modal transparent visible={loading}>
        <View style={$modalBackground}>
          <ActivityIndicator size="large" color={colors.palette.primary500}/>
        </View>
      </Modal>
    </View>
  )
}

// Styles
const $container: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}
const $inputContainer: TextStyle = {
  marginTop: spacing.md,
}
const $inputWrapper: TextStyle = {
  backgroundColor: colors.palette.neutral100,
}
const $modalBackground: ViewStyle = {
  alignItems: "center",
  backgroundColor: "#00000040",
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-around",
}
const $error: TextStyle = {
  color: colors.error,
  marginVertical: spacing.md,
  textAlign: "center",
  width: "100%",
  fontSize: 20,
}
const $buttonContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginVertical: spacing.md,
}
const $button: ViewStyle = {
  marginTop: spacing.xs,
}


```

### Update the Welcome Screen

We don't need any of the content on the Welcome screen, so for now lets clear it out and replace it with a simple screen to confirm that sign in is working.

```tsx
import {useAuth} from "app/services/auth/use-auth"
import {observer} from "mobx-react-lite"
import React, {FC} from "react"
import {ViewStyle} from "react-native"
import {Text} from 'app/components'
import {
  Button,
} from "app/components"
import {SafeAreaView} from "react-native-safe-area-context"
import {AppStackScreenProps} from "../navigators"
import {colors} from "../theme"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {

  const {signOut} = useAuth()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <SafeAreaView style={$container}>
      <Text preset="heading" text="Signed In"/>
      <Button
        text="Sign Out"
        onPress={handleSignOut}/>
    </SafeAreaView>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  justifyContent: 'flex-start',
  height: '100%',
}
```

### Update the App Navigator

We don't want to allow users to navigate to the Welcome screen if they are not signed in.

We can ensure this by checking the user's authentication status in the `AppNavigator` and only allowing them to access the `Auth` screen if they are not signed in.

```tsx
// app/navigation/AppNavigator.tsx

//...

const AppStack = observer(function AppStack() {
  // Fetch the user from the auth context
  // success-line
  // success-line
  const {signedIn} = useAuth()
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, navigationBarColor: colors.background}}
    >
      {/**
       * by wrapping the Welcome screen in a conditional, we ensure that
       * the user can only access it if they are signed in
       */}
      // success-line
      {signedIn
        // success-line
       ? <Stack.Screen name="Welcome" component={Screens.WelcomeScreen}/>
        // success-line
       : null
        // success-line
      }
      <Stack.Screen name="Auth" component={Screens.AuthScreen}/>
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

// ...
```

:::tip
For more information on Authentication flows with `react-navigation` see their docs: https://reactnavigation.org/docs/auth-flow/
:::

### Checking In

At this point you should be able to:

- **sign in** and **sign out** of your app
- **sign up** for a new account.

If you are getting errors about an unverified email -- remember to disable email verification in the Supabase dashboard as described in the [Prerequisites](#prerequisites) section.

## Connecting PowerSync to Supabase

Now that we have a valid Supabase session, we can connect to PowerSync and start syncing data between the local database and the backend.

We'll need to:

1. Adding our PowerSync URL to the app configuration
2. Defining our data schema
3. Connecting to the database

### Add your PowerSync URL to your app config

Just like we did with supabase, add the PowerSync URL to your app's configuration.

Your PowerSync URL can be found in your **PowerSync dashboard**:

1. Click on the **Edit Instance** button for your instance
2. Copy the **Instance URL** from the dialog that appears.

```ts
// `app/config/config.base.ts`:

// update the interface to include the new properties
export interface ConfigBaseProps {
  // Existing config properties
  supabaseUrl: string;
  supabaseAnonKey: string;
  //success-line
  powerSyncUrl: string;
}

// Add the new properties to the config object
const BaseConfig: ConfigBaseProps = {
  // Existing config values
  supabaseUrl: '<<YOUR_SUPABASE_URL>>',
  supabaseAnonKey: '<<YOUR_SUPABASE_ANON_KEY>>',
  // success-line
  powerSyncUrl: '<<YOUR_POWER_SYNC_URL>>',
};
```

### Defining Your Schema

First we need to define the schema for our database and TypeScript types in `app/services/database/schema.ts`.

The Schema defines the data that PowerSync will sync between the local SQLite database and the backend.

From the [PowerSync docs](https://docs.powersync.com/usage/installation/client-side-setup/define-your-schema#react-native-and-expo):
> The types available are `TEXT`, `INTEGER` and `REAL`. These should map directly to the values produced by the [Sync Rules](https://docs.powersync.com/usage/sync-rules). If a value doesn't match, it is cast automatically.

#### Typescript Types

It's good to also define TypeScript types for your records, as this will help with type checking and autocompletion in your code.

Keeping them with the schema will help keep your code organized and easy to maintain.

#### The Schema for our Todo App

Here is the schema we'll be using for our todo app:

```ts
// app/services/database/schema.ts
import {
  Column,
  ColumnType,
  Index,
  IndexedColumn,
  Schema,
  Table
} from '@journeyapps/powersync-sdk-react-native';

export const TODO_TABLE = 'todos';
export const LIST_TABLE = 'lists';

export interface ListRecord {
  id: string;
  name: string;
  created_at: string;
  owner_id?: string;
}

export interface TodoRecord {
  id: string;
  created_at: string;
  completed: boolean;
  description: string;
  completed_at?: string;
  created_by: string;
  completed_by?: string;
  list_id: string;
  photo_id?: string;
}

export const AppSchema = new Schema([
  new Table({
    name: 'todos',
    columns: [
      new Column({name: 'list_id', type: ColumnType.TEXT}),
      new Column({name: 'created_at', type: ColumnType.TEXT}),
      new Column({name: 'completed_at', type: ColumnType.TEXT}),
      new Column({name: 'description', type: ColumnType.TEXT}),
      new Column({name: 'completed', type: ColumnType.INTEGER}),
      new Column({name: 'created_by', type: ColumnType.TEXT}),
      new Column({name: 'completed_by', type: ColumnType.TEXT})
    ],
    indexes: [
      new Index({
        name: 'list',
        columns: [new IndexedColumn({name: 'list_id'})]
      })
    ]
  }),
  new Table({
    name: 'lists',
    columns: [
      new Column({name: 'created_at', type: ColumnType.TEXT}),
      new Column({name: 'name', type: ColumnType.TEXT}),
      new Column({name: 'owner_id', type: ColumnType.TEXT})
    ]
  }),
]);

```

:::tip Automated Schema Generation
PowerSync can generate a Javascript version of your schema for you.

1. Right-click on your instance in the PowerSync dashboard
2. Select "Generate Client-Side Schema".

This will generate a schema definition in javascript that will give you a good starting point for building the rest of your schema.
:::

### Implementing the SupabaseConnector

To tell PowerSync how to connect to the database we'll create a `SupabaseConnector`, which implements the `PowerSyncBackendConnector` interface with methods for fetching credentials and uploading data.

#### PowerSyncBackendConnector Interface

The Supabase Connector needs to implement the `PowerSyncBackendConnector` interface ([declared here](https://github.com/powersync-ja/powersync-js/blob/main/packages/powersync-sdk-common/src/client/connection/PowerSyncBackendConnector.ts)), ensuring it can seamlessly
communicate with PowerSync for data synchronization.

The interface is straightforward and only requires two methods:

```ts
// from @journeyapps/powersync-sdk-common
// see: https://github.com/powersync-ja/powersync-js/blob/main/packages/powersync-sdk-common/src/client/connection/PowerSyncBackendConnector.ts
export interface PowerSyncBackendConnector {
  /** Allows the PowerSync client to retrieve an authentication token from your backend
   * which is used to authenticate against the PowerSync service.
   *
   * This should always fetch a fresh set of credentials - don't use cached
   * values.
   *
   * Return null if the user is not signed in. Throw an error if credentials
   * cannot be fetched due to a network error or other temporary error.
   *
   * This token is kept for the duration of a sync connection.
   */
  fetchCredentials: () => Promise<PowerSyncCredentials | null>;

  /** Upload local changes to the app backend.
   *
   * Use {@link AbstractPowerSyncDatabase.getCrudBatch} to get a batch of changes to upload.
   *
   * Any thrown errors will result in a retry after the configured wait period (default: 5 seconds).
   */
  uploadData: (database: AbstractPowerSyncDatabase) => Promise<void>;
}
```

#### SupabaseConnector

In `app/services/database/supabase.ts`, we'll add the two methods, and then export an object that implements the `PowerSyncBackendConnector` interface.

```ts

import {
  AbstractPowerSyncDatabase,
  CrudEntry, PowerSyncBackendConnector,
  UpdateType, PowerSyncCredentials
} from "@journeyapps/powersync-sdk-react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from "@supabase/supabase-js"
import Config from "app/config"

export const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
  auth: {
    persistSession: true, storage: AsyncStorage,
  },
})


// This function fetches the session token from Supabase, it should return null if the user is not signed in, and the session token if they are.
async function fetchCredentials(): Promise<PowerSyncCredentials | null> {
  const {data: {session}, error} = await supabase.auth.getSession()

  if (error) {
    throw new Error(`Could not fetch Supabase credentials: ${error}`)
  }

  if (!session) {
    return null
  }

  return {
    endpoint: Config.powersyncUrl,
    token: session.access_token ?? "",
    expiresAt: session.expires_at
               ? new Date(session.expires_at * 1000)
               : undefined
  }
}


// Response codes indicating unrecoverable errors.
const FATAL_RESPONSE_CODES = [
  /^22...$/, // Data Exception
  /^23...$/, // Integrity Constraint Violation
  /^42501$/, // INSUFFICIENT PRIVILEGE
]

// Powersync will call this function to upload data to the backend
const uploadData: (database: AbstractPowerSyncDatabase) => Promise<void> = async (database) => {
  const transaction = await database.getNextCrudTransaction();

  if (!transaction) {
    return;
  }


  let lastOp: CrudEntry | null = null;
  try {
    // Note: If transactional consistency is important, use database functions
    // or edge functions to process the entire transaction in a single call.
    for (const op of transaction.crud) {
      lastOp = op;
      const table = supabase.from(op.table);
      let result: any = null;
      switch (op.op) {
        case UpdateType.PUT:
          // eslint-disable-next-line no-case-declarations
          const record = {...op.opData, id: op.id};
          result = await table.upsert(record);
          break;
        case UpdateType.PATCH:
          result = await table.update(op.opData).eq('id', op.id);
          break;
        case UpdateType.DELETE:
          result = await table.delete().eq('id', op.id);
          break;
      }

      if (result?.error) {
        throw new Error(`Could not ${op.op} data to Supabase error: ${JSON.stringify(result)}`);
      }
    }

    await transaction.complete();
  } catch (ex: any) {
    console.debug(ex);
    if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
      /**
       * Instead of blocking the queue with these errors,
       * discard the (rest of the) transaction.
       *
       * Note that these errors typically indicate a bug in the application.
       * If protecting against data loss is important, save the failing records
       * elsewhere instead of discarding, and/or notify the user.
       */
      console.error(`Data upload error - discarding ${lastOp}`, ex);
      await transaction.complete();
    } else {
      // Error may be retryable - e.g. network error or temporary server error.
      // Throwing an error here causes this call to be retried after a delay.
      throw ex;
    }
  }
}

export const supabaseConnector: PowerSyncBackendConnector = {
  fetchCredentials, uploadData,
}
```

### Creating the DatabaseContext

We need a single point of connection to the PowerSync instance that we can interact with throughout the app.

To achieve this we create a `Database` singleton and provide a stable reference to that instance through our `DatabaseContext`.

:::note
The `DatabaseProvider` component wraps its children in both the `DatabaseContext.Provider` that we create, and also the `PowerSyncContext.Provider` provided by the PowerSync SDK.

This is necessary because the hooks from the PowerSync SDK require the `PowerSyncContext` to be present in the component tree, while the DatabaseContext gives us access to the powersync instance.
:::

```tsx
import {SupabaseClient} from "@supabase/supabase-js"
import React, {PropsWithChildren, useEffect} from "react"
import {
  AbstractPowerSyncDatabase,
  PowerSyncContext,
  RNQSPowerSyncDatabaseOpenFactory
} from '@journeyapps/powersync-sdk-react-native';
import {supabase, supabaseConnector} from "./supabase"; // Adjust the path as needed
import {AppSchema} from './schema'; // Adjust the path as needed

export class Database {
  // We expose the PowerSync and Supabase instances for easy access elsewhere in the app
  powersync: AbstractPowerSyncDatabase;
  supabase: SupabaseClient;

  /**
   * Initialize the Database class with a new PowerSync instance
   */
  constructor() {
    const factory = new RNQSPowerSyncDatabaseOpenFactory({
      schema: AppSchema,
      dbFilename: 'sqlite.db',
    });
    this.powersync = factory.getInstance();
    this.supabase = supabase;
  }

  /**
   * Initialize the PowerSync instance and connect it to the Supabase backend.
   * This will call `fetchCredentials` on the Supabase connector to get the session token.
   * So if your database requires authentication, the user will need to be signed in before this is called.
   */
  async init() {
    await this.powersync.init();
    // Connect the PowerSync instance to the Supabase backend through the connector
    await this.powersync.connect(supabaseConnector);
  }
}

// A singleton of the Database class
const database = new Database();

// A context to provide our singleton to the rest of the app
const DatabaseContext = React.createContext<Database | null>(null);

// A hook to access the database instance via the context
export const useDatabase = () => {
  const context: Database | null = React.useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

// Finally, a provider component that initializes the database and provides it to the app
export function DatabaseProvider<T>({children}: PropsWithChildren<T>) {
  useEffect(() => {
    // You'll likely want to handle errors here, but for simplicity we're just logging them
    database.init().catch(console.error);
  }, []);

  return (
    <DatabaseContext.Provider value={database}>
      {/*The `PowerSyncContext.Provider` is provided by the PowerSync SDK and is required 
      for the PowerSync hooks (i.e. `useWatchedPowerSyncQuery` and `usePowerSyncQuery`) 
      to work, so we need to provide it as well as our own context provider. */}
      <PowerSyncContext.Provider value={database.powersync}>
        {children}
      </PowerSyncContext.Provider>
    </DatabaseContext.Provider>
  );
}
```

## Managing Lists of Todos

In our app we'll want the ability to:

* fetch the list of all the todo lists from the database
* add a new todo list
* delete a todo list

To manage this we'll create the following:

* a `useLists` hook to encapsulate the logic for fetching and managing the lists
* a `Lists` component to display the lists
* an `AddList` component with a form to add a new list

### The `useLists` Hook

The `useLists` hook will encapsulate the logic for fetching and managing the lists.

It will use:

* `usePowerSyncWatchedQuery` to fetch the lists from the database and watch for changes
* `PowerSync.execute` to create and delete lists

#### usePowerSyncWatchedQuery

This hook is used to fetch data from the database and watch for changes. It will automatically re-fetch the data when the database changes.

We'll implement our own in a second, but Here's an example of what that looks like:

```ts
const lists = usePowerSyncWatchedQuery<ListItemRecord>(`
    SELECT ${LIST_TABLE}.*,
         COUNT(${TODO_TABLE}.id) AS total_tasks,
         SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) AS completed_tasks
    FROM ${LIST_TABLE}
         LEFT JOIN ${TODO_TABLE} ON ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
    GROUP BY ${LIST_TABLE}.id;
  `);
```

You can write complex queries to fetch data from the database, and the hook will automatically re-fetch the data when the database changes. 

:::note
This hook needs to be inside a `PowerSyncContext.Provider` (or our `DatabaseProvider`) to work.
:::

#### PowerSync.execute()

This method is used to execute SQL queries against the database. We'll be using it here to create and delete lists.

```ts
const deleteList = useCallback(async (id: string) => {
  console.log('Deleting list', id);
  return powersync.execute(`DELETE FROM ${LIST_TABLE} WHERE id = ?`, [id]);
}, [powersync]);
```

#### Implementing the `useLists` Hook

When we put it all together we get a hook like this:

```ts
// app/services/database/use-lists.ts
import {usePowerSyncWatchedQuery} from "@journeyapps/powersync-sdk-react-native"
import {useAuth} from "app/services/database/use-auth"
import {useCallback} from "react"
import {useDatabase} from "app/services/database/database"
import {LIST_TABLE, ListRecord, TODO_TABLE} from "app/services/database/schema"
import {v4 as uuid} from 'uuid';

// Extend the base type with the calculated fields from our query  
export type ListItemRecord = ListRecord & { total_tasks: number; completed_tasks: number }

export const useLists = () => {
  // Get the current user from the auth context 
  const {user} = useAuth();
  // Get the database instance from the context
  const {powersync} = useDatabase();

  // List fetching logic here. You can modify it as per your needs.
  const lists = usePowerSyncWatchedQuery<ListItemRecord>(`
      SELECT ${LIST_TABLE}.*,
             COUNT(${TODO_TABLE}.id) AS total_tasks,
             SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM ${LIST_TABLE}
               LEFT JOIN ${TODO_TABLE} ON ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
      GROUP BY ${LIST_TABLE}.id;
  `)


  const createList = useCallback(async (name: string) => {
    
    if (!user) {throw new Error("Can't add list -- user is undefined");}
    
    return powersync.execute(`
          INSERT INTO ${LIST_TABLE}
              (id, name, created_at, owner_id)
          VALUES (?, ?, ?, ?)`,
      [uuid(), name, new Date().toISOString(), user?.id],
    );
  }, [user, powersync]);

  const deleteList = useCallback(async (id: string) => {
    console.log('Deleting list', id);
    return powersync.execute(`DELETE
                             FROM ${LIST_TABLE}
                             WHERE id = ?`, [id]);
  }, [powersync]);

  return {lists, createList, deleteList};
};

```

#### Creating the components

We're going to need several components to view and manage our todo lists:

* `AddList` - displays form to add a new list
* `Lists` - displays the list of todo lists and allows the user to delete them

Let start by creating the components using the ignite CLI.

```shell
# Create the AddList Component
npx ignite-cli generate component AddList
```

```shell
# Create the Lists Component
npx ignite-cli generate component Lists
```

#### Adding the components to the Welcome Screen

Lets update the Welcome Screen to display the components we just created. That way we can see them while we work on them:

```tsx
// app/screens/WelcomeScreen.tsx
import {Button, Lists} from "app/components"
import {DatabaseProvider} from "app/services/database/database"
import {useAuth} from "app/services/database/use-auth"
import {observer} from "mobx-react-lite"
import React, {FC} from "react"
import {View, ViewStyle} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {AppStackScreenProps} from "../navigators"
import {colors, spacing} from "../theme"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const {signOut} = useAuth()

  return (
    <DatabaseProvider>
      <SafeAreaView style={$container}>
        <Lists/>
        <View style={$signOut}>
          <Button
            text="Sign Out"
            onPress={signOut}/>
        </View>
      </SafeAreaView>
    </DatabaseProvider>
  )
})

const $signOut: ViewStyle = {
  padding: spacing.md,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral300,
  display: "flex",
  justifyContent: "flex-start",
  height: "100%",
  flexDirection: "column",
}
```

#### Creating Todo Lists in `AddList`

Open `app/components/AddList.tsx` and update the `AddList` component to display a simple form to add a new list.

```tsx
import {Button, Text, TextField} from "app/components"
import {useLists} from "app/services/database/use-lists"
import {colors, spacing} from "app/theme"
import {observer} from "mobx-react-lite"
import React from "react"
import {TextStyle, View, ViewStyle} from "react-native"

/**
 * Display a form to add a new list
 */
export const AddList = observer(function AddList(props: never) {
  const [newListName, setNewListName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  // Here we call the useLists hook to get the createList function
  const {createList} = useLists()

  // Then creating a list is as simple as calling the createList function with the name of the list.
  // We'll also handle any errors that occur when creating the list, because we're good developers like that.
  const handleAddList = React.useCallback(async () => {
    if (!newListName) { return }
    try {
      await createList(newListName)
      setNewListName("")
    } catch (e: any) {
      setError(`Failed to create list: ${e?.message ?? "unknown error"}`)
    }
  }, [createList, newListName])

  return (
    <View style={$container}>
      <Text preset={"subheading"}>Add a list</Text>
      <View style={$form}>
        <TextField placeholder="Enter a list name" containerStyle={$textField} inputWrapperStyle={$textInput}
                   onChangeText={setNewListName} value={newListName}/>
        <Button text="Add List" style={$button} onPress={handleAddList}/>
      </View>
      {error && <Text style={$error}>{error}</Text>}
    </View>
  )
})

// Styles
const $container: ViewStyle = {
  padding: spacing.md,
  backgroundColor: colors.palette.neutral200,
}
const $form: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}
const $textField: ViewStyle = {
  flex: 1,
}
const $textInput: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}
const $button: ViewStyle = {
  marginHorizontal: spacing.xs,
  padding: 0,
  paddingHorizontal: spacing.xs,
  paddingVertical: 0,
  minHeight: 44,
}
const $error: TextStyle = {
  color: colors.error,
  marginTop: spacing.sm,
}
```

#### Displaying and Deleting Todo Lists in `Lists`

Now we can use our `useLists` hook in 0 `app/components/Lists.tsx` to display a list of our todo lists:

```tsx
import {AddList, Icon, ListItem, Text} from "app/components"
import {ListItemRecord, useLists} from "app/services/database/use-lists"
import {useCallback} from "react"
import {FlatList, TextStyle, View, ViewStyle} from "react-native"
import {colors, spacing} from "../theme"

export function Lists() {

  // Again we can use the useLists hook to get the list of lists and `deleteList` function
  const {lists, deleteList} = useLists()

  // This tells FlatList how to render each item in the list
  const renderItem = useCallback(({item}: { item: ListItemRecord }) => {
    // We'll use Ignite's ListItem component to display each item, and it takes care of a lot of the formatting for us.
    return <ListItem
      textStyle={$listItemText}
      onPress={() => {
        // Later on we'll use this to navigate to view the todos, but for now we'll just log the name of the list
        console.log(`Pressed: ${item.name}`)
      }}
      text={`${item.name}`}
      // Pressing the "X" icon will delete the list
      RightComponent={<View style={$deleteListIcon}><Icon icon={"x"} onPress={() => deleteList(item.id)}/></View>}
    />
  }, [])

  return (
    <View style={$container}>
      <Text preset={"heading"}>Lists</Text>
      <View style={$card}><AddList/></View>
      <View style={[$list, $card]}>
        <Text preset={"subheading"}>Your Lists</Text>
        <FlatList
          style={$listContainer}
          // We can just pass our lists in and it'll render them for us, and because
          // this is a watched query it'll update automatically when the database changes.
          data={lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: colors.border}}/>}
          ListEmptyComponent={<Text style={$emptyList}>No lists found</Text>}
        />
      </View>
    </View>
  )
}

// Styles
const $emptyList: TextStyle = {
  textAlign: "center",
  color: colors.textDim,
  opacity: 0.5,
  padding: spacing.lg,
}
const $card: ViewStyle = {
  shadowColor: colors.palette.neutral800,
  shadowOffset: {width: 0, height: 1},
  shadowRadius: 2,
  shadowOpacity: 0.35,
  borderRadius: 8,
}
const $listContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  height: "100%",
  borderColor: colors.border,
  borderWidth: 1,
}
const $list: ViewStyle = {
  flex: 1,
  marginVertical: spacing.md,
  backgroundColor: colors.palette.neutral200,
  padding: spacing.md,
}
const $container: ViewStyle = {
  flex: 1,
  display: "flex",
  flexGrow: 1,
  padding: spacing.md,
}
const $listItemText: TextStyle = {
  height: 44,
  width: 44,
}
const $deleteListIcon: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 44,
  marginVertical: spacing.xxs
}
```

### Checking In

By this point you should be able to:

* add new Todo lists,
* see a list of all the Todo lists,
* delete Todo lists from the database.

## Sharing the Database Context with Multiple Screens

To view and edit todos inside a list, we'll want to create a new Screen. 

Our new screen and `WelcomeScreen`  will both need to be inside a `DatabaseProvder` to have access to the database.

Now we could just wrap every screen in the `DatabaseProvider`, like we did with `WelcomeScreen`, but as our app gets larger this can become cumbersome.

What we really want is for authenticated routes to have access to the database, and unauthenticated routes to not have access.

To do this we'll: 
1. Create our new `TodoListScreen`
2. Create two navigators, one for signed in routes that has access to the database and one for unauthenticated routes that doesn't
3. Move our screens into the appropriate navigator
4. Use the users authentication status to determine which navigator to render.

### Creating the TodoList Screen

First lets create a new screen called `TodoList` that will eventually display the todos for a list. For now we'll just leave it as-is.

```shell
npx ignite-cli generate screen TodoList
```

### Creating the `AuthNavigator` and `SignedInNavigator`

First lets create the `AuthNavigator` that will contain the `AuthScreen` and `PowerSyncScreen`.

```shell
npx ignite-cli generate navigator Auth
```

And then the `SignedInNavigator` that will contain the `WelcomeScreen` and `TodoListScreen`.

```shell
npx ignite-cli generate navigator SignedIn
```

### Move the screens from `AppNavigator` into the appropriate navigators

Moving screens between navigators is a multi-step process. We need to:

1. move the `AuthScreen` into the `AuthNavigator`
2. move the `WelcomeScreen` and `TodoListScreen` into the `SignedInNavigator`, and wrap the navigator in the `DatabaseProvider`
3. update the `AppNavigator` to conditionally render the `AuthNavigator` or `SignedInNavigator` based on the user's authentication status.
4. Update existing calls to `navigation.navigate()` to use the new routes

For each screen we we move, we will need to:

* update the types of the screen's props to reference the new navigator
* move the `ParamsList` property that defines the screen's parameters to the new navigator
* move the `Stack.Screen` component that points to the screen to the new navigator

#### Moving  `AuthScreen` to the `AuthNavigator`

* Move the params and screen from  `AppStackParamList` to `AuthStackParamList`

  First remove them from `AppNavigator`:
    ```tsx
    // app/navigators/AppNavigator.tsx
    
    //...
    export type AppStackParamList = {
      Welcome: undefined
      // highlight-next-line
      Auth: undefined              // <---REMOVE THIS LINE
      TodoList: { listId: string } 
      // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
    }
    //...
    const AppStack = observer(function AppStack() {
        //...
        return (
            <Stack.Navigator
                screenOptions={{headerShown: false, navigationBarColor: colors.background}}
            >
                // ...
                // highlight-next-line
                <Stack.Screen name="Auth" component={Screens.AuthScreen}/> {/* <<--- REMOVE THIS LINE*/}  
                //...
            </Stack.Navigator>
        )
    })
    ```
  and then add them to the `AuthNavigator`, replacing the screen put there by the template, and create a utility type to allow for type checking when navigating between navigators:

    ```tsx
    // app/navigators/AuthNavigator.tsx
    
    import React from "react"
    import {createNativeStackNavigator} from "@react-navigation/native-stack"
    import {
        AuthScreen,
    } from "app/screens"
    
    export type AuthNavigatorParamList = {
        //success-line
        Auth: undefined
    }
    
    // This type is used combines the AuthNavigatorParamList with the AppStackParamList
    // so we can have type checking when navigating between navigators
    //success-line 
     export type AuthNavigatorScreenProps<T extends keyof AuthNavigatorParamList> = CompositeScreenProps<
       //success-line
       NativeStackScreenProps<AuthNavigatorParamList, T>,
        //success-line 
       NativeStackScreenProps<AppStackParamList>
        //success-line
     >

    const Stack = createNativeStackNavigator<AuthNavigatorParamList>()
    export const AuthNavigator = () => {
        return (
            <Stack.Navigator>
                //success-line
                <Stack.Screen name="Auth" component={AuthScreen}/>
            </Stack.Navigator>
        )
    }
    ```

* Update the Props Type of `AuthScreen`
   ```tsx
   interface AuthScreenProps extends AuthNavigatorScreenProps<"Auth"> {}
   ```

#### Moving `WelcomeScreen` and `TodoListScreen` to the `SignedInNavigator`** and wrapping it in the `DatabaseProvider`

* Move the params and screens into the `SignedInNavigatorParamList`

  First remove them from `AppNavigator`:
    ```tsx
    // app/navigators/AppNavigator.tsx
    
    //...
    export type AppStackParamList = {
      // highlight-next-line
      Welcome: undefined           // <---REMOVE THIS LINE
      // highlight-next-line              
      TodoList: undefined // <---REMOVE THIS LINE
      // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
    }
    //...
    const AppStack = observer(function AppStack() {
        //...
        return (
            <Stack.Navigator
                screenOptions={{headerShown: false, navigationBarColor: colors.background}}
            >
                // highlight-next-line
                // Remove the Welcome and TodoList screens
                // highlight-next-line
                // leaving an empty Stack.Navigator
                // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
            </Stack.Navigator>
        )
    })
    ```

  Then add them to the `SignedInNavigator`, replacing the screen put there by the template, and wrap the whole navigator in the `DatabaseProvider`:

    ```tsx
    import * as Screens from "app/screens"
    import {colors} from "app/theme"
    import React from "react"
    import {createNativeStackNavigator} from "@react-navigation/native-stack"
    //success-line
    import {DatabaseProvider} from "app/services/database/database"
  
    export type SignedInNavigatorParamList = {
      //success-line
      Welcome: undefined
      //success-line
      TodoList: undefined
    }
  
    // This type is used combines the SignedInNavigatorParamList with the AppStackParamList
    // so we can have type checking when navigating between navigators 
  //success-line
    export type SignedInNavigatorScreenProps<T extends keyof AuthNavigatorParamList> = CompositeScreenProps<
  //success-line
      NativeStackScreenProps<SignedInNavigatorParamList, T>,
  //success-line 
      NativeStackScreenProps<AppStackParamList>
  //success-line
    >
  
    const Stack = createNativeStackNavigator<SignedInNavigatorParamList>()
  
    export const SignedInNavigator = () => {
      return (
          //success-line
          <DatabaseProvider>
            <Stack.Navigator screenOptions={{headerShown: false, navigationBarColor: colors.background}}>
              //success-line
              <Stack.Screen name="Welcome" component={Screens.WelcomeScreen}/>
              //success-line
              <Stack.Screen name="TodoList" component={Screens.TodoListScreen}/>
            </Stack.Navigator>
          //success-line
          </DatabaseProvider>
      )
    }
    ```

* Update the Props Type of `WelcomeScreen` and `TodoListScreen` to use the new prop type
   ```tsx
  // app/screens/WelcomeScreen.tsx
   interface WelcomeScreenProps extends SignedInNavigatorScreenProps<"Welcome"> {}
   ```

   ```tsx
  // app/screens/TodoListScreen.tsx
   interface TodoListScreenProps extends SignedInNavigatorScreenProps<"TodoList"> {}
   ```

#### Update the `AppNavigator` to only show signed in routes if the user is signed in.

    Next we'll change AppNavigator so it conditionally renders the `AuthNavigator` or `SignedInNavigator` based on the user's authentication status.

   ```tsx
    // app/navigators/AppNavigator.tsx

// ... other imports
//success-line
import {DarkTheme, DefaultTheme, NavigationContainer, NavigatorScreenParams} from "@react-navigation/native"
//success-line
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack"
//success-line
import {AuthNavigator, AuthNavigatorParamList} from "app/navigators/AuthNavigator"
//success-line
import {SignedInNavigator, SignedInNavigatorParamList} from "app/navigators/SignedInNavigator"

//..

export type AppStackParamList = {
  //success-line
  AuthNavigator: NavigatorScreenParams<AuthNavigatorParamList>
  //success-line
  SignedInNavigator: NavigatorScreenParams<SignedInNavigatorParamList>
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

// ...

const AppStack = observer(function AppStack() {
  // Fetch the user from the auth context
  const {signedIn} = useAuth()
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, navigationBarColor: colors.background}}
    >
      //success-line
      <Stack.Screen name={"AuthNavigator"} component={AuthNavigator}/>
      {/* Only render the SignedIn Navigator if we are signed in */}
      //success-line
      {signedIn ? <Stack.Screen name={"SignedInNavigator"} component={SignedInNavigator}/> : null}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

//...
   ```

**4. Update the existing `navigation.navigate()` calls to use the new routes**
Because we've moved the screens into navigators, we've changed the paths that react-navigation uses to find them.

   ```tsx
   // app/screens/AuthScreen.tsx
useEffect(() => {
  if (user) {
    //success-line
    navigation.navigate("SignedInNavigator", {screen: "Welcome"})
  }
}, [user])
   ```

## Fetching and Managing Todos

Now that our authenticated navigation is in place, we can navigate to the `TodoList` screen and display the todos for a list.

#### Make the `TodoList` screen take the `listId` as a parameter

To do this we'll pass the list id as a parameter when we navigate to the screen.

Open `app/navigators/SignedInNavigator.tsx` and update the `SignedInNavigatorParamList` type:

We want to pass only the minimum required data in our params for performance reasons, so we'll only pass the list id.

```tsx

export type SignedInNavigatorParamList = {
  Welcome: undefined
  // success-line
  TodoList: { listId: string }
}
```

We'll update the `TodoListScreen` to accept the list id as a parameter -- for now we'll just display it to make sure we got it.

```tsx

// ...

export const TodoListScreen: FC<TodoListScreenProps> = function TodoListScreen({
  navigation,

  // suucess-line
  route: {params}
}) {
  // We get the listId from the route params
  // success-line
  const listId = params.listId;

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
      // success-line
      <Pressable onPress={() => navigation.goBack()}><Icon icon={"back"} size={50}></Icon></Pressable>
      // success-line
      <Text preset={"heading"} text={listId}/>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $backButton: ViewStyle = {
  height: 44,
}


```

#### Navigating to the `TodoList` screen and passing the parameter

Now we can update the `Lists` component to navigate to the `TodoList` screen when a list is pressed.

```tsx

// ... other imports
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {AppStackParamList} from "app/navigators"

export function Lists() {

  const {lists, deleteList} = useLists()
  // We use the root param list, because this component might be reusing in other screens/navigators
  // success-line
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()


  const renderItem = useCallback(({item}: { item: ListItemRecord }) => {
    return <ListItem
      // ... other props
      // Navigate to the TodoList screen, passing the list id as a parameter
      onPress={() => {
        // success-line
        navigation.navigate("SignedInNavigator", {screen: "TodoList", params: {listId: item.id}})
      }}
    />
  }, [])

  return (
    //... component body
  )
}
```

### Creating a `useList` hook to view and manage Todos for a List 

Now that we can navigate to the `TodoList` screen, we can start fetching and managing the todos for a list.

Once again we'll create a hook to gather together the methods we'll likely use together.

The hook will take a `listId` as a parameter, and return the list, the todos for that list, and functions to add and remove todos.

:::note
We are using `usePowerSyncQuery` to fetch the list and `usePowerSyncWatchedQuery` to fetch the todos, because the list itself won't change often, so we only need to watch the todos for changes.
:::

```tsx
// app/services/database/use-list.ts

import {usePowerSyncQuery, usePowerSyncWatchedQuery} from "@journeyapps/powersync-sdk-react-native"
import {useDatabase} from "app/services/database/database"
import {LIST_TABLE, ListRecord, TODO_TABLE, TodoRecord} from "app/services/database/schema"
import {useAuth} from "app/services/database/use-auth"
import {useCallback} from "react"
import {v4 as uuid} from "uuid"


export function useList(listId: string) {
  const {user} = useAuth()
  const {powersync} = useDatabase()


  const listRecords = usePowerSyncQuery<ListRecord>(`
      SELECT *
      FROM ${LIST_TABLE}
      WHERE id = ?;
  `, [listId])

  // we only expect one list record
  const list = listRecords[0]


  const todos = usePowerSyncWatchedQuery<TodoRecord>(`
      SELECT *
      FROM ${TODO_TABLE}
      WHERE list_id = ?;
  `, [listId])


  const addTodo = useCallback(async (description: string): Promise<{ error: string | null }> => {
    if (!user) {
      throw new Error("Can't add todo -- user is undefined")
    }
    try {
      await powersync.execute(
        `INSERT INTO ${TODO_TABLE}
             (id, description, created_at, list_id, created_by, completed)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuid(), description, new Date().toISOString(), listId, user?.id, 0],
      )

      return {error: null}
    } catch (error: any) {
      return {error: `Error adding todo: ${error?.message}`}
    }
  }, [user, powersync, listId])

  const removeTodo = useCallback(async (id: string): Promise<{ error: string | null }> => {
    try {
      await powersync.execute(`DELETE
                                FROM ${TODO_TABLE}
                                WHERE id = ?`, [id])
      return {error: null}
    } catch (error: any) {
      console.error("Error removing todo", error)
      return {error: `Error removing todo: ${error?.message}`}
    }

  }, [
    powersync,
  ])

  const setTodoCompleted = useCallback(async (id: string, completed: boolean): Promise<{ error: string | null }> => {

    const completedAt = completed ? new Date().toISOString() : null;
    const completedBy = completed ? user?.id : null;

    try {
      await powersync.execute(`
            UPDATE ${TODO_TABLE}
            SET completed = ?, completed_at = ?, completed_by = ?
            WHERE id = ?
        `, [completed, completedAt, completedBy, id]);

      return {error: null}

    } catch (error: any) {
      console.error('Error toggling todo', error);
      return {error: `Error toggling todo: ${error?.message}`};
    }
  }, [powersync]);


  return {list, todos, addTodo, removeTodo, setTodoCompleted}

}

```

### Displaying the Todos on our `TodoListScreen`

Now in our `TodoList` screen we can use the `useList` hook to fetch the todos for a list:

:::note
We're going to use expo-checkbox to show the completed state, so we'll need to install it:

```shell
npx expo add @react-native-community/checkbox
```

:::

A lot of this should be familiar by now, we're using the `useList` hook to fetch the list and todos, and then rendering them in a FlatList.

```tsx
import {Button, Icon, ListItem, Screen, Text, TextField} from "app/components"
import {SignedInNavigatorProp} from "app/navigators"
import {TodoRecord} from "app/services/database/schema"
import {useList} from "app/services/database/use-list"
import {colors, spacing} from "app/theme"
import React, {FC, useCallback} from "react"
import {FlatList, Pressable, TextStyle, View, ViewStyle} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"

interface TodoListScreenProps extends SignedInNavigatorProp<"TodoList"> {}

export const TodoListScreen: FC<TodoListScreenProps> = function TodoListScreen({
  navigation,
  route: {params: {listId}},
}) {

  // We use the hook to get the list and todos for the list
  const {list, todos, addTodo, removeTodo, setTodoCompleted} = useList(listId)

  // State for managing the new todo input and errors
  const [newTodo, setNewTodo] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  // We wrap the addTodo from the hook with a bit of error handling
  const handleAddTodo = useCallback(async () => {
    const {error} = await addTodo(newTodo)
    if (error) {
      setError(error)
      return
    }
    setNewTodo("")
  }, [newTodo])

  // And do the same for removeTodo
  const handleRemoveTodo = useCallback(async (id: string) => {
    const {error} = await removeTodo(id)
    if (error) {
      setError(error)
    }
  }, [removeTodo, setError])


  const DeleteButton = React.useCallback(({id}: { id: string }) => {
    <View style={$deleteIcon}>
      <Icon
        icon={"x"}
        onPress={() => handleRemoveTodo(item.id)}/>
    </View>
  }, [handleRemoveTodo])

  // We'll use the ListItem component to display each todo, as we did with the lists
  const renderItem = useCallback(({item}: { item: TodoRecord }) => {
    return <ListItem
      containerStyle={$listItemContainer}
      textStyle={[$listItemText, item.completed && $strikeThrough]}
      text={`${item.description}`}
      RightComponent={(
        <Pressable style={$deleteIcon}>
          <Icon icon={"x"} onPress={() => handleRemoveTodo(item.id)}/>
        </Pressable>)}
      onPress={() => setTodoCompleted(item.id, !item.completed)}
    />
  }, [
    handleRemoveTodo,
  ])

  return (
    <Screen style={$root} preset="fixed">
      <SafeAreaView style={$header} edges={["top"]}>
        <Pressable onPress={() => navigation.goBack()}><Icon icon={"back"} size={44}></Icon></Pressable>
        <Text style={$listName} preset={"heading"} text={list?.name}/>
      </SafeAreaView>
      <View style={$addTodoContainer}>
        <Text preset={"subheading"}>Add a list</Text>
        <View style={$form}>
          <TextField
            placeholder="New todo..."
            containerStyle={$textField}
            inputWrapperStyle={$textInput}
            onChangeText={setNewTodo}
            value={newTodo}/>
          <Button text="ADD" style={$button} onPress={handleAddTodo}/>
        </View>
        {error && <Text style={$error}>{error}</Text>}
      </View>
      <View style={$container}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={$separator}/>}
          ListEmptyComponent={<Text style={$emptyList}>List is Empty</Text>}
        />
      </View>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
const $listItemContainer: ViewStyle = {
  alignItems: "center",
}

const $strikeThrough: TextStyle = {textDecorationLine: "line-through"}

const $form: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}

const $separator: ViewStyle = {height: 1, backgroundColor: colors.border}
const $emptyList: TextStyle = {
  color: colors.textDim,
  opacity: 0.5,
  padding: spacing.lg,
  fontSize: 24,
}

const $textField: ViewStyle = {
  flex: 1,
}

const $textInput: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}


const $button: ViewStyle = {
  marginHorizontal: spacing.xs,
  padding: 0,
  paddingHorizontal: spacing.xs,
  paddingVertical: 0,
}

const $addTodoContainer: ViewStyle = {
  padding: spacing.md,
  backgroundColor: colors.palette.neutral300,
}
const $header: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.secondary200,
  paddingBottom: spacing.md,
}

const $listName: TextStyle = {
  marginLeft: spacing.sm,
  flex: 1,
}

const $error: TextStyle = {
  color: colors.error,
  marginTop: spacing.sm,
}

const $container: ViewStyle = {
  padding: spacing.md,
}

const $listItemText: TextStyle = {
  height: 44,
  verticalAlign: "middle"
}

const $deleteIcon: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 44,
  marginVertical: spacing.xxs,
}

```

### Checking In

At this point you should be able to:

* Touch a list in the `Lists` component and navigate to the `TodoList` screen
* See the list of todos in the list on the `TodoList` screen
* Add and remove todos from the list
* Toggle todos completed status by tapping them


## Conclusion

That's it! Now you have all the tools you need use PowerSync and Supabase to build a local-first app with real-time sync!

