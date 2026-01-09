---
title: Migrating From Apisauce to Axios
description: A comprehensive guide to migrate your Ignite boilerplate API layer from Apisauce to Axios
tags:
  - Guide
  - API
  - Apisauce
  - Migration

last_update:
  author: BOUMOUZOUNA Brahim Vall
publish_date: 2025-08-31
---
# Migrating From Apisauce to Axios (Ignite)

This guide walks you through migrating your Ignite boilerplate API layer from **Apisauce** to **Axios** with production-ready TypeScript examples.

> ⚠️ Axios difference vs Apisauce
> Axios **rejects** promises for non-2xx responses by default. If you prefer Apisauce-style “never reject by status” behavior, enable **compat mode** in the `Api` constructor (`validateStatusCompat: true`).

## Quick Start

```bash
yarn add axios
yarn remove apisauce
```

Then update your API layer using the snippets below.

---

## 1) `app/services/api/types.ts`

Keep your domain types and configure Axios via `ApiConfig`.

```ts
/**
 * Options used to configure Axios.
 */
export interface ApiConfig {
  /**
   * Base URL of the API.
   */
  url: string
  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * Example domain model (adjust to your backend).
 */
export interface EpisodeItem {
  id: string
  title: string
  description?: string
  // add the fields you actually use
}

/**
 * Example API response payload used by getEpisodes().
 * Adjust to match your backend.
 */
export interface ApiFeedResponse {
  items: EpisodeItem[]
}
```

---

## 2) `app/services/api/apiProblem.ts`

A resilient mapper that understands Axios errors **and** raw responses (for compat mode).

```ts
import axios, { AxiosError, AxiosResponse } from "axios"

export type GeneralApiProblem =
  | { kind: "timeout"; temporary: true }
  | { kind: "cannot-connect"; temporary: true }
  | { kind: "server" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "not-found" }
  | { kind: "rejected" }
  | { kind: "unknown"; temporary: true }
  | { kind: "bad-data" }

/**
 * Attempts to extract a common problem shape from an Axios error (preferred)
 * or from a raw response (when using compat mode / validateStatus override).
 */
export function getGeneralApiProblem(input: unknown): GeneralApiProblem | null {
  // Primary path: Axios errors
  if (axios.isAxiosError(input)) {
    const err = input as AxiosError
    const status = err.response?.status

    // Network & timeout codes
    if (err.code === "ECONNABORTED") return { kind: "timeout", temporary: true }
    if (err.code === "ERR_NETWORK") return { kind: "cannot-connect", temporary: true }
    if (err.code === "ERR_CANCELED") return { kind: "unknown", temporary: true }

    // HTTP status mapping (when response exists)
    if (typeof status === "number") {
      if (status >= 500) return { kind: "server" }
      if (status === 401) return { kind: "unauthorized" }
      if (status === 403) return { kind: "forbidden" }
      if (status === 404) return { kind: "not-found" }
      if (status >= 400) return { kind: "rejected" }
      return null
    }

    // Fallback for unexpected Axios errors
    return { kind: "unknown", temporary: true }
  }

  // Secondary path: raw responses when using validateStatus: () => true
  const res = input as Partial<AxiosResponse>
  if (typeof res?.status === "number") {
    const { status } = res
    if (status >= 500) return { kind: "server" }
    if (status === 401) return { kind: "unauthorized" }
    if (status === 403) return { kind: "forbidden" }
    if (status === 404) return { kind: "not-found" }
    if (status >= 400) return { kind: "rejected" }
    return null
  }

  // Unknown non-Axios input
  return { kind: "unknown", temporary: true }
}
```

---

## 3) `app/services/api/index.ts`

Interceptors are **optional** via `ApiOptions`. Compat mode is also optional.

```ts
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios"
import Config from "@/config"
import type { EpisodeItem, ApiFeedResponse, ApiConfig } from "./types"
import { getGeneralApiProblem, GeneralApiProblem } from "./apiProblem"

/**
 * Default Axios config
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10_000,
}

/**
 * Optional features you can toggle per instance.
 */
export interface ApiOptions {
  /**
   * Enables console logging of requests/responses in development.
   * Default: true in __DEV__, false otherwise.
   */
  enableLogging?: boolean
  /**
   * Enables a simple retry-on-5xx interceptor with exponential backoff (x3).
   * Default: false
   */
  enableRetry?: boolean
  /**
   * Apisauce-like "compat" mode where Axios never rejects by status.
   * If true, you must pass the raw response to getGeneralApiProblem().
   * Default: false
   */
  validateStatusCompat?: boolean
}

/**
 * (A) If you want to track retry counts on requests, augment the config type.
 * In production, put this in a global .d.ts (e.g., app/types/axios.d.ts).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare module "axios" {
  export interface AxiosRequestConfig {
    retryCount?: number
  }
}

export class Api {
  axios: AxiosInstance
  config: ApiConfig
  options: Required<ApiOptions>

  constructor(config: ApiConfig = DEFAULT_API_CONFIG, options: ApiOptions = {}) {
    this.config = config
    this.options = {
      enableLogging: typeof __DEV__ !== "undefined" ? __DEV__ : false,
      enableRetry: false,
      validateStatusCompat: false,
      ...options,
    }

    this.axios = axios.create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: { Accept: "application/json" },
      ...(this.options.validateStatusCompat
        ? { validateStatus: () => true } // never reject by status
        : {}),
    })

    if (this.options.enableLogging) this.setupLoggingInterceptor()
    if (this.options.enableRetry) this.setupRetryInterceptor()
  }

  /**
   * Example call — adjust URL and mapping to your backend.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
    try {
      const response: AxiosResponse<ApiFeedResponse> = await this.axios.get(
        "api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx",
      )

      // Compat mode: treat status errors like Apisauce (no throw)
      if (this.options.validateStatusCompat) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const raw = response.data
      if (!raw || !Array.isArray(raw.items)) {
        return { kind: "bad-data" }
      }

      const episodes: EpisodeItem[] = raw.items.map((it) => ({ ...it }))
      return { kind: "ok", episodes }
    } catch (error) {
      // Default Axios behavior: non-2xx throws → map the error
      const problem = getGeneralApiProblem(error)
      return problem ?? { kind: "unknown", temporary: true }
    }
  }

  // ---------- Optional interceptors ----------

  private setupRetryInterceptor() {
    this.axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (!axios.isAxiosError(error)) return Promise.reject(error)
        const { response, config } = error
        if (!config) return Promise.reject(error)

        // Retry on 5xx, up to 3 attempts with backoff
        if (response?.status && response.status >= 500) {
          config.retryCount = (config.retryCount ?? 0) + 1
          if (config.retryCount <= 3) {
            await new Promise((r) => setTimeout(r, 1000 * config.retryCount))
            return this.axios.request(config as AxiosRequestConfig)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private setupLoggingInterceptor() {
    this.axios.interceptors.request.use((config) => {
      // Use baseURL to build a helpful message
      const base = config.baseURL ?? ""
      console.log(`API Request: ${config.method?.toUpperCase()} ${base}${config.url}`)
      return config
    })

    this.axios.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        console.log(`API Error: ${status ?? "unknown"} ${error?.config?.url ?? ""}`)
        return Promise.reject(error)
      },
    )
  }
}

// Singleton if you prefer the old pattern
export const api = new Api()
```

**Usage examples:**

```ts
// Default (DEV logs on, retry off, compat off)
const api = new Api()

// Silent, no retries
const apiSilent = new Api(DEFAULT_API_CONFIG, { enableLogging: false })

// Enable retries
const apiWithRetry = new Api(DEFAULT_API_CONFIG, { enableRetry: true })

// Apisauce-like compat behavior (no throw by status)
const apiCompat = new Api(DEFAULT_API_CONFIG, { validateStatusCompat: true })
```

---

## 4) Tests (examples)

### `app/services/api/apiProblem.test.ts`

```ts
import { AxiosError, AxiosResponse } from "axios"
import { getGeneralApiProblem } from "./apiProblem"

function mockAxiosError(message: string, code: string, status?: number): AxiosError {
  const err = new AxiosError(message, code)
  if (status) {
    const res = { status } as AxiosResponse
    ;(err as any).response = res
  }
  return err
}

test("maps timeout", () => {
  const error = mockAxiosError("timeout of 5000ms exceeded", "ECONNABORTED")
  expect(getGeneralApiProblem(error)).toEqual({ kind: "timeout", temporary: true })
})

test("maps cannot-connect (network error)", () => {
  const error = mockAxiosError("Network Error", "ERR_NETWORK")
  expect(getGeneralApiProblem(error)).toEqual({ kind: "cannot-connect", temporary: true })
})

test("maps server 5xx", () => {
  const error = mockAxiosError("Internal Server Error", "ERR_BAD_RESPONSE", 500)
  expect(getGeneralApiProblem(error)).toEqual({ kind: "server" })
})

test("maps 401/403/404/418", () => {
  expect(getGeneralApiProblem(mockAxiosError("Unauthorized", "ERR_BAD_REQUEST", 401))).toEqual({
    kind: "unauthorized",
  })
  expect(getGeneralApiProblem(mockAxiosError("Forbidden", "ERR_BAD_REQUEST", 403))).toEqual({
    kind: "forbidden",
  })
  expect(getGeneralApiProblem(mockAxiosError("Not Found", "ERR_BAD_REQUEST", 404))).toEqual({
    kind: "not-found",
  })
  expect(getGeneralApiProblem(mockAxiosError("I'm a teapot", "ERR_BAD_REQUEST", 418))).toEqual({
    kind: "rejected",
  })
})

test("returns null for successful raw responses (compat path)", () => {
  const response = { status: 200 } as AxiosResponse
  expect(getGeneralApiProblem(response)).toBeNull()
})
```

### `app/services/api/index.test.ts`

```ts
import { Api, DEFAULT_API_CONFIG } from "./index"

describe("Api", () => {
  it("creates an axios instance with correct defaults", () => {
    const api = new Api({ url: "https://api.example.com", timeout: 5000 })
    expect(api.axios.defaults.baseURL).toBe("https://api.example.com")
    expect(api.axios.defaults.timeout).toBe(5000)
  })

  it("handles successful requests", async () => {
    const api = new Api(DEFAULT_API_CONFIG, { enableLogging: false })
    jest.spyOn(api.axios, "get").mockResolvedValue({
      data: { items: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as any)

    const result = await api.getEpisodes()
    expect(result.kind).toBe("ok")
  })
})
```

---

## Replace Apisauce Imports

```ts
// Before
import { ApiResponse, ApisauceInstance, create } from "apisauce"

// After
import axios, { AxiosInstance, AxiosResponse } from "axios"
```

---

## Error Handling Patterns

* **Default Axios** (throws on non-2xx):

  ```ts
  try {
    const res = await api.axios.get("/users")
    // success path
  } catch (error) {
    const problem = getGeneralApiProblem(error)
    // handle problem
  }
  ```

* **Compat mode** (never throws by status):

  ```ts
  const res = await api.axios.get("/users") // validateStatusCompat = true
  const problem = getGeneralApiProblem(res)
  if (problem) {
    // handle problem
  }
  ```

---

## Extras You Can Add Later

* Auth header in a request interceptor (uses secure storage).
* Request cancellation via `AbortController`.
* Progress callbacks for uploads/downloads.
* Offline strategies (queue + retry) for RN.

---

## Resources

* [https://axios-http.com/](https://axios-http.com/) (Docs)
* [https://axios-http.com/docs/interceptors](https://axios-http.com/docs/interceptors)
* [https://axios-http.com/docs/typescript](https://axios-http.com/docs/typescript)

