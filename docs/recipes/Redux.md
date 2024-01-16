---
title: Redux
description: How to migrate a Mobx-State-Tree project to Redux
tags:
  - Redux
  - MobX
  - State Management
last_update:
  author: Justin Poliachik
publish_date: 2024-01-16
---

# Redux

This guide will show you how to migrate a Mobx-State-Tree project (Ignite's default) to Redux, using a newly created Ignite project as our example:

```terminal
npx ignite-cli new ReduxApp --yes --removeDemo
```

If you are migrating an existing project these steps still apply, but you may need to migrate your existing state tree and other additional functionality.

## Remove Mobx-State-Tree

- Remove all Mobx-related dependencies from `package.json`, then run `yarn` or `npm i`

```diff
--"mobx": "6.10.2",
--"mobx-react-lite": "4.0.5",
--"mobx-state-tree": "5.3.0",

--"reactotron-mst": "3.1.5",
```

- Ignite created default boilerplate Mobx-State-Tree files in the `models/` directory. Remove this entire directory and all files within it, these are not needed for Redux.

- In `devtools/ReactotronConfig.ts` remove the `reactotron-mst` plugin. We can come back to [add a Redux plugin](#reactotron-support) later.

```diff
--import { mst } from "reactotron-mst"

...

const reactotron = Reactotron.configure({
  name: require("../../package.json").name,
  onConnect: () => {
    /** since this file gets hot reloaded, let's clear the past logs every time we connect */
    Reactotron.clear()
  },
--}).use(
--  mst({
--    /** ignore some chatty `mobx-state-tree` actions  */
--    filter: (event) => /postProcessSnapshot|@APPLY_SNAPSHOT/.test(event.name) === false,
--  }),
--)
++})
```

- Remove all `observer()` components and reformat as normal React components. Do a project-wide search for `observer(` and replace each component instance with the following pattern:

```diff
--import { observer } from "mobx-react-lite"

--export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(props) {
++export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
    ...
--})
++}
```

- Remove old Mobx-State-Tree store initialization / hydration code in `app.tsx`.
- Call `hideSplashScreen` in a `useEffect` so the app loads for now. We'll replace this code when we add [persistence](#persistence) below.

```diff
--import { useInitialRootStore } from "./models"

--const { rehydrated } = useInitialRootStore(() => {
--setTimeout(hideSplashScreen, 500)
--})
++useEffect(() => {
++    setTimeout(hideSplashScreen, 500)
++}, [])

--if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null
++if (!isNavigationStateRestored || !areFontsLoaded) return null
```

You should be able to build and run your app! It won't have any data...but it's a good idea to check that it successfully runs before we move on.

## Add Redux

#### Install dependencies

[redux-tooklit is the current recommended approach](https://redux.js.org/introduction/getting-started#redux-toolkit), and you'll also need `react-redux` bindings for your React Native app.

```bash
yarn add @reduxjs/toolkit
yarn add react-redux
```

#### Create Store

- In a new file `store.ts`, create your Redux store.
  - Create an initial store. We're using [Redux Toolkit's `configureStore`](https://redux-toolkit.js.org/usage/usage-guide#simplifying-store-setup-with-configurestore) here for simplicity.
  - Export Typescript helpers for the rest of your app to stay type safe

`store.ts`

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // add other state here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout app instead of plain `useDispatch` and `useSelector` for type safety
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### Add State

- Add your state reducers or [slices](https://redux-toolkit.js.org/usage/usage-guide#creating-slices-of-state). We'll create a simple `counter` slice for this example.
- If you have an existing state tree with Mobx-State-Tree, you'll need to convert your tree into a series of Redux reducers.
  - Note: Redux does not define or validate your models like Mobx-State-Tree does. It is up to you to ensure the correct data is being set in your reducers.

`counterSlice.ts`

```typescript
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CounterState {
  value: number;
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

#### Add Redux Provider

In `app.tsx`, wrap your `AppNavigator` with the react-redux Provider component

```jsx
import { Provider } from "react-redux";
import { store } from "./store/store";

...

<Provider store={store}>
  <AppNavigator
    linking={linking}
    initialState={initialNavigationState}
    onStateChange={onNavigationStateChange}
  />
</Provider>
```

#### Hook up Components

You can now use selectors to grab data and `dispatch()` to execute actions within your components. Here's an example:

- Remember to use our exported `useAppSelector` and `useAppDispatch` helpers for type safety

`WelcomeScreen.tsx`

```typescript
import React, { FC } from "react";
import { View, ViewStyle } from "react-native";
import { Button, Text } from "app/components";
import { AppStackScreenProps } from "../navigators";
import { colors } from "../theme";
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle";
import { useAppDispatch, useAppSelector } from "app/store/store";
import { decrement, increment } from "app/store/counterSlice";

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const $containerInsets = useSafeAreaInsetsStyle(["top", "bottom"]);
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return (
    <View style={[$containerInsets, $container]}>
      <Button text="Increment" onPress={() => dispatch(increment())} />
      <Button text="Decrement" onPress={() => dispatch(decrement())} />
      <Text text={`Count: ${count}`} />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
};
```

You're now using Redux!

## Persistence

Ignite ships with built-in persistence support for Mobx-State-Tree. We can add similar support for Redux by:

1. Install [`redux-persist`](https://github.com/rt2zz/redux-persist)

```
yarn add redux-persist
```

2. Modify `store.ts` to include `redux-persist`

`store.ts`

```typescript
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  counter: counterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout app instead of plain `useDispatch` and `useSelector` for type safety
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

3. Add a `PersistGate` to `app.tsx` and replace any existing `hideSplashScreen` calls with the `onBeforeLift` callback

`app.tsx`

```typescript
...

import { persistor, store } from "./store/store"
import { PersistGate } from "redux-persist/integration/react"

...

function App(props: AppProps) {
  const { hideSplashScreen } = props
...
  const onBeforeLiftPersistGate = () => {
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  }
...
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={$container}>
          <Provider store={store}>
            <PersistGate
              loading={null}
              onBeforeLift={onBeforeLiftPersistGate}
              persistor={persistor}
            >
              <AppNavigator
                linking={linking}
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
            </PersistGate>
          </Provider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
```

Your Redux state should now be persisted using AsyncStorage!

## Reactotron Support

Reactotron has a prebuilt plugin for Redux!

[Follow the instructions to install](https://docs.infinite.red/reactotron/plugins/redux/)
