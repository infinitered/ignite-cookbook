---
title: Mock Service Worker (MSW)
description: How to integrate Mock Service Worker with Ignite 
tags:
  - MSW
  - Testing
  - Expo
last_update:
  author: Tyler Williams
publish_date: 2026-07-13
---

# Mock Service Worker (MSW)

## Overview

[Mock Service Worker](https://mswjs.io/) (MSW) intercepts network activity, letting you mock API responses without changing your application code. It can be useful for QA testing different network states, running end-to-end tests against mock data, and even running Jest tests without having to mock in Jest. 

Unfortunately, the [MSW React Native integration](https://mswjs.io/docs/integrations/react-native) doesn't work as written (as of July 2026). The main issues is that Mock Service Worker has to override fetch behavior and some other global JavaScript objects, which are different in Hermes as compared to the environments it expects to be using. This recipe walks through each problem and its fix in an Ignite app.

For the complete working example, see the [reference PR on GitHub](https://github.com/infinitered/mswtest/pull/2).

## Prerequisites

- An Ignite app (created with `npx ignite-cli new`)

## Step 1: Install Dependencies

```bash
npx expo install msw fast-text-encoding react-native-url-polyfill
```

## Step 2: Polyfill Hermes for MSW Compatibility

**Why this is needed:** MSW assumes a browser-like environment. On Hermes, `globalThis.fetch` is non-writable and `BroadcastChannel`, `EventTarget`, `Event`, `MessageEvent`, and `XMLHttpRequestUpload` are all missing, causing MSW to crash at runtime. See the [MSW #2367 discussion](https://github.com/mswjs/msw/issues/2367#issuecomment-4311536712) for background.

The polyfill file below handles six things:

1. Imports `fast-text-encoding` and `react-native-url-polyfill` for `TextEncoder`/`URL` support
2. Deletes and re-defines `globalThis.fetch` as writable so MSW can replace it
3. Stubs `Event` with enough of the interface for MSW's internal event dispatching
4. Stubs `EventTarget` with `addEventListener`/`removeEventListener`/`dispatchEvent`
5. Stubs `MessageEvent`, `XMLHttpRequestUpload`, and `BroadcastChannel`
6. Wraps `XMLHttpRequest.getAllResponseHeaders()` to never return `null` (Hermes quirk that causes MSW to crash on `.split()`)

```js title="msw.polyfills.js"
import "fast-text-encoding"
import "react-native-url-polyfill/auto"

// Issue 1: globalThis.fetch is non-writable in Hermes.
// MSW's FetchInterceptor does `globalThis.fetch = interceptedFetch`, but Hermes
// exposes fetch as a non-configurable native binding. The assignment silently
// fails — no error thrown, MSW reports it's listening, but no requests are
// intercepted. We must delete and re-define the property as writable/configurable
// before MSW is imported.
const nativeFetch = globalThis.fetch
try {
  delete globalThis.fetch
  globalThis.fetch = nativeFetch
  Object.defineProperty(globalThis, "fetch", {
    value: nativeFetch,
    writable: true,
    configurable: true,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
} catch (error) {
  if (typeof globalThis.fetch === "undefined") {
    globalThis.fetch = nativeFetch
  }
}

// Issue 2: Missing Web APIs at import time.
// MSW's core module (ws.js, sse.js) references BroadcastChannel, EventTarget,
// Event, and MessageEvent at module evaluation time (not inside functions).
// Hermes doesn't provide these. They must be polyfilled before any MSW import.

if (typeof globalThis.Event === "undefined") {
  globalThis.Event = class Event {
    constructor(type, init) {
      this.type = type
      this.bubbles = init?.bubbles ?? false
      this.cancelable = init?.cancelable ?? false
      this.defaultPrevented = false
    }
    preventDefault() {
      this.defaultPrevented = true
    }
    stopPropagation() {}
    stopImmediatePropagation() {}
  }
}

if (typeof globalThis.EventTarget === "undefined") {
  globalThis.EventTarget = class EventTarget {
    constructor() {
      this._listeners = {}
    }
    addEventListener(type, listener) {
      ;(this._listeners[type] ??= []).push(listener)
    }
    removeEventListener(type, listener) {
      const list = this._listeners[type]
      if (list) this._listeners[type] = list.filter((l) => l !== listener)
    }
    dispatchEvent(event) {
      for (const listener of this._listeners[event.type] ?? []) listener(event)
      return true
    }
  }
}

if (typeof globalThis.MessageEvent === "undefined") {
  globalThis.MessageEvent = class MessageEvent {
    constructor(type, init) {
      this.type = type
      this.data = init?.data ?? null
      this.origin = init?.origin ?? ""
      this.lastEventId = init?.lastEventId ?? ""
      this.source = init?.source ?? null
      this.ports = init?.ports ?? []
    }
  }
}

// MSW's XMLHttpRequest interceptor uses `target instanceof XMLHttpRequestUpload`
// at runtime. Hermes doesn't expose XMLHttpRequestUpload as a global, causing a
// ReferenceError. Provide a stub class so the instanceof check resolves to false
// instead of throwing.
if (typeof globalThis.XMLHttpRequestUpload === "undefined") {
  globalThis.XMLHttpRequestUpload = class XMLHttpRequestUpload {}
}

// Hermes's XMLHttpRequest.getAllResponseHeaders() can return null instead of an
// empty string when no headers are available. MSW's interceptor calls .split()
// on the result, which throws "Cannot read property 'split' of null".
// Wrap the method so it always returns a string.
if (typeof globalThis.XMLHttpRequest !== "undefined") {
  const origGetAllResponseHeaders = globalThis.XMLHttpRequest.prototype.getAllResponseHeaders
  if (origGetAllResponseHeaders) {
    globalThis.XMLHttpRequest.prototype.getAllResponseHeaders = function () {
      return origGetAllResponseHeaders.call(this) ?? ""
    }
  }
}

if (typeof globalThis.BroadcastChannel === "undefined") {
  globalThis.BroadcastChannel = class BroadcastChannel {
    constructor(_name) {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
      return true
    }
  }
}
```

## Step 3: Patch `@mswjs/interceptors` for `whatwg-fetch` Compatibility

**Why this is needed:** Expo's `whatwg-fetch` polyfill provides the `Response` class on React Native, but it doesn't implement a `body` getter. When MSW reads `response.body`, it gets `undefined` instead of the actual response body, so mocked responses arrive empty. This patch falls back to `_bodyInit`, which is where `whatwg-fetch` stores the body internally.

See the upstream issues: [whatwg-fetch #1454](https://github.com/JakeChampion/fetch/issues/1454) and [Expo PR #46630](https://github.com/expo/expo/pull/46630).

:::warning
This patch targets a specific build artifact filename (`fetch-5IMPqr9e.mjs`) inside `@mswjs/interceptors`. When you upgrade MSW, the filename may change and the patch may fail to apply. You'll need to regenerate it against the new version.
:::

```diff title="patches/@mswjs__interceptors.patch"
diff --git a/lib/browser/fetch-5IMPqr9e.mjs b/lib/browser/fetch-5IMPqr9e.mjs
index ff7e15e2e4b6d91614f01fd4e5439f67ed72ea70..be355a7e1f1c6b14f2e7763bc0d580b7399f2231 100644
--- a/lib/browser/fetch-5IMPqr9e.mjs
+++ b/lib/browser/fetch-5IMPqr9e.mjs
@@ -110,7 +110,7 @@ function createDecompressionStream(contentEncoding) {
 	}, []));
 }
 function decompressResponse(response) {
-	if (response.body === null) return null;
+	if (!response.body) return null;
 	const decompressionStream = createDecompressionStream(response.headers.get("content-encoding") || "");
 	if (!decompressionStream) return null;
 	response.body.pipeTo(decompressionStream.writable);
@@ -172,7 +172,7 @@ var FetchInterceptor = class FetchInterceptor extends Interceptor {
 						return;
 					}
 					this.logger.info("received mocked response!", { rawResponse });
-					const response = new FetchResponse(decompressResponse(rawResponse) || rawResponse.body, {
+					const response = new FetchResponse(decompressResponse(rawResponse) || rawResponse._bodyInit || rawResponse.body, {
 						url: request.url,
 						status: rawResponse.status,
 						statusText: rawResponse.statusText,
```

Register the patch in your `package.json`:

```json title="package.json"
{
  "pnpm": {
    "patchedDependencies": {
      // success-line
      "@mswjs/interceptors": "patches/@mswjs__interceptors.patch"
    }
  }
}
```

Then reinstall to apply it:

```bash
pnpm install
```

## Step 4: Create Mock Handlers and Server

The rest of this guide comes from the [MSW quick start docs](https://mswjs.io/docs/quick-start).

**Server setup** — create the MSW server using the `msw/native` entry point (not `msw/node`):

```ts title="app/mocks/server.ts"
import { setupServer } from "msw/native"

import { handlers } from "./handlers"

export const server = setupServer(...handlers)
```

**Request handlers** — define which requests to intercept and what to return:

```ts title="app/mocks/handlers.ts"
import { http, passthrough, HttpResponse } from "msw"

import { mockFeedResponse } from "./data"

export const handlers = [
  http.get("https://api.rss2json.com/v1/api.json", () => {
    console.log("[MSW] Intercepted rss2json request, returning mock data")
    return new HttpResponse(JSON.stringify(mockFeedResponse), {
      headers: { "Content-Type": "application/json" },
    })
  }),

  // Let Metro's internal requests pass through without warnings
  http.post("*/symbolicate", () => passthrough()),
]
```

:::tip
The `symbolicate` passthrough handler is important — without it, MSW intercepts Metro's symbolication requests and your stack traces will break during development.
:::

**Mock data** — define the response shapes that match your API types. Here's an abbreviated example matching the Ignite demo app's `ApiFeedResponse`:

```ts title="app/mocks/data.ts"
import type { ApiFeedResponse } from "../services/api/types"

export const mockFeedResponse: ApiFeedResponse = {
  status: "ok",
  feed: {
    url: "https://feeds.simplecast.com/hEI_f9Dx",
    title: "React Native Radio",
    link: "https://www.reactnativeradio.com/",
    author: "Infinite Red",
    description: "Exploring React Native Together",
    image: "https://placecats.com/200/200",
  },
  items: [
    {
      title: "RNR 287 - Expo Router and the Future of Navigation",
      pubDate: "2024-06-12 00:00:00",
      link: "https://www.reactnativeradio.com/episodes/rnr-287",
      guid: "rnr-287-expo-router",
      author: "Jamon Holmgren",
      thumbnail: "https://placecats.com/300/300",
      description:
        "In this episode we dive deep into Expo Router, file-based routing, and what the future of navigation looks like in React Native.",
      content:
        "<p>In this episode we dive deep into Expo Router, file-based routing, and what the future of navigation looks like in React Native.</p>",
      enclosure: {
        link: "https://cdn.simplecast.com/audio/rnr-287.mp3",
        type: "audio/mpeg",
        length: 45000000,
        duration: 2700,
        rating: { scheme: "urn:itunes", value: "clean" },
      },
      categories: ["React Native", "Navigation", "Expo"],
    },
    // ... more items
  ],
}
```

## Step 5: Enable Mocking in `app.tsx`

**Why the mocking gate matters:** The dynamic `import()` calls keep MSW and its polyfills out of production bundles entirely — Metro's tree shaker eliminates the `__DEV__` branch. The `isMockingReady` state prevents the app from rendering before MSW is listening, which would let real requests slip through before interception is active.

:::warning
The MSW docs suggest wrapping `registerRootComponent` in a promise and awaiting the setup. However, [we found](https://github.com/infinitered/mswtest/pull/2#:~:text=Do%20not%20register%20root%20component%20after%20a%20delay) that this caused `registerRootComponent` not to fire. So our recommendation is to wire up the mocking logic to your app initialization. 
:::

Add the following to your `App` component in `app/app.tsx`:

```tsx title="app/app.tsx"
// success-line
const [isMockingReady, setIsMockingReady] = useState(!__DEV__)

// success-line-start
useEffect(() => {
  if (!__DEV__) return

  async function enableMocking() {
    // @ts-ignore
    await import("../msw.polyfills")
    const { server } = await import("./mocks/server")
    server.listen()
    setIsMockingReady(true)
  }

  enableMocking()
}, [])
// success-line-end

// ...

if (
  // success-line
  !isMockingReady ||
  !isNavigationStateRestored ||
  !isI18nInitialized ||
  (!areFontsLoaded && !fontLoadError)
) {
  return null
}
```

## Step 6: Configure Axios to Use the Fetch Adapter

**Why this is needed:** MSW intercepts `fetch`, but axios defaults to the `XMLHttpRequest` adapter, which bypasses MSW entirely. Switching to the [fetch adapter](https://axios.rest/pages/advanced/fetch-adapter) routes all axios requests through `fetch` where MSW can intercept them.

In your API service configuration (e.g. `app/services/api/index.ts`), add `adapter: "fetch"` to the axios instance:

```ts title="app/services/api/index.ts"
this.apiSauce = create({
  baseURL: this.config.url,
  timeout: this.config.timeout,
  headers: {
    Accept: "application/json",
  },
  // success-line-start
  // Use the fetch adapter so MSW can intercept requests reliably.
  adapter: "fetch",
  // success-line-end
})
```

## Verify It Works

1. Run the app — mocked data should appear instead of real API responses
2. Check the console for `[MSW] Intercepted ...` log messages from your handlers
3. Trigger an error to confirm symbolication still works (the `*/symbolicate` passthrough handler should keep stack traces intact)

## Further Reading

- [MSW React Native integration docs](https://mswjs.io/docs/integrations/react-native)
- [MSW #2367 — Hermes compatibility discussion](https://github.com/mswjs/msw/issues/2367#issuecomment-4311536712)
- [whatwg-fetch #1454 — missing `body` getter](https://github.com/JakeChampion/fetch/issues/1454)
- [Axios fetch adapter docs](https://axios.rest/pages/advanced/fetch-adapter)
- [Reference PR: Full working example](https://github.com/infinitered/mswtest/pull/2)
