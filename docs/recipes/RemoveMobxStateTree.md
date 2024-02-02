---
title: Remove Mobx-State-Tree
description: How to remove Mobx-State-Tree from an Ignite project
tags:
  - MobX
  - State Management
last_update:
  author: Justin Poliachik
publish_date: 2024-02-01
---

# Remove Mobx-State-Tree

By default, Ignite uses [Mobx-State-Tree](https://mobx-state-tree.js.org/) as the default state management solution. While we love [Mobx-State-Tree at Infinite Red](https://docs.infinite.red/ignite-cli/concept/MobX-State-Tree/), we understand the landscape is rich with great alternatives that you may want to use instead.

This guide will show you how to remove Mobx-State-Tree from an Ignite-generated project and get to a "blank slate" with no state management at all.

## Steps

1. Let's start by removing all Mobx-related dependencies from `package.json`, then run `yarn` or `npm i`

**package.json**

```diff
--"mobx": "6.10.2",
--"mobx-react-lite": "4.0.5",
--"mobx-state-tree": "5.3.0",

--"reactotron-mst": "3.1.5",
```

2. Ignite places all Mobx-State-Tree models in the `models/`. Remove this entire directory and all files within it, these are not needed anymore.

```terminal
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

```diff
--import { observer } from "mobx-react-lite"

--export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(props) {
++export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
    ...
--})
++}
```

5. Update the [Ignite Generator Templates](https://docs.infinite.red/ignite-cli/concept/Generator-Templates/)!

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

6. Remove old Mobx-State-Tree store initialization & hydration code in `app.tsx`.

- We still need to call `hideSplashScreen` in a `useEffect` so the app loads without needing to hydrate a store first.

**app/app.tsx**

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

## Conclusion

You should be able to build and run your app! It won't have any data...but you now have a "blank slate" to setup your state management solution of choice.

For next steps, we have recipes for migrating to

- [Redux](./Redux.md)
- [Zustand](./Zustand.md)
- Or you can roll your own!
