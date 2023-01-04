"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[3067],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(t),m=o,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||a;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2914:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var r=t(7462),o=(t(7294),t(3905));const a={title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",tags:["CI/CD","Guide"],last_update:{author:"Robin Heinze"}},i=void 0,c={unversionedId:"SampleYAMLCircleCI",id:"SampleYAMLCircleCI",title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",source:"@site/docs/SampleYAMLCircleCI.md",sourceDirName:".",slug:"/SampleYAMLCircleCI",permalink:"/ignite-cookbook/docs/SampleYAMLCircleCI",draft:!1,tags:[{label:"CI/CD",permalink:"/ignite-cookbook/docs/tags/ci-cd"},{label:"Guide",permalink:"/ignite-cookbook/docs/tags/guide"}],version:"current",lastUpdatedBy:"Robin Heinze",lastUpdatedAt:1672867127,formattedLastUpdatedAt:"Jan 4, 2023",frontMatter:{title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",tags:["CI/CD","Guide"],last_update:{author:"Robin Heinze"}},sidebar:"tutorialSidebar",previous:{title:"Pristine Expo Project",permalink:"/ignite-cookbook/docs/PristineExpoProject"},next:{title:"Staying With Expo",permalink:"/ignite-cookbook/docs/StayingWithExpo"}},s={},l=[{value:"Sampl YAML File",id:"sampl-yaml-file",level:3}],p={toc:l};function u(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h3",{id:"sampl-yaml-file"},"Sampl YAML File"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'# Javascript Node CircleCI 2.0 configuration file\n#\n# Check https://circleci.com/docs/2.0/language-javascript/ for more details\n#\n\ndefaults: &defaults\n  docker:\n    # Choose the version of Node you want here\n    - image: circleci/node:10.11\n  working_directory: ~/repo\n\nversion: 2\njobs:\n  setup:\n    <<: *defaults\n    steps:\n      - checkout\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      - run:\n          name: Install dependencies\n          command: |\n            yarn install\n      - save_cache:\n          name: Save node modules\n          paths:\n            - node_modules\n          key: v1-dependencies-{{ checksum "package.json" }}\n\n  tests:\n    <<: *defaults\n    steps:\n      - checkout\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      - run:\n          name: Install React Native CLI and Ignite CLI\n          command: |\n            sudo npm i -g ignite-cli react-native-cli\n      - run:\n          name: Run tests\n          command: yarn ci:test # this command will be added to/found in your package.json scripts\n\n  publish:\n    <<: *defaults\n    steps:\n      - checkout\n      - run: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      # Run semantic-release after all the above is set.\n      - run:\n          name: Publish to NPM\n          command: yarn ci:publish # this will be added to your package.json scripts\n\nworkflows:\n  version: 2\n  test_and_release:\n    jobs:\n      - setup\n      - tests:\n          requires:\n            - setup\n      - publish:\n          requires:\n            - tests\n          filters:\n            branches:\n              only: master\n')))}u.isMDXComponent=!0}}]);