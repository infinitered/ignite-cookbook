---
title: Maestro Setup
description: Setting up e2e testing with Maestro in Ignite
tags:
  - Maestro
  - testing
last_update:
  author: Dan Edwards
publish_date: 2023-01-06
---

# Setting Up Maestro in Ignite

## Overview

E2E testing is a critical part of any application but it can be difficult to set up and maintain. Maestro is a tool that promises to be easy to set up and maintain e2e tests. This recipe will walk you through setting up Maestro in your Ignite project.

> ##### Note
>
> Detox is the default e2e testing tool in Ignite. Should you choose to use Maestro, you will need to remove Detox from your project. There will be a section at the end of this recipe that will walk you through removing Detox.

## Maestro Installation

We're going to start by installing Maestro via the terminal. To do this, we'll need to run the following command:

```bash
    curl -Ls "https://get.maestro.mobile.dev" | bash
```

Once the installation is complete, you'll be ready to create your first Maestro flow!

## Creating our first Maestro Flow

To start out, we're going to create a folder to hold our Maestro flows. Let's do this by adding a folder in the root of our Ignite project called `.maestro`. Once that's done we can create our first flow in a file called `Login.yaml`

With this flow we want to open up our app and then login with the default credentials. We can do this by adding the following to our `Login.yaml` file:

```yaml
#flow: Login
#intent:
# Open up our app and use the default credentials to login
# and navigate to the demo screen

appId: com.maestroapp # the app id of the app we want to test, in my case it's the com.maestroapp
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

clearState - This action clears the state of our app. This is useful if we want to start from a clean slate.
launchApp - This action launches our app specified with the `appId` in our flow.
assertVisible - This assertion checks to see if the text we pass in is visible on the screen.
tapOn - This action taps on the specified element. In our case, we're tapping on the text we pass in.

To run our flow we can `cd` into our `maestro` folder and simply run the following command:

```bash
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

Let's create another flow that will run the login flow and then navigate to the demo podcast list screen, favorite a podcast, and then switch the list to only be favorites.

Go ahead and create a flow called `FavoritePodcast.yaml` and add the following to it:

```yaml

```
