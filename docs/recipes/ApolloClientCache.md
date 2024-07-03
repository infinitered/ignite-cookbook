---
title: Extracting Apollo Client's Cache in Reactotron
description: How to enhance your Ignite debugging experience when using the Apollo client with Custom Commands in Reactotron
tags:
  - Apollo Client
  - Cache
  - Reactotron
  - Custom Commands
last_update:
  author: Frank Calise
publish_date: 2024-03-26
---

# Overview

This guide will teach you how to add two additional [Custom Commands](https://docs.infinite.red/reactotron/custom-commands/) for use within [Reactotron](https://docs.infinite.red/reactotron/) when using Ignite alongside the [Apollo Client](https://www.apollographql.com/docs/react/) library.

# Prerequisites

You'll need the following to get going with this recipe:

- An Ignite project with Reactotron configured (this is done for you)
- Configured with an Apollo Client pointed at a GraphQL backend

## Install Commands

```bash
npx ignite-cli@latest new ignite-apollo-cmds --yes
cd ignite-apollo-cmds
npx expo install @apollo/client graphql
mkdir app/stores/apollo
touch app/stores/apollo/index.tsx
```

## Quick Apollo Client Setup

Open up `app/stores/apollo/index.tsx` and initialize your Apollo Client, feel free to customize this to your liking:

```tsx title="app/stores/apollo/index.tsx"
import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

export const client = new ApolloClient({
  uri: "https://api.graphql.guide/graphql",
  cache,
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
```

Now we need to pass this client into the provider at the root app level, so open `app/app.tsx` and wrap the return value that is already there:

```tsx title="app/app.tsx"
// success-line-start
import { ApolloProvider } from "@apollo/client";
import { client as apolloClient } from "app/stores/apollo";
// success-line-end

// ...

return (
  // success-line
  <ApolloProvider client={apolloClient}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={$container}>
          <AppNavigator
            linking={linking}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
    // success-line
  </ApolloProvider>
);
```

# Reactotron Config

We'll be adding two additional commands to our Reactotron setup.

1. Extract an entire snapshot of the current cache and display it to the timeline
2. Extract a specific key of the current cache and display it to the timeline

Both of these modifications will be added to `app/devtools/ReactotronConfig.ts`. Before we add these, we'll need access to our client - so add the following import in that file: `import { client as apolloClient } from "../stores/apollo"`

## Cache Snapshot

Somewhere after the `Reactotron.configure` statement (below or above the existing custom commands will work fine), add the following code

```tsx title="app/devtools/ReactotronConfig.ts"
reactotron.onCustomCommand({
  title: "Extract Apollo Client Cache",
  description: "Gets the updated InMemory cache from Apollo Client",
  command: "extractApolloCache",
  handler: () => {
    Reactotron.display({
      name: "Apollo Cache",
      preview: "Cache Snapshot",
      value: apolloClient.cache.extract(),
    });
  },
});
```

Now if we look at our Reactotron window, you'll see under the Custom Commands we have a new button! Press that and flip back to the timeline. You'll see we have a new list item that we can tap on and see the value of the in-memory cache from the Apollo Client

![Cache Snapshot Custom Command](https://github.com/infinitered/ignite-cookbook/assets/374022/3afeba98-70e9-486a-bc98-f3cb2a18e4b3)

![Cache Snapshot Timeline Collapsed](https://github.com/infinitered/ignite-cookbook/assets/374022/14bbca18-23dc-4603-9fec-d7d3f78b2906)

![Cache Snapshot Timeline Expanded](https://github.com/infinitered/ignite-cookbook/assets/374022/f4444809-42a2-4e92-9f34-4fdb2f0b11c1)

## Cache by Key

Quite often, though, you're in-memory cache could be quite large and maybe you're not that interested in all the data. We can create another command that will do a look up specifically by the key we pass into the Reactotron UI.

To do this, we'll utilize the `args` property to allow our command to take in a string. We'll then get access to that value in the `handler` callback, which we can use however we wish.

Let's plan this out:

1. Upon press, make sure the user filled out a key, if not we'll log an error to the Timeline
2. Extract the cache and look for the requested key
   a. if it doesn't exist, log an error to the Timeline
   b. if it does exist, return the value

To make this easier, we'll first create a helper function to extract a specific key path from the cache. This will allow us to request a key in some nested object, for example if we had the following:

```json
{
  "parent": {
    "child": {
      "someProp": 5
    }
  }
}
```

We could directly request the value `parent.child.someProp` to be logged out via this Custom Command. Here's a helper function that'll get you started, customize it how you like! This one will be able to access array value via their index in addition to a key directly.

```tsx title="app/devtools/ReactogronConfig.ts"
function getNestedCacheValue(keyPath: string): any {
  // Extract the entire cache
  const cache: NormalizedCacheObject = client.cache.extract();

  // Define a regular expression to match keys and array accessors
  const pathSegmentRegex = /[^.[\]]+|\[\d+\]/g;

  // Extract path segments, including array indices
  const pathSegments = keyPath.match(pathSegmentRegex) || [];

  // Navigate through the path segments to get to the desired value
  const value = pathSegments.reduce((acc, segment) => {
    // Check if the segment is an array accessor, e.g., [1]
    if (segment.startsWith("[") && segment.endsWith("]")) {
      // Extract the index from the segment and convert it to a number
      const index = parseInt(segment.slice(1, -1), 10);
      return acc ? acc[index] : undefined;
    }
    // Handle normal object property access
    return acc ? acc[segment] : undefined;
  }, cache);

  return value ?? null; // Return null if the value is undefined at any point
}
```

With that in place, we can set up our new Custom Command:

```tsx
reactotron.onCustomCommand({
  title: "Extract Apollo Client Cache by Key",
  description: "Retrieves a specific key from the Apollo Client cache",
  command: "extractApolloCacheByKey",
  args: [{ name: "key", type: ArgType.String }],
  handler: (args) => {
    const { key } = args ?? {};
    if (key) {
      const findValue = getNestedCacheValue(key);
      if (findValue) {
        Reactotron.display({
          name: "Apollo Cache",
          preview: `Cache Value for Key: ${key}`,
          value: findValue,
        });
      } else {
        Reactotron.display({
          name: "Apollo Cache",
          preview: `Value not available for key: ${key}`,
        });
      }
    } else {
      Reactotron.log("Could not extract cache value. No key provided.");
    }
  },
});
```

![Cache By Key Custom Command](https://github.com/infinitered/ignite-cookbook/assets/374022/2262dfc4-ce4e-409c-9ab5-3bfb0e45d788)

![Cache By Key Timeline Collapsed](https://github.com/infinitered/ignite-cookbook/assets/374022/e2659614-2322-45ec-93cc-1a09123bff4c)

![Cache By Key Timeline Expanded](https://github.com/infinitered/ignite-cookbook/assets/374022/86966b34-ba10-46ce-931c-de5579b5f6c4)

Head back to your Reactotron UI and you'll see the Custom Command at the bottom (or top, depending on how you register in your config) available for use. You can now extract values from more complex key paths such as `ROOT_QUERY.chapter({"id":1}).sections[2]` rather than having to traverse the entire object.
