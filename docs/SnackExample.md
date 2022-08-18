---
title: Example of Using Snack-Player
description: Here's an example of how to use the remark-snackplayer in the cookbook.
last_update:
  author: Dan Edwards
---

This plugin parses codeblocks with language set as `SnackPlayer` and replaces them with embedded Expo's SnackPlayers, you can also provide parameters along with the codeblock to set some basic details.

```SnackPlayer name=Hello%20Dumb%20World description=This%20is%20a%20description
import React from 'react';
import { Text, View } from 'react-native';

const YourApp = () => {
    return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
        Try editing me! 🎉
        </Text>
    </View>
    );
}

export default YourApp;
```
