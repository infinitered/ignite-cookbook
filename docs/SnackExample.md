---
title: Example of Using Snack-Player
description: Here's an example of how to use the remark-snackplayer in the cookbook.
last_update:
  author: Dan Edwards
---

This plugin parses codeblocks with language set as `SnackPlayer` and replaces them with embedded Expo's SnackPlayers, you can also provide parameters along with the codeblock to set some basic details.

```SnackPlayer name=Hello%20World&description=This%20is%20a%20description&dependencies=react-native-reanimated&platform=ios
import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function Box() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * 255 }],
    };
  });

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button onPress={() => (offset.value = Math.random())} title="Move" />
    </>
  );
}

const YourApp = () => {
    return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
        Try editing me! 🎉
        </Text>
        <Box />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'navy',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 80,
    color: 'white',
  },
  buttons: {
    marginTop: 50,
  },
});

export default YourApp;
```
