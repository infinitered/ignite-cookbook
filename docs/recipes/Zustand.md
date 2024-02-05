---
title: Zustand
description: How to migrate a Mobx-State-Tree project to Zustand
tags:
  - Zustand
  - MobX
  - State Management
last_update:
  author: Justin Poliachik
publish_date: 2024-01-16
---

# Zustand

[Zustand](https://github.com/pmndrs/zustand) is a "bearbones" state management solution (hence the cute bear mascot).
Its a relatively simple and unopinionated option to manage application state, with a hooks-based API for easy use in a React app.

This guide will show you how to migrate a Mobx-State-Tree project (Ignite's default) to Zustand, using a new Ignite project as an example:

```terminal
npx ignite-cli new ZustandApp --yes
```

If you are converting an existing project these steps still apply, but you may also need to migrate other related functionality.

## Convert Mobx-State-Tree Models to Zustand

Our Ignite Demo App includes a few Mobx-State-Tree models inside `app/models`. Before we remove those, let's convert them to Zustand!

First, add `zustand`:

```terminal
yarn add zustand
```

Create a directory for our new Zustand store files:

```terminal
mkdir app/store
```

:::note
If you Ignited a demo-free project `npx ignite-cli new ZustandApp --yes --removeDemo` or if you don't have any existing models to convert and you're already familiar with Zustand, feel free to [skip this section](#remove-mobx-state-tree).
:::

**AuthenticationStore**

<details>
<summary>For reference, here's the original AuthenticationStore with Mobx-State-Tree:</summary>

**`app/models/AuthenticationStore.ts`**

```ts
import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank";
      if (store.authEmail.length < 6) return "must be at least 6 characters";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail)) return "must be a valid email address";
      return "";
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "");
    },
    logout() {
      store.authToken = undefined;
      store.authEmail = "";
    },
  }));

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
```

</details>

Mobx-State-Tree models declare the data type, initial values, derived values, and actions all in one.  
Zustand takes a "barebones" approach and defines a store as a basic state object with data and actions co-located.

Create a new file `app/store/AuthenticationStore.ts` and convert the model to Zustand to look like this:

**`app/store/AuthenticationStore.ts`**

```ts
import { StateCreator } from "zustand";
import { RootStore } from "./RootStore";

// Typescript interface for this store slice
export interface AuthenticationStore {
  authToken?: string;
  authEmail: string;
  setAuthToken: (value?: string) => void;
  setAuthEmail: (value: string) => void;
  logout: () => void;
}

// create our store slice with default data and actions
export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (set) => ({
  authToken: undefined,
  authEmail: "",
  setAuthToken: (value) => set({ authToken: value }),
  setAuthEmail: (value) => set({ authEmail: value.replace(/ /g, "") }),
  logout: () => set({ authToken: undefined, authEmail: "" }),
});

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  authToken: state.authToken,
  authEmail: state.authEmail,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setAuthEmail: state.setAuthEmail,
  logout: state.logout,
});

// selectors can also be used for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken;

export const validationErrorSelector = (state: RootStore) => {
  if (state.authEmail.length === 0) return "can't be blank";
  if (state.authEmail.length < 6) return "must be at least 6 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authEmail)) return "must be a valid email address";
  return "";
};
```

A few things to note:

- We're using the [slices pattern](https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md) to create AuthenticationStore as a slice of the overall state.
- Zustand doesn't validate data, so we need to explicitly define the Typescript interface `AuthenticationStore`.
- We've created several selectors for our derived values. These can be chained together, or used directly in a component via `useStore(mySelector)`. You'll see how these are used in components later.
- Zustand is very non-opinionated, so there are many different ways to achieve this! Keep this in mind if your app has different use cases, or if you'd like to experiment with alternative strategies for creating your stores.

**EpisodeStore**

Follow the same pattern to convert `app/models/EpisodeStore.ts`

<details>
  <summary>Original Mobx-State-Tree EpisodeStore for reference:</summary>

**`app/models/EpisodeStore.ts`**

```ts
import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { api } from "../services/api";
import { Episode, EpisodeModel } from "./Episode";
import { withSetPropAction } from "./helpers/withSetPropAction";

export const EpisodeStoreModel = types
  .model("EpisodeStore")
  .props({
    episodes: types.array(EpisodeModel),
    favorites: types.array(types.reference(EpisodeModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchEpisodes() {
      const response = await api.getEpisodes();
      if (response.kind === "ok") {
        store.setProp("episodes", response.episodes);
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`);
      }
    },
    addFavorite(episode: Episode) {
      store.favorites.push(episode);
    },
    removeFavorite(episode: Episode) {
      store.favorites.remove(episode);
    },
  }))
  .views((store) => ({
    get episodesForList() {
      return store.favoritesOnly ? store.favorites : store.episodes;
    },

    hasFavorite(episode: Episode) {
      return store.favorites.includes(episode);
    },
  }))
  .actions((store) => ({
    toggleFavorite(episode: Episode) {
      if (store.hasFavorite(episode)) {
        store.removeFavorite(episode);
      } else {
        store.addFavorite(episode);
      }
    },
  }));

export interface EpisodeStore extends Instance<typeof EpisodeStoreModel> {}
export interface EpisodeStoreSnapshot extends SnapshotOut<typeof EpisodeStoreModel> {}
```

</details>

<details>
<summary>Converted EpisodeStore using Zustand:</summary>

**`app/store/EpisodeStore.ts`**

```ts
import { api } from "../services/api";
import { Episode } from "./Episode";
import { StateCreator } from "zustand";
import { RootStore } from "./RootStore";

export interface EpisodeStore {
  episodes: Episode[];
  favorites: string[];
  favoritesOnly: boolean;

  fetchEpisodes: () => Promise<void>;
  addFavorite: (episode: Episode) => void;
  removeFavorite: (episode: Episode) => void;
  toggleFavorite: (episode: Episode) => void;
  setFavoritesOnly: (value: boolean) => void;
}

export const createEpisodeSlice: StateCreator<RootStore, [], [], EpisodeStore> = (set, get) => ({
  episodes: [],
  favorites: [],
  favoritesOnly: false,

  // Zustand supports async actions
  fetchEpisodes: async () => {
    const response = await api.getEpisodes();
    if (response.kind === "ok") {
      set({ episodes: response.episodes });
    } else {
      console.error(`Error fetching episodes: ${JSON.stringify(response)}`);
    }
  },
  addFavorite: (episode) => set((state) => ({ favorites: [...state.favorites, episode.guid] })),
  removeFavorite: (episode) => set((state) => ({ favorites: state.favorites.filter((guid) => guid !== episode.guid) })),
  toggleFavorite: (episode) => {
    // get() can be used within actions
    if (get().favorites.includes(episode.guid)) {
      get().removeFavorite(episode);
    } else {
      get().addFavorite(episode);
    }
  },
  setFavoritesOnly: (value: boolean) => set({ favoritesOnly: value }),
});

export const episodeStoreSelector = (state: RootStore) => ({
  episodes: state.episodes,
  favorites: state.favorites,
  favoritesOnly: state.favoritesOnly,

  // derived values can be included in selectors like this
  episodesForList: getEpisodesForList(state),

  fetchEpisodes: state.fetchEpisodes,
  addFavorite: state.addFavorite,
  removeFavorite: state.removeFavorite,
  toggleFavorite: state.toggleFavorite,
  setFavoritesOnly: state.setFavoritesOnly,

  // we can also include helper functions that have access to state
  hasFavorite: (episode: Episode) => {
    return state.favorites.includes(episode.guid);
  },
});

export const getEpisodesForList = (store: EpisodeStore) => {
  return store.favoritesOnly ? store.episodes.filter((a) => store.favorites.includes(a.guid)) : store.episodes;
};
```

</details>

**Episode**

So far, `AuthenticationStore` and `EpisodeStore` converted cleanly into Zustand store slices. But we also have `app/models/Episode.ts`, which is less of a data store and more of a basic data model. We don't need a Zustand slice for `Episode`, and Zustand is not opinionated about how data models are defined, so let's convert this into a set of Typescript types to define the data model and a few basic util functions for the derived values.

- Another very popular method is to use [Zod](https://zod.dev/), which also enables data validation at runtime for better safety.

<details>
<summary>Original Mobx-State-Tree Episode.ts file for reference:</summary>

**`app/models/Episode.ts`**

```ts
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
import { formatDate } from "../utils/formatDate";
import { translate } from "../i18n";

interface Enclosure {
  link: string;
  type: string;
  length: number;
  duration: number;
  rating: { scheme: string; value: string };
}

/**
 * This represents an episode of React Native Radio.
 */
export const EpisodeModel = types
  .model("Episode")
  .props({
    guid: types.identifier,
    title: "",
    pubDate: "", // Ex: 2022-08-12 21:05:36
    link: "",
    author: "",
    thumbnail: "",
    description: "",
    content: "",
    enclosure: types.frozen<Enclosure>(),
    categories: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views((episode) => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = { title: episode.title?.trim(), subtitle: "" };

      if (!defaultValue.title) return defaultValue;

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/);

      if (!titleMatches || titleMatches.length !== 3) return defaultValue;

      return { title: titleMatches[1], subtitle: titleMatches[2] };
    },
    get datePublished() {
      try {
        const formatted = formatDate(episode.pubDate);
        return {
          textLabel: formatted,
          accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
            date: formatted,
          }),
        };
      } catch (error) {
        return { textLabel: "", accessibilityLabel: "" };
      }
    },
    get duration() {
      const seconds = Number(episode.enclosure.duration);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor((seconds % 3600) % 60);

      const hDisplay = h > 0 ? `${h}:` : "";
      const mDisplay = m > 0 ? `${m}:` : "";
      const sDisplay = s > 0 ? s : "";
      return {
        textLabel: hDisplay + mDisplay + sDisplay,
        accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {
          hours: h,
          minutes: m,
          seconds: s,
        }),
      };
    },
  }));

export interface Episode extends Instance<typeof EpisodeModel> {}
export interface EpisodeSnapshotOut extends SnapshotOut<typeof EpisodeModel> {}
export interface EpisodeSnapshotIn extends SnapshotIn<typeof EpisodeModel> {}
```

</details>

<details>
<summary>
Updated Episode.ts model using Typescript types and util functions
</summary>

**`app/store/Episode.ts`**

```ts
import { formatDate } from "../utils/formatDate";
import { translate } from "../i18n";

interface Enclosure {
  link: string;
  type: string;
  length: number;
  duration: number;
  rating: { scheme: string; value: string };
}

export type Episode = {
  guid: string;
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Enclosure;
  categories: string[];
};

export const getParsedTitleAndSubtitle = (episode: Episode) => {
  const defaultValue = { title: episode.title?.trim(), subtitle: "" };

  if (!defaultValue.title) return defaultValue;

  const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/);

  if (!titleMatches || titleMatches.length !== 3) return defaultValue;

  return { title: titleMatches[1], subtitle: titleMatches[2] };
};

export const getDatePublished = (episode: Episode) => {
  try {
    const formatted = formatDate(episode.pubDate);
    return {
      textLabel: formatted,
      accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
        date: formatted,
      }),
    };
  } catch (error) {
    return { textLabel: "", accessibilityLabel: "" };
  }
};

export const getDuration = (episode: Episode) => {
  const seconds = Number(episode.enclosure.duration);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? `${h}:` : "";
  const mDisplay = m > 0 ? `${m}:` : "";
  const sDisplay = s > 0 ? s : "";
  return {
    textLabel: hDisplay + mDisplay + sDisplay,
    accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {
      hours: h,
      minutes: m,
      seconds: s,
    }),
  };
};
```

</details>

## Remove Mobx-State-Tree

Now that our models have been converted, follow our recipe to [Remove Mobx-State-Tree](./RemoveMobxStateTree.md) entirely from your project.

## Create Store

Let's create our main Zustand store. Create a new file `app/store/RootStore.ts`:

**`app/store/RootStore.ts`**

```ts
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { AuthenticationStore, authenticationStoreSelector, createAuthenticationSlice } from "./AuthenticationStore";
import { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore";

export interface RootStore extends AuthenticationStore, EpisodeStore {}

export const useStore = create<RootStore>()((...a) => ({
  ...createAuthenticationSlice(...a),
  ...createEpisodeSlice(...a),
  // add your state slices here
}));

// optional: custom hooks can be used to pick pieces from state
// useShallow is used to help prevent unnecessary rerenders
export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector));
export const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector));
```

- We're combining AuthenticationStore and EpisodeStore into one Zustand store for simplicity. Again, Zustand is very non-opinionated so you can modify this structure if desired.
- `useAuthenticationStore` and `useEpisodeStore` are exported as custom hooks to make it easier to select common pieces of state. Feel free to create additional custom hooks for reusable lookup patterns and prevent unnecessary re-renders [Read more about this](https://github.com/pmndrs/zustand?tab=readme-ov-file#selecting-multiple-state-slices).

Create `store/index.ts` file to export our hooks and selectors for easy use across our app:

**`app/store/index.ts`**

```ts
export * from "./RootStore";
export * from "./AuthenticationStore";
export * from "./EpisodeStore";
export * from "./Episode";
```

## Use Zustand in Components

Zustand's hooks-based API makes it easy to pull data into components.

In the Ignite Demo App, we'll update the following components to use our exported Zustand hooks and selectors:

**`app/navigators/AppNavigator.tsx`**

```tsx
import { useStore, isAuthenticatedSelector } from "../store";

const AppStack = () => {

  // use a selector to pick only that value
  const isAuthenticated = useStore(isAuthenticatedSelector)

  return (
    <Stack.Navigator
    ...
```

**`app/screens/LoginScreen.tsx`**

```tsx
// pick several values & actions from the AuthenticationStore
const { authEmail, setAuthEmail, setAuthToken } = useAuthenticationStore();
// we can also use multiple hooks
const validationError = useStore(validationErrorSelector);
```

**`app/screens/DemoPodcastListScreen.tsx`**

Several changes are needed here. We'll use `useEpisodeStore` to select all the data and actions we need from EpisodeStore:

```ts
import {
  useEpisodeStore,
  Episode,
  getDatePublished,
  getDuration,
  getParsedTitleAndSubtitle,
} from "app/store"

...

const episodeStore = useEpisodeStore();
```

We also need to update how we get derived values from `Episode` now that we're working with a plain object in Zustand without custom getters. Instead of `episode.duration` we can use our util function `getDatePublished`. Add these lines to the render function of `EpisodeCard`, and replace a few spots those values are used.

```ts
const datePublished = getDatePublished(episode);
const duration = getDuration(episode);
const parsedTitleAndSubtitle = getParsedTitleAndSubtitle(episode);
```

```diff
 <Text
  style={$metadataText}
  size="xxs"
--accessibilityLabel={episode.datePublished.accessibilityLabel}
++accessibilityLabel={datePublished.accessibilityLabel}
>
--{episode.datePublished.textLabel}
++{datePublished.textLabel}
</Text>
```

A few additional updates to make in Ignite's Demo App:

**`app/screens/WelcomeScreen.tsx`**

```diff
--const {
--  authenticationStore: { logout },
--} = useStores()
++const logout = useStore((state) => state.logout)
```

**`app/screens/DemoDebugScreen.tsx`**

```diff
--const {
--  authenticationStore: { logout },
--} = useStores()
++const logout = useStore((state) => state.logout)
```

**`app/services/api/api.ts`**

```diff
+import { Episode } from "../../models/Episode";

-const episodes: EpisodeSnapshotIn[] =
+const episodes: Episode[] =
```

## Persist Zustand Store

Zustand ships with [persistence middlware](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md). Let's hook it up!

Update `RootStore` to look like this:

**`app/store/RootStore.ts`**

```ts
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, createJSONStorage } from "zustand/middleware";

import { AuthenticationStore, authenticationStoreSelector, createAuthenticationSlice } from "./AuthenticationStore";
import { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RootStore extends AuthenticationStore, EpisodeStore {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createEpisodeSlice(...a),
      // add your state slices here

      _hasHydrated: false,
      setHasHydrated: (state) => {
        const set = a[0];
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "zustand-app",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector));
export const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector));
```

We added the `persist` middleware and created `_hasHydrated` property & action to track `AsyncStorage` hydration. This will automatically persist and hydrate your Zustand store! We just need to handle the loading state during initial hydration:

**`app/app.tsx`**

```diff
+import { useStore } from "./models"

...

const [areFontsLoaded] = useFonts(customFontsToLoad)

-useEffect(() => {
-  hideSplashScreen()
-}, [])

+const hasHydrated = useStore((state) => state._hasHydrated)
+useEffect(() => {
+  if (hasHydrated) {
+    setTimeout(hideSplashScreen, 500)
+  }
+}, [hasHydrated])

-if (!isNavigationStateRestored || !areFontsLoaded) return null
+if (!hasHydrated || !isNavigationStateRestored || !areFontsLoaded) return null

```

And we're all set!

[Full Source Code](https://github.com/Jpoliachik/ignite-zustand)
