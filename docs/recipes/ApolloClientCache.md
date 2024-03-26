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
npx ignite-cli@latest ignite-apollo-cmds --yes
cd ignite-apollo-cmds
npx expo install @apollo/client graphql
mkdir app/stores/apollo
touch app/stores/apollo/index.tsx
```

## Quick Apollo Client Setup

Open up `app/stores/apollo/index.tsx` and initialize your Apollo Client, feel free to customize this to your liking:

```tsx
// app/stores/apollo/index.tsx
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

```tsx
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

```tsx
reactotron.onCustomCommand({
  title: "Extract Apollo Client Cache",
  description: "Gets the updated InMemory cache from Apollo Client",
  command: "extractApolloCache",
  handler: () => {
    Reactotron.display({
      name: "Apollo Cache",
      preview: "Cache Snapshot",
      value: client.cache.extract(),
    });
  },
});
```

Now if we look at our Reactotron window, you'll see under the Custom Commands we have a new button! Press that and flip back to the timeline. You'll see we have a new list item that we can tap on and see the value of the in-memory cache from the Apollo Client

![Cache Snapshot Custom Command](https://private-user-images.githubusercontent.com/374022/316961769-3afeba98-70e9-486a-bc98-f3cb2a18e4b3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYxNzY5LTNhZmViYTk4LTcwZTktNDg2YS1iYzk4LWYzY2IyYTE4ZTRiMy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03OTgxN2M3YjNlY2E1ODhkMzRkNTVmZDUwMDRjZGUxNDhhYWJmNmI5ZTE2OTljM2UxNjQwMjcxMzRkMjIzMTM3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.b6kbQjn7Q24lKyyNesr4fPLv5mfs0NnXZGCwgWt9tOI)

![Cache Snapshot Timeline Collapsed](https://private-user-images.githubusercontent.com/374022/316962010-14bbca18-23dc-4603-9fec-d7d3f78b2906.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYyMDEwLTE0YmJjYTE4LTIzZGMtNDYwMy05ZmVjLWQ3ZDNmNzhiMjkwNi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yM2Q3ZmRkZGU0M2RkOTMwMTQ5YjZiNGVmMTQxY2YzNjE4NjEzNGI3M2VhNzA2MTJjMDc2M2ZiNTJjMDJlYmI5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.9GG2mAai2ZLwOdMflyN0GoRMtdNuvMVr0KQR4ppMNlI)

![Cache Snapshot Timeline Expanded](https://private-user-images.githubusercontent.com/374022/316962193-f4444809-42a2-4e92-9f34-4fdb2f0b11c1.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYyMTkzLWY0NDQ0ODA5LTQyYTItNGU5Mi05ZjM0LTRmZGIyZjBiMTFjMS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hMzBkYWNhMzVhZTBiNWFhNWIwZjEzYTMxZjI0NWIyYTQ4NDgzZTYxZDQwYmYzZTU3ZTQ0MzcxNWI4NzdmZmUxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.hKKPmobTwe9ymQvt17SWWlwwfWMANmnqwBND21mUwEE)

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

```tsx
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

![Cache By Key Custom Command](https://private-user-images.githubusercontent.com/374022/316961853-2262dfc4-ce4e-409c-9ab5-3bfb0e45d788.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYxODUzLTIyNjJkZmM0LWNlNGUtNDA5Yy05YWI1LTNiZmIwZTQ1ZDc4OC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01ZTQ5ODhiZWMzMTE5YjIyZTg5YjZlYmYyYWUxMDIzYjM4MDJkYjAxYzY3MGNhZTUwNDNjNTVmMGY2YWYwOTRkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.ySP3VT-lXY_aCWtLkmTWWwASlh6ZCWlKgQ5XDgtCzPw)

![Cache By Key Timeline Collapsed](https://private-user-images.githubusercontent.com/374022/316962080-e2659614-2322-45ec-93cc-1a09123bff4c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYyMDgwLWUyNjU5NjE0LTIzMjItNDVlYy05M2NjLTFhMDkxMjNiZmY0Yy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hMWQ5NTg1ZWJiMzlhZmU4MGU3YTI4OWFjYzZkNjkzMzFjMTRlNTI4ZmVkY2FlZTljOTgzZTc2NTNjYmQ4MTM3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.0wJPqrXgVt0hcNdQe-2JDo42PPa47xneDw6B7UQuuls)

![Cache By Key Timeline Expanded](https://private-user-images.githubusercontent.com/374022/316962242-86966b34-ba10-46ce-931c-de5579b5f6c4.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE0NzIwNjksIm5iZiI6MTcxMTQ3MTc2OSwicGF0aCI6Ii8zNzQwMjIvMzE2OTYyMjQyLTg2OTY2YjM0LWJhMTAtNDZjZS05MzFjLWRlNTU3OWI1ZjZjNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyNlQxNjQ5MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0wYzEwOTEwMzJhZGYxOWQ2YTJjMmFkMDJjYjk0MjI0OTI2NjY5Y2U4NzQ1MWE1YzQxOTkzMDk5MjU1NTMwMjk3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.753f3a64LCho0uMXpIrzHf5fhl1wiu3DkQqSGLSsWXo)

Head back to your Reactotron UI and you'll see the Custom Command at the bottom (or top, depending on how you register in your config) available for use. You can now extract values from more complex key paths such as `ROOT_QUERY.chapter({"id":1}).sections[2]` rather than having to traverse the entire object.
