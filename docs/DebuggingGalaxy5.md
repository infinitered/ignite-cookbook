---
title: Enable USB Debugging for Galaxy 5
description: Instructions for enabling USB Debugging on Galaxy 5
tags:
  - Debug
  - Android
last_update:
  author: Derek Greenberg
---

The steps required to get a tethered Galaxy 5 Android phone to appear in your list of `adb devices` quite tedious.

First, the USB connection must go directly to a port on the machine that is running Android Studio. In my case, using a USB hub for the connection will fail. I found that running `adb devices` returns an empty list if the device is plugged into a USB hub such as the Atolla USB hub.

You have to dive into the dark recesses of the phone's Settings menu, find what should be a read-only icon that should display something, tap it 7 times (an informational overlay shows how many times you have tapped it as you go), then back out until you can access a Developer options menu that appears where you can enable USB Debugging. See [https://www.androidcentral.com/how-enable-samsung-galaxy-s5-developer-options](https://www.androidcentral.com/how-enable-samsung-galaxy-s5-developer-options)
