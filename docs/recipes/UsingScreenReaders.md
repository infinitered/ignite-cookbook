---
title: Using Screen Readers
description: Learn how to use a screen reader to improve accesibility!
tags:
  - Accessibility
  - iOS
  - Android
last_update:
  author: Lizzi Lindboe
publish_date: 2018-01-01
---

# Using Screen Readers

## iOS

### On a simulator

**Setting it up**
Simulators don't have VoiceOver, so you'll have to use the Accessibility Inspector.

From XCode, go to Xcode menu > Developer Tools > Accessibility Inspector, and make sure to change the laptop icon in the top left of the inspector window to the simulator instead.

**Operation**
For operation, the WWDC video on the inspector is more helpful than the documentation: [https://developer.apple.com/videos/play/wwdc2019/257/](https://developer.apple.com/videos/play/wwdc2019/257/).

### On a device

**Setting it up**
Go to Settings > Accessibility > VoiceOver and toggle VoiceOver on.
You can also toggle VoiceOver a few other ways:

- [Activate Siri](https://support.apple.com/guide/iphone/aside/summon_siri/15.0/ios/15.0) and ssay "Turn on VoiceOver" or "Turn off VoiceOver."
- Set up an accessibility shortcut to open VoiceOver when you:
  - [Triple-click the side button](https://support.apple.com/guide/iphone/accessibility-shortcuts-iph3e2e31a5/15.0/ios/15.0#iph3ce566f26) (on an iPhone with Face ID).
  - [Triple-click the Home button](https://support.apple.com/guide/iphone/accessibility-shortcuts-iph3e2e31a5/15.0/ios/15.0#iphe66e6ee36) (on an iPhone with a Home button).

**Operation**
Basic navigation for beginners:

- Tap items on the screen to hear them read aloud or interact with them
- To activate items you have selected, double tap quickly anywhere on the screen
- To scroll, select an item within the scrollable area and use a three-finger swipe

Other useful navigation tips:

- To hear the screen read aloud from the beginning, swipe upward with two fingers
- If you hear "Actions Available," you can access extra actions using the Rotor.
  - Make sure the rotor is set to "Actions" by rotating two fingers in a circle, as if turning a dial
  - To navigate through the list of actions, single-finger swipe up or down, and double-tap to use
- Gestures documented here:
  [https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios](https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios) - Helpful cheatsheet:
  [https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

## Android

### Devices with TalkBack installed

**Setup**
Go to Settings > Accessibility > TalkBack and toggle it on.

You can also:

- [Set up a shortcut](https://support.google.com/accessibility/android/answer/7650693) to toggle TalkBack by pressing both volume keys for 3 seconds
- Configure through adb:

```bash
# enable
adb shell settings put secure enabled_accessibility_services \
com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
# disable
adb shell settings put secure enabled_accessibility_services \
com.android.talkback/com.google.android.marvin.talkback.TalkBackService
```

**Operation**
Basic navigation:

- TalkBack follows a "drag your finger to explore the screen" paradigm. As you drag your finger around, you'll hear items read out. Pause over items you want to hear.
- You can also swipe left and right with one finger to explore items linearly.
- Double-tap to activate an element.
- Use two-finger swipes to scroll or pull down the notification shade.
- Typing: By default, TalkBack tries to follow the "drag your finger to explore the screen" pattern on the keyboard too. Drag your finger over the keys. Whichever you hovered on last and then lifted is typed.
  - This does not appear to always work with the default Samsung keyboard. You can install "GBoard" from the Google Play store and use that instead.

The rest:

- The TalkBack UI can vary depending on the device you're on. Reference these articles as you're learning:
  - Using the TalkBack menu and reading controls:
    [https://support.google.com/accessibility/android/answer/6007066?hl=en&ref_topic=10601570](https://support.google.com/accessibility/android/answer/6007066?hl=en&ref_topic=10601570)
  - Gestures:
    [https://support.google.com/accessibility/android/answer/6151827](https://support.google.com/accessibility/android/answer/6151827)
- Access custom actions by opening the TalkBack menu (depending on the device, either a three-finger tap, or, in one motion, swipe down then right).

### Devices with Voice Assistant and not TalkBack

(e.g., Galaxy S models less than 20)

**Setup**
TODO: Voice Assistant instructions

You can also probably install TalkBack on your device. Install "Android Accessibility Suite" from the Play store, and then enable it from Settings > Accessibility > Installed Accessibility Services. Note that if you have multiple profiles on this device, this service must be installed on the primary (personal) profile.

**Operation**
Cheatsheet:
[https://dequeuniversity.com/screenreaders/talkback-shortcuts](https://dequeuniversity.com/screenreaders/talkback-shortcuts)
