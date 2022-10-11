# Ignite Cookbook for React Native

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Recipe Template

When creating a recipe there are a few needed elements (front-matter) for Docusaurus:

```markdown
---
title: Recipe Template
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
