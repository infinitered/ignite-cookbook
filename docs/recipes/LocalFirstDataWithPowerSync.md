---
title: PowerSync for Local-First Data Management
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

## Introduction

This guide helps you integrate PowerSync with Supabase in an Ignite app for efficient local-first data management. This
setup allows your app to work smoothly offline while keeping the data in sync with your backend database.

### What is Powersync?

Powersync is a tool designed to synchronize local and remote data efficiently. It ensures that your application's local
database is always up-to-date with the server, and vice versa, without requiring constant internet connectivity.

The user is always working with their local data, which provides a fast and responsive experience. In the background,
Powersync syncs the local data with the server.

If the user loses internet connectivity, they can continue to work with the local data and Powersync will sync the data
with the server once the connection is restored.

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
2. **A Postgres SQL instance set up and connected to a PowerSync** 
   - If you don't have a database, you can follow the [PowerSync + Supabase Integration Guide](https://docs.powersync.com/integration-guides/supabase-+-powersync) to
   get one set up -- both PowerSync and Supabase have free tiers that you can use to get started.
3. **Your PowerSync URL**
    - Found in your PowerSync dashboard. Click on the "Edit Instance" button for your instance and copy the URL from the "Instance URL" field in the dialog that appears.
 
### Supabase

This recipe uses a supabase backend as an example -- if you are following along you will need:

1. **Supabase project details:**

- **supabaseUrl**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project URL**.
- **supabaseAnonKey**: Found through your Supabase dashboard under: **Project Settings** > **API** > **Project API
  keys**.

2. **Configure or disable email verification in your Supabase project.** 
    - by default, Supabase requires email verification for new users. This should be configured for any production apps.
    - For testing and experimentation, you can disable this in the Supabase dashboard under
      **Authentication** > **Providers** > **Email** >> **Confirm Email**

:::info **Authentication Required**
To interact with Supabase and perform data synchronization through PowerSync, you must authenticate with Supabase and persist the session token, as PowerSync requires a valid session token to communicate with Supabase. 

The sample code in this recipe contains basic methods for authentication with Supabase, but you will need to implement a basic sign in / sign up screens or additional authentication logic based on your app's requirements.

If you need help with Supabase authentication, refer to the [Supabase documentation](https://supabase.io/docs/guides/auth) for more information.

If you are using a different backend, you will need to implement a connector that fetches credentials, persists a session token, and uploads data to your backend.
:::

### Other Databases
This recipe uses Supabase as an example, but there will not be much difference for other types of Postgres backends.

When the time comes, you will need to implement a `PowerSyncBackendConnector` for your database in place of the `SupabaseConnector` but everything else should be the same.

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

Supabase implements [row-level security](https://supabase.com/docs/guides/auth/row-level-security), so sharing the anon key is not a security risk, but other backends may not have this feature. 
:::


:::info **Environment-Specific Configurations**
If you have different configurations for production, development, and testing environments, you can use `config.dev.ts` or `config.prod.ts` files to store these configurations.
:::

## Installing SDK and Dependencies

### Install necessary dependencies for PowerSync.

Powersync [requires polyfills](https://github.com/powersync-ja/powersync-js/blob/main/packages/powersync-sdk-react-native/README.md#install-polyfills)
to replace browser-specific APIs with their React Native equivalents. These are listed as peer-dependencies so we need
to install them manually.


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

:::tip
These dependencies include native modules so be sure to run `npx pod-install` after installing, and/or rebuild your
android project.
:::

### Install necessary dependencies for Supabase
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

In a fresh Ignite app, this would be in `app/app.tsx`. and placed at the top of the list of imports, right after
reactotron configuration.

### Add Babel Plugin

Update `babel.config.js` to include the `transform-async-generator-functions` plugin:

```js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            '@babel/plugin-transform-async-generator-functions',
        ],
    };
};
```

## Defining Your Data Schema

Next, define your data schema and TypeScript types in `app/services/database/app-schema.ts`. Here's an example for a todo app:

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

## Setting Up the PowerSync Context and Database Connection

To seamlessly manage and synchronize data within your Ignite app, you'll integrate PowerSync and Supabase by setting up
a database context. This context provides a convenient way to access your database throughout your application. Follow
these steps to establish the database context and ensure your app is ready for offline-first functionality with
real-time sync capabilities.

### Connecting to Your Database

You need to tell PowerSync how to connect to your database. This involves creating a `PowerSyncBackendConnector` that
has methods for fetching credentials and uploading data.

As an example we'll use Supabase as our back end. You can replace this with a class that connects to your own back end.

#### PowerSyncBackendConnector Interface

The Supabase Connector is implemented according to the `PowerSyncBackendConnector` interface, ensuring it can seamlessly
communicate with PowerSync for data synchronization:

```ts
// Required methods for PowerSyncBackendConnector
fetchCredentials: () => Promise<PowerSyncCredentials | null>;
uploadData: (database: AbstractPowerSyncDatabase) => Promise<void>;
```

The Powersync docs provide [detailed instructions](https://docs.powersync.com/client-sdk-references/react-native-and-expo#id-2.-create-a-backend-connector) on how to implement the `PowerSyncBackendConnector` interface.

#### Implementing a Supabase Connector

We Initialize the Supabase client with session persistence and custom storage for persisting keys.

Persisting the Supabase session is essential for maintaining user sessions across app restarts. Unlike web environments
where `localStorage` is available, React Native requires a different approach for secure storage.

The`react-native-supabase-todolist` demo from PowerSync has
a [simple implementation of a kv-store](https://github.com/powersync-ja/powersync-js/blob/main/demos/react-native-supabase-todolist/library/storage/SupabaseStorageAdapter.ts)
that you can use for this. (imported above as `KVStorage`)

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

async function fetchCredentials() {
    // NOTE: For client.auth.getSession() to work, the user needs to be signed in with Supabase
    // see the supabase documentation for more information on how to do this
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

    // Basic methods for authentication with supabase - use these to manage authentication
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

### Initializing the PowerSync Instance, and providing it to the app

We need a stable reference to the PowerSync instance throughout the app. We can achieve this by creating a `Database`
class that encompasses both the PowerSync and Supabase configurations, and then providing it to the app using a React
context.

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

    constructor() {
        // This creates a new PowerSync instance using our schema and a database using the specified filename
        const factory = new RNQSPowerSyncDatabaseOpenFactory({
            schema: AppSchema,
            dbFilename: 'sqlite.db',
        });
        this.powersync = factory.getInstance();
        this.supabase = supabaseConnector;
    }

    async init() {
        await this.powersync.init();
        // Connect the PowerSync instance to the Supabase backend through the connector
        await this.powersync.connect(supabaseConnector);
    }
}

// Then we create an instance of the Database class and create a context for it to hold a stable reference
export const database = new Database();

export const DbContext = React.createContext<Database | undefined>(undefined);

export const useDatabase = () => {
    const context: Database | undefined = React.useContext(DbContext);
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
        <DbContext.Provider value={database}>
            <PowerSyncContext.Provider value={database.powersync}>
                {children}
            </PowerSyncContext.Provider>
        </DbContext.Provider>
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

This gives us access to the powersync instance and the supabase connector throughout the app. This is very useful if you
are using Supabase Auth, for instance.

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

export type RootStackParamList = {
    Public: undefined
    Private: undefined
    // Other routes here
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const AppNavigator = observer(function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                // Public routes
                <Stack.Screen name="Public" component={Screens.PublicNavigator}/>

                // Private routes
                <Stack.Screen name="Private" component={SignedInNavigator}/>
                // Add other routes as needed
            </Stack.Navigator>
        </NavigationContainer>
    )
})
```

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

When you need to fetch data from multiple tables and possibly remap fields for your UI, use joins within your query.
The `usePowerSyncWatchedQuery` hook can be used for live updates on complex queries as well.

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

- Links to PowerSync documentation.
- Links to Ignite documentation.
- Other useful resources for deep diving.
