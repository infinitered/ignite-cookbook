"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[3180],{8232:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>g,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var o=t(7624),r=t(2172);const a={title:"Migrating to MMKV",description:"How to migrate from React Native's AsyncStorage to MMKV",tags:["MMKV","AsyncStorage"],last_update:{author:"Frank Calise, Mark Rickert"},publish_date:new Date("2022-12-28T00:00:00.000Z")},i="Migrating to MMKV",s={id:"recipes/MigratingToMMKV",title:"Migrating to MMKV",description:"How to migrate from React Native's AsyncStorage to MMKV",source:"@site/docs/recipes/MigratingToMMKV.md",sourceDirName:"recipes",slug:"/recipes/MigratingToMMKV",permalink:"/docs/recipes/MigratingToMMKV",draft:!1,unlisted:!1,tags:[{label:"MMKV",permalink:"/docs/tags/mmkv"},{label:"AsyncStorage",permalink:"/docs/tags/async-storage"}],version:"current",lastUpdatedBy:"Frank Calise, Mark Rickert",lastUpdatedAt:1723051649,formattedLastUpdatedAt:"Aug 7, 2024",frontMatter:{title:"Migrating to MMKV",description:"How to migrate from React Native's AsyncStorage to MMKV",tags:["MMKV","AsyncStorage"],last_update:{author:"Frank Calise, Mark Rickert"},publish_date:"2022-12-28T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Migrating from i18n-js to react-i18next",permalink:"/docs/recipes/MigratingToI18Next"},next:{title:"Choosing the right monorepo strategy for your project",permalink:"/docs/recipes/MonoreposOverview"}},c={},l=[{value:"Overview",id:"overview",level:2},{value:"Project Dependencies",id:"project-dependencies",level:2},{value:"Code Changes",id:"code-changes",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"migrating-to-mmkv",children:"Migrating to MMKV"}),"\n",(0,o.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.a,{href:"https://github.com/mrousavy/react-native-mmkv",children:"MMKV"})," is said to be the fastest key/value storage for React Native. It has encryption support for secure local storage and also uses synchronous storage to simplify your application code."]}),"\n",(0,o.jsxs)(n.p,{children:["In this recipe, we'll convert our the Ignite demo project from using ",(0,o.jsx)(n.code,{children:"AsyncStorage"})," to ",(0,o.jsx)(n.code,{children:"MMKV"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["We'll get started by igniting a new application with the ",(0,o.jsx)(n.code,{children:"cng"})," workflow. We must do this since ",(0,o.jsx)(n.code,{children:"react-native-mmkv"})," contains native dependencies not included in the Expo SDK. Luckily with Ignite CLI, it's easy to jump into this workflow:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npx ignite-cli new PizzaApp --workflow=cng --yes\ncd PizzaApp\n"})}),"\n",(0,o.jsx)(n.h2,{id:"project-dependencies",children:"Project Dependencies"}),"\n",(0,o.jsxs)(n.p,{children:["Install the ",(0,o.jsx)(n.code,{children:"react-native-mmkv"})," dependency into the project and run prebuild again to let Expo take care of the necessary adjustments to the native template."]}),"\n",(0,o.jsx)(n.admonition,{type:"warning",children:(0,o.jsxs)(n.p,{children:["If you're working in the ",(0,o.jsx)(n.a,{href:"https://reactnative.dev/docs/the-new-architecture/landing-page",children:"New Architecture"}),", you'll want to specifically install ",(0,o.jsx)(n.code,{children:"react-native-mmkv@beta"}),", which at the time of this writing is major version 3 and up."]})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"yarn remove @react-native-async-storage/async-storage\nyarn add react-native-mmkv\nyarn prebuild\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsxs)(n.em,{children:["Note: For more information on Continuous Native Generation (CNG), you can read the ",(0,o.jsx)(n.a,{href:"https://docs.expo.dev/workflow/continuous-native-generation/",children:"Expo docs here"}),"."]})}),"\n",(0,o.jsx)(n.h2,{id:"code-changes",children:"Code Changes"}),"\n",(0,o.jsxs)(n.p,{children:["Open ",(0,o.jsx)(n.code,{children:"app/utils/storage.ts"})," and modify the the file to use ",(0,o.jsx)(n.code,{children:"MMKV"})," instead of ",(0,o.jsx)(n.code,{children:"AsyncStorage"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",metastring:"{1-10} show-lines",children:"import { MMKV } from \"react-native-mmkv\";\n\nexport const storage = new MMKV();\n\n/**\n * Loads a string from storage.\n *\n * @param key The key to fetch.\n */\nexport function loadString(key: string): string | undefined {\n  try {\n    return storage.getString(key)\n  } catch {\n    // not sure why this would fail... even reading the RN docs I'm unclear\n    return undefined\n  }\n}\n\n/**\n * Saves a string to storage.\n *\n * @param key The key to fetch.\n * @param value The value to store.\n */\nexport function saveString(key: string, value: string): boolean {\n  try {\n    storage.set(key, value)\n    return true\n  } catch {\n    return false\n  }\n}\n\n/**\n * Loads something from storage and runs it thru JSON.parse.\n *\n * @param key The key to fetch.\n */\nexport function load(key: string): unknown | undefined {\n  try {\n    const almostThere = loadString(key)\n    if (almostThere) {\n      try {\n        return JSON.parse(almostThere)\n      } catch {\n        return almostThere // Return the string if it's not a valid JSON\n      }\n    }\n    return undefined\n  } catch {\n    return undefined\n  }\n}\n\n/**\n * Saves an object to storage.\n *\n * @param key The key to fetch.\n * @param value The value to store.\n */\nexport function save(key: string, value: unknown): boolean {\n  try {\n    saveString(key, JSON.stringify(value))\n    return true\n  } catch {\n    return false\n  }\n}\n\n/**\n * Removes something from storage.\n *\n * @param key The key to kill.\n */\nexport function remove(key: string): void {\n  try {\n    storage.delete(key)\n  } catch {}\n}\n\n/**\n * Burn it all to the ground.\n */\nexport function clear(): void {\n  try {\n    storage.clearAll()\n  } catch {}\n}\n"})}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsx)(n.p,{children:"Now that you've moved the base storage functions over to MMKV, you might want to update Reactotron to use it as well!"}),(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://docs.infinite.red/reactotron/plugins/react-native-mmkv/",children:"Configuring Reactotron with MMKV"})})]}),"\n",(0,o.jsxs)(n.p,{children:["You may notice that the ",(0,o.jsx)(n.code,{children:"storage.test.ts"})," test file will no longer pass. Replace the contents of this file with the following test data:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import {\n  storage,\n  load,\n  loadString,\n  save,\n  saveString,\n  clear,\n  remove,\n} from "./storage";\n\nconst VALUE_OBJECT = { x: 1 };\nconst VALUE_STRING = JSON.stringify(VALUE_OBJECT);\n\ndescribe("MMKV Storage", () => {\n  beforeEach(() => {\n    storage.clearAll();\n    storage.set("string", "string");\n    storage.set("object", JSON.stringify(VALUE_OBJECT));\n  });\n\n  it("should be defined", () => {\n    expect(storage).toBeDefined();\n  });\n\n  it("should have default keys", () => {\n    expect(storage.getAllKeys()).toEqual(["string", "object"]);\n  });\n\n  it("should load data", () => {\n    expect(load("object")).toEqual(VALUE_OBJECT);\n    expect(loadString("object")).toEqual(VALUE_STRING);\n\n    expect(load("string")).toEqual("string");\n    expect(loadString("string")).toEqual("string");\n  });\n\n  it("should save strings", () => {\n    saveString("string", "new string");\n    expect(loadString("string")).toEqual("new string");\n  });\n\n  it("should save objects", () => {\n    save("object", { y: 2 });\n    expect(load("object")).toEqual({ y: 2 });\n    save("object", { z: 3, also: true });\n    expect(load("object")).toEqual({ z: 3, also: true });\n  });\n\n  it("should save strings and objects", () => {\n    saveString("object", "new string");\n    expect(loadString("object")).toEqual("new string");\n  });\n\n  it("should remove data", () => {\n    remove("object");\n    expect(load("object")).toBeUndefined();\n    expect(storage.getAllKeys()).toEqual(["string"]);\n\n    remove("string");\n    expect(load("string")).toBeUndefined();\n    expect(storage.getAllKeys()).toEqual([]);\n  });\n\n  it("should clear all data", () => {\n    expect(storage.getAllKeys()).toEqual(["string", "object"]);\n    clear();\n    expect(storage.getAllKeys()).toEqual([]);\n  });\n});\n'})}),"\n",(0,o.jsxs)(n.p,{children:["Run the app in the iOS simulator to test the changes with ",(0,o.jsx)(n.code,{children:"yarn ios"}),". Navigate to the Podcast List screen:"]}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:'Press "Tap to sign in!"'}),"\n",(0,o.jsx)(n.li,{children:'Press "Let\'s go!"'}),"\n",(0,o.jsx)(n.li,{children:'Tap on the "Podcast"'}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Now let's swipe the app away to close it. Re-open the app to see if the navigation picks up where we left off (which shows our storage is working to remember the navigation key we were last on)."}),"\n",(0,o.jsxs)(n.p,{children:["And that's it! Ignite is now configured with ",(0,o.jsx)(n.code,{children:"react-native-mmkv"})," over ",(0,o.jsx)(n.code,{children:"AsyncStorage"}),"."]})]})}function g(e={}){const{wrapper:n}={...(0,r.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},2172:(e,n,t)=>{t.d(n,{I:()=>s,M:()=>i});var o=t(1504);const r={},a=o.createContext(r);function i(e){const n=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),o.createElement(a.Provider,{value:n},e.children)}}}]);