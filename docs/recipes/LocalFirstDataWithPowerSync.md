---
title: Sync your App with your Postgres database using PowerSync
description: Enhance your app with PowerSync for efficient data synchronization between your app's local database and backend
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

# PowerSync for Local-First Data Management

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

:::info **Authentication Required**
Powersync connects directly to your Postgres instance and will need a valid session token to do so. If your database has authentication enabled, you'll need to sign in and store a valid session token before PowerSync will be able to connect to your database.  

**If you are using Supabase**, the recipe provides some basic methods for signing in and signing out, but you'll need to implement your own UI. refer to the [Supabase auth documentation](https://supabase.io/docs/guides/auth) for more information. 

**If you are using a different backend**, you will need to implement your own UI and logic for connecting to and authenticating with your back end. We cover the exact requirements in [
**Connecting to Your Database**](http://localhost:3000/docs/recipes/LocalFirstDataWithPowerSync#connecting-to-your-database).
:::

### Supabase (Optional)

This recipe uses a supabase backend as an example -- if you want to follow along you will need:

1. **Supabase project details:**

- **supabaseUrl**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project URL**.
- **supabaseAnonKey**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project API
  keys**.

2. **Configure or disable email verification in your Supabase project.**
  - By default, Supabase requires email verification for new users. This should be configured for any production apps.
  - For testing and experimentation, you can disable this in the Supabase dashboard under
    **Authentication** > **Providers** > **Email** >> **Confirm Email**

    
### Other Databases

While this recipe uses Supabase in the example code, PowerSync can connect to almost any Postgres SQL backend and the process will be largely identical for other types of Postgres backends.

The major difference is that when the time comes, you will need to implement a `PowerSyncBackendConnector` for your database in place of the `SupabaseConnector`.

Check the [PowerSync documentation](https://docs.powersync.com/) for more information on connecting your database to PowerSync.

## Configuring the App

First, add any required config to your app's configuration. Here we are adding the Supabase URL and Anon Key, as well as the PowerSync URL. Other backend configurations can be added as needed.

```ts
// `app/config/config.base.ts`:

// update the interface to include the new properties
interface AppConfig {
    // Existing config properties
    supabaseUrl: string;
    supabaseAnonKey: string;
    powersyncUrl: string;
}

// Add the new properties to the config object
export const APP_CONFIG: AppConfig = {
    // Existing config values
    supabaseUrl: '<<YOUR_SUPABASE_URL>>',
    supabaseAnonKey: '<<YOUR_SUPABASE_ANON_KEY>>',
    powersyncUrl: '<<YOUR_POWERSYNC_URL>>',
};
```

:::danger
These values are not secure, even inside a compiled app. You should **never** store sensitive information like API keys your app's config.

Supabase implements [row-level security](https://supabase.com/docs/guides/auth/row-level-security), so sharing the anon key is not a security risk, but other backends may not have this feature, so be careful!
:::

:::info **Environment-Specific Configurations**
If you have different configurations for production, development, and testing environments, you can use `config.dev.ts` or `config.prod.ts` files to store these configurations.
:::

## Installing SDK and Dependencies

### Install necessary dependencies for PowerSync.

Powersync [requires polyfills](https://github.com/powersync-ja/powersync-js/blob/main/packages/powersync-sdk-react-native/README.md#install-polyfills)
to replace browser-specific APIs with their React Native equivalents. These are listed as peer-dependencies so we need
to install them ourselves.

```shell
npx expo install \
  @journeyapps/powersync-sdk-react-native \
  @journeyapps/react-native-quick-sqlite \
  react-native-fetch-api \
  react-native-polyfill-globals \
  react-native-url-polyfill \
  text-encoding \
  web-streams-polyfill@^3.2.1 \
  base-64 \
  react-native-get-random-values
```

:::info Update your native dependencies  
The PowerSync SDK includes native modules so be sure to run `npx pod-install` after installing, and/or rebuild your
android project.
:::

:::note
At the time of writing the PowerSync SDK is not compatible with `web-streams-polyfill@4.0.0`, so we specify version `^3.2.1`. 
:::

### Optional - Install necessary dependencies for Supabase

If using Supabase also install that now

```shell
npx expo intall @supabase/supabase-js
```

## Configuring Babel and Polyfills

### Import polyfills at App entry

Ensure polyfills are imported in your app's entry file, typically `App.tsx`:

```ts
import "react-native-polyfill-globals/auto";
import "@azure/core-asynciterator-polyfill";
```

:::tip
In a fresh Ignite app, this would be in `app/app.tsx`. and placed at the top of the list of imports, right after
the Reactotron config.
:::

### Add Babel Plugin

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

## Defining Your Data Schema

Next, define your data schema and TypeScript types in `app/services/database/app-schema.ts`.  

From the [PowerSync docs](https://docs.powersync.com/usage/installation/client-side-setup/define-your-schema#react-native-and-expo):
> The types available are `TEXT`, `INTEGER` and `REAL`. These should map directly to the values produced by the [Sync Rules](https://docs.powersync.com/usage/sync-rules). If a value doesn't match, it is cast automatically. 

Here's an example for a todo app:

```ts
// app/services/database/schema.ts
import {Schema, Table, Column, ColumnType} from '@journeyapps/powersync-sdk-react-native';

export const todoSchema = new Schema([
    new Table({
        name: 'todos',
        columns: [
            new Column({name: 'id', type: ColumnType.TEXT, primaryKey: true}),
            new Column({name: 'title', type: ColumnType.TEXT}),
            new Column({name: 'completed', type: ColumnType.BOOLEAN}),
            // Add other columns as needed
        ],
    }),
    // Define other tables as needed
]);

// It's a good idea to export typescript types for your schema as well, and keep them near the schema types they describe.
export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}
```

:::tip Automated Schema Generation

PowerSync can generate a Javascript version of your schema for you. To do this, run the following command in your
project directory.

1. Right click on your instance in the PowerSync dashboard
2. Select "Generate Client-Side Schema".

This will generate a `schema.js` file which can still save you a lot of time as you get started.
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

The Powersync docs provide [detailed instructions](https://docs.powersync.com/client-sdk-references/react-native-and-expo#id-2.-create-a-backend-connector) on how to implement the `PowerSyncBackendConnector` interface.

#### Implementing a Database Connector for Supabase

We Initialize the Supabase client with session persistence and custom storage for persisting keys. 

Persisting the Supabase session is essential for maintaining user sessions across app restarts. Unlike web environments
where `localStorage` is available, React Native requires a different approach for secure storage.

The`react-native-supabase-todolist` demo from PowerSync has a [simple implementation of a kv-store](https://github.com/powersync-ja/powersync-js/blob/main/demos/react-native-supabase-todolist/library/storage/KVStorage.ts)
that works well for this. (imported below as `KVStorage`)

```ts
// app/services/database/supabase.ts
import {
    AbstractPowerSyncDatabase,
    PowerSyncBackendConnector,
    UpdateType
} from "@journeyapps/powersync-sdk-react-native";
import {createClient} from "@supabase/supabase-js";
import Config from "app/config";
import {KVStorage} from "./kv-storage";

const kvStorage = new KVStorage();

const client = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
    auth: {
        persistSession: true,
        storage: kvStorage,
    },
});

/**
 * Called by PowerSync to fetch the credentials needed to connect to the backend.
 * Here we use the Supabase client to get the session token and user ID.
 */
async function fetchCredentials() {
    // NOTE: For client.auth.getSession() to work, the user needs to be signed in
    const {data: {session}, error} = await client.auth.getSession();
    if (!session || error) throw new Error(`Supabase credentials error: ${error?.message}`);

    return {
        client,
        endpoint: Config.powersyncUrl,
        token: session.access_token,
        expiresAt: new Date(session.expires_at * 1000),
        userID: session.user.id,
    };
}

/**
 * Called by PowerSync to upload data to the backend. Changes to the database are stored in a transaction, which
 * is a sequence of operations that are applied atomically to the backend, ensuring that the database remains
 * consistent.
 */
async function uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
        for (const op of transaction.crud) {
            const table = client.from(op.table);
            let result;

            switch (op.op) {
                case UpdateType.PUT:
                    result = await table.upsert({...op.opData, id: op.id});
                    break;
                case UpdateType.PATCH:
                    result = await table.update(op.opData).eq('id', op.id);
                    break;
                case UpdateType.DELETE:
                    result = await table.delete().eq('id', op.id);
                    break;
            }

            if (result.error) throw new Error(`Supabase sync error: ${result.error.message}`);
        }
        await transaction.complete();
    } catch (error) {
        console.error('Sync to Supabase failed:', error);
        // Handle error based on your application's needs
    }

    // Basic methods for authentication with supabase
    async function login(email: string, password: string) {
        return await client.auth.signIn({email, password});
    }

    async function signUp(email: string, password: string) {
        return await client.auth.signUp({email, password});
    }

    async function signOut() {
        return await client.auth.signOut();
    }

}

export const supabaseConnector: PowerSyncBackendConnector = {fetchCredentials, uploadData};
```

:::tip
For more information on authentication with Supabase, refer to the [Supabase Auth documentation](https://supabase.io/docs/guides/auth).
:::

### Initializing the PowerSync Instance, and providing it to the app

We need a sinple point of connection to the PowerSync instance that we can interact with throughout the app. 

To achieve this we create a `Database` class that encompasses both the PowerSync and Supabase configurations. 

Then we provide a stable reference to the `Database` instance through a React Context.

```tsx
// app/services/database.ts
import '@azure/core-asynciterator-polyfill';
import 'react-native-polyfill-globals/auto';
import React, {PropsWithChildren} from "react";
import {AbstractPowerSyncDatabase, RNQSPowerSyncDatabaseOpenFactory} from '@journeyapps/powersync-sdk-react-native';
import {SupabaseConnector, supabaseConnector} from "./supabase"; // Adjust the path as needed
import {AppSchema} from './schema'; // Adjust the path as needed

export class Database {
    // We expose the PowerSync instance and the Supabase connector for easy access elsewhere in the app
    powersync: AbstractPowerSyncDatabase;
    supabase: SupabaseConnector;

    /**
     * Initialize the Database class with a new PowerSync instance
     */
    constructor() {
        const factory = new RNQSPowerSyncDatabaseOpenFactory({
            schema: AppSchema,
            dbFilename: 'sqlite.db',
        });
        this.powersync = factory.getInstance();
        // include the Supabase connector for easy access
        this.supabase = supabaseConnector;
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

// Then we create an instance of the Database class and create a context for it to hold a stable reference
export const database = new Database();

export const DatabaseContext = React.createContext<Database | undefined>(undefined);

export const useDatabase = () => {
    const context: Database | undefined = React.useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatabase must be used within a DatabaseProvider");
    }
    return context;
};

// Finally, we create a provider component that initializes the database and provides it to the app
export function DatabaseProvider({children}: PropsWithChildren<{}>) {
    useEffect(() => {
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

## Making the Database Available Throughout Your App

### Add the Database Provider at the root of your app

To ensure Database class is available throughout your app, wrap your app's root component with the
`DatabaseProvider` component:

```tsx
// app/app.tsx
//...
import {DatabaseProvider} from "app/services/database";

//...

function App(props: AppProps) {

    // wrap your app with the DatabaseProvider  
    return (
        <DatabaseProvider>
            <SafeAreaProvider>
                {/* ... */}
            </SafeAreaProvider>
        </DatabaseProvider>
    );
}

export default App;
//...
```

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
                // Public routes
                <Stack.Screen name="Public" component={Screens.PublicNavigator}/>
                // Only render the SignedInNavigator if the user is signed in
                {isSignedIn 
                   ? <Stack.Screen name="Private" component={SignedInNavigator}/> 
                   : null
                }
                // Add other routes as needed
            </Stack.Navigator>
        </NavigationContainer>
    )
})
```

Now, only routes in the `PrivateNavigator` will have access to the PowerSync context, ensuring that database operations
are limited to authenticated users.

## Data Operations with PowerSync

This section outlines how to effectively use PowerSync in a React Native app for various data operations. You can fetch
static data, subscribe to live updates, fetch complex data using joins, or update data through a unified API.

And with PowerSync, you can perform these operations locally for maximum speed and responsiveness, while still knowing
that your data will be safely and efficiently synchronized with your Supabase backend.

### Fetching Data

To fetch static data once without subscribing to updates, use the `usePowerSyncQuery` hook. This is useful for data that
doesn't change often or where live updates aren't necessary. 

```tsx
// app/components/StaticItemList.tsx
import React from 'react';
import {Text, View} from 'react-native';
import {usePowerSyncQuery} from '@journeyapps/powersync-sdk-react-native';

const StaticItemList = () => {
    const items = usePowerSyncQuery(`SELECT * FROM items`);
    return (
        <View>
            {items.map((item) => (
                <Text key={item.id}>{item.name}</Text>
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

const LiveItemList = () => {
    const items = usePowerSyncWatchedQuery(`SELECT * FROM items`);

    return (
        <ScrollView>
            {items.map((item) => (
                <Text key={item.id}>{item.name}</Text>
            ))}
        </ScrollView>
    );
};
```

### Fetching Complex Data Using Joins

The `usePowerSyncWatchedQuery` hook can be used for live updates on complex queries as well. Fetching data from
multiple tables using joins is a common use case, and PowerSync makes it easy to handle.

```tsx
// app/components/ItemsWithCategories.tsx
import React from 'react';
import {ScrollView, Text} from 'react-native';
import {usePowerSyncWatchedQuery} from '@journeyapps/powersync-sdk-react-native';

const ItemsWithCategories = () => {
    const query = `
    SELECT items.id, items.name AS itemName, categories.name AS categoryName
    FROM items
    JOIN categories ON items.category_id = categories.id
  `;
    const items = usePowerSyncWatchedQuery(query);

    return (
        <ScrollView>
            {items.map((item) => (
                <Text key={item.id}>{item.itemName} - {item.categoryName}</Text>
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
import React, {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import {useDatabase} from 'path/to/your/databaseContext'; // Replace with actual path

interface UpdateDataComponentProps {
    itemIdToUpdate: string;
}

export function UpdateDataComponent({itemIdToUpdate}: UpdateDataComponentProps) {
    const {powersync} = useDatabase();
    const [itemName, setItemName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const addItem = async () => {
        await powersync.execute(`INSERT INTO items (name) VALUES (?)`, [itemName]);
        setItemName('');
    };

    const updateItemDescription = async () => {
        await powersync.execute(`UPDATE items SET description = ? WHERE id = ?`, [newDescription, itemIdToUpdate]);
        setNewDescription('');
    };

    const deleteItem = async () => {
        await powersync.execute(`DELETE FROM items WHERE id = ?`, [itemIdToUpdate]);
    };

    return (
        <View>
            <TextInput
                value={itemName}
                onChangeText={setItemName}
                placeholder="Item Name"
            />
            <Button onPress={addItem} title="Add Item"/>

            <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="New Description"
            />
            <Button onPress={updateItemDescription} title="Update Description"/>

            <Button onPress={deleteItem} title="Delete Item"/>
        </View>
    );
}
```

By defining these methods in your components, you can easily manage your app's data, responding to user interactions to
add, update, and remove items from your PowerSync-backed database.

## Additional Resources

- [PowerSync React Native + Expo Documentation](https://docs.powersync.com/client-sdk-references/react-native-and-expo)
- [Supabase Docs](https://supabase.io/docs)
- [PowerSync JS on GitHub](https://github.com/powersync-ja/powersync-js) 




