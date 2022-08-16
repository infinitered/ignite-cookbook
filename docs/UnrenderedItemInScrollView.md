---
title: Scrolling to a location that hasn't been rendered using FlatList or SectionList
description: This article expains how to scroll to a location of a FlatList or SectionList that hasn't rendered yet
tags:
  - UI
last_update:
  author: Mark Rickert
---

When calling `scrollViewRef.current.scrollToLocation()` on a React Native FlatList or SectionList will fail on occasion because it can't scroll to a location that hasn't been rendered yet.

I ran into this problem on a LOT of the screens on a recent project so I wrote a HOC for SectionList that handles this case for us by implementing `onScrollToIndexFailed`.

This component basically tries over and over to scroll to the requested location until it gets it right and no longer calls `onScrollToIndexFailed`.

```jsx
import * as React from 'react';
import { SectionList, SectionListProps, SectionListScrollParams } from 'react-native';

interface SectionListHandle {
  scrollToLocation: (params: SectionListScrollParams) => void;
}

/**
 * This is a wrapper around react-native's SectionList that adds protection against scrolling to an
 * unknown (not rendered yet) location. This is useful for cases where the user wants to scroll to a
 * position very far down the list but we haven't rendered that far yet.
 *
 * This adds onScrollToIndexFailed property to SectionList so that if the scroll fails, we calculate the aproximate
 * scroll position, scroll there, and then try again to get the exact position requested.
 *
 * Essentially, it's a "guess the position and retry the operation" strategy until the list is scrolled to the
 * correct location.
 */
export const ScrollProtectedSectionList = React.forwardRef<
  SectionListHandle,
  SectionListProps<any, any>
>((props, forwardedRef) => {
  const internalRef = React.useRef<SectionList>(null);
  const [lastScrollRequest, setLastScrollRequest] = React.useState<SectionListScrollParams>();
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    console.log('ScrollProtectedSectionList.onScrollToIndexFailed', info);

    // Calculate the possible position of the item and scroll there using the internal scroll responder.
    const offset = info.averageItemLength * info.index;
    internalRef.current?.getScrollResponder()?.scrollTo({ x: 0, y: offset, animated: false });

    // If we know exactly where we want to scroll to, we can just scroll now since the item is likely visible.
    // Otherwise it'll call this function recursively again.
    if (lastScrollRequest) {
      timeout.current = setTimeout(() => {
        internalRef.current?.scrollToLocation(lastScrollRequest);
      }, 100);
    }
  };

  // Clear the timeout if it still exists when the component unmounts.
  React.useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      scrollToLocation: (params: SectionListScrollParams) => {
        internalRef.current?.scrollToLocation(params);
        setLastScrollRequest(params);
      },
    }),
    [internalRef],
  );

  return <SectionList {...props} ref={internalRef} onScrollToIndexFailed={onScrollToIndexFailed} />;
});
```
