"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[3128],{6960:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var s=t(7624),a=t(4552);const o={title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",tags:["CI/CD","Guide"],last_update:{author:"Robin Heinze"},publish_date:new Date("2022-10-09T00:00:00.000Z")},i=void 0,c={id:"recipes/SampleYAMLCircleCI",title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",source:"@site/docs/recipes/SampleYAMLCircleCI.md",sourceDirName:"recipes",slug:"/recipes/SampleYAMLCircleCI",permalink:"/docs/recipes/SampleYAMLCircleCI",draft:!1,unlisted:!1,tags:[{label:"CI/CD",permalink:"/docs/tags/ci-cd"},{label:"Guide",permalink:"/docs/tags/guide"}],version:"current",lastUpdatedBy:"Robin Heinze",lastUpdatedAt:1674164388,formattedLastUpdatedAt:"Jan 19, 2023",frontMatter:{title:"Sample YAML for CircleCi for Ignite",description:"A Copy/Paste Sample YAML for your Ignite Project",tags:["CI/CD","Guide"],last_update:{author:"Robin Heinze"},publish_date:"2022-10-09T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Remove MobX-State-Tree",permalink:"/docs/recipes/RemoveMobxStateTree"},next:{title:"SelectField using `react-native-bottom-sheet`",permalink:"/docs/recipes/SelectFieldWithBottomSheet"}},r={},l=[{value:"Sampl YAML File",id:"sampl-yaml-file",level:3}];function d(e){const n={code:"code",h3:"h3",pre:"pre",...(0,a.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h3,{id:"sampl-yaml-file",children:"Sampl YAML File"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'# Javascript Node CircleCI 2.0 configuration file\n#\n# Check https://circleci.com/docs/2.0/language-javascript/ for more details\n#\n\ndefaults: &defaults\n  docker:\n    # Choose the version of Node you want here\n    - image: circleci/node:10.11\n  working_directory: ~/repo\n\nversion: 2\njobs:\n  setup:\n    <<: *defaults\n    steps:\n      - checkout\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      - run:\n          name: Install dependencies\n          command: |\n            yarn install\n      - save_cache:\n          name: Save node modules\n          paths:\n            - node_modules\n          key: v1-dependencies-{{ checksum "package.json" }}\n\n  tests:\n    <<: *defaults\n    steps:\n      - checkout\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      - run:\n          name: Install React Native CLI and Ignite CLI\n          command: |\n            sudo npm i -g ignite-cli react-native-cli\n      - run:\n          name: Run tests\n          command: yarn ci:test # this command will be added to/found in your package.json scripts\n\n  publish:\n    <<: *defaults\n    steps:\n      - checkout\n      - run: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc\n      - restore_cache:\n          name: Restore node modules\n          keys:\n            - v1-dependencies-{{ checksum "package.json" }}\n            # fallback to using the latest cache if no exact match is found\n            - v1-dependencies-\n      # Run semantic-release after all the above is set.\n      - run:\n          name: Publish to NPM\n          command: yarn ci:publish # this will be added to your package.json scripts\n\nworkflows:\n  version: 2\n  test_and_release:\n    jobs:\n      - setup\n      - tests:\n          requires:\n            - setup\n      - publish:\n          requires:\n            - tests\n          filters:\n            branches:\n              only: master\n'})})]})}function p(e={}){const{wrapper:n}={...(0,a.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},4552:(e,n,t)=>{t.d(n,{I:()=>c,M:()=>i});var s=t(1504);const a={},o=s.createContext(a);function i(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);