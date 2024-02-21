---
title: Remove MobX-State-Tree
description: How to remove MobX-State-Tree from an Ignite project
tags:
  - MobX
  - State Management
last_update:
  author: Justin Poliachik
publish_date: 2024-02-05
---

# Remove Mobx-State-Tree

By default, Ignite uses [MobX-State-Tree](https://mobx-state-tree.js.org/) as the default state management solution. While we love [MobX-State-Tree at Infinite Red](https://docs.infinite.red/ignite-cli/concept/MobX-State-Tree/), we understand the landscape is rich with great alternatives that you may want to use instead.

This guide will show you how to remove Mobx-State-Tree from an Ignite-generated project and get to a "blank slate" with no state management at all.

## Steps

1. Let's start by removing all MobX-related dependencies

```bash
yarn remove mobx mobx-react-lite mobx-state-tree reactotron-mst
```

2. Ignite places all MobX-State-Tree models in the `models/`. Remove this entire directory and all files within it, these are not needed anymore.

```bash
rm -rf ./app/models
```

:::note
If you are migrating a project with several existing models, you may want to keep a copy of these around for reference as you migrate to your new system.
:::

3. Remove the `reactotron-mst` plugin from Reactotron's config

**devtools/ReactotronConfig.ts**

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

4. Remove `observer()` wrapped components and reformat as functional React components

- Do a project-wide search for `observer(` and replace each component instance with the following pattern:

**app/screens/WelcomeScreen.tsx**

```diff
--import { observer } from "mobx-react-lite"

--export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(props) {
++export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
    ...
--})
++}
```

5. Remove `useStores()` from components

- Do a project-wide search for `useStores` and remove each instance.
- If you're converting to a different state management solution, you'll need to swap the data we get from `useStores` to your new solution. Or you can swap in temporary hardcoded values to prevent crashes while you migrate. (just don't forget about it!)

```diff
--import { useStores } from "../models"

const AppStack = () => {
--  const { authenticationStore: { isAuthenticated } } = useStores()
++  const isAuthenticated = false // TODO: TEMPORARY VALUE - replace with alternative state management solution
```

6. Update the [Ignite Generator Templates](https://docs.infinite.red/ignite-cli/concept/Generator-Templates/)!

- Follow the same pattern to replace `observer()`. This will allow you to quickly generate screens and components via `npx ignite-cli generate screen NewScreen` and `npx ignite-cli generate component NewComponent` and use your updated syntax.
- I also recommend customizing these however else you prefer!

**ignite/templates/component/NAME.tsx.ejs**  
**ignite/templates/screen/NAMEScreen.tsx.ejs**

```diff
--import { observer } from "mobx-react-lite"

--export const <%= props.pascalCaseName %> = observer(function <%= props.pascalCaseName %>(props: <%= props.pascalCaseName %>Props) {
++export const <%= props.pascalCaseName %> = (props: <%= props.pascalCaseName %>Props) => {
    ...
--})
++}
```

7. Remove old MobX-State-Tree store initialization & hydration code in `app.tsx`.

- We still need to call `hideSplashScreen` in a `useEffect` so the app loads without needing to hydrate a store first.

**app/app.tsx**

```diff
--import { useInitialRootStore } from "./models"

--const { rehydrated } = useInitialRootStore(() => {
--setTimeout(hideSplashScreen, 500)
--})
++React.useEffect(() => {
++    setTimeout(hideSplashScreen, 500)
++}, [])

--if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null
++if (!isNavigationStateRestored || !areFontsLoaded) return null
```

8. Remove any remaining `/models` imports

Your app might have a few remaining references to replace. In the Ignite Demo App, we need to replace the `EpisodeSnapshotIn` type which was previously derived from the MST model. Instead, we'll use `EpisodeItem` from our API types.

**app/services/api/api.ts**

```diff
--import type { ApiConfig, ApiFeedResponse } from "./api.types"
--import type { EpisodeSnapshotIn } from "../../models/Episode"
++import type { ApiConfig, ApiFeedResponse, EpisodeItem } from "./api.types"


--async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
++async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
// make the api call

--// This is where we transform the data into the shape we expect for our MST model.
--const episodes: EpisodeSnapshotIn[] =
--  rawData?.items.map((raw) => ({
--    ...raw,
--  })) ?? []
++const episodes = rawData?.items ?? []
```

## Conclusion

You should be able to build and run your app! It won't have any data...but you now have a "blank slate" to setup your state management solution of choice.

For next steps, we have recipes for migrating to

- [Redux](./Redux.md)
- [Zustand](./Zustand.md)
- Or you can roll your own!
