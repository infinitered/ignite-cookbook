"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[492],{8392:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>d,default:()=>m,frontMatter:()=>i,metadata:()=>c,toc:()=>h});var o=n(7624),r=n(2172),s=n(1268),a=n(5388),l=n(1608);const i={title:"Theming Ignite with styled-components",description:"Learn how to use different styling libraries to theme your Ignited app!",tags:["Theming","iOS","Android","colors","darkmode","styled-components"],last_update:{author:"Mark Rickert"},publish_date:new Date("2024-12-02T00:00:00.000Z")},d="Theming Ignite",c={id:"recipes/Theming-StyledComponents",title:"Theming Ignite with styled-components",description:"Learn how to use different styling libraries to theme your Ignited app!",source:"@site/docs/recipes/Theming-StyledComponents.mdx",sourceDirName:"recipes",slug:"/recipes/Theming-StyledComponents",permalink:"/docs/recipes/Theming-StyledComponents",draft:!1,unlisted:!1,tags:[{label:"Theming",permalink:"/docs/tags/theming"},{label:"iOS",permalink:"/docs/tags/i-os"},{label:"Android",permalink:"/docs/tags/android"},{label:"colors",permalink:"/docs/tags/colors"},{label:"darkmode",permalink:"/docs/tags/darkmode"},{label:"styled-components",permalink:"/docs/tags/styled-components"}],version:"current",lastUpdatedBy:"Mark Rickert",lastUpdatedAt:1728940271,formattedLastUpdatedAt:"Oct 14, 2024",frontMatter:{title:"Theming Ignite with styled-components",description:"Learn how to use different styling libraries to theme your Ignited app!",tags:["Theming","iOS","Android","colors","darkmode","styled-components"],last_update:{author:"Mark Rickert"},publish_date:"2024-12-02T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Theming Ignite with Emotion.js",permalink:"/docs/recipes/Theming-Emotion"},next:{title:"Theming Ignite with Unistyles",permalink:"/docs/recipes/Theming-Unistyles"}},u={},h=[{value:"Using <code>styled-components</code>",id:"using-styled-components",level:2},{value:"1. Add <code>styled-components</code> to your app:",id:"1-add-styled-components-to-your-app",level:3},{value:"2. Add the <code>ThemeProvider</code> to your app:",id:"2-add-the-themeprovider-to-your-app",level:3},{value:"3. Create and use your first styled-component using the new theme:",id:"3-create-and-use-your-first-styled-component-using-the-new-theme",level:3},{value:"4. Tell <code>styled-components</code> about the shape of your theme:",id:"4-tell-styled-components-about-the-shape-of-your-theme",level:3},{value:"Complete!",id:"complete",level:2}];function p(e){const t={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"theming-ignite",children:"Theming Ignite"}),"\n",(0,o.jsxs)(t.p,{children:["When it comes to styling we acknowledge the popularity and effectiveness of libraries like ",(0,o.jsx)(t.code,{children:"styled-components"}),", ",(0,o.jsx)(t.code,{children:"emotion.js"})," and ",(0,o.jsx)(t.code,{children:"unistyles"}),". Our boilerplate is designed to work seamlessly with these styling solutions, offering you the flexibility to choose the one that aligns with your preferences and project requirements."]}),"\n",(0,o.jsx)(t.p,{children:"The theming system in Ignite Boilerplate is crafted to be adaptable and easy to customize. By simply replacing colors and fonts through the designated theme files, you can tailor the look and feel of your application."}),"\n",(0,o.jsxs)(t.h2,{id:"using-styled-components",children:["Using ",(0,o.jsx)(t.code,{children:"styled-components"})]}),"\n",(0,o.jsxs)(t.h3,{id:"1-add-styled-components-to-your-app",children:["1. Add ",(0,o.jsx)(t.code,{children:"styled-components"})," to your app:"]}),"\n",(0,o.jsxs)(s.c,{groupId:"operating-systems",children:[(0,o.jsx)(a.c,{value:"yarn",label:"Yarn",children:(0,o.jsx)(l.c,{language:"bash",children:"yarn add styled-components"})}),(0,o.jsx)(a.c,{value:"npm",label:"npm",children:(0,o.jsx)(l.c,{language:"bash",children:"npm install styled-components"})}),(0,o.jsx)(a.c,{value:"pnpm",label:"pnpm",children:(0,o.jsx)(l.c,{language:"bash",children:"pnpm install styled-components"})})]}),"\n",(0,o.jsxs)(t.h3,{id:"2-add-the-themeprovider-to-your-app",children:["2. Add the ",(0,o.jsx)(t.code,{children:"ThemeProvider"})," to your app:"]}),"\n",(0,o.jsxs)(t.p,{children:["Find and open the ",(0,o.jsx)(t.code,{children:"AppNavigator.tsx"})," file in your project and add the import:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-ts",children:'import { ThemeProvider as StyledThemeProvider } from "styled-components";\n'})}),"\n",(0,o.jsx)(t.p,{children:"Add the following functional component:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-tsx",children:"const StyledComponentsThemeProvider = (props: React.PropsWithChildren) => {\n  const { theme } = useAppTheme();\n  return <StyledThemeProvider theme={theme} {...props} />;\n};\n"})}),"\n",(0,o.jsxs)(t.p,{children:["Add the new ",(0,o.jsx)(t.code,{children:"StyledComponentsThemeProvider"})," component just inside the ",(0,o.jsx)(t.code,{children:"<ThemeProvider>"})," component in the ",(0,o.jsx)(t.code,{children:"AppNavigator"}),"."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-diff",children:"return (\n  <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>\n+    <StyledComponentsThemeProvider>\n      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>\n        <AppStack />\n      </NavigationContainer>\n+    </StyledComponentsThemeProvider>\n  </ThemeProvider>\n);\n"})}),"\n",(0,o.jsx)(t.h3,{id:"3-create-and-use-your-first-styled-component-using-the-new-theme",children:"3. Create and use your first styled-component using the new theme:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-tsx",children:'import styled from "styled-components/native";\n\nconst MyTextComponent = styled.Text`\n  margin: 10px;\n  color: ${({ theme }) => theme.colors.text};\n  background-color: ${({ theme }) => theme.colors.background};\n`;\n\nexport const MyScreen = (props) => {\n  return (\n    <MyTextComponent>\n      This text color and background will change when changing themes.\n    </MyTextComponent>\n  );\n};\n'})}),"\n",(0,o.jsxs)(t.h3,{id:"4-tell-styled-components-about-the-shape-of-your-theme",children:["4. Tell ",(0,o.jsx)(t.code,{children:"styled-components"})," about the shape of your theme:"]}),"\n",(0,o.jsxs)(t.p,{children:["Create a new file in you Ignited app's ",(0,o.jsx)(t.code,{children:"types"})," folder called ",(0,o.jsx)(t.code,{children:"styled-components.d.ts"})," with the following content:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-tsx",children:'// Override DefaultTheme to get accurate typings for your project.\nimport type { Theme } from "app/theme";\nimport "styled-components";\nimport "styled-components/native";\n\ndeclare module "styled-components" {\n  export interface DefaultTheme extends Theme {}\n}\n\ndeclare module "styled-components/native" {\n  export interface DefaultTheme extends Theme {}\n}\n'})}),"\n",(0,o.jsx)(t.h2,{id:"complete",children:"Complete!"}),"\n",(0,o.jsxs)(t.p,{children:["You can now use ",(0,o.jsx)(t.code,{children:"styled-components"})," integrated into the Ignite theme engine. To swap themes provide the user a switch or toggle button:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-tsx",children:'const { setThemeContextOverride, themeContext } = useAppTheme();\n\nreturn (\n  <Button\n    onPress={() => {\n      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the transition\n      setThemeContextOverride(themeContext === "dark" ? "light" : "dark");\n    }}\n    text={`Switch Theme: ${themeContext}`}\n  />\n);\n'})})]})}function m(e={}){const{wrapper:t}={...(0,r.M)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},5388:(e,t,n)=>{n.d(t,{c:()=>a});n(1504);var o=n(5456);const r={tabItem:"tabItem_Ymn6"};var s=n(7624);function a(e){let{children:t,hidden:n,className:a}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,o.c)(r.tabItem,a),hidden:n,children:t})}},1268:(e,t,n)=>{n.d(t,{c:()=>T});var o=n(1504),r=n(5456),s=n(3943),a=n(5592),l=n(5288),i=n(632),d=n(7128),c=n(1148);function u(e){return o.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,o.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,o.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:o,default:r}}=e;return{value:t,label:n,attributes:o,default:r}}))}(n);return function(e){const t=(0,d.w)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const r=(0,a.Uz)(),s=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,i._M)(s),(0,o.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(r.location.search);t.set(s,e),r.replace({...r.location,search:t.toString()})}),[s,r])]}function g(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,s=h(e),[a,i]=(0,o.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const o=n.find((e=>e.default))??n[0];if(!o)throw new Error("Unexpected error: 0 tabValues");return o.value}({defaultValue:t,tabValues:s}))),[d,u]=m({queryString:n,groupId:r}),[g,y]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,s]=(0,c.IN)(n);return[r,(0,o.useCallback)((e=>{n&&s.set(e)}),[n,s])]}({groupId:r}),f=(()=>{const e=d??g;return p({value:e,tabValues:s})?e:null})();(0,l.c)((()=>{f&&i(f)}),[f]);return{selectedValue:a,selectValue:(0,o.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),y(e)}),[u,y,s]),tabValues:s}}var y=n(3664);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=n(7624);function x(e){let{className:t,block:n,selectedValue:o,selectValue:a,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.MV)(),c=e=>{const t=e.currentTarget,n=i.indexOf(t),r=l[n].value;r!==o&&(d(t),a(r))},u=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=i.indexOf(e.currentTarget)+1;t=i[n]??i[0];break}case"ArrowLeft":{const n=i.indexOf(e.currentTarget)-1;t=i[n]??i[i.length-1];break}}t?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.c)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:s}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:o===t?0:-1,"aria-selected":o===t,ref:e=>i.push(e),onKeyDown:u,onClick:c,...s,className:(0,r.c)("tabs__item",f.tabItem,s?.className,{"tabs__item--active":o===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:r}=e;const s=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===r));return e?(0,o.cloneElement)(e,{className:"margin-top--md"}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function j(e){const t=g(e);return(0,b.jsxs)("div",{className:(0,r.c)("tabs-container",f.tabList),children:[(0,b.jsx)(x,{...e,...t}),(0,b.jsx)(v,{...e,...t})]})}function T(e){const t=(0,y.c)();return(0,b.jsx)(j,{...e,children:u(e.children)},String(t))}}}]);