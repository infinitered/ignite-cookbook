---
title: Redux
description: How to migrate a MobX-State-Tree project to Redux
tags:
  - Redux
  - MobX
  - State Management
last_update:
  author: Justin Poliachik
publish_date: 2024-01-16
---

# Redux

This guide will show you how to migrate a MobX-State-Tree project (Ignite's default) to Redux, using a newly created Ignite project as our example:

```terminal
npx ignite-cli new ReduxApp --yes --removeDemo
```

If you are migrating an existing project these steps still apply, but you may need to migrate your existing state tree and other additional functionality.

## Remove MobX-State-Tree

First, follow our recipe to [Remove MobX-State-Tree](./RemoveMobxStateTree.md) from your project. This will give you a blank slate to setup Redux.

## Add Redux

#### Install dependencies

[redux-tooklit is the current recommended approach](https://redux.js.org/introduction/getting-started#redux-toolkit), and you'll also need `react-redux` bindings for your React Native app.

```bash
yarn add @reduxjs/toolkit
yarn add react-redux
```

#### Create Store

- In a new file `app/store/store.ts`, create your Redux store.
  - Create an initial store. We're using [Redux Toolkit's `configureStore`](https://redux-toolkit.js.org/usage/usage-guide#simplifying-store-setup-with-configurestore) here for simplicity.
  - Export Typescript helpers for the rest of your app to stay type safe.
  - We'll use `app/store` directory for all our Redux reducers and store, but feel free to use any directory structure you like. Another popular option is to use [feature folders](https://redux.js.org/faq/code-structure).

**`app/store/store.ts`**

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
- If you have an existing state tree with MobX-State-Tree, you'll need to convert your tree into a series of Redux reducers.
  - Note: Redux does not define or validate your models like MobX-State-Tree does. It is up to you to ensure the correct data is being set in your reducers.

**`app/store/counterSlice.ts`**

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

**`app/app.tsx`**

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

**`app/screens/WelcomeScreen.tsx`**

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

Ignite ships with built-in persistence support for MobX-State-Tree. We can add similar support for Redux by:

1. Install [`redux-persist`](https://github.com/rt2zz/redux-persist)

```
yarn add redux-persist
```

2. Modify `store.ts` to include `redux-persist`

**`app/store/store.ts`**

```typescript
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
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

**`app/app.tsx`**

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
