---
title: Adding MobX-State-Tree to your Ignite app
description: How to add MobX-State-Tree to an Ignite project that starts without it
tags:
  - MobX
  - State Management
last_update:
  author: Charlie (AI assistant)
publish_date: 2025-11-21
---

# Adding MobX-State-Tree to your Ignite app

When we shipped Ignite 11, we simplified the default boilerplate and stopped including
[MobX-State-Tree](https://mobx-state-tree.js.org/) out of the box. The current
`boilerplate/app` uses plain React Context for things like authentication and the demo
podcast list instead.

MobX-State-Tree is still one of our favorite state management libraries at Infinite Red.
It has been our go-to choice for complex apps for years, and we still use it on many
client projects because of its strong typing, snapshot debugging, and excellent
Reactotron integration.

This recipe shows how to **add MobX-State-Tree to a current Ignite app (11.x or newer)**
using the latest `boilerplate` structure. We will:

- Install the MST dependencies
- Create a root store
- Persist it using the shared `utils/storage` helpers
- Wire MST into Reactotron
- Expose a `useStores()` hook you can call from any screen or component

> If you're starting from an older Ignite project that already uses MST and you want to
> remove it, use the [Remove MobX-State-Tree](./RemoveMobxStateTree.md) recipe instead.

## Prerequisites

- An Ignite 11+ app created with the current template, for example:

```bash
npx ignite-cli new MstDemo --yes
```

Everything below assumes the default folder layout under `boilerplate/app` (for example
`app/app.tsx`, `app/context/AuthContext.tsx`, `app/utils/storage`, etc). If you're
working in an existing app with a customized structure, adjust the paths accordingly.

## 1. Install MobX-State-Tree and friends

From your Ignite app directory, install the MobX packages and the Reactotron plugin:

```bash
yarn add mobx mobx-react-lite mobx-state-tree reactotron-mst
```

- `mobx` is the underlying reactive state library.
- `mobx-state-tree` adds a structured, snapshot-friendly model layer on top.
- `mobx-react-lite` gives you React bindings (the `observer` HOC and hooks).
- `reactotron-mst` lets Reactotron inspect your MST tree and time‑travel snapshots.

## 2. Create a models folder and RootStore

Create a place for your MobX-State-Tree models:

```bash
mkdir -p app/models
mkdir -p app/models/helpers
```

### `app/models/AuthenticationStore.ts`

We'll start with a simple authentication store. This mirrors the logic in
`AuthContext`, but implemented as an MST model so you can grow it with richer domain
behavior later.

```ts title="/app/models/AuthenticationStore.ts"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore", {
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return Boolean(store.authToken)
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail)) {
        return "must be a valid email address"
      }
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      // keep the same trimming behavior as the default AuthContext
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot
  extends SnapshotOut<typeof AuthenticationStoreModel> {}
```

### `app/models/CounterStore.ts` (example domain store)

To demonstrate how to consume stores from your UI, we'll use a tiny `CounterStore`.
In a real app you'd likely create stores for things like `TodoStore`, `ProfileStore`,
or convert your existing contexts into MST models.

```ts title="/app/models/CounterStore.ts"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const CounterStoreModel = types
  .model("CounterStore", {
    value: 0,
  })
  .actions((store) => ({
    increment() {
      store.value += 1
    },
    decrement() {
      store.value -= 1
    },
    reset() {
      store.value = 0
    },
  }))

export interface CounterStore extends Instance<typeof CounterStoreModel> {}
export interface CounterStoreSnapshot extends SnapshotOut<typeof CounterStoreModel> {}
```

### `app/models/RootStore.ts`

Now create a `RootStore` that combines all of your MST models into a single tree. We'll
start with `authenticationStore` and `counterStore`, but you can add more as your app
grows.

```ts title="/app/models/RootStore.ts"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthenticationStoreModel } from "./AuthenticationStore"
import { CounterStoreModel } from "./CounterStore"

export const RootStoreModel = types.model("RootStore", {
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  counterStore: types.optional(CounterStoreModel, {}),
})

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
```

## 3. Persist the RootStore

Ignite's boilerplate ships with a `utils/storage` module backed by MMKV. We'll reuse
that to persist the MST root store between launches.

Create `app/models/helpers/setupRootStore.ts`:

```ts title="/app/models/helpers/setupRootStore.ts"
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"

import type { RootStore, RootStoreSnapshot } from "../RootStore"
import * as storage from "@/utils/storage"

const ROOT_STATE_STORAGE_KEY = "root-v1"

let disposer: IDisposer | undefined

export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null

  try {
    // MMKV-backed helper that reads and parses JSON
    restoredState = storage.load<RootStoreSnapshot>(ROOT_STATE_STORAGE_KEY)
    if (restoredState) {
      applySnapshot(rootStore, restoredState)
    }
  } catch (error) {
    if (__DEV__ && error instanceof Error) {
      console.error("Failed to load root store", error.message)
    }
  }

  // stop tracking if we've already set up listeners
  if (disposer) disposer()

  // persist every snapshot to storage
  disposer = onSnapshot(rootStore, (snapshot) => {
    storage.save(ROOT_STATE_STORAGE_KEY, snapshot)
  })

  const unsubscribe = () => {
    disposer?.()
    disposer = undefined
  }

  return { rootStore, restoredState, unsubscribe }
}
```

## 4. Expose `useStores()` and `useInitialRootStore()` hooks

Next, create a small helper that:

- Instantiates a singleton `RootStore`
- Exposes a `useStores()` hook for components
- Exposes a `useInitialRootStore()` hook for `app/app.tsx` to hydrate and wire up
  Reactotron

Create `app/models/helpers/useStores.ts`:

```ts title="/app/models/helpers/useStores.ts"
import { createContext, useContext, useEffect, useState } from "react"

import type { RootStore } from "../RootStore"
import { RootStoreModel } from "../RootStore"
import { setupRootStore } from "./setupRootStore"

// Create the singleton RootStore instance
const rootStore = RootStoreModel.create({})

const RootStoreContext = createContext<RootStore>(rootStore)

export const RootStoreProvider = RootStoreContext.Provider

export const useStores = () => useContext(RootStoreContext)

export function useInitialRootStore(callback?: () => void | Promise<void>) {
  const store = useStores()
  const [rehydrated, setRehydrated] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    ;(async () => {
      const { unsubscribe: setupUnsubscribe } = await setupRootStore(store)
      unsubscribe = setupUnsubscribe

      // Reactotron + MST integration (DEV only)
      if (__DEV__ && (console as any).tron?.trackMstNode) {
        ;(console as any).tron.trackMstNode(store)
      }

      setRehydrated(true)

      if (callback) {
        await callback()
      }
    })()

    return () => {
      unsubscribe?.()
    }
  }, [callback, store])

  return { rootStore: store, rehydrated }
}
```

Finally, re-export these helpers from `app/models/index.ts`:

```ts title="/app/models/index.ts"
export * from "./RootStore"
export * from "./helpers/useStores"
export * from "./AuthenticationStore"
export * from "./CounterStore"
```

At this point you have a fully wired root store, but nothing in your UI is using it yet.

## 5. Initialize the RootStore in `app/app.tsx`

We'll now hydrate the root store when the app boots and make sure we wait for it before
rendering the rest of the UI.

In `app/app.tsx` (inside the generated Ignite app),

1. Import `useInitialRootStore` alongside the other imports:

```ts
import { useInitialRootStore } from "./models"
```

2. Inside `export function App() { ... }`, call the hook near the top of the component:

```ts
const { rehydrated } = useInitialRootStore()
```

3. Update the early-return guard so it also waits for `rehydrated` before rendering:

```ts
if (
  !rehydrated ||
  !isNavigationStateRestored ||
  !isI18nInitialized ||
  (!areFontsLoaded && !fontLoadError)
) {
  return null
}
```

The Auth and Episode React Context providers can stay exactly as they are. You can
gradually migrate pieces of your state to MST as it makes sense for your project.

## 6. Hook MST into Reactotron (optional but recommended)

One of the nicest parts of MST is how well it works with Reactotron snapshots.

In `app/devtools/ReactotronConfig.ts`:

1. Import the plugin:

```ts
import { mst } from "reactotron-mst"
```

2. Chain the plugin after the existing MMKV plugin:

```ts
const reactotron = Reactotron.configure({
  name: require("../../package.json").name,
  onConnect: () => {
    Reactotron.clear()
  },
})

reactotron
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .use(
    mst({
      // Ignore noisy internal MST actions to keep the timeline readable
      filter: (event) => /postProcessSnapshot|@APPLY_SNAPSHOT/.test(event.name) === false,
    }),
  )
```

Now when you run your app in development with Reactotron open, you should see your
`RootStore` tree appear and be able to inspect snapshots as you interact with the app.

## 7. Using `useStores()` from a screen

Finally, let's use the `CounterStore` in a screen so you can see the full flow.

In `app/screens/WelcomeScreen.tsx` (or any screen of your choice), import and use the
hook:

```ts
import { useStores } from "@/models"

export const WelcomeScreen = () => {
  const { themed } = useAppTheme()
  const { counterStore } = useStores()

  return (
    <Screen /* ...existing props... */>
      {/* existing content */}

      <Button
        text={`Count: ${counterStore.value}`}
        style={themed($tapButton)}
        onPress={counterStore.increment}
      />
    </Screen>
  )
}
```

Reload the app and tap the button. You should see the count increase while
Reactotron shows the MST actions and snapshots.

From here you can:

- Add more MST models (for example `TodoStore`, `ProfileStore`, or a new
  `EpisodeStore`)
- Gradually replace pieces of `AuthContext` or `EpisodeContext` with MST-backed
  stores, while keeping their public APIs the same
- Use `mobx-react-lite`'s `observer` HOC or hooks like `useLocalObservable` for more
  fine‑grained control in complex components

## Conclusion

You now have MobX-State-Tree integrated into a modern Ignite 11+ app, with persistence,
Reactotron support, and a simple pattern for exposing stores to your React Native UI.

If you ever need to go back to a "blank slate" without MST, follow the
[Remove MobX-State-Tree](./RemoveMobxStateTree.md) recipe.
