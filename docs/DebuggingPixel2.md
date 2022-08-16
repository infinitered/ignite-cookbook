---
title: Enable USB Debugging for Pixel 2
description: Instructions for enabling USB Debugging on Pixel 2
tags:
  - Debug
  - Android
last_update:
  author: Derek Greenberg
---

[Helpful Article](https://www.verizon.com/support/knowledge-base-215055/)

Connect the device directly to the machine running the RN app on Android Studio.

I found that running `adb devices` returns an empty list if the device is plugged into a USB hub such as the Atolla USB hub. So plug the device directly into a USB port on the host machine.

This involves the usual 7-taps-on-an-obscure-icon technique used for other Android devices to enable the Developer Options menu, this time accessible from the Settings →Advanced→ Developer options menu

Be WARNED: like other Android phones, the device will require you to approve USB debugging AFTER you access the Developers menu after setting it! If you do not do this, you cannot access the device via adb devices
