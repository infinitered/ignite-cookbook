---
title: Creating a Good Experience for Screen Readers
description: Learn how to improve the experience of screen readers using your app!
tags:
  - Accessibility
  - iOS
  - Android
last_update:
  author: Lizzi Lindboe
---

## UI Patterns

### Screens

**Titles**
All screen should ideally have unique titles, to make it easier to know quickly which screen you're on [source](https://www.a11yportal.com/guidelines/design/structure.html#unique-page-screen-titles).

**Headings**
Apps should ideally mark headings to allow for quick "scanning" of the structure of screens ([source](https://www.a11yportal.com/guidelines/design/structure.html#headings)). In React Native, mark headings with the "header" accessibility role.

**Try to group controls as much as possible**
([source](https://www.a11yportal.com/guidelines/design/structure.html#grouped-elements))

> It is easier and quicker for people using a keyboard or screen reader to interact with content when not overwhelmed and confused by extraneous elements. Grouping elements into a single overall control makes things clearer, simplifies interactions, and can provide larger touch targets.
> For example, a control such as a custom item selector may be made up of smaller interface elements, but will be easier to use if conveyed as a single control. Another common example is [grouping adjacent links](https://www.a11yportal.com/guidelines/design/links.html#combining-repeated-links) to the same resource.

### Common patterns that require more work to add good UX for screen readers

**Infinite Scroll**
Infinite scroll causes two main problems for screen readers: 1) there's no clear "end" to jump to, and 2) elements pop in, which need to be announced if there weren't there when the end was reached.

**Toast, Dialog, or Modal**
Depending on the implementation used, these elements may not "announce" when they pop in. Evaluate solution for this before going with a library.

### RN-specific issues

**Test links nested in text with formatting**
Text links nested in other text elements aren't accessible. If you need to implement that design, there are a few options:

- Wrap the parent text in a View and add custom [accessibilityActions](https://reactnative.dev/docs/accessibility#accessibility-actions) for opening the links
  - Do not apply custom accessibilityActions to text, those will cause a crash on iOS
- Re-structure the component based on whether a screen reader is turned on (as in this [blog post](https://callstack.com/blog/react-native-android-accessibility-tips/))

## Labeling

A good accessibility label for an element is concise, but also unique and makes sense even when the screen is not read linearly. This is because one way to navigate with a screen reader is to search for a label. Another is to jump between controls (e.g., links, buttons, form fields), so if a header preceding a link is the only way to understand the link, it won't make sense in this navigation method.

See this post for some great advice on when and how to use labels: [https://mobilea11y.com/blog/when-to-use-accessibility-labels](https://mobilea11y.com/blog/when-to-use-accessibility-labels)
