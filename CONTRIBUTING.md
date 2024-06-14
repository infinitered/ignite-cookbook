# Ignite Cookbook for React Native

This website is built using [Docusaurus 3](https://docusaurus.io/docs/3.1.1), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

For contributions from members of the Ignite community, please nest the recipe in the `docs/communityRecipes` directory. This will allow us to easily identify and promote community contributions.

### Recipe Template

When creating a recipe there are a few needed elements (front-matter) for Docusaurus:

```markdown
---
title: Recipe Template (should match the file name for proper alphabetization)
description: A quick look at what's needed for Docusaurus
tags:
  - Guide
  - Intro
last_update:
  author: Your Name Here
---
```

Every recipe needs this metadata at the top of the file for Docusaurus to title, tag, and give author credit appropriately.

````markdown
## Section Titles Are Great

Sections help break up the recipe into more cohesive thoughts and help others follow along.

For step-by-step examples, lists are great:

1. Readers can do this step.
2. Then this one when they're done with the first.
3. And this is the last step before they're done.

Using **Bold** and _Italic_ Fonts are also helpful ways to create emphasis within your recipe.

> Block Quotes help others know when you're highlighting something, or attributing an idea to someone else.
> They're also great for footnotes to sections.

Whenever you create a Code Block, be sure to label it with the language like so:

```jsx
import * as React from "react";
import { Text, View } from "react-native";

export default ExampleCodeBlock = () => (
  <View>
    <Text>This is a great example code block.</Text>
  </View>
);
```

To use a SnackPlayer for the code block you simply note that it's a SnackPlayer and provide some props for the player:

```SnackPlayer name=Hello%20World&description=This%20is%20a%20description&dependencies=react-native-reanimated&platform=ios

import * as React from "react";
import { Text, View } from "react-native";

export default ExampleCodeBlock = () => (
  <View>
    <Text>This is a great example code block.</Text>
  </View>
```
````

## Swizzled components and upgrades

To allow customization of pre-built theme components, Docusaurus has a feature called [swizzling](https://docusaurus.io/docs/swizzling), which either allows creating a wrapper around the existing component, or creating a copy of it that can be modified.

It's totally fine to swizzle components, even "unsafe" ones, but take care to minimize changes so that it's easy to upgrade components to their latest versions later on.

## License

This project is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0) - see the [LICENSE](./LICENSE.md) file for details.

By contributing to this project, you agree that your contributions will be licensed under the same Creative Commons license.
