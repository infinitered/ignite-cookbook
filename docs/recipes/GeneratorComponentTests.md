---
title: Generator for Component Tests
description: Customize `npx ignite-cli generate component` to add test files for each component generated
tags:
  - Generator
last_update:
  author: Joshua Yoes
---

# Add component tests to `npx ignite-cli generate component`

Did you know that Ignite automatically generates files for you? And that you can customize those generators?

Here is how to automatically generate components and tests for them using `@testing-library/react-native`

## Setup `@testing-library/react-native`

First, we will want to add `@testing-library/react-native` to our Ignite project. [Josh Justice has an excellent setup guide to follow along at reactnativetesting.io](https://reactnativetesting.io/component/setup)

## Component Generators

There are a variety of generators, but today we are going to focus on `npx ignite-cli generate component`

Ignite will look in the `ignite/templates/*` directory for what templates to run on each command.

By default, Ignite provides a `ignite/templates/component/NAME.tsx.ejs` template for creating a component file.

- We use ejs and frontmatter to write our templates, you can read more about syntax [in the Ignite docs](https://github.com/infinitered/ignite/blob/master/docs/Generator-Templates.md).
- `NAME` in `ignite/templates/component/NAME.tsx.ejs` is replaced with the first argument passed to our generator. So `npx ignite-cli generate component Profile` would create `app/components/Profile.tsx`

## Customizing Component Generators

Add the following file to `ignite/templates/component/NAME.spec.tsx.ejs`

```
---
destinationDir: app/components/specs
---
// https://reactnativetesting.io/component/testing/

import React from "react"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { <%= props.pascalCaseName %> } from "../<%= props.pascalCaseName %>"

describe("<%= props.pascalCaseName %>", () => {
  it("renders", () => {
    render(<<%= props.pascalCaseName %> />)
    expect(screen.getByText("Hello")).toBeTruthy()
  })
})
```

Now, when we run `npx ignite-cli generate component Profile`, it will create both `app/components/Profile.tsx` _and_ `app/components/specs/Profile.spec.tsx`

- `ignite/templates/component/NAME.spec.tsx.ejs`
- `ignite/templates/component/NAME.tsx.ejs`

## Testing

Now, all we need to do is run `yarn test`! If everything was set up properly, you should have a new suite of passing tests!
