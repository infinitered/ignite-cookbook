"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[5064],{6516:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var s=n(7624),o=n(4552);const i={title:"Maestro Setup",description:"Setting up e2e testing with Maestro in Ignite",tags:["Maestro","testing"],last_update:{author:"Dan Edwards"},publish_date:new Date("2023-02-01T00:00:00.000Z")},a="Setting Up Maestro in Ignite",r={id:"recipes/MaestroSetup",title:"Maestro Setup",description:"Setting up e2e testing with Maestro in Ignite",source:"@site/docs/recipes/MaestroSetup.md",sourceDirName:"recipes",slug:"/recipes/MaestroSetup",permalink:"/docs/recipes/MaestroSetup",draft:!1,unlisted:!1,tags:[{label:"Maestro",permalink:"/docs/tags/maestro"},{label:"testing",permalink:"/docs/tags/testing"}],version:"current",lastUpdatedBy:"Dan Edwards",lastUpdatedAt:1707340305,formattedLastUpdatedAt:"Feb 7, 2024",frontMatter:{title:"Maestro Setup",description:"Setting up e2e testing with Maestro in Ignite",tags:["Maestro","testing"],last_update:{author:"Dan Edwards"},publish_date:"2023-02-01T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Generator for Component Tests",permalink:"/docs/recipes/GeneratorComponentTests"},next:{title:"Migrating to MMKV",permalink:"/docs/recipes/MigratingToMMKV"}},l={},c=[{value:"Overview",id:"overview",level:2},{value:"Maestro Installation",id:"maestro-installation",level:2},{value:"Creating our first Maestro Flow",id:"creating-our-first-maestro-flow",level:2},{value:"Let&#39;s see what else Maestro can do",id:"lets-see-what-else-maestro-can-do",level:2},{value:"Conclusion",id:"conclusion",level:2},{value:"Notes",id:"notes",level:2}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,o.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"setting-up-maestro-in-ignite",children:"Setting Up Maestro in Ignite"}),"\n",(0,s.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,s.jsxs)(t.p,{children:["End-to-end (e2e) testing is a critical part of any application but it can be difficult to set up and maintain. ",(0,s.jsx)(t.a,{href:"https://maestro.mobile.dev/",children:"Maestro"})," is a tool that promises to be easy to set up and maintain e2e tests. This recipe will walk you through setting up Maestro in your Ignite project."]}),"\n",(0,s.jsx)(t.h2,{id:"maestro-installation",children:"Maestro Installation"}),"\n",(0,s.jsx)(t.p,{children:"We're going to start by installing Maestro via the terminal. To do this, we'll need to run the following command:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:'curl -Ls "https://get.maestro.mobile.dev" | bash\n'})}),"\n",(0,s.jsx)(t.p,{children:"If you haven't already, you'll also need to install Facebook's IDB Companion tool:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"brew tap facebook/fb\nbrew install idb-companion\n"})}),"\n",(0,s.jsxs)(t.p,{children:["If you run into any issues, check out the ",(0,s.jsx)(t.a,{href:"https://maestro.mobile.dev/getting-started/installing-maestro#installing-the-cli",children:"Maestro cli installation guide"})," for more information."]}),"\n",(0,s.jsx)(t.p,{children:"Once the installation is complete, you'll be ready to create your first Maestro flow!"}),"\n",(0,s.jsx)(t.h2,{id:"creating-our-first-maestro-flow",children:"Creating our first Maestro Flow"}),"\n",(0,s.jsxs)(t.p,{children:["To start out, we're going to create a folder to hold our Maestro flows. Let's do this by adding a folder in the root of our Ignite project called ",(0,s.jsx)(t.code,{children:".maestro"}),". Once that's done we can create our first flow in a file called ",(0,s.jsx)(t.code,{children:"Login.yaml"})]}),"\n",(0,s.jsxs)(t.p,{children:["With this flow we want to open up our app and then login with the default credentials. We can do this by adding the following to our ",(0,s.jsx)(t.code,{children:"Login.yaml"})," file:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:'#flow: Login\n#intent:\n# Open up our app and use the default credentials to login\n# and navigate to the demo screen\n\nappId: com.maestroapp # the app id of the app we want to test\n# You can find the appId of an Ignite app in the `app.json` file\n# as the "package" under the "android" section and "bundleIdentifier" under the "ios" section\n---\n- clearState # clears the state of our app (navigation and authentication)\n- launchApp # launches the app\n- assertVisible: "Sign In"\n- tapOn:\n    text: "Tap to sign in!"\n- assertVisible: "Your app, almost ready for launch!"\n- tapOn:\n    text: "Let\'s go!"\n- assertVisible: "Components to jump start your project!"\n'})}),"\n",(0,s.jsx)(t.p,{children:"We're using a few different actions and assertions in this flow. Let's take a look at what they do:"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"clearState"})," - This action clears the state of our app. This is useful if we want to start from a clean slate.\n",(0,s.jsx)(t.code,{children:"launchApp"})," - This action launches our app specified with the ",(0,s.jsx)(t.code,{children:"appId"})," in our flow.\n",(0,s.jsx)(t.code,{children:"assertVisible"})," - This assertion checks to see if the text we pass in is visible on the screen.\n",(0,s.jsx)(t.code,{children:"tapOn"})," - This action taps on the specified element. In our case, we're tapping on the text we pass in."]}),"\n",(0,s.jsxs)(t.p,{children:["To run our flow, first make sure the app is loaded on the simulator or running via metro through ",(0,s.jsx)(t.code,{children:"yarn ios"}),". If you're using Expo Go, you'll need to do a development build in ",(0,s.jsx)(t.a,{href:"/docs/recipes/SwitchBetweenExpoGoCNG",children:"Expo CNG"})," first. Then execute maestro from its test directory with the following command:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"cd .maestro\nmaestro test Login.yaml\n"})}),"\n",(0,s.jsx)(t.p,{children:"And that's it! We've successfully created our first Maestro flow and ran it. You should see something like this in your terminal after running the test:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:'    \u2551  > Flow\n        Running on iPhone 11 - iOS 16.2 - 5A269AA1-2704-429B-BF30-D6965060E03E\n    \u2551    \u2705  Clear state of com.maestroapp\n    \u2551    \u2705  Launch app "com.maestroapp"\n    \u2551    \u2705  Assert that "Sign In" is visible\n    \u2551    \u2705  Tap on "Tap to sign in!"\n    \u2551    \u2705  Assert that "Your app, almost ready for launch!" is visible\n    \u2551    \u2705  Tap on "Let\'s go!"\n    \u2551    \u2705  Assert that "Components to jump start your project!" is visible\n'})}),"\n",(0,s.jsx)(t.p,{children:"Let's add another flow to see what else we can do with Maestro!"}),"\n",(0,s.jsx)(t.h2,{id:"lets-see-what-else-maestro-can-do",children:"Let's see what else Maestro can do"}),"\n",(0,s.jsx)(t.p,{children:"Let's create a more advanded flow that spans across multiple screens, we'll want to accomplish the following:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"Use environment variables"}),"\n",(0,s.jsx)(t.li,{children:"Run the login flow"}),"\n",(0,s.jsx)(t.li,{children:"Navigate to the demo podcast list screen"}),"\n",(0,s.jsx)(t.li,{children:"Favorite a podcast"}),"\n",(0,s.jsx)(t.li,{children:"Switch the list to only be favorites"}),"\n",(0,s.jsx)(t.li,{children:"Use accessibility labels to find elements"}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Go ahead and create a flow called ",(0,s.jsx)(t.code,{children:"FavoritePodcast.yaml"})," and add the following to it:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:'# flow: run the login flow and then navigate to the demo podcast list screen, favorite a podcast, and then switch the list to only be favorites.\n\nappId: com.maestroapp\nenv:\n  TITLE: "RNR 257 - META RESPONDS! How can we improve React Native, part 2"\n  FAVORITES_TEXT: "Switch on to only show favorites"\n\n---\n- runFlow: Login.yaml\n- tapOn: "Podcast, tab, 3 of 4"\n- assertVisible: "React Native Radio episodes"\n- tapOn:\n    text: ${FAVORITES_TEXT}\n- assertVisible: "This looks a bit empty"\n- tapOn:\n    text: ${FAVORITES_TEXT}\n- scrollUntilVisible:\n    element:\n      text: ${TITLE}\n    direction: DOWN\n    timeout: 50000\n    speed: 40\n    visibilityPercentage: 100\n- longPressOn: ${TITLE}\n- scrollUntilVisible:\n    element:\n      text: ${FAVORITES_TEXT}\n    direction: UP\n    timeout: 50000\n    speed: 40\n    visibilityPercentage: 100\n- tapOn:\n    text: ${FAVORITES_TEXT}\n- assertVisible: ${TITLE}\n'})}),"\n",(0,s.jsx)(t.p,{children:"We did a few things new here. Let's take a look at what they are:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["We added an ",(0,s.jsx)(t.code,{children:"env"})," section to our flow. This allows us to set environment variables that we can use in our flow. In this case, we're setting the title of the podcast we want to favorite and the favorites toggle label text."]}),"\n",(0,s.jsxs)(t.li,{children:["We added a ",(0,s.jsx)(t.code,{children:"runFlow"})," action. This action allows us to run another flow from within our flow. In this case, we're running the ",(0,s.jsx)(t.code,{children:"Login.yaml"})," flow before we run the rest of our flow."]}),"\n",(0,s.jsxs)(t.li,{children:["We added a ",(0,s.jsx)(t.code,{children:"scrollUntilVisible"})," action. This will help us find the episode we are looking for because it won't always be available in the first visible content as new episodes are released. This action is also used to scroll back up to toggle the ",(0,s.jsx)(t.code,{children:"Only Show Favorites"})," switch."]}),"\n",(0,s.jsxs)(t.li,{children:["We added a ",(0,s.jsx)(t.code,{children:"longPressOn"})," action. This action allows us to long press on an element. In this case, we're long pressing on the podcast we want to favorite, we're able to do this because of the accessability action that's associated with the Podcast Card."]}),"\n",(0,s.jsxs)(t.li,{children:['The text "Switch on to only show favorites" (or env var ',(0,s.jsx)(t.code,{children:"${FAVOREITES_TEXT}"}),") is the accessibility label passed to the Toggle component. Maestro identifies accessibility labels as text as long as that element does not have any text children."]}),"\n"]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:["If you're running these tests on an iOS simulator, you may need to add ",(0,s.jsx)(t.code,{children:"accessibilityLabel: episode.title,"})," to line 180 of ",(0,s.jsx)(t.code,{children:"DemoPodcastListScreen.tsx"})," in your Ignite project."]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsxs)(t.p,{children:["Maestro is a great tool for e2e testing. It's easy to set up and maintain. It's also easy to add to your Ignite project. If you want to check out how to use their other features, like Maestro cloud & Maestro Studio, check out their ",(0,s.jsx)(t.a,{href:"https://maestro.mobile.dev/",children:"documentation"}),"."]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.h2,{id:"notes",children:"Notes"}),"\n",(0,s.jsx)(t.p,{children:"Detox is the default e2e testing tool in Ignite. Should you choose to use Maestro, remove Detox from your project."}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,o.M)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},4552:(e,t,n)=>{n.d(t,{I:()=>r,M:()=>a});var s=n(1504);const o={},i=s.createContext(o);function a(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);