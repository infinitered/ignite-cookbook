---
title: Expo Updates
description: Setting up Ignite to deployed over-the-air (OTA) updates
tags:
  - Expo
  - expo-updates
  - EAS Update
  - Expo Updates
last_update:
  author: Frank Calise
publish_date: 2023-01-06
---

# Expo Updates

This guide will teach you how to set up over-the-air (OTA) updates with Expo and EAS Update within an Ignite project.

## Appetizer

Follow the [Pristine Expo Project](./PristineExpoProject.md) recipe first to make sure you're starting with an Expo only project.

You'll also need `eas-cli` globally installed and and an [Expo account](https://expo.dev/signup) if you don't already have one.

`npm install -g eas-cli`

## Steps

### 1. Project Setup

From within your project directory, run the following:

```bash
npx expo install expo-updates
eas build:configure
```

- Answer yes to setting up the EAS project prompt and you can configure it for both platforms (**note:** for the purposes of this guide we'll be using Android)
- This will make some edits to your `app.json` now that the project has an EAS identifier, as well as add a new `eas.json` configuration file.

```bash
eas update:configure
```

- Some more `app.json` changes will be made adding an `updates` key to your configuration file.

### 2. Edit Build Profiles

Modify the newly generated `eas.json` to configure a `preview` build profile. We'll be using a `buildType` of `apk` for the Android build to keep things easy for testing, your production build can still use an Android App Bundle.

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "channel": "preview",
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Create the Build

Next, we'll create a build that we can test with on either an Android emulator or device. You may do this via EAS or [locally](https://docs.expo.dev/build-reference/local-builds/) if you the added queue time for an unpaid EAS account is getting in your way.

```bash
# via EAS
eas build --profile preview -p android

# locally
eas build --profile preview -p android --local
```

Accept the prompts for generating the new Android Keystore. Once that is completed (~7-10 minutes if you do it locally, add some extra time if using the EAS servers due to the queue time), drop it on your emulator or device and fire it up! 🔥

### 4. Making a Project Update

Right now you should be staring at the `<LoginScreen />` of the Ignite demo code. Let's go ahead and make an update to that so we can deploy it OTA. Open up `./app/screens/LoginScreen.tsx`. Feel free to make any modification, but for an example, let's change the header text:

```tsx
// error-line
<Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
// success-line
<Text testID="login-heading" text="Welcome! Please sign in" preset="heading" style={$signIn} />
```

Observe that currently there are no changes to your application (as metro is not running), there are no hot reloads going on and the header text remains `Sign in`.

### 5. Publishing OTA

#### Create the Update Channel

To publish this out to our app which is living on the `preview` channel (via the build profile in `eas.json`), we'll set up the channel:

```bash
eas channel:create preview
```

This only has to be done once if the channel doesn't exist (which you can confirm via `eas channel:view [name]`).

#### Upload Changes to EAS

Next, tell EAS about the update package to send out with our new changes:

```bash
eas update --branch preview --message "update login screen"
```

#### Download the Updates OTA

Now that the updates are on the server, we can look to update our app on our emulator/device. If the app is still in the foreground, swipe the app away to close it.

Reopen it from the app drawer. At this point in time, the default Expo update flow is to check for new updates on the update channel (formerly release channel if you're coming over from `expo publish`). If there is a pending compatible update, it will now be downloaded.

Close the app again and reopen it. Now the update will actually be applied. Note the change in the heading at the top of the sign in screen. It should match `Welcome! Please sign in` or whatever modification you made in Step 4.

You've now successfully sent an update over-the-air! Waiting on the app store review has been skipped and your critical bug fix is out there to the masses.

## Customized Update Flow

You'll note in Step 5 that it was kind of magical / lucky that we rebooted the app twice to get the update. This can be difficult to communicate that kind of behavior to users. You can build on the foundation from this guide and add a more customized approach, providing the user with a better experience in a few ways. Here is one example flow:

1. Check for updates
2. If one exists, alert the user
3. Should they choose to update, keep them updated that it is in progress
4. After successfully getting the update, offer to restart the app for the user
5. On any errors, communicate that it could not be completed at this time.

To achieve this functionality, you'll have to make some modifications to the `app.json` for more manual control over the flow, in addition to your UI changes.

```json
{
  // ...
  "updates": {
    "checkAutomatically": "ON_ERROR_RECOVERY"
    // ...
  }
}
```

This will tell Expo to skip checking for updates on load and instead only do it when we request a check. Look into the following methods to achieve this:

- [checkForUpdateAsync()](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)
- [fetchUpdateAsync()](https://docs.expo.dev/versions/latest/sdk/updates/#updatesfetchupdateasync)
- [reloadAsync()](https://docs.expo.dev/versions/latest/sdk/updates/#updatesreloadasync)

## Notes

Expo SDK updates, native code changes and `app.json` or `app.config.js` changes behave differently, so make sure to read the additional documentation below if that is your goal.

## More Resources

- [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Running builds on your own infrastructure](https://docs.expo.dev/build-reference/local-builds/)
