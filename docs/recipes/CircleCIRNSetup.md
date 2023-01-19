---
title: CircleCI CD Setup - React Native
description: Learn how to set up your CircleCI CD instance for React Native
tags:
  - Guide
  - CI/CD
last_update:
  author: Robin Heinze
publish_date: 2022-10-09
---

This document shows the steps necessary to set up CircleCI automatic continuous integration testing and automatic Fastlane beta builds upon successfully merging a pull request.

Note: there is some experimental information about using Github Actions at the end of this article.

### First Things First

1. Write Tests

- If the project already has tests, great. If not, write some.
- See [this](https://github.com/infinitered/ChainReactApp2019) for an example of how Infinite Red typically sets up tests for a React Native app.

### CircleCI Setup

1. [Log into CircleCI](https://circleci.com/vcs-authorize/) with your Github account
2. Choose your organization from the dropdown in the top left
3. Navigate to `Add Projects` on the left
4. Search for your repo
5. Choose Set Up Project
6. Set Up Project

- Select `macOS` for the operating system and Other for the language

7. Copy the basic `config.yml` to `.circleci/config.yml`, commit your code changes and push to github `master`
8. Choose `Start building` to initiate the first CI build. This build will fail. That's ok. We will update the config in the next step.
9. Enable builds from forked pull requests. Go to project settings > Advanced Settings, then toggle on `Build forked pull requests`
10. If this project is open-source, you'll want to make sure the open-source setting is enabled to allow for macOS builds. Go to project settings > Advanced Settings, then toggle `Free and Open Source`.

### Continuous Integration

1. Create a folder in the project root named `.circleci`.
2. Create a file inside that folder named `config.yml`
3. Use the below template in that file.
4. If needed, see [configuration docs](https://circleci.com/docs/2.0/config-intro/#section=configuration) for additional configuration options. (_Here is a complete [config.yml](https://github.com/YOUR_ORG/open-source/blob/master/config.example.yml) with CI and CD steps completed_)

```yaml
defaults: &defaults
  docker:
    # Choose the version of Node you want here
    - image: circleci/node:10.11
  working_directory: ~/repo

version: 2
jobs:
  setup:
    <<: *defaults
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-node-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-node-
      - run:
          name: Install dependencies
          command: yarn install
      - save_cache:
          name: Save node modules
          paths:
            - node_modules
          key: v1-dependencies-node-{{ checksum "package.json" }}

  tests:
    <<: *defaults
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-node-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-node-
      - run:
          name: Run tests
          command: yarn ci:test # this command will be added to/found in your package.json scripts

workflows:
  version: 2
  test_and_release:
    jobs:
      - setup
      - tests:
          requires:
            - setup
```

5. Make sure the test script is added to your `package.json`

```json
  {
    ...
    "scripts": {
      ...
      "ci:test": "<command to run tests>" <<-- if you don't already have this one
    },
    ...
  }
```

### iOS Continuous Deployment

**Add Fastlane**

1. Before you can add continuous deployment, you'll need to setup Fastlane and Match to sign and deploy your app. You can follow these blog posts to get setup!

- [Releasing on iOS with Fastlane](https://shift.infinite.red/simple-react-native-ios-releases-4c28bb53a97b) Make sure you get to the point of being able to run:
- fastlane ios beta

2.  In your Fastfile, add:

```ruby
before_all do
 setup_circle_ci
end
```

3. In your `beta` lane, make sure you have included a command that bumps the build number prior to building, and then commits the build number after building.
   Example:

```ruby
PROJECT = "YourProject"
XCODE_PROJECT    = "#{PROJECT}.xcodeproj"
  lane :beta do
    increment_build_number(xcodeproj: "./#{XCODE_PROJECT}")
    match(type: "appstore")
    build_ios_app(
      scheme: PROJECT,
      workspace: "./YourProject.xcworkspace",
      xcargs: "-UseNewBuildSystem=NO -allowProvisioningUpdates",
      export_method: "app-store"
    )
    # Ship it!
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
    commit_version_bump(
      xcodeproj: "./#{XCODE_PROJECT}",
      ignore: /tvOS/,
      force: true,
      message: "[skip ci] Version bump"
    )
  end
```

4. If you prefer, you can also do these steps as separate fastlane commands, just make sure to include a `- run:` entry for each one in `config.yml`.

**Setting up CircleCI to Run Fastlane**
Check out [this blog post](https://medium.com/@odedre/circle-ci-v2-react-native-project-build-release-setup-ce4ef31209d0) for lots of helpful tips.

1. Make sure CircleCI has all the credentials to run your fastlane scripts:
   - Go into the Settings screen for your project on CircleCI
   - Under "Build Settings", click on "Environment Variables" ([https://circleci.com/gh/YOUR_ORG/YOURPROJECT/edit#env-vars](https://circleci.com/gh/YOUR_ORG/YOURPROJECT/edit#env-vars))
   - Click "Add Variable"
   - Set `FASTLANE_USER` to the email address of your your Apple App Store Connect / Dev Portal user.
   - Do this for all of the variables listed [here](https://github.com/fastlane/docs/blob/950c6f42231d86b5187d2cfdcab2a6c81d0f61dc/docs/best-practices/continuous-integration.md#environment-variables-to-set) **Note**: If your dev portal user does not have 2-Factor Auth turned on, you DO NOT need to set FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD. Including this variable when your account does need it will result in errors during TestFlight upload. You can find more info from the Fastlane Docs, and from the CircleCI codesigning docs
2. Add `GITHUB_TOKEN` to env vars on CircleCI ([https://circleci.com/gh/YOUR_ORG/YOURPROJECT/edit#env-vars](https://circleci.com/gh/YOUR_ORG/YOURPROJECT/edit#env-vars)). Y

- If you need to make a new `GITHUB_TOKEN`, go to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new) and create a new one with `repo` access.

3. Add the `Circle CI` Github team to your repo (https://github.com/YOUR_ORG/YOURPROJECT/settings/collaboration) with write access.
4. Add the `Circle CI` Github team as a read-only collaborator to the private match certificates repo.
5. Log in to GitHub/CircleCI as the CI user. Then in CircleCI, go to Project Settings > Checkout SSH keys (https://circleci.com/gh/YOURORGANIZATION/YOURPROJECT/edit#checkout) and add a new user key. This will allow CircleCI to clone the certs repo in order to sign your app.
6. Go to Project Settings > Checkout SSH Keys and add a new deploy key. You will copy the fingerprint and paste into the `config.yml` example below in the `add_ssh_keys` section (there should be `"`s around it)
7. Add a script to your `package.json` called `ci:setup`. This will run any necessary shell commands to prepare your project for building. For example, creating private files like `.env`. If you don't any additional setup, you can leave this command as "", or remove the `ci:setup` step from the `config.yml` example below.

```json
  {
    ...
    "scripts": {
      ...
      "ci:setup": "touch .env && echo \"ENV_VAR=\"$ENV_VAR >> .env",
    },
    ...
  }
```

**Note**: `react-native-dotenv` throws errors if there is not a `.env` present with the variables it expects. However, if you don't want to put secret values in this script (you shouldn't), then you can add them directly to CircleCI under Project Settings > Environment Variables. Then you can reference them in this script as `$ENV_VAR`.

1. Add `mac` configuration and `deploy_ios` job to your CircleCI `config.yml`
   NOTE: The macOS boxes currently come with Node 11.0, with no apparent way to change the version. This shouldn't be a huge problem. One known issue is with `upath`, which is a deep dependency of react-native. If you encounter errors related to `upath` requiring a lower version of Node, just make sure it is at `1.1.0`, and not `1.0.4` in your yarn.lock. See [https://github.com/airbnb/enzyme/issues/1637#issuecomment-397327562](https://github.com/airbnb/enzyme/issues/1637#issuecomment-397327562).

````yaml
defaults: ...

mac: &mac
  macos:
    xcode: "10.1.0"
  working_directory: ~/repo
  environment:
    FL_OUTPUT_DIR: output
  shell: /bin/bash --login -o pipefail

version: 2
jobs:
  setup: ...

  tests: ...

  deploy_ios:
    <<: *mac
    steps:
      - checkout
      - add_ssh_keys:
          fingerprints: — “SSH_FINGERPRINT_HERE”
      - run:
          name: Git configuration
          command: git config user.email "ci@your.domain" && git config user.name "CircleCI"
      - run:
          name: Set upstream branch
          command: git branch --set-upstream-to origin ${CIRCLE_BRANCH}
      # Node modules
      - restore_cache:
          name: Restore node modules
          keys:
            - v1-dependencies-mac-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-mac-
      - run:
          name: Install dependencies
          command: NOYARNPOSTINSTALL=1 yarn install
      - save_cache:
          name: Save node modules
          paths:
            - node_modules
          key: v1-dependencies-mac-{{ checksum "package.json" }}

      # Cocoapods
      - run:
          name: Fetch CocoaPods Specs
          command: |
            curl https://cocoapods-specs.circleci.com/fetch-cocoapods-repo-from-s3.sh | bash -s cf
      - run:
          working_directory: ios
          name: Install CocoaPods
          command: pod install --verbose

      # Gems
      - restore_cache:
          name: Restore gems
          key: bundle-v1-{{ checksum "ios/Gemfile.lock" }}-{{ arch }}
      - run:
          name: Bundle Install
          command: bundle install
          working_directory: ios
      - save_cache:
          key: bundle-v1-{{ checksum "ios/Gemfile.lock" }}-{{ arch }}
          paths:
            - vendor/bundle

      # Misc setup
      - run:
          name: Misc setup
          command: yarn ci:setup

      # Git grooming
      - run:
          name: Pull latest git
          command: git stash && git pull && git stash pop

      # Run Fastlane
      - run:
          working_directory: ios
          name: Fastlane
          command: bundle exec fastlane ios beta

      # Git cleanup
      - run:
          name: Pull latest git
          command: git stash && git pull && git stash pop
      - run:
          name: Push version bump commit
          command: git push
      - store_artifacts:
          path: output

workflows:
  version: 2
  test_and_release:
    jobs:
      - setup
      - tests:
          requires:
            - setup
      - deploy_ios:
          filters:
            branches:
              only: master
              ```
````

**Troubleshooting tips**

- If you need to debug failed builds, you can use the "Rebuild with SSH" option in CircleCI. See [https://circleci.com/docs/2.0/ssh-access-jobs/](https://circleci.com/docs/2.0/ssh-access-jobs/) for more info.
- Tip: make sure you are logged in to Github/CircleCI as yourself (not the CI user) when you hit the button to rebuild with SSH.
- If you get a vague error saying `File main.jsbundle does not exist`, that means there was an error while building the app and you can view the more detailed message by inspecting the log files with the following command (while in SSH mode). Increase the number of lines from 50 as needed.
- `tail -50 ios/output/buildlogs/gym/YourProject-YourProject.log`

### Github Actions Setup - Maybe take this out

Here is some experimental information for Github Actions CI.

**Github Actions YML File**

```yml
name: RN App CI
on: [push]
jobs:
  build:
    runs-on: macos-latest
    env:
      CI: true
      NODE_ENV: development
    steps:
      - uses: actions/checkout@v1
      - name: Cache my-app node modules
        uses: actions/cache@v1
        with:
          path: my-app/node_modules
          key: ${{ runner.OS }}-build-${{ hashFiles('**/my-app/yarn.lock') }}
          restore-keys: |
            ${{ runner.OS }}-build-${{ env.cache-name }}-
            ${{ runner.OS }}-build-
            ${{ runner.OS }}-
      - name: Install dependencies
        run: |
          yarn install
      - name: Run unit tests
        run: |
          yarn test:unit
      - name: Install cocoapods
        run: |
          cd my-app/ios
          pod install --repo-update
      - name: Run e2e tests
        run: |
          cd my-app
          yarn test:e2e:build --configuration="ios.sim.debug"
          yarn test:e2e --configuration="ios.sim.debug"
```
