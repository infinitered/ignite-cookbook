---
title: Maestro Setup
description: Setting up e2e testing with Maestro in Ignite
tags:
  - Maestro
  - testing
last_update:
  author: Dan Edwards
publish_date: 2023-02-01
---

# Setting Up Maestro in Ignite

## Overview

End-to-end (e2e) testing is a critical part of any application but it can be difficult to set up and maintain. [Maestro](https://maestro.mobile.dev/) is a tool that promises to be easy to set up and maintain e2e tests. This recipe will walk you through setting up Maestro in your Ignite project.

## Maestro Installation

We're going to start by installing Maestro via the terminal. To do this, we'll need to run the following command:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

If you haven't already, you'll also need to install Facebook's IDB Companion tool:

```bash
brew tap facebook/fb
brew install idb-companion
```

If you run into any issues, check out the [Maestro cli installation guide](https://maestro.mobile.dev/getting-started/installing-maestro#installing-the-cli) for more information.

Once the installation is complete, you'll be ready to create your first Maestro flow!

## Creating our first Maestro Flow

To start out, we're going to create a folder to hold our Maestro flows. Let's do this by adding a folder in the root of our Ignite project called `.maestro`. Once that's done we can create our first flow in a file called `Login.yaml`

With this flow we want to open up our app and then login with the default credentials. We can do this by adding the following to our `Login.yaml` file:

```yaml
#flow: Login
#intent:
# Open up our app and use the default credentials to login
# and navigate to the demo screen

appId: com.maestroapp # the app id of the app we want to test
# You can find the appId of an Ignite app in the `app.json` file
# as the "package" under the "android" section and "bundleIdentifier" under the "ios" section
---
- clearState # clears the state of our app (navigation and authentication)
- launchApp # launches the app
- assertVisible: "Sign In"
- tapOn:
    text: "Tap to sign in!"
- assertVisible: "Your app, almost ready for launch!"
- tapOn:
    text: "Let's go!"
- assertVisible: "Components to jump start your project!"
```

We're using a few different actions and assertions in this flow. Let's take a look at what they do:

`clearState` - This action clears the state of our app. This is useful if we want to start from a clean slate.
`launchApp` - This action launches our app specified with the `appId` in our flow.
`assertVisible` - This assertion checks to see if the text we pass in is visible on the screen.
`tapOn` - This action taps on the specified element. In our case, we're tapping on the text we pass in.

To run our flow, first make sure the app is loaded on the simulator (or running via metro through `yarn ios`, for example). Then execute maestro from its test directory with the following command:

```bash
cd .maestro
maestro test Login.yaml
```

And that's it! We've successfully created our first Maestro flow and ran it. You should see something like this in your terminal after running the test:

```bash
    ║  > Flow
        Running on iPhone 11 - iOS 16.2 - 5A269AA1-2704-429B-BF30-D6965060E03E
    ║    ✅  Clear state of com.maestroapp
    ║    ✅  Launch app "com.maestroapp"
    ║    ✅  Assert that "Sign In" is visible
    ║    ✅  Tap on "Tap to sign in!"
    ║    ✅  Assert that "Your app, almost ready for launch!" is visible
    ║    ✅  Tap on "Let's go!"
    ║    ✅  Assert that "Components to jump start your project!" is visible
```

Let's add another flow to see what else we can do with Maestro!

## Let's see what else Maestro can do

Let's create a more advanded flow that spans across multiple screens, we'll want to accomplish the following:

1. Use environment variables
2. Run the login flow
3. Navigate to the demo podcast list screen
4. Favorite a podcast
5. Switch the list to only be favorites
6. Use accessibility labels to find elements

Go ahead and create a flow called `FavoritePodcast.yaml` and add the following to it:

```yaml
# flow: run the login flow and then navigate to the demo podcast list screen, favorite a podcast, and then switch the list to only be favorites.

appId: com.maestroapp
env:
  TITLE: "RNR 257 - META RESPONDS! How can we improve React Native, part 2"
  FAVORITES_TEXT: "Switch on to only show favorites"

---
- runFlow: Login.yaml
- tapOn: "Podcast, tab, 3 of 4"
- assertVisible: "React Native Radio episodes"
- tapOn:
    text: ${FAVORITES_TEXT}
- assertVisible: "This looks a bit empty"
- tapOn:
    text: ${FAVORITES_TEXT}
- scrollUntilVisible:
    element:
      text: ${TITLE}
    direction: DOWN
    timeout: 50000
    speed: 40
    visibilityPercentage: 100
- longPressOn: ${TITLE}
- scrollUntilVisible:
    element:
      text: ${FAVORITES_TEXT}
    direction: UP
    timeout: 50000
    speed: 40
    visibilityPercentage: 100
- tapOn:
    text: ${FAVORITES_TEXT}
- assertVisible: ${TITLE}
```

We did a few things new here. Let's take a look at what they are:

1. We added an `env` section to our flow. This allows us to set environment variables that we can use in our flow. In this case, we're setting the title of the podcast we want to favorite and the favorites toggle label text.
2. We added a `runFlow` action. This action allows us to run another flow from within our flow. In this case, we're running the `Login.yaml` flow before we run the rest of our flow.
3. We added a `scrollUntilVisible` action. This will help us find the episode we are looking for because it won't always be available in the first visible content as new episodes are released. This action is also used to scroll back up to toggle the `Only Show Favorites` switch.
4. We added a `longPressOn` action. This action allows us to long press on an element. In this case, we're long pressing on the podcast we want to favorite, we're able to do this because of the accessability action that's associated with the Podcast Card.
5. The text "Switch on to only show favorites" (or env var `${FAVOREITES_TEXT}`) is the accessibility label passed to the Toggle component. Maestro identifies accessibility labels as text as long as that element does not have any text children.

> If you're running these tests on an iOS simulator, you may need to add `accessibilityLabel: episode.title,` to line 180 of `DemoPodcastListScreen.tsx` in your Ignite project.

## Conclusion

Maestro is a great tool for e2e testing. It's easy to set up and maintain. It's also easy to add to your Ignite project. If you want to check out how to use their other features, like Maestro cloud & Maestro Studio, check out their [documentation](https://maestro.mobile.dev/).

> ## Notes
>
> Detox is the default e2e testing tool in Ignite. Should you choose to use Maestro, remove Detox from your project.
