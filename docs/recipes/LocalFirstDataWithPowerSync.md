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

1. **An Ignite app using `Expo CNG` or `Bare` workflow**

- PowerSync requires native modules, so you cannot use Expo Go

   ```bash
   npx ignite-cli@latest new PowerSyncIgnire --remove-demo --workflow=cng --yes
   ```

2. **A Postgres SQL instance set up and connected to a PowerSync**

- Instruction for connecting to a number of platforms are available in the [PowerSync documentation](https://docs.powersync.com/)
- If you don't have a database, you can follow the [PowerSync + Supabase Integration Guide](https://docs.powersync.com/integration-guides/supabase-+-powersync) to
  get one set up -- both PowerSync and Supabase have free tiers that you can use to get started.

3. **Your PowerSync URL**

- Found in your PowerSync dashboard. Click on the "Edit Instance" button for your instance and copy the URL from the "Instance URL" field in the dialog that appears.

4. **Supabase project details:**

- **supabaseUrl**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project URL**.
- **supabaseAnonKey**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project API
  keys**.

5. Configure or Disable Supabase Email Verification

- By default, Supabase requires email verification for new users. This should be configured for any production apps.
- For the purposes of this recipe, you can disable this in the Supabase dashboard under:
  **Authentication** > **Providers** > **Email** >> **Confirm Email**

## Installing SDK and Dependencies

### Install necessary dependencies for PowerSync.

First install the PowerSync SDK and its dependencies.

```shell
npx expo install \
  @journeyapps/powersync-sdk-react-native \
  @journeyapps/react-native-quick-sqlite \
````

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

### Install necessary dependencies for Supabase

First we need to install the Supabase SDK.

```shell
npx expo install @supabase/supabase-js
```

and we'll also need to install `@react-native-async-storage/async-storage` for persisting the Supabase session.

```shell
npx expo install @react-native-async-storage/async-storage
```

### Update your native dependencies

These dependencies include native modules so you'll need to rebuild your app after installing.

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

PowerSync requires a valid session token to connect to the Supabase backend.

We'll need a hook and context to manage our authentication state.

### Add Supabase Config Variables to Your App Config

First add your Supabase config to your app's configuration.

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
````

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
import {AuthProvider} from "app/services/database/use-auth"

// ...
function App(props: AppProps) {
    // ...
    return (
        <AuthProvider>
            <SafeAreaProvider>
                {/* ... */}
            </SafeAreaProvider>
        </AuthProvider>
    );
}


````

### Create a Sign-In Screen

First use the Ignite CLI to generate a new screen for signing in:

```shell
npx ignite-cli generate screen Auth
```

:::note
This will:

* create a new screen in `app/screens/AuthScreen.tsx`,
* add that screen to the `AppNavigator` in `app/navigators/app-navigator.tsx`, and
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


````

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
// app/navigation/app-navigator.tsx

//...

const AppStack = observer(function AppStack() {
    // Fetch the user from the auth context
    // success-line
    const {signedIn} = useAuth()
    return (
        <DatabaseProvider>
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
        </DatabaseProvider>
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

### Add your PowerSync URL to your app config

Just like we did with supabase, add the powerSync URL to your app's configuration.

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

## Defining Your Data Schema

Next, define your data schema and TypeScript types in `app/services/database/schema.ts`. The Schema defines the data that PowerSync will sync between the local SQLite database and the backend.

From the [PowerSync docs](https://docs.powersync.com/usage/installation/client-side-setup/define-your-schema#react-native-and-expo):
> The types available are `TEXT`, `INTEGER` and `REAL`. These should map directly to the values produced by the [Sync Rules](https://docs.powersync.com/usage/sync-rules). If a value doesn't match, it is cast automatically.

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
        indexes: [new Index({name: 'list', columns: [new IndexedColumn({name: 'list_id'})]})]
    }),
    new Table({
        name: 'lists',
        columns: [
            new Column({name: 'created_at', type: ColumnType.TEXT}),
            new Column({name: 'name', type: ColumnType.TEXT}),
            new Column({name: 'owner_id', type: ColumnType.TEXT})
        ]
    })
]);
```

:::tip Automated Schema Generation
PowerSync can generate a Javascript version of your schema for you.

1. Right-click on your instance in the PowerSync dashboard
2. Select "Generate Client-Side Schema".

This will generate a schema definition in javascript that will give you a good starting point for building the rest of your schema.
:::

## Setting Up the Database Connection and Context

Next we need to integrate PowerSync and Supabase by setting up the database connection, and then providing that connection to the app through a React Context..

### Connecting to Your Database

To tell PowerSync how to connect to the database we'll create a `PowerSyncBackendConnector` that
has methods for fetching credentials and uploading data.

#### PowerSyncBackendConnector Interface

The Supabase Connector needs to implement the `PowerSyncBackendConnector` interface, ensuring it can seamlessly
communicate with PowerSync for data synchronization.

The interface requires two methods:

```ts
// fetches credentials for connecting to the backend
fetchCredentials: () => Promise<PowerSyncCredentials | null>;

// a method powersync will call to upload data to the backend
uploadData: (database: AbstractPowerSyncDatabase) => Promise<void>;
```

#### Implementing the Database Connector for Supabase

In `app/services/database/supabase.ts` we need to implement these methods, and then export them in an object that we can provide to PowerSync.

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

### Initializing the PowerSync Instance, and providing it to the app

We need a single point of connection to the PowerSync instance that we can interact with throughout the app.

To achieve this we create a `Database` singleton and provide a stable reference to that instance through a React Context.

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
            <PowerSyncContext.Provider value={database.powersync}>
                {children}
            </PowerSyncContext.Provider>
        </DatabaseContext.Provider>
    );
}
```

:::info
The `PowerSyncContext.Provider` is provided by the PowerSync SDK and is required for the PowerSync hooks to work, so we need to provide it as well as our own context provider. (
i.e. `useWatchedPowerSyncQuery` and `usePowerSyncQuery`).
:::

## Working With Your Data

Now that we have our database set up and connected to PowerSync, we can start reading and writing data to the database.

Lets create a todo-list app that will let us manage multiple todo lists.

### Managing Lists of Todos

In our app we'll want the ability to:

* fetch the list of all the todo lists from the database
* add a new todo list
* delete a todo list

To manage this we'll create the following:

* a `useLists` hook to encapsulate the logic for fetching and managing the lists
* a `Lists` component to display the lists
* an `AddList` component with a form to add a new list

#### The `useLists` Hook

The `useLists` hook will encapsulate the logic for fetching and managing the lists.

##### usePowerSyncWatchedQuery

This hook is used to fetch data from the database and watch for changes. It will automatically re-fetch the data when the database changes.

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

##### PowerSync.execute

This method is used to execute SQL queries against the database. It is used here to create and delete lists.

```ts
const deleteList = useCallback(async (id: string) => {
    console.log('Deleting list', id);
    return powersync.execute(`DELETE FROM ${LIST_TABLE} WHERE id = ?`, [id]);
}, [powersync]);
````

##### Putting it all together

When we put it all together we get a hook like this:

```ts
// app/services/database/use-lists.ts
import {usePowerSyncWatchedQuery} from "@journeyapps/powersync-sdk-react-native"
import {useAuth} from "app/services/database/use-auth"
import {useCallback} from "react"
import {useDatabase} from "app/services/database/database"
import {LIST_TABLE, ListRecord, TODO_TABLE} from "app/services/database/schema"
import {v4 as uuid} from 'uuid';

export type ListItemRecord = ListRecord & { total_tasks: number; completed_tasks: number }

export const useLists = () => {
    const {user} = useAuth();
    const {powersync} = useDatabase();


    // This hook will fetch the lists from the database and calculate the total number of tasks and completed tasks for each list
    const lists = usePowerSyncWatchedQuery<ListItemRecord>(`
      SELECT ${LIST_TABLE}.*,
             COUNT(${TODO_TABLE}.id)                                         AS total_tasks,
             SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM ${LIST_TABLE}
               LEFT JOIN ${TODO_TABLE} ON ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
      GROUP BY ${LIST_TABLE}.id;
  `);

    // This function will create a new list in the database
    const createList = useCallback(async (name: string) => {
        if (!user) {
            throw new Error("Can't add list -- user is undefined");
        }
        return powersync.execute(
            `
          INSERT INTO ${LIST_TABLE}
              (id, name, created_at, owner_id)
          VALUES (?, ?, ?, ?)`,
            [uuid(), name, new Date().toISOString(), user?.id],
        );
    }, [user, powersync]);

    // This function will delete a list from the database
    const deleteList = useCallback(async (id: string) => {
        console.log('Deleting list', id);
        return powersync.execute(`DELETE
                             FROM ${LIST_TABLE}
                             WHERE id = ?`, [id]);
    }, [powersync]);

    return {lists, createList, deleteList};
};
```

### Creating, Viewing, and Deleting Lists

Now that we have the hook, lets create the components to display and manage the lists.

#### Creating the components

We're going to need several components to view and manage our todo lists:
* `AddList` - displays form to add a new list
* `Lists` - displays the list of todo lists and allows the user to delete them

Let start by creating the components using the ignite CLI.

```shell
npx ignite-cli generate component AddList
```

```shell
npx ignite-cli generate component Lists
```


#### Adding the components to the Welcome Screen

Lets update the Welcome Screen to display the components we just created. That was we can see them while we work on them:

```tsx
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

For now, it won't look like much, but we'll fix that pretty quickly!

#### Creating Todo Lists in `AddList`

Create a new component called `AddList` that will display a form to add a new list.

```shell
npx ignite-cli generate component AddList
```

Then open `app/components/AddList.tsx` and update the `AddList` component to display a simple form to add a new list.

```tsx
import {Button, Text, TextField} from "app/components"
import {useLists} from "app/services/database/use-lists"
import {colors, spacing} from "app/theme"
import {observer} from "mobx-react-lite"
import * as React from "react"
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
    const handleAddList = React.useCallback(async () => {
        if (!newListName) { return }
        try {
            await createList(newListName)
            setNewListName("")
        } catch (e: any) {
            // It's good practice to handle errors when interacting with the database
            // Here we're just setting the error message to display to the user, so they know their list wasnt created.
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

Create the Lists component that will display the lists and allow the user to delete them.

```shell
npx ignite-cli generate component Lists
```

Then open `app/components/Lists.tsx` and update the `Lists` component to display a list of todo lists:

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

#### Checking In

By this point you should be able to:
* add new Todo lists,
* see a list of all the Todo lists,
* delete Todo lists from the database.

### Creating, Viewing, and Deleting Todos inside of Lists


# OLD STUFF

### Add Todo Form

use the Ignite CLI to generate a new component for adding todos:

```shell
npx ignite-cli generate component AddTodo
```

:::info Generating Unique IDs on the Client
Because PowerSync is a local-first database we need to generate and store our own unique IDs for each record. Auto-incrementing IDs would
require a connection to the server. More information on generating unique IDs can be found in the [PowerSync documentation](https://docs.powersync.com/usage/sync-rules/client-id).
:::

We can use the `uuid` package to generate unique IDs for our todos.

```shell
npx expo install uuid
```

Then open `app/components/AddTodo.tsx` and update the `AddTodo` component to add a new todo to the database:

```tsx
import {Button, TextField} from "app/components"
import {useDatabase} from "app/services/database"
import React, {useState} from "react"
import {View, ViewStyle} from "react-native"
import {spacing} from "../theme"

export const AddTodo = () => {
    const {powersync} = useDatabase()
    const [description, setDescription] = useState("")

    const handleAddTodo = async () => {
        // Assuming you've set created_by, and list_id
        const created_at = new Date().toISOString();
        const completed = 0; // not completed yet
        const created_by = "user_id"; // replace with actual user id
        const list_id = "list_id"; // replace with actual list id
        const id = "unique_id";  // replace with actual unique id for the todo

        await powersync.execute(
            `
            INSERT INTO todos
            (id, created_at, completed, description, created_by, list_id)
            VALUES (?,?,?,?,?,?)
            `,
            [id, created_at, completed, description, created_by, list_id]
        )
        setDescription("")
    }

    return (
        <View style={$container}>
            <TextField
                label={"Description"}
                value={description}
                onChangeText={setDescription}
            />
            <Button
                text={"Add Todo"}
                onPress={handleAddTodo}
            />
        </View>
    )
}
```


## Making the Database Available Throughout Your App

This gives us access to the powersync instance and the supabase connector throughout the app.

### Example: Providing Database Context to Signed-In Routes

Consider a scenario where your app has both public (sign-in, sign-up) and private (user-specific content) routes. You
might want to ensure that the PowerSync database is only accessible to the private, signed in parts of your app. This
approach minimizes overhead and focuses database interactions where they are most needed.

Here's how you can structure your app to provide the PowerSync context exclusively to signed in routes, by extracting
the logic into a `SignedInNavigator` component:

```tsx
// app/navigation/SignedInNavigator.tsx
import React from "react"
import {PowerSyncContext} from "@journeyapps/powersync-sdk-react-native"
import {useDatabase} from "app/services/database"
import * as Screens from "app/screens"

const SignedInNavigator = () => {
    // Extract the PowerSync instance from our custom hook
    const {powersync} = useDatabase()

    return (
        <PowerSyncContext.Provider value={powersync}>
            <Screens.PrivateNavigator/>
        </PowerSyncContext.Provider>
    )
}

export default SignedInNavigator
```

And in your main app component, you integrate `SignedInNavigator` like so:

```tsx
// app/navigators/AppNavigator.tsx
import React from "react"
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {observer} from "mobx-react-lite"
import * as Screens from "app/screens"
import SignedInNavigator from "./SignedInNavigator" // Adjust the path as needed
import {useAuth} from 'app/services/auth'

export type RootStackParamList = {
    Public: undefined
    Private: undefined
    // Other routes here
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const AppNavigator = observer(function App() {

    // Check if the user is signed in
    const {isSignedIn} = useAuth()

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                // Only render the SignedInNavigator if the user is signed in
                {isSignedIn
                 ? <Stack.Screen name="Private" component={SignedInNavigator}/>
                 : <Stack.Screen name="Public" component={Screens.PublicNavigator}/>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
})
```

Now, only routes in the `PrivateNavigator` will have access to the PowerSync context, ensuring that database operations
are limited to authenticated users.

## Data Operations with PowerSync

This section outlines how to use PowerSync in a React Native app for various data operations. You can fetch
static data, subscribe to live updates, fetch complex data using joins, or update data through a unified API.

And with PowerSync, you can perform these operations locally for maximum speed and responsiveness, while still knowing
that your data will be safely and efficiently synchronized with your Supabase backend.

### Fetching Data

To fetch static data once without subscribing to updates, use the `usePowerSyncQuery` hook. This is useful for data that
doesn't change often or where live updates aren't necessary.

```tsx
// app/components/StaticTodoList.tsx
import React from 'react';
import {Text, View} from 'react-native';
import {usePowerSyncQuery} from '@journeyapps/powersync-sdk-react-native';

const StaticTodoList = () => {
    const todos = usePowerSyncQuery(`SELECT * FROM ${TODO_TABLE}`);
    return (
        <View>
            {items.map((todo) => (
                <Text key={todo.id}>{todo.name}</Text>
            ))}
        </View>
    );
};
```

### Fetching and Watching Data

For data that changes frequently and where you want your component to automatically update, use
the `usePowerSyncWatchedQuery` hook. This will subscribe to changes and re-render your component with the latest data.

```tsx
// app/components/LiveItemList.tsx
import React from 'react';
import {ScrollView, Text} from 'react-native';
import {usePowerSyncWatchedQuery} from '@journeyapps/powersync-sdk-react-native';

const LiveTodoList = () => {
    const todos = usePowerSyncWatchedQuery(`SELECT * FROM ${TODO_TABLE}`);

    return (
        <ScrollView>
            {todos.map((todo) => (
                <Text key={todo.id}>{todo.name}</Text>
            ))}
        </ScrollView>
    );
};
```

## Data Update Operations in a React Native Component

To integrate insert, update, and delete your data within a React Native component using PowerSync, you can define
methods that execute the necessary SQL queries. These methods can be triggered by user interactions, such as button
presses or form submissions.

Call `powersync.execute()` with the SQL query and parameters to perform the desired operation. PowerSync will make the
updates locally and then sync them with your Supabase backend at the next opportunity.

Here's an example component that allows users to add, update, and delete items from a database:

```tsx
// app/components/UpdateDataComponent.tsx
import {useDatabase} from "app/services/database"
import {TODO_TABLE} from "app/services/database/schema" // Replace with actual path
import React, {useState} from "react"
import {Button, TextInput, View} from "react-native"

interface UpdateDataComponentProps {
    todoIdToUpdate: string;
}

export function UpdateDataComponent({todoIdToUpdate}: UpdateDataComponentProps) {
    const {powersync} = useDatabase()
    const [todoName, setTodoName] = useState("")
    const [newDescription, setNewDescription] = useState("")

    const addTodo = async () => {
        await powersync.execute(`INSERT INTO ${TODO_TABLE} (name)
                             VALUES (?)`, [todoName])
        setTodoName("")
    }

    const updateItemDescription = async () => {
        await powersync.execute(`UPDATE ${TODO_TABLE}
                             SET description = ?
                             WHERE id = ?`, [newDescription, todoIdToUpdate])
        setNewDescription("")
    }

    const deleteItem = async () => {
        await powersync.execute(`DELETE
                             FROM ${TODO_TABLE}
                             WHERE id = ?`, [todoIdToUpdate])
    }

    return (<View>
        <TextInput
            value={todoName}
            onChangeText={setTodoName}
            placeholder="Todo Name"
        />
        <Button onPress={addTodo} title="Add Todo"/>

        <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="New Description"
        />
        <Button onPress={updateItemDescription} title="Update Description"/>

        <Button onPress={deleteItem} title="Delete Item"/>
    </View>)
}

```

By defining these methods in your components, you can easily manage your app's data, responding to user interactions to
add, update, and remove items from your PowerSync-backed database.

## Additional Resources

- [PowerSync React Native + Expo Documentation](https://docs.powersync.com/client-sdk-references/react-native-and-expo)
- [Supabase Docs](https://supabase.io/docs)
- [PowerSync JS on GitHub](https://github.com/powersync-ja/powersync-js)




