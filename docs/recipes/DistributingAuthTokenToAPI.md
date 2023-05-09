---
title: Distributing Auth Token to APIs
description: Use token stored in Authentication Store with API Sauce
tags:
  - Mobx State Tree
  - Apisauce
  - Guide
last_update:
  author: Ellie Croce
publish_date: 2023-05-09
---

# Distributing Auth Token to APISauce

Building off of the Ignite Boilerplate, this recipe will show you how to connect your Mobx State Tree Authentication Store with an APISauce instance to make authenticating your API requests a breeze.

## Review of API Instance and Auth Store

To start off let's quickly review the boilerplate Auth Store and API Instance.

In `app/services/api/api.ts` we have an example API class with an export of a singleton instance of that class at the end of the file. This api singleton what we're going to use to update the apiSauce configuration on the instance outside of this file.

```tsx
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}


export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    ... // example API call that needs authenticating
  }

}

// Singleton instance of the API for convenience
export const api = new Api()
```

Next in `app/models/AuthenticationStore.ts` we have an action to set the auth token in the store after retrieving it.

```tsx
import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .views((store) => ({}))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
  }));

export interface AuthenticationStore
  extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot
  extends SnapshotOut<typeof AuthenticationStoreModel> {}
```

## Distributing Auth Token to API Instance

Once we have an auth token and setAuthToken has been called, we need to hydrate the authentication header on all APIs that require requests to be authenticated. One of the easiest ways to do that is to grab the instance(s) in an action on the authStore and update the apiSauce configuration directly like so:

```tsx
import { api } from "app/services/api/api.ts";

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .views((store) => ({}))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
    distributeAuthToken(value?: string) {
      // optionally grab the store's authToken if not passing a value
      const token = value || store.authToken;
      api.apiSauce.setHeader("Authorization", `Bearer ${token}`);
    },
  }));
```

From there you have a couple options of how to trigger the distribution.

- Add another action that calls both setAuthToken and distributeAuthToken and replace wherever you call setAuthToken with this new dual action
- Call distributeAuthToken immediately after wherever you are calling setAuthToken
- Add the distributeAuthToken call to the setAuthToken action (not recommended because it doesn't follow the SRP of the action)

For example in `app/screens/LoginScreen.tsx` we can update the login function to distribute the auth token after setting it in the store.

```tsx
function login() {
  setIsSubmitted(true);
  setAttemptsCount(attemptsCount + 1);

  if (validationError) return;

  // Make a request to your server to get an authentication token.
  // If successful, reset the fields and set the token.
  setIsSubmitted(false);
  setAuthPassword("");
  setAuthEmail("");

  // We'll mock this with a fake token.
  const token = String(Date.now());
  setAuthToken(token);
  distributeAuthToken(token);
}
```

And that's it! Now all of your requests to that API will be made with the authentication header, leveraging the auth token received on login.
