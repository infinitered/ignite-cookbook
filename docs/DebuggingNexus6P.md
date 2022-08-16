---
title: Enable USB Debugging for Nexus 6P
description: Instructions for enabling USB Debugging on Nexus 6P
tags:
  - Debug
  - Android
last_update:
  author: Derek Greenberg
---

Connect the device directly to the machine running the RN app on Android Studio.

I found that running `adb devices` returns an empty list if the device is plugged into a USB hub such as the Atolla USB hub.

Gamers will love this. You have to tap on an unexpected icon (the build number) exactly 7 times to enable the Developers menu.

See [this helpful blog post](https://dzone.com/articles/enabling-usb-debugging-nexus-7#:~:text=Here%20are%20the%20high%20level,top%20menu)

The phone put up more of a fight than a Samsung Galaxy 5. It forced me to manually re-enter my pin and displayed some unpleasant warning and display modals that I had to cancel before I could back out of the screen, access the NEW developers menu, scroll down to the enable USB debugging, and enable it.

Be WARNED: like other Android phones, the device will require you to approve USB debugging AFTER you access the Developers menu after setting it! If you do not do this, you cannot access the device via adb devices
