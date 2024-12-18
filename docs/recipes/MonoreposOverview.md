---
title: Choosing the right monorepo strategy for your project
description: This document outlines the advantages and challenges of adopting a monorepo strategy for software development projects, particularly in the context of React Native and the Ignite framework. It provides guidance on when to use or avoid a monorepo, explores common monorepo tools, and discusses typical setups to help teams select the most suitable approach for their needs.
tags:
  - Monorepo
  - Yarn
last_update:
  author: Felipe Peña
---

# Choosing the right monorepo strategy for your project

## Introduction

When embarking on a software development project, particularly in the context of React Native and using the Ignite framework, the decision to adopt a monorepo structure is critical. A monorepo can streamline development, foster better code sharing, and simplify dependency management. However, it's not a one-size-fits-all solution. This document explores when you should consider using a monorepo, when you might want to avoid it, the most common monorepo options available, and typical setups for software applications.

## When to use a monorepo

- **Code sharing across multiple projects**: If your project involves multiple apps or services that share a significant amount of code, a monorepo can help ensure that these shared components are consistent across all projects. This is particularly beneficial for UI components, utility functions, or custom logic.

- **Unified CI/CD pipeline**: A monorepo allows you to manage a single CI/CD pipeline, simplifying the automation process. This is useful when you want to ensure that all parts of your application are tested and deployed together, reducing the risk of version mismatches.

- **Simplified dependency management**: Managing dependencies across multiple repositories can be complex and error-prone. With a monorepo, you can centralize dependency management, making it easier to maintain consistency and avoid version conflicts.

- **Synchronous release cycles**: If your apps or services need to be released together, a monorepo makes it easier to coordinate these releases. This is often the case in large-scale enterprise applications where different parts of the system are closely interconnected.

- **Small to medium-sized teams**: Monorepos work well for small to medium-sized teams. With everyone working in the same repository, it’s easier to collaborate, share code, and stay aligned on changes.

## When not to use a monorepo

- **Large and unrelated projects**: If your projects are large and unrelated, a monorepo can become unwieldy. The repository size might grow excessively, and it can become difficult to manage unrelated codebases together, leading to longer CI/CD times and more complex build processes.

- **Different lifecycles**: When different projects have significantly different release cycles or stability requirements, maintaining them in a monorepo can introduce unnecessary complexity. For example, if one service is in active development while another is in maintenance mode, separate repositories might be more appropriate.

- **Security concerns**: If your projects require different access controls or have varying levels of security requirements, a monorepo might not be suitable. Ensuring that sensitive parts of the codebase are protected can be more challenging in a monorepo setup.

- **Large, distributed teams**: For large, distributed teams, a monorepo can become hard to manage. With many contributors, the repository can grow quickly, leading to longer build times and more complicated merges. In these cases, using separate repositories might be better, allowing different teams to work independently without slowing each other down.

## Common monorepo tools

Existing monorepo tools can be divided in two types:
* Dependency managers
* Build systems

Let's talk about each of them.

### Dependency managers

A dependency manager is a tool that automates the installation and management of a project's required libraries, ensuring compatibility and consistency.

| Tool                          | Pros                                                                                                                                      | Cons                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Yarn Workspaces](https://yarnpkg.com/features/workspaces) | Built-in support for monorepos. <br />Simplifies dependency management across packages. <br />Excellent community support and documentation. | Can be complex to configure initially. <br />Some issues with peer dependencies.                                                   |
| [Pnpm](https://pnpm.io/)                          | Efficient disk space usage with unique package storage. <br />Fast installation times. <br />Built-in support for monorepos.                 | Less mainstream adoption, leading to potential issues with community support. <br />Some tooling might not fully support Pnpm yet. |
| [Lerna](https://lerna.js.org/) | Great for managing multi-package repositories. <br/>Supports independent versioning of packages. <br/>Integrates well with Yarn Workspaces. | Stagnant for years, although [maintained by Nx now](https://www.google.com/url?q=https://blog.nrwl.io/lerna-5-1-new-website-new-guides-new-lerna-example-repo-distributed-caching-support-and-speed-64d66410bec7&sa=D&source=docs&ust=1727362999686773&usg=AOvVaw2QrLSkc_AY7zOgk7Sz_YQM). <br/> Slower for large codebases. <br/>Requires additional configuration for CI/CD. |

:::info

Based on our experience, simplicity and community support, **we recommend Yarn as a dependency manager**.

:::


### Build systems

A build system automates tasks like compiling code, running tests, and bundling assets, optimizing the development process.

| Tool                          | Pros                                                                                                                                      | Cons                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Nx](https://nx.dev/)                            | Focuses on improving performance with advanced caching and task scheduling. <br />Great for large-scale enterprise applications.           | Steeper learning curve. <br />May be overkill for smaller projects.                                                                |
| [Turborepo](https://turbo.build/repo/docs/guides/tools)                     | High performance with built-in caching and parallel task execution. <br />Simplifies monorepo management with minimal configuration.       | Less mature ecosystem compared to Yarn or Lerna. <br />Limited tooling support for some workflows.                                 |

## Common monorepo setups for software apps

### Frontend apps and packages

- `/apps`: Contains a set of frontend apps (e.g. React, Electron, React Native).
- `/packages`: Contains shared packages used by frontend apps.

Use case: Ideal for projects that need to manage multiple frontend apps sharing a common set of utilities and packages.

### Frontend and backend in a single monorepo

Structure:

- `/frontend`: Contains the React Native app and other frontend components.
- `/backend`: Contains the server-side code, typically a Node.js or Python backend.
- `/shared`: Contains shared utilities, types, or components used by both frontend and backend.

Use case: Ideal for projects where the frontend and backend are tightly coupled and frequently share code, such as shared type definitions, utility functions, or API clients.

### Monorepo with multiple microservices

Structure:

- `/service-auth`: Contains the authentication service.
- `/service-payment`: Contains the payment processing service.
- `/service-notifications`: Contains the notification service.
- `/shared`: Contains shared libraries, such as logging or database utilities.

Use case: Suitable for large-scale applications with multiple microservices that need to share common libraries or configurations.

### Hybrid monorepo (web, mobile, and backend)

Structure:

- `/web`: Contains the web application code, typically built with React or Next.js.
- `/mobile`: Contains the React Native mobile app code.
- `/backend`: Contains the backend services.
- `/shared`: Contains shared components, utilities, or API clients.

Use case: Ideal for projects that need to maintain both web and mobile applications with a shared backend, ensuring that all parts of the system stay in sync.

### Library and application in a single monorepo

Structure:

- `/library`: Contains the core library code, which could be published as an npm package.
- `/app`: Contains the application code that consumes the library.
- `/docs`: Contains documentation for the library and application.

Use case: Best for projects where a core library is being developed alongside an application that consumes it, allowing for rapid iteration and testing.

## Conclusion

Choosing whether to use a monorepo and selecting the right setup and tool depends on your project's specific needs. Yarn Workspaces is generally the recommended choice due to its balance of simplicity, community support, and effectiveness in managing shared dependencies. However, other options like Lerna, Nx, Turborepo, and Pnpm offer unique advantages that might better suit your project depending on its scale, complexity, and specific requirements.

By carefully considering the pros and cons of each option and common monorepo setups, you can select the best strategy to streamline your development process and ensure the long-term maintainability of your codebase.