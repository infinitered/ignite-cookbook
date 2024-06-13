---
title: Detox Intro
description: A quick look at Detox and what makes it useful
tags:
  - Testing
  - Intro
last_update:
  author: Jamon Holmgren
publish_date: 2022-10-09
---

Detox is a library for end-to-end testing of React Native apps. This wiki provides information on how to use Detox effectively.

### Installation

Detox's [documentation for installation](https://wix.github.io/Detox/docs/introduction/getting-started/).

### What's unique about Detox

#### Synchronization

One of the key features that makes Detox unique is that it synchronizes with app state, so it can know when to move to the next step of a test, instead of including manual sleep statements. [See the documentation for more info](https://wix.github.io/Detox/docs/articles/how-detox-works/#how-detox-automatically-synchronizes-with-your-app).

But this does create new kinds of errors to be aware of. For example, if you see a Detox test hanging, that's an indication that Detox might not be detecting that the app went into the idle state so that the test can continue. To debug, check out [Detox's troubleshooting guide on sync issues](https://wix.github.io/Detox/docs/troubleshooting/synchronization).

**🚸 Flaky Tests**

The RNR team interviewed Rotem Meidan, former lead of Detox, about Detox stability, in [React-Native Radio 189](https://reactnativeradio.com/episodes/rnr-189-reliable-detox-with-rotem-opBGVWSK).

He wrote an article about that here: [Detox: Writing Stable Test Suites](https://medium.com/wix-engineering/detox-writing-stable-test-suites-372c9d537184).
