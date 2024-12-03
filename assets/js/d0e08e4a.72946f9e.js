"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[9016],{2980:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>a,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var t=n(7624),o=n(2172);const r={title:"Patching/Building Android .aar From Source",description:"Instructions for updating the RN Android source code",tags:["Debug","Guide","Android"],last_update:{author:"Yulian Glukhenko"},publish_date:new Date("2022-10-09T00:00:00.000Z")},s=void 0,d={id:"recipes/PatchingBuildingAndroid",title:"Patching/Building Android .aar From Source",description:"Instructions for updating the RN Android source code",source:"@site/docs/recipes/PatchingBuildingAndroid.md",sourceDirName:"recipes",slug:"/recipes/PatchingBuildingAndroid",permalink:"/docs/recipes/PatchingBuildingAndroid",draft:!1,unlisted:!1,tags:[{label:"Debug",permalink:"/docs/tags/debug"},{label:"Guide",permalink:"/docs/tags/guide"},{label:"Android",permalink:"/docs/tags/android"}],version:"current",lastUpdatedBy:"Yulian Glukhenko",lastUpdatedAt:1708554035,formattedLastUpdatedAt:"Feb 21, 2024",frontMatter:{title:"Patching/Building Android .aar From Source",description:"Instructions for updating the RN Android source code",tags:["Debug","Guide","Android"],last_update:{author:"Yulian Glukhenko"},publish_date:"2022-10-09T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Choosing the right monorepo strategy for your project",permalink:"/docs/recipes/MonoreposOverview"},next:{title:"Prepping Ignite for EAS Build",permalink:"/docs/recipes/PrepForEASBuild"}},a={},c=[{value:"Why?",id:"why",level:3},{value:"Official Guides",id:"official-guides",level:3},{value:"Steps",id:"steps",level:3}];function l(e){const i={a:"a",blockquote:"blockquote",code:"code",em:"em",h3:"h3",img:"img",p:"p",pre:"pre",...(0,o.M)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.h3,{id:"why",children:"Why?"}),"\n",(0,t.jsxs)(i.p,{children:["Sometimes, a situation arises when you might want to update the react-native Android source code without upgrading react-native itself. For example, there's a ",(0,t.jsx)(i.a,{href:"https://github.com/facebook/react-native/issues/33375",children:"new bug"})," on Android 12 where the application crashes due to some bug with the animation queue. The potential fix is available on the ",(0,t.jsx)(i.code,{children:"main"}),' (unreleased) branch, but your app version is a few patches behind. Another situation is when you simply can\'t upgrade your react-native version yet, but need a fix from future version. In these cases, you can use this approach to "patch" your Android source files and build new .aar binary and use that for your app.']}),"\n",(0,t.jsx)(i.h3,{id:"official-guides",children:"Official Guides"}),"\n",(0,t.jsxs)(i.p,{children:["The official steps to build from source are provided by react-native and you can find them ",(0,t.jsx)(i.a,{href:"https://reactnative.dev/contributing/how-to-build-from-source",children:"here."})]}),"\n",(0,t.jsx)(i.p,{children:'The guid is fairly generic and redundant in some cases if you already have a sufficient react-native development environment setup. The steps below describe what has "worked for me" and they may or may not apply to everyone.'}),"\n",(0,t.jsx)(i.h3,{id:"steps",children:"Steps"}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"1 - Fork React-Native And Clone"})}),"\n",(0,t.jsxs)(i.p,{children:["Go to ",(0,t.jsx)(i.a,{href:"https://github.com/facebook/react-native",children:"Github"})," and fork react-native. Pull the forked code down to your system."]}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsxs)(i.p,{children:["Note: The official instructions tell you to clone react-native into your project's ",(0,t.jsx)(i.code,{children:"node_modules"}),". Don't do this. Just pull it down into your favorite development directory."]}),"\n"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"2 - Checkout the Correct Commit"})}),"\n",(0,t.jsxs)(i.p,{children:["If you are following this guide, you are most likely trying to patch react-native Android source files at a specific older version. The easiest way to do this is to checkout the commit specified in the respective version's git tag.\n",(0,t.jsx)(i.img,{alt:"Branch and Commit History",src:n(5071).c+"",width:"1221",height:"783"})]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"3 - Install Dependencies"})}),"\n",(0,t.jsxs)(i.p,{children:["Just type ",(0,t.jsx)(i.code,{children:"yarn"}),"."]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"4 - Configure the SDK"})}),"\n",(0,t.jsxs)(i.p,{children:["You will need the version of the SDk specifice in the ",(0,t.jsx)(i.code,{children:"./ReactAndroid/build.gradle"})," for ",(0,t.jsx)(i.code,{children:"compileSdkVersion"}),". You can install it via Android Studio.\n",(0,t.jsx)(i.img,{alt:"Android SDK Configuration",src:n(399).c+"",width:"1141",height:"141"})]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"5 - Configure the NDK"})}),"\n",(0,t.jsxs)(i.p,{children:["Check the ",(0,t.jsx)(i.code,{children:"./gradle.properties"})," file, ",(0,t.jsx)(i.code,{children:"ANDROID_NDK_VERSION"})," key, for the version needed. This can be installed from Android Studio as well.\n",(0,t.jsx)(i.img,{alt:"Android NDK Configuration",src:n(6428).c+"",width:"1057",height:"224"})]}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsx)(i.p,{children:"Note: The official docs provide links to NDK archives. Installing through Android Studio is probably easer. One caveat is that I didn't find arm architecture NDKs in Android Studio. It's not a big deal though to use those since you won't do this often."}),"\n"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"6 - Configure Paths"})}),"\n",(0,t.jsxs)(i.p,{children:["Create a ",(0,t.jsx)(i.code,{children:"local.properties"})," file in the root. This file is gitignored and should be kept as so."]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"sdk.dir=/Users/path/to/sdk\nndk.dir=/Users/path/to/ndk\n"})}),"\n",(0,t.jsx)(i.p,{children:"Your SDK path is in your Library files (if installed through Android Studio).Your NDK path is inside the SDK path. This is what mine looks like:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"sdk.dir=/Users/~Usernamehere~/Library/Android/sdk\nndk.dir=/Users/~Usernamehere~/Library/Android/sdk/ndk/21.4.7075529\n"})}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsx)(i.p,{children:"Note: The official guides also have you setup shell paths with the same values. Not sure if this is needed. It wasn't for me."}),"\n"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"7 - Make the Necessary Changes"})}),"\n",(0,t.jsxs)(i.p,{children:["Now, you can make any changes in the ",(0,t.jsx)(i.code,{children:"./ReactAndroid"})," folder."]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"8 - Build"})}),"\n",(0,t.jsx)(i.p,{children:"Run the following command in the root:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"arch -x86_64 ./gradlew :ReactAndroid:installArchives --no-daemon\n"})}),"\n",(0,t.jsx)(i.p,{children:"The first time you run this, it'll take some time. It will also report any syntax/type errors. It will also report any configuration errors."}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsxs)(i.p,{children:["Note: If you installed an arm compatible NDK, omit the ",(0,t.jsx)(i.code,{children:"arch -x86_64"})," from the command"]}),"\n"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"9 - Commit and Push"})}),"\n",(0,t.jsxs)(i.p,{children:["In your ",(0,t.jsx)(i.code,{children:".gitignore"}),", remove the line which ignores the ",(0,t.jsx)(i.code,{children:"/android/"})," directory. We'll want to commit this build output from step 7. Commit and push your fork."]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"10 - Update Project's React-Native"})}),"\n",(0,t.jsxs)(i.p,{children:["Now that you have build and pushed your changes, you can reference that in your application's ",(0,t.jsx)(i.code,{children:"package.json"}),".\n",(0,t.jsx)(i.img,{alt:"package json",src:n(348).c+"",width:"954",height:"140"})]}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsxs)(i.p,{children:["Note: You'll most likely need to delete/re-install your node_modules as well as run ",(0,t.jsx)(i.code,{children:"./android/gradlew clean"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,o.M)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},5071:(e,i,n)=>{n.d(i,{c:()=>t});const t=n.p+"assets/images/PatchingBuildingAndroid(1)-68d9226be54d8c740b0c14cf4f3679e0.jpg"},399:(e,i,n)=>{n.d(i,{c:()=>t});const t=n.p+"assets/images/PatchingBuildingAndroid(2)-13515d97cfab79a43688abf9c36d6216.jpg"},6428:(e,i,n)=>{n.d(i,{c:()=>t});const t=n.p+"assets/images/PatchingBuildingAndroid(3)-cf31a6c6fe16cd2a2b16e76fac43081f.jpg"},348:(e,i,n)=>{n.d(i,{c:()=>t});const t=n.p+"assets/images/PatchingBuildingAndroid(4)-88633463af8780ffac07ec487ae12ad8.jpg"},2172:(e,i,n)=>{n.d(i,{I:()=>d,M:()=>s});var t=n(1504);const o={},r=t.createContext(o);function s(e){const i=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function d(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),t.createElement(r.Provider,{value:i},e.children)}}}]);