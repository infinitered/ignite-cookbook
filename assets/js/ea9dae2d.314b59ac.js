"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[8568],{3860:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>a,toc:()=>c});var s=t(7624),i=t(2172);const r={title:"Setting up a Yarn monorepo with Ignite",description:"How to set up a Yarn monorepo using Ignite and two extra shared utilities",tags:["Ignite","Monorepo","Yarn"],last_update:{author:"Felipe Pe\xf1a"},publish_date:new Date("2024-08-22T00:00:00.000Z")},o="Setting up a Yarn monorepo with Ignite",a={id:"recipes/SettingUpYarnMonorepo",title:"Setting up a Yarn monorepo with Ignite",description:"How to set up a Yarn monorepo using Ignite and two extra shared utilities",source:"@site/docs/recipes/SettingUpYarnMonorepo.md",sourceDirName:"recipes",slug:"/recipes/SettingUpYarnMonorepo",permalink:"/docs/recipes/SettingUpYarnMonorepo",draft:!1,unlisted:!1,tags:[{label:"Ignite",permalink:"/docs/tags/ignite"},{label:"Monorepo",permalink:"/docs/tags/monorepo"},{label:"Yarn",permalink:"/docs/tags/yarn"}],version:"current",lastUpdatedBy:"Felipe Pe\xf1a",lastUpdatedAt:1734368632,formattedLastUpdatedAt:"Dec 16, 2024",frontMatter:{title:"Setting up a Yarn monorepo with Ignite",description:"How to set up a Yarn monorepo using Ignite and two extra shared utilities",tags:["Ignite","Monorepo","Yarn"],last_update:{author:"Felipe Pe\xf1a"},publish_date:"2024-08-22T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"SelectField using `react-native-bottom-sheet`",permalink:"/docs/recipes/SelectFieldWithBottomSheet"},next:{title:"Switch Between Expo Go and Expo CNG",permalink:"/docs/recipes/SwitchBetweenExpoGoCNG"}},l={},c=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Use case",id:"use-case",level:2},{value:"Step 1: Setting up the monorepo",id:"step-1-setting-up-the-monorepo",level:2},{value:"Step 2: Create mobile app using Ignite",id:"step-2-create-mobile-app-using-ignite",level:2},{value:"Step 3: Install dependencies",id:"step-3-install-dependencies",level:2},{value:"Step 4: Add a shared ESLint configuration with TypeScript",id:"step-4-add-a-shared-eslint-configuration-with-typescript",level:2},{value:"Step 6: Use the shared ESLint configuration in the mobile app",id:"step-6-use-the-shared-eslint-configuration-in-the-mobile-app",level:2},{value:"Step 7: Create a shared UI components package",id:"step-7-create-a-shared-ui-components-package",level:2},{value:"Step 8: Use the shared UI package in the mobile app",id:"step-8-use-the-shared-ui-package-in-the-mobile-app",level:2},{value:"Step 9: Run mobile app to make sure logic was added",id:"step-9-run-mobile-app-to-make-sure-logic-was-added",level:2},{value:"Step 10: Add Yarn global scripts (optional)",id:"step-10-add-yarn-global-scripts-optional",level:2},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"setting-up-a-yarn-monorepo-with-ignite",children:"Setting up a Yarn monorepo with Ignite"}),"\n",(0,s.jsxs)(n.p,{children:["\ud83d\udc4b Hello and welcome to this monorepo guide! We know setting up a project using a monorepo structure can be sometimes challenging, therefore we created this guide to lead you through process. We'll be focusing on ",(0,s.jsx)(n.a,{href:"https://reactnative.dev/",children:"React Native"})," projects using the ",(0,s.jsx)(n.a,{href:"https://github.com/infinitered/ignite",children:"Ignite"})," framework and the ",(0,s.jsx)(n.a,{href:"https://yarnpkg.com",children:"Yarn"})," tool."]}),"\n",(0,s.jsx)(n.p,{children:"This guide starts by setting up the monorepo structure, then create a React Native app using the Ignite CLI, to finally end up generating two shared utilities: a form-validator utility and a shared UI library, that we will be integrate into the app."}),"\n",(0,s.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,s.jsx)(n.p,{children:"Before we begin, we want to ensure you have these standard tools installed on your machine:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://nodejs.org/en",children:"Node.js"})," (version 18 or later)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://yarnpkg.com",children:"Yarn"})," (version 3.8 or later)"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Now, let\u2019s dive into the specific use case this guide will address."}),"\n",(0,s.jsx)(n.h2,{id:"use-case",children:"Use case"}),"\n",(0,s.jsx)(n.p,{children:"In a monorepo setup with multiple applications, like a React Native mobile app and a React web app, can share common functionalities."}),"\n",(0,s.jsx)(n.p,{children:"In this guide we will be focusing on that premise and creating/utilizing shared utilities within the monorepo. For instance, if you have several apps that need to share an ESLint configuration or UI components, you can create reusable packages that can be integrated across all your apps."}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["Wait! How do I even know if my project will benefit from a monorepo structure? No worries! We have more documentation on monorepo tools and whether you want to choose this way of organization. You can find it ",(0,s.jsx)(n.a,{href:"MonoreposOverview",children:"here"}),"."]})}),"\n",(0,s.jsx)(n.p,{children:"By centralizing these kind of utilities, you can reduce code duplication and simplify maintenance work, ensuring any updates or bug fixes are immediately available in all your apps within the monorepo."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"So in summary we\u2019ll create a React Native app along with two shared packages: one for holding a common ESLint configuration and another for shared UI components, to finally integrate those back into the app."})}),"\n",(0,s.jsx)(n.p,{children:"Let's begin!"}),"\n",(0,s.jsx)(n.h2,{id:"step-1-setting-up-the-monorepo",children:"Step 1: Setting up the monorepo"}),"\n",(0,s.jsxs)(n.p,{children:["First, read carefully what ",(0,s.jsx)(n.a,{href:"https://docs.expo.dev/guides/monorepos/",children:"Expo documentation on setting up monorepos"})," says."]}),"\n",(0,s.jsxs)(n.p,{children:["After this step, you'll get a folder with a ",(0,s.jsx)(n.code,{children:"packages/"})," and ",(0,s.jsx)(n.code,{children:"apps/"})," directories and a ",(0,s.jsx)(n.code,{children:"package.json"})," file with basic workspace configuration."]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Initialize the monorepo:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mkdir monorepo-example\ncd monorepo-example\nyarn init -y\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsxs)(n.li,{children:["Configure workspaces in ",(0,s.jsx)(n.code,{children:"package.json"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "name": "monorepo-example",\n  // error-line\n  "packageManager": "yarn@3.8.4"\n  // success-line-start\n  "packageManager": "yarn@3.8.4",\n  "private": true,\n  "workspaces": [\n    "apps/*",\n    "packages/*"\n  ]\n  // success-line-end\n}\n'})}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsxs)(n.p,{children:["We recommend organizing your monorepo's folder structure in a way that best suits the needs of your project. While this guide suggests using ",(0,s.jsx)(n.code,{children:"apps/"})," and ",(0,s.jsx)(n.code,{children:"packages/"}),", you can rename or add directories like, for example, ",(0,s.jsx)(n.code,{children:"services/"})," or ",(0,s.jsx)(n.code,{children:"libs/"})," to fit your workflow."]}),(0,s.jsx)(n.p,{children:"The key here is to keep your monorepo clear and organized, ensuring that it\u2019s easy to manage and navigate for you and your team \ud83e\udd1c\ud83c\udffb."})]}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Create directory structure:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mkdir apps packages\n"})}),"\n",(0,s.jsx)(n.h2,{id:"step-2-create-mobile-app-using-ignite",children:"Step 2: Create mobile app using Ignite"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/infinitered/ignite",children:"Ignite"})," is Infinite's Red battle-tested React Native boilerplate. We're proud to say we use it every time we start a new project."]}),"\n",(0,s.jsx)(n.p,{children:"In this step we'll take advantage of Ignite's CLI and create a React Native app within the monorepo."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Install the ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/ignite-cli",children:"Ignite CLI"})," (if you haven't already):"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"npx ignite-cli@latest\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsxs)(n.li,{children:["Generate a new app:\nNavigate to the ",(0,s.jsx)(n.code,{children:"apps/"})," directory and run the following command to create a new app:"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd apps\nnpx ignite-cli new mobile\n"})}),"\n",(0,s.jsx)(n.p,{children:"We recommend the following answers to the CLI prompts:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"\ud83d\udcdd Do you want to use Expo?: Expo - Recommended for almost all apps [Default]\n\ud83d\udcdd Which Expo workflow?: Expo Go - For simple apps that don't need custom native code [Default]\n\ud83d\udcdd Do you want to initialize a git repository?: No\n\ud83d\udcdd Remove demo code? We recommend leaving it in if it's your first time using Ignite: No\n\ud83d\udcdd Which package manager do you want to use?: yarn\n\ud83d\udcdd Do you want to install dependencies?: No\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsxs)(n.li,{children:["Open the ",(0,s.jsx)(n.code,{children:"metro.config.js"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"touch mobile/metro.config.js\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["In order to fit a monorepo structurem we need to adjust the Metro configuration. Let's do that by updating these lines in the ",(0,s.jsx)(n.code,{children:"metro.config.js"})," file (this changes are taken from the ",(0,s.jsx)(n.a,{href:"https://docs.expo.dev/guides/monorepos/",children:"Expo guide"}),"):"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"// Learn more https://docs.expo.io/guides/customizing-metro\nconst { getDefaultConfig } = require('expo/metro-config');\n\n// success-line-start\n// Get monorepo root folder\nconst monorepoRoot = path.resolve(projectRoot, '../..');\n// success-line-end\n\n/** @type {import('expo/metro-config').MetroConfig} */\n// error-line\nconst config = getDefaultConfig(__dirname);\n// success-line\nconst config = getDefaultConfig(projectRoot);\n\nconfig.transformer.getTransformOptions = async () => ({\n  transform: {\n    // Inline requires are very useful for deferring loading of large dependencies/components.\n    // For example, we use it in app.tsx to conditionally load Reactotron.\n    // However, this comes with some gotchas.\n    // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading\n    // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698\n    inlineRequires: true,\n  },\n});\n\n// success-line-start\n// 1. Watch all files within the monorepo\nconfig.watchFolders = [monorepoRoot];\n// 2. Let Metro know where to resolve packages and in what order\nconfig.resolver.nodeModulesPaths = [\n  path.resolve(projectRoot, 'node_modules'),\n  path.resolve(monorepoRoot, 'node_modules'),\n];\n// success-line-end\n\n// This helps support certain popular third-party libraries\n// such as Firebase that use the extension cjs.\nconfig.resolver.sourceExts.push(\"cjs\")\n\nmodule.exports = config;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Awesome! We have our mobile app created \u2b50\ufe0f."}),"\n",(0,s.jsx)(n.h2,{id:"step-3-install-dependencies",children:"Step 3: Install dependencies"}),"\n",(0,s.jsx)(n.p,{children:"Let's make sure all of our dependencies are installed for the mobile app."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Run ",(0,s.jsx)(n.code,{children:"yarn"})," at the root of the project:"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd ..\nyarn install\n"})}),"\n",(0,s.jsx)(n.h2,{id:"step-4-add-a-shared-eslint-configuration-with-typescript",children:"Step 4: Add a shared ESLint configuration with TypeScript"}),"\n",(0,s.jsx)(n.p,{children:"Maintaining consistent code quality across TypeScript and JavaScript projects within a monorepo is crucial for a project's long-term success."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"A good first step we recommend is to share a single ESLint configuration file between apps to ensure consistency and streamline the development process."})}),"\n",(0,s.jsx)(n.p,{children:"Let's create a shared utility for that purpose."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Create a shared ESLint configuration package:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Inside your monorepo, create a new package for your shared ESLint configuration."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mkdir packages/eslint-config\ncd packages/eslint-config\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Initialize the package:"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Initialize the package with a ",(0,s.jsx)(n.code,{children:"package.json"})," file."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"yarn init -y\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Install ESLint and TypeScript dependencies:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Install ESLint, TypeScript, and any shared plugins or configurations that you want to use across the apps. We recommend the follow:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-native eslint-plugin-reactotron eslint-config-standard eslint-config-prettier --dev\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["Create the ",(0,s.jsx)(n.code,{children:"tsconfig.json"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"packages/eslint-config/tsconfig.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'// success-line-start\n{\n  "compilerOptions": {\n    "module": "commonjs",\n    "target": "es6",\n    "lib": ["es6", "dom"],\n    "jsx": "react",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  }\n }\n // success-line-end\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"5",children:["\n",(0,s.jsx)(n.li,{children:"Create the shared ESLint configuration file:"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Create an ",(0,s.jsx)(n.code,{children:"index.ts"})," file in the root of your ",(0,s.jsx)(n.code,{children:"eslint-config"})," package."]}),"\n",(0,s.jsx)(n.p,{children:"For this guide we will reuse Ignite\u2019s boilerplate ESLint configuration and then replace the original configuration with it."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"packages/eslint-config/index.ts"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:'module.exports = {\n  root: true,\n  parser: "@typescript-eslint/parser",\n  extends: [\n    "plugin:@typescript-eslint/recommended",\n    "plugin:react/recommended",\n    "plugin:react-native/all",\n    "standard",\n    "prettier",\n  ],\n  plugins: [\n    "@typescript-eslint",\n    "react",\n    "react-native",\n    "reactotron",\n  ],\n  parserOptions: {\n    ecmaFeatures: {\n      jsx: true,\n    },\n  },\n  settings: {\n    react: {\n      pragma: "React",\n      version: "detect",\n    },\n  },\n  globals: {\n    __DEV__: false,\n    jasmine: false,\n    beforeAll: false,\n    afterAll: false,\n    beforeEach: false,\n    afterEach: false,\n    test: false,\n    expect: false,\n    describe: false,\n    jest: false,\n    it: false,\n  },\n  rules: {\n    "@typescript-eslint/ban-ts-ignore": 0,\n    "@typescript-eslint/ban-ts-comment": 0,\n    "@typescript-eslint/explicit-function-return-type": 0,\n    "@typescript-eslint/explicit-member-accessibility": 0,\n    "@typescript-eslint/explicit-module-boundary-types": 0,\n    "@typescript-eslint/indent": 0,\n    "@typescript-eslint/member-delimiter-style": 0,\n    "@typescript-eslint/no-empty-interface": 0,\n    "@typescript-eslint/no-explicit-any": 0,\n    "@typescript-eslint/no-object-literal-type-assertion": 0,\n    "@typescript-eslint/no-var-requires": 0,\n    "@typescript-eslint/no-unused-vars": [\n      "error",\n      {\n        argsIgnorePattern: "^_",\n        varsIgnorePattern: "^_",\n      },\n    ],\n    "comma-dangle": 0,\n    "multiline-ternary": 0,\n    "no-undef": 0,\n    "no-unused-vars": 0,\n    "no-use-before-define": 0,\n    "no-global-assign": 0,\n    "quotes": 0,\n    "react-native/no-raw-text": 0,\n    "react/no-unescaped-entities": 0,\n    "react/prop-types": 0,\n    "space-before-function-paren": 0,\n    "reactotron/no-tron-in-production": "error",\n  },\n}\n// success-line-end\n'})}),"\n",(0,s.jsxs)(n.p,{children:["This configuration (originally sourced from ",(0,s.jsx)(n.a,{href:"https://github.com/infinitered/ignite",children:"Ignite"}),") will provide a strong foundation for TypeScript, React and React Native projects. You can always refine the rules later to align with the specific requirements of your project."]}),"\n",(0,s.jsxs)(n.ol,{start:"5",children:["\n",(0,s.jsx)(n.li,{children:"Compile the TypeScript configuration:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"npx tsc\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This will generate a ",(0,s.jsx)(n.code,{children:"index.js"})," file from your ",(0,s.jsx)(n.code,{children:"index.ts"})," file."]}),"\n",(0,s.jsx)(n.h2,{id:"step-6-use-the-shared-eslint-configuration-in-the-mobile-app",children:"Step 6: Use the shared ESLint configuration in the mobile app"}),"\n",(0,s.jsx)(n.p,{children:"Now we'll use the utility we just made and add it to the React Native app. Let\u2019s get started!"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Navigate to the mobile app:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd ..\ncd ..\ncd apps/mobile\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsxs)(n.li,{children:["Add the ESLint shared package to the ",(0,s.jsx)(n.code,{children:"package.json"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"apps/mobile/package.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'"eslint": "8.17.0",\n// success-line\n "eslint-config": "workspace:^",\n "eslint-config-prettier": "8.5.0",\n'})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["This guide mainly focuses on a private monorepo, but let\u2019s also talk about publishing packages publicly. If your monorepo includes packages meant for public release, avoid using ",(0,s.jsx)(n.code,{children:"workspace:^"})," for dependencies. Instead, set specific package versions to make sure everything works as expected. To handle versioning and publishing for multiple packages, we recommend trying out ",(0,s.jsx)(n.a,{href:"https://github.com/changesets/changesets",children:"changesets"})," \u2014 it makes the process much easier!"]})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsxs)(n.li,{children:["Replace the shared ESLint configuration in ",(0,s.jsx)(n.code,{children:"package.json"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"apps/mobile/package.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'// error-line-start\n"eslintConfig": {\n    "root": true,\n    "parser": "@typescript-eslint/parser",\n    "extends": [\n      "plugin:@typescript-eslint/recommended",\n      "plugin:react/recommended",\n      "plugin:react-native/all",\n      "standard",\n      "prettier"\n    ],\n    "plugins": [\n      "@typescript-eslint",\n      "react",\n      "react-native",\n      "reactotron"\n    ],\n    "parserOptions": {\n      "ecmaFeatures": {\n        "jsx": true\n      }\n    },\n    "settings": {\n      "react": {\n        "pragma": "React",\n        "version": "detect"\n      }\n    },\n    "globals": {\n      "__DEV__": false,\n      "jasmine": false,\n      "beforeAll": false,\n      "afterAll": false,\n      "beforeEach": false,\n      "afterEach": false,\n      "test": false,\n      "expect": false,\n      "describe": false,\n      "jest": false,\n      "it": false\n    },\n    "rules": {\n      "@typescript-eslint/ban-ts-ignore": 0,\n      "@typescript-eslint/ban-ts-comment": 0,\n      "@typescript-eslint/explicit-function-return-type": 0,\n      "@typescript-eslint/explicit-member-accessibility": 0,\n      "@typescript-eslint/explicit-module-boundary-types": 0,\n      "@typescript-eslint/indent": 0,\n      "@typescript-eslint/member-delimiter-style": 0,\n      "@typescript-eslint/no-empty-interface": 0,\n      "@typescript-eslint/no-explicit-any": 0,\n      "@typescript-eslint/no-object-literal-type-assertion": 0,\n      "@typescript-eslint/no-var-requires": 0,\n      "@typescript-eslint/no-unused-vars": [\n        "error",\n        {\n          "argsIgnorePattern": "^_",\n          "varsIgnorePattern": "^_"\n        }\n      ],\n      "comma-dangle": 0,\n      "multiline-ternary": 0,\n      "no-undef": 0,\n      "no-unused-vars": 0,\n      "no-use-before-define": 0,\n      "no-global-assign": 0,\n      "quotes": 0,\n      "react-native/no-raw-text": 0,\n      "react/no-unescaped-entities": 0,\n      "react/prop-types": 0,\n      "space-before-function-paren": 0,\n      "reactotron/no-tron-in-production": "error"\n    }\n  }\n// error-line-end\n// success-line-start\n"eslintConfig": {\n  extends: ["@monorepo-example/eslint-config"],\n}\n// success-line-end\n'})}),"\n",(0,s.jsx)(n.admonition,{type:"warning",children:(0,s.jsxs)(n.p,{children:["In this guide, we use ",(0,s.jsx)(n.code,{children:"@monorepo-example"})," as the placeholder name for the monorepo. Be sure to replace it with your actual monorepo name if it\u2019s different."]})}),"\n",(0,s.jsx)(n.p,{children:"By completing this step, you now have an app (and maybe more in the future) that benefits from a shared ESLint configuration. Great work!"}),"\n",(0,s.jsx)(n.h2,{id:"step-7-create-a-shared-ui-components-package",children:"Step 7: Create a shared UI components package"}),"\n",(0,s.jsx)(n.p,{children:"Now that we are familiar with the creation of a shared package, let's create another one."}),"\n",(0,s.jsx)(n.p,{children:"As we mentioned earlier, a common need in projects is sharing UI components across multiple apps. In this step, we\u2019ll create a shared UI package featuring a Badge component. A Badge is a simple yet versatile element often used to show small pieces of information, like notifications, statuses, or labels."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Navigate to the packages folder:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd ..\ncd ..\ncd packages\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Create the package directory:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mkdir ui-components\ncd ui-components\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Initialize the package:"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Initialize the package with a ",(0,s.jsx)(n.code,{children:"package.json"})," file."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"yarn init -y\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsx)(n.li,{children:"Install dependencies:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Install any necessary dependencies, such as React, React Native, and TypeScript, which will be used across both platforms."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"yarn add react react-native typescript --peer\nyarn add @types/react @types/react-native --dev\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["Create the ",(0,s.jsx)(n.code,{children:"tsconfig.json"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"packages/ui-components/tsconfig.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'// success-line-start\n{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "es2017"],\n    "module": "commonjs",\n    "jsx": "react",\n    "declaration": true,\n    "outDir": "dist",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  },\n  "include": ["src"],\n  "exclude": ["node_modules"]\n}\n // success-line-end\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"5",children:["\n",(0,s.jsx)(n.li,{children:"Now let's create the badge component:"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Inside the ",(0,s.jsx)(n.code,{children:"packages/ui-components"})," directory, create a ",(0,s.jsx)(n.code,{children:"src"})," folder and add your Badge component."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mkdir src\ntouch src/Badge.tsx\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"6",children:["\n",(0,s.jsx)(n.li,{children:"Build the badge component:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"packages/ui-components/src/Badge.tsx"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'// success-line-start\nimport React, { FC } from "react"\nimport { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"\n\ninterface BadgeProps {\n  label: string\n  color?: string\n  backgroundColor?: string\n  style?: ViewStyle\n  textStyle?: TextStyle\n}\n\nexport const Badge: FC<BadgeProps> = ({ label, color = "white", backgroundColor = "red", style, textStyle }) => {\n  return (\n    <View style={[styles.badge, { backgroundColor }, style]}>\n      <Text style={[styles.text, { color }, textStyle]}>{label}</Text>\n    </View>\n  )\n}\n\nconst styles = StyleSheet.create({\n  badge: {\n    paddingHorizontal: 8,\n    paddingVertical: 4,\n    borderRadius: 12,\n    alignSelf: "flex-start",\n  } satisfies ViewStyle,\n  text: {\n    fontSize: 12,\n    fontWeight: "bold",\n  } satisfies TextStyle,\n})\n// success-line-end\n'})}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.code,{children:"Badge"})," component, as defined above, is a simple UI element designed to display a label with customizable colors. This makes it versatile and useful in various parts of your app, like showing notification counts, statuses, or category labels."]}),"\n",(0,s.jsxs)(n.ol,{start:"7",children:["\n",(0,s.jsx)(n.li,{children:"Export the badge component:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Ensure that your component is exported in the package's main entry file."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"packages/ui-components/src/index.ts"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:'// success-line-start\nexport * from "./Badge"\n// success-line-end\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"8",children:["\n",(0,s.jsx)(n.li,{children:"Compile the package:"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Compile your TypeScript code to ensure it's ready for consumption by other packages."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"npx tsc\n"})}),"\n",(0,s.jsx)(n.p,{children:"Awesome! We have now a second package within our monorepo and a UI component we can share across apps. Onward!"}),"\n",(0,s.jsx)(n.h2,{id:"step-8-use-the-shared-ui-package-in-the-mobile-app",children:"Step 8: Use the shared UI package in the mobile app"}),"\n",(0,s.jsx)(n.p,{children:"To finish integrating our shared UI package, we also need to include it in the mobile app."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Navigate now to the mobile app:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd ..\ncd ..\ncd apps/mobile\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsxs)(n.li,{children:["Add the shared UI package to the ",(0,s.jsx)(n.code,{children:"package.json"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"apps/mobile/package.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'    "react-native-screens": "3.31.1",\n    // error-line\n    "react-native-web": "~0.19.6"\n    // success-line-start\n    "react-native-web": "~0.19.6",\n    "ui-components": "workspace:^"\n    // success-line-end\n  },\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Add the Badge component to the UI"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Now, let\u2019s add the ",(0,s.jsx)(n.code,{children:"Badge"})," component to the app! For this example, we\u2019ll place it on the login screen\u2014right below the heading and above the form fields\u2014to show the number of login attempts if they go over a certain limit."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"apps/mobile/apps/screens/LoginScreen.tsx"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import { AppStackScreenProps } from "../navigators"\nimport { colors, spacing } from "../theme"\n// success-line\nimport { Badge } from "ui-components"\n\n...\n\n<Text testID="login-heading" tx="loginScreen.logIn" preset="heading" style={themed($logIn)} />\n// success-line-start\n{attemptsCount > 0 && (\n  <Badge\n    label={`Attempt ${attemptsCount}`}\n    backgroundColor={attemptsCount > 2 ? "red" : "blue"}\n  />\n)}\n// success-line-end\n'})}),"\n",(0,s.jsxs)(n.p,{children:["Great work! Now the mobile app is using the ",(0,s.jsx)(n.code,{children:"Badge"})," component from the shared UI library."]}),"\n",(0,s.jsx)(n.h2,{id:"step-9-run-mobile-app-to-make-sure-logic-was-added",children:"Step 9: Run mobile app to make sure logic was added"}),"\n",(0,s.jsx)(n.p,{children:"Alright, we\u2019re almost done! The final step is to make sure everything is set up correctly. Let\u2019s do this by running the mobile app."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Navigate to the root of the project:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd ..\ncd ..\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Make sure dependencies are installed:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"yarn\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsxs)(n.li,{children:["Run the React Native app (make sure you have your ",(0,s.jsx)(n.a,{href:"https://reactnative.dev/docs/set-up-your-environment",children:"environment setup"}),"):"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"For iOS:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd apps/mobile\nyarn ios\n"})}),"\n",(0,s.jsx)(n.p,{children:"For Android:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"cd apps/mobile\nyarn android\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You should now see the login screen with a ",(0,s.jsx)(n.code,{children:"Badge"})," displayed between the heading and the form fields. Amazing! \ud83c\udf89"]}),"\n",(0,s.jsx)(n.h2,{id:"step-10-add-yarn-global-scripts-optional",children:"Step 10: Add Yarn global scripts (optional)"}),"\n",(0,s.jsx)(n.p,{children:"Just when we thought we were done! If you're still with us, here's an extra step that can make your workflow even smoother."}),"\n",(0,s.jsx)(n.p,{children:"One of the great features of Yarn Workspaces is the ability to define and run scripts globally across all packages in your monorepo. This means you can handle tasks like testing, building, or linting right from the root of your project\u2014no need to dive into individual packages."}),"\n",(0,s.jsx)(n.p,{children:"In this optional section, we\u2019ll show you how to set up and use global scripts with Yarn. To start, let's add a global script for the mobile app to run both iOS and Android projects."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Add a global script to the mobile app ",(0,s.jsx)(n.code,{children:"package.json"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"apps/mobile/package.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'  "scripts": {\n    ...\n    "serve:web": "npx server dist",\n    // error-line\n    "prebuild:clean": "npx expo prebuild --clean"\n    // success-line-start\n    "prebuild:clean": "npx expo prebuild --clean",\n    "mobile:ios" : "yarn workspace mobile ios",\n    "mobile:android" : "yarn workspace mobile android"\n    // success-line-end\n  },\n'})}),"\n",(0,s.jsxs)(n.p,{children:["Even though this script is locally defined within the app's ",(0,s.jsx)(n.code,{children:"package.json"})," file, it will available everywhere within the monorepo by running ",(0,s.jsx)(n.code,{children:"yarn mobile:ios"})," or ",(0,s.jsx)(n.code,{children:"yarn mobile:android"}),". Very neat!"]}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["For more information on Yarn's global scripts, check ",(0,s.jsx)(n.a,{href:"https://yarnpkg.com/features/workspaces#global-scripts",children:"this link"}),"."]})}),"\n",(0,s.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsxs)(n.p,{children:["\ud83c\udf89 Congratulations on reaching the end of this guide! You\u2019ve set up a powerful monorepo with shared utilities, learned how to integrate them into a React Native app created using ",(0,s.jsx)(n.a,{href:"https://github.com/infinitered/ignite",children:"Ignite"}),", and even explored optional enhancements to streamline your workflow."]}),"\n",(0,s.jsx)(n.p,{children:"We hope this guide has been helpful and gives you more confidence when working with a monorepo setup!"}),"\n",(0,s.jsx)(n.p,{children:"For more information, you can check the following resources:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/recipes/MonoreposOverview",children:"Choosing the right monorepo strategy for your project"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://docs.expo.dev/guides/monorepos/",children:"Expo: Work with monorepos"})}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},2172:(e,n,t)=>{t.d(n,{I:()=>a,M:()=>o});var s=t(1504);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);