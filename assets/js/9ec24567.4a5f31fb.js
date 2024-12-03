"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[7136],{900:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>h});var s=n(7624),r=n(2172),i=n(1268),a=n(5388),l=n(1608);const o={title:"Theming Ignite with Unistyles",description:"Learn how to use different styling libraries to theme your Ignited app!",tags:["Theming","iOS","Android","colors","darkmode","unistyles"],last_update:{author:"Mark Rickert"},publish_date:new Date("2024-10-02T00:00:00.000Z")},c="Theming Ignite",u={id:"recipes/Theming-Unistyles",title:"Theming Ignite with Unistyles",description:"Learn how to use different styling libraries to theme your Ignited app!",source:"@site/docs/recipes/Theming-Unistyles.mdx",sourceDirName:"recipes",slug:"/recipes/Theming-Unistyles",permalink:"/docs/recipes/Theming-Unistyles",draft:!1,unlisted:!1,tags:[{label:"Theming",permalink:"/docs/tags/theming"},{label:"iOS",permalink:"/docs/tags/i-os"},{label:"Android",permalink:"/docs/tags/android"},{label:"colors",permalink:"/docs/tags/colors"},{label:"darkmode",permalink:"/docs/tags/darkmode"},{label:"unistyles",permalink:"/docs/tags/unistyles"}],version:"current",lastUpdatedBy:"Mark Rickert",lastUpdatedAt:1730219098,formattedLastUpdatedAt:"Oct 29, 2024",frontMatter:{title:"Theming Ignite with Unistyles",description:"Learn how to use different styling libraries to theme your Ignited app!",tags:["Theming","iOS","Android","colors","darkmode","unistyles"],last_update:{author:"Mark Rickert"},publish_date:"2024-10-02T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Theming Ignite with styled-components",permalink:"/docs/recipes/Theming-StyledComponents"},next:{title:"TypeScript baseUrl Configuration",permalink:"/docs/recipes/TypeScriptBaseURL"}},d={},h=[{value:"Using <code>Unistyles</code>",id:"using-unistyles",level:2},{value:"1. Add <code>react-native-unistyles</code> to your app:",id:"1-add-react-native-unistyles-to-your-app",level:3},{value:"2. Add define Unistyles theme types:",id:"2-add-define-unistyles-theme-types",level:3},{value:"3. Configure unistyles to use the app&#39;s Theme:",id:"3-configure-unistyles-to-use-the-apps-theme",level:3},{value:"4. Ensure that Unistyles knows when we want to change the theme:",id:"4-ensure-that-unistyles-knows-when-we-want-to-change-the-theme",level:3},{value:"5. Create and use your first Unistyles component using the new theme:",id:"5-create-and-use-your-first-unistyles-component-using-the-new-theme",level:3},{value:"Complete!",id:"complete",level:2}];function p(e){const t={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"theming-ignite",children:"Theming Ignite"}),"\n",(0,s.jsxs)(t.p,{children:["When it comes to styling we acknowledge the popularity and effectiveness of libraries like ",(0,s.jsx)(t.code,{children:"styled-components"}),", ",(0,s.jsx)(t.code,{children:"emotion.js"})," and ",(0,s.jsx)(t.code,{children:"unistyles"}),". Our boilerplate is designed to work seamlessly with these styling solutions, offering you the flexibility to choose the one that aligns with your preferences and project requirements."]}),"\n",(0,s.jsx)(t.p,{children:"The theming system in Ignite Boilerplate is crafted to be adaptable and easy to customize. By simply replacing colors and fonts through the designated theme files, you can tailor the look and feel of your application."}),"\n",(0,s.jsxs)(t.h2,{id:"using-unistyles",children:["Using ",(0,s.jsx)(t.code,{children:"Unistyles"})]}),"\n",(0,s.jsxs)(t.admonition,{type:"warning",children:[(0,s.jsx)(t.p,{children:"Unistyles includes custom native code, which means it does not support Expo Go. You'll need to use expo CNG to build your app."}),(0,s.jsxs)(t.p,{children:["To do this with an newly ignited app, run ",(0,s.jsx)(t.code,{children:"yarn prebuild:clean"})," and then ",(0,s.jsx)(t.code,{children:"yarn start"}),"."]})]}),"\n",(0,s.jsxs)(t.h3,{id:"1-add-react-native-unistyles-to-your-app",children:["1. Add ",(0,s.jsx)(t.code,{children:"react-native-unistyles"})," to your app:"]}),"\n",(0,s.jsxs)(i.c,{groupId:"operating-systems",children:[(0,s.jsx)(a.c,{value:"yarn",label:"Yarn",children:(0,s.jsx)(l.c,{language:"bash",children:"yarn add react-native-unistyles"})}),(0,s.jsx)(a.c,{value:"npm",label:"npm",children:(0,s.jsx)(l.c,{language:"bash",children:"npm install react-native-unistyles"})}),(0,s.jsx)(a.c,{value:"pnpm",label:"pnpm",children:(0,s.jsx)(l.c,{language:"bash",children:"pnpm install react-native-unistyles"})})]}),"\n",(0,s.jsx)(t.h3,{id:"2-add-define-unistyles-theme-types",children:"2. Add define Unistyles theme types:"}),"\n",(0,s.jsxs)(t.p,{children:["Create a new file in you Ignited app's ",(0,s.jsx)(t.code,{children:"types"})," folder called ",(0,s.jsx)(t.code,{children:"react-native-unistyles.d.ts"})," with the following content:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'// Override UnistylesThemes to get accurate typings for your project.\nimport type { Theme } from "app/theme";\nimport "react-native-unistyles";\n\ntype AppThemes = {\n  light: Theme;\n  dark: Theme;\n};\n\ndeclare module "react-native-unistyles" {\n  export interface UnistylesThemes extends AppThemes {}\n}\n'})}),"\n",(0,s.jsx)(t.h3,{id:"3-configure-unistyles-to-use-the-apps-theme",children:"3. Configure unistyles to use the app's Theme:"}),"\n",(0,s.jsxs)(t.p,{children:["Add the following to your app's ",(0,s.jsx)(t.code,{children:"app/App.tsx"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:'+import { UnistylesRegistry } from "react-native-unistyles"\n+import { darkTheme, lightTheme } from "app/theme"\n\nSplashScreen.preventAutoHideAsync()\n\n+UnistylesRegistry.addThemes({\n+  light: lightTheme,\n+  dark: darkTheme,\n+}).addConfig({\n+  // adaptiveThemes: true,\n+  initialTheme: "light",\n+})\n+\n\nfunction IgniteApp() {\n  return <App hideSplashScreen={SplashScreen.hideAsync} />\n}\n'})}),"\n",(0,s.jsx)(t.h3,{id:"4-ensure-that-unistyles-knows-when-we-want-to-change-the-theme",children:"4. Ensure that Unistyles knows when we want to change the theme:"}),"\n",(0,s.jsxs)(t.p,{children:["Open the ",(0,s.jsx)(t.code,{children:"app/utils/useAppTheme.ts"})," and make the following changes:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:'  const setThemeContextOverride = useCallback((newTheme: ThemeContexts) => {\n    setTheme(newTheme)\n+    UnistylesRuntime.setTheme(newTheme || "light")\n  }, [])\n'})}),"\n",(0,s.jsx)(t.h3,{id:"5-create-and-use-your-first-unistyles-component-using-the-new-theme",children:"5. Create and use your first Unistyles component using the new theme:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'import { createStyleSheet, useStyles } from "react-native-unistyles";\n\nexport const MyScreen = (props) => {\n  const { styles } = useStyles($uniStyles);\n  return (\n    <Text style={styles.text}>\n      This text color and background will change when changing themes.\n    </Text>\n  );\n};\n\nconst $uniStyles = createStyleSheet((theme) => ({\n  text: {\n    color: theme.colors.text,\n    backgroundColor: theme.colors.background,\n  },\n}));\n'})}),"\n",(0,s.jsx)(t.h2,{id:"complete",children:"Complete!"}),"\n",(0,s.jsx)(t.p,{children:"You can now use Unistyles integrated into the Ignite theme engine. To swap themes provide the user a switch or toggle button:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'const { setThemeContextOverride, themeContext } = useAppTheme();\n\nreturn (\n  <Button\n    onPress={() => {\n      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the transition\n      setThemeContextOverride(themeContext === "dark" ? "light" : "dark");\n    }}\n    text={`Switch Theme: ${themeContext}`}\n  />\n);\n'})})]})}function m(e={}){const{wrapper:t}={...(0,r.M)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},5388:(e,t,n)=>{n.d(t,{c:()=>a});n(1504);var s=n(5456);const r={tabItem:"tabItem_Ymn6"};var i=n(7624);function a(e){let{children:t,hidden:n,className:a}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,s.c)(r.tabItem,a),hidden:n,children:t})}},1268:(e,t,n)=>{n.d(t,{c:()=>T});var s=n(1504),r=n(5456),i=n(3943),a=n(5592),l=n(5288),o=n(632),c=n(7128),u=n(1148);function d(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:r}}=e;return{value:t,label:n,attributes:s,default:r}}))}(n);return function(e){const t=(0,c.w)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const r=(0,a.Uz)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,o._M)(i),(0,s.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(r.location.search);t.set(i,e),r.replace({...r.location,search:t.toString()})}),[i,r])]}function g(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,i=h(e),[a,o]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:i}))),[c,d]=m({queryString:n,groupId:r}),[g,y]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,i]=(0,u.IN)(n);return[r,(0,s.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:r}),f=(()=>{const e=c??g;return p({value:e,tabValues:i})?e:null})();(0,l.c)((()=>{f&&o(f)}),[f]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),y(e)}),[d,y,i]),tabValues:i}}var y=n(3664);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=n(7624);function x(e){let{className:t,block:n,selectedValue:s,selectValue:a,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,i.MV)(),u=e=>{const t=e.currentTarget,n=o.indexOf(t),r=l[n].value;r!==s&&(c(t),a(r))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=o.indexOf(e.currentTarget)+1;t=o[n]??o[0];break}case"ArrowLeft":{const n=o.indexOf(e.currentTarget)-1;t=o[n]??o[o.length-1];break}}t?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.c)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:i}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>o.push(e),onKeyDown:d,onClick:u,...i,className:(0,r.c)("tabs__item",f.tabItem,i?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:r}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function w(e){const t=g(e);return(0,b.jsxs)("div",{className:(0,r.c)("tabs-container",f.tabList),children:[(0,b.jsx)(x,{...e,...t}),(0,b.jsx)(v,{...e,...t})]})}function T(e){const t=(0,y.c)();return(0,b.jsx)(w,{...e,children:d(e.children)},String(t))}}}]);