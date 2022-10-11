---
title: Patching/Building Android .aar From Source
description: Instructions for updating the RN Android source code
tags:
  - Debug
  - Guide
  - Android
last_update:
  author: Yulian Glukhenko
---

### Why?

Sometimes, a situation arises when you might want to update the react-native Android source code without upgrading react-native itself. For example, there's a [new bug](https://github.com/facebook/react-native/issues/33375) on Android 12 where the application crashes due to some bug with the animation queue. The potential fix is available on the `main` (unreleased) branch, but your app version is a few patches behind. Another situation is when you simply can't upgrade your react-native version yet, but need a fix from future version. In these cases, you can use this approach to "patch" your Android source files and build new .aar binary and use that for your app.

### Official Guides

The official steps to build from source are provided by react-native and you can find them [here.](https://reactnative.dev/contributing/how-to-build-from-source)

The guid is fairly generic and redundant in some cases if you already have a sufficient react-native development environment setup. The steps below describe what has "worked for me" and they may or may not apply to everyone.

### Steps

_1 - Fork React-Native And Clone_

Go to [Github](https://github.com/facebook/react-native) and fork react-native. Pull the forked code down to your system.

> Note: The official instructions tell you to clone react-native into your project's `node_modules`. Don't do this. Just pull it down into your favorite development directory.

_2 - Checkout the Correct Commit_

If you are following this guide, you are most likely trying to patch react-native Android source files at a specific older version. The easiest way to do this is to checkout the commit specified in the respective version's git tag.
![Branch and Commit History](<../static/img/PatchingBuildingAndroid(1).jpg>)

_3 - Install Dependencies_

Just type `yarn`.

_4 - Configure the SDK_

You will need the version of the SDk specifice in the `./ReactAndroid/build.gradle` for `compileSdkVersion`. You can install it via Android Studio.
![Android SDK Configuration](<../static//img/PatchingBuildingAndroid(2).jpg>)

_5 - Configure the NDK_

Check the `./gradle.properties` file, `ANDROID_NDK_VERSION` key, for the version needed. This can be installed from Android Studio as well.
![Android NDK Configuration](<../static//img/PatchingBuildingAndroid(3).jpg>)

> Note: The official docs provide links to NDK archives. Installing through Android Studio is probably easer. One caveat is that I didn't find arm architecture NDKs in Android Studio. It's not a big deal though to use those since you won't do this often.

_6 - Configure Paths_

Create a `local.properties` file in the root. This file is gitignored and should be kept as so.

```
sdk.dir=/Users/path/to/sdk
ndk.dir=/Users/path/to/ndk
```

Your SDK path is in your Library files (if installed through Android Studio).Your NDK path is inside the SDK path. This is what mine looks like:

```
sdk.dir=/Users/~Usernamehere~/Library/Android/sdk
ndk.dir=/Users/~Usernamehere~/Library/Android/sdk/ndk/21.4.7075529
```

> Note: The official guides also have you setup shell paths with the same values. Not sure if this is needed. It wasn't for me.

_7 - Make the Necessary Changes_

Now, you can make any changes in the `./ReactAndroid` folder.

_8 - Build_

Run the following command in the root:

```
arch -x86_64 ./gradlew :ReactAndroid:installArchives --no-daemon
```

The first time you run this, it'll take some time. It will also report any syntax/type errors. It will also report any configuration errors.

> Note: If you installed an arm compatible NDK, omit the `arch -x86_64` from the command

_9 - Commit and Push_

In your `.gitignore`, remove the line which ignores the `/android/` directory. We'll want to commit this build output from step 7. Commit and push your fork.

_10 - Update Project's React-Native_

Now that you have build and pushed your changes, you can reference that in your application's `package.json`.
![package json](<../static//img/PatchingBuildingAndroid

> Note: You'll most likely need to delete/re-install your node_modules as well as run `./android/gradlew clean`.
