---
title: Updating Dependencies with Yarn Audit, Outdated and Upgrade
tags:
  - Yarn
  - Guide
last_update:
  author: Derek Greenberg
---

If you get a bunch of warnings in the git command output about vulnerabilities, similar to this: &quot;remote: Github found 80 vulnerabilities on &lt;branch&gt; ….&quot;, you can examine these vulnerabilities with yarn audit, get a list of outdated packages with yarn outdated, and update each dependency using yarn update

[**Yarn Audit**](https://classic.yarnpkg.com/en/docs/cli/audit) Checks for known security issues with the installed packages. Issue the command from the root of your project. The output is a list of known issues. Usage: `yarn audit`

![](https://static.slab.com/prod/uploads/67oa0iba/posts/images/cwzWfJi-twHOoJcKHPVx1lm_.png)

[**Yarn Outdated**](https://classic.yarnpkg.com/en/docs/cli/outdated) generates a list of outdated packages and all the info you need to make decisions about updating their versions, such as whether a major update that is NOT backwards compatible is available. A handy link to the repository is provided so you can read about the consequences of updating that dependency in your project.

![](https://static.slab.com/prod/uploads/67oa0iba/posts/images/g93PKCGCzgP-Ho0-QZWV8PIF.png)

[**Yarn Upgrade**](https://classic.yarnpkg.com/en/docs/cli/upgrade/) updates the version of a given package to the latest, or to a specific version if you specify it. Be sure to provide an argument to this command; otherwise, it will update all dependencies to their latest versions, which is usually not what you want.

![](https://static.slab.com/prod/uploads/67oa0iba/posts/images/lsVpJJ9m7AGF6Nh0hbpy9927.png)