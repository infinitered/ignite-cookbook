"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[8500],{5220:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>r,toc:()=>l});var o=t(7624),i=t(2172);const a={title:"React Native Vision Camera",description:"How to integrate VisionCamera in Ignite v9+",tags:["Expo","VisionCamera","react-native-vision-camera"],last_update:{author:"Frank Calise"},publish_date:new Date("2023-10-23T00:00:00.000Z")},s="VisionCamera",r={id:"recipes/ReactNativeVisionCamera",title:"React Native Vision Camera",description:"How to integrate VisionCamera in Ignite v9+",source:"@site/docs/recipes/ReactNativeVisionCamera.md",sourceDirName:"recipes",slug:"/recipes/ReactNativeVisionCamera",permalink:"/docs/recipes/ReactNativeVisionCamera",draft:!1,unlisted:!1,tags:[{label:"Expo",permalink:"/docs/tags/expo"},{label:"VisionCamera",permalink:"/docs/tags/vision-camera"},{label:"react-native-vision-camera",permalink:"/docs/tags/react-native-vision-camera"}],version:"current",lastUpdatedBy:"Frank Calise",lastUpdatedAt:1708554035,formattedLastUpdatedAt:"Feb 21, 2024",frontMatter:{title:"React Native Vision Camera",description:"How to integrate VisionCamera in Ignite v9+",tags:["Expo","VisionCamera","react-native-vision-camera"],last_update:{author:"Frank Calise"},publish_date:"2023-10-23T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Prepping Ignite for EAS Build",permalink:"/docs/recipes/PrepForEASBuild"},next:{title:"Redux",permalink:"/docs/recipes/Redux"}},c={},l=[{value:"Overview",id:"overview",level:2},{value:"Installation",id:"installation",level:2},{value:"Permissions",id:"permissions",level:2},{value:"Codes Store &amp; Screen",id:"codes-store--screen",level:2},{value:"Displaying the Camera",id:"displaying-the-camera",level:2}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,i.M)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"visioncamera",children:"VisionCamera"}),"\n",(0,o.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,o.jsx)(n.p,{children:"VisionCamera is a powerful, high-performance React Native Camera library. It's both feature-rich and flexible! The library provides the necessary hooks and functions to easily integrate camera functionality in your app."}),"\n",(0,o.jsx)(n.p,{children:"In this example, we'll take a look at wiring up a barcode scanner. This tutorial is written for the Ignite v9 Prebuild workflow, however it generally still applies to DIY or even a bare react-native project."}),"\n",(0,o.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,o.jsx)(n.p,{children:"If you haven't already, spin up a new Ignite application:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npx ignite-cli@latest new PizzaApp --remove-demo --workflow=prebuild --yes\ncd PizzaApp\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Next, let's install the necessary dependencies. You can see complete installation instructions for ",(0,o.jsx)(n.code,{children:"react-native-vision-camera"})," ",(0,o.jsx)(n.a,{href:"https://react-native-vision-camera.com/docs/guides",children:"here"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npx expo install react-native-vision-camera\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Add the plugin to ",(0,o.jsx)(n.code,{children:"app.json"})," as per the documentation. It'll look like the following if you have the default Ignite template:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'"plugins": [\n  "expo-localization",\n  [\n    "expo-build-properties",\n    {\n      "ios": {\n        "newArchEnabled": false\n      },\n      "android": {\n        "newArchEnabled": false\n      }\n    }\n  ],\n  [\n    "react-native-vision-camera",\n    {\n      "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera.",\n      "enableCodeScanner": true\n    }\n  ]\n],\n'})}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note:"})," ",(0,o.jsx)(n.code,{children:"$(PRODUCT_NAME)"})," comes from the iOS project build configuration, this will be populated with the app name at runtime as long as it's configured properly (in this case, it is in the Ignite boilerplate)"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"To get this native dependency working in our project, we'll need to run prebuild so Expo can execute the proper native code changes for us. Then we can boot up the app on a device."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npx expo prebuild\nyarn android\n"})}),"\n",(0,o.jsx)(n.p,{children:"Since the simulators do not offer a good way of testing the camera for this recipe, we'll be creating an Android build to test on an actual device. This is for convenience, as it's a bit easier to achieve than running on an iOS device, however both would work."}),"\n",(0,o.jsx)(n.h2,{id:"permissions",children:"Permissions"}),"\n",(0,o.jsx)(n.p,{children:"Before we can get to using the camera on the device, we must get permission from the user to do so. Let's edit the Welcome screen in Ignite to reflect the current permission status and a way to prompt the user."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import { observer } from "mobx-react-lite";\nimport React, { FC } from "react";\nimport { AppStackScreenProps } from "../navigators";\nimport { Camera, CameraPermissionStatus } from "react-native-vision-camera";\nimport { Linking, View, ViewStyle } from "react-native";\nimport { Button, Screen, Text } from "app/components";\n\ninterface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}\n\nexport const WelcomeScreen: FC<WelcomeScreenProps> = observer(\n  function WelcomeScreen(_props) {\n    const [cameraPermission, setCameraPermission] =\n      React.useState<CameraPermissionStatus>();\n\n    React.useEffect(() => {\n      Camera.getCameraPermissionStatus().then(setCameraPermission);\n    }, []);\n\n    const promptForCameraPermissions = React.useCallback(async () => {\n      const permission = await Camera.requestCameraPermission();\n      Camera.getCameraPermissionStatus().then(setCameraPermission);\n\n      if (permission === "denied") await Linking.openSettings();\n    }, [cameraPermission]);\n\n    if (cameraPermission == null) {\n      // still loading\n      return null;\n    }\n\n    return (\n      <Screen contentContainerStyle={$container}>\n        <View>\n          <Text>\n            Camera Permission:{" "}\n            {cameraPermission === null ? "Loading..." : cameraPermission}\n          </Text>\n          {cameraPermission !== "granted" && (\n            <Button\n              onPress={promptForCameraPermissions}\n              text="Request Camera Permission"\n            />\n          )}\n        </View>\n      </Screen>\n    );\n  }\n);\n\nconst $container: ViewStyle = {\n  flex: 1,\n  padding: 20,\n  justifyContent: "space-evenly",\n};\n'})}),"\n",(0,o.jsxs)(t,{children:[(0,o.jsx)("summary",{children:"Demo Preview"}),(0,o.jsx)("img",{src:"https://github.com/frankcalise/CookbookVisionCamera/assets/374022/cbbae841-3b45-44ee-87dd-5bca69b5980b",width:"320",height:"240"})]}),"\n",(0,o.jsx)(n.h2,{id:"codes-store--screen",children:"Codes Store & Screen"}),"\n",(0,o.jsx)(n.p,{children:"Before we get to displaying the camera for scanning, let's quickly set up a new store in MST for keeping our list of codes and a screen to view them. Generate the commands using the Ignite CLI:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npx ignite-cli@next g model CodeStore\nnpx ignite-cli@next g screen Codes\n"})}),"\n",(0,o.jsxs)(n.p,{children:["If you're not familiar with generators, head on over to the ",(0,o.jsx)(n.a,{href:"https://docs.infinite.red/ignite/concept/generators",children:"Ignite Generators"})," documentation to learn more!"]}),"\n",(0,o.jsxs)(n.p,{children:["Open the generated ",(0,o.jsx)(n.code,{children:"models/CodeStore.ts"}),". Our Code Store will just have a simple string array and an action to add a new code:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";\nimport { withSetPropAction } from "./helpers/withSetPropAction";\n\n/**\n * Model description here for TypeScript hints.\n */\nexport const CodeStoreModel = types\n  .model("CodeStore")\n  .props({\n    codes: types.array(types.string),\n  })\n  .actions(withSetPropAction)\n  .actions((self) => ({\n    addCode(code: string) {\n      self.codes.push(code);\n    },\n  }));\n\nexport interface CodeStore extends Instance<typeof CodeStoreModel> {}\nexport interface CodeStoreSnapshotOut\n  extends SnapshotOut<typeof CodeStoreModel> {}\nexport interface CodeStoreSnapshotIn\n  extends SnapshotIn<typeof CodeStoreModel> {}\nexport const createCodeStoreDefaultModel = () =>\n  types.optional(CodeStoreModel, {});\n'})}),"\n",(0,o.jsxs)(n.p,{children:["Next we'll utilize this store on our ",(0,o.jsx)(n.code,{children:"screens/CodesScreen.tsx"}),". This will just list all of the previously scanned codes and a way to get back to the main screen:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import React, { FC } from "react";\nimport { observer } from "mobx-react-lite";\nimport { View, ViewStyle } from "react-native";\nimport { AppStackScreenProps } from "app/navigators";\nimport { Button, Screen, Text } from "app/components";\nimport { useNavigation } from "@react-navigation/native";\nimport { useStores } from "app/models";\nimport { spacing } from "app/theme";\n\ninterface CodesScreenProps extends AppStackScreenProps<"Codes"> {}\n\nexport const CodesScreen: FC<CodesScreenProps> = observer(\n  function CodesScreen() {\n    // Pull in one of our MST stores\n    const { codeStore } = useStores();\n\n    // Pull in navigation via hook\n    const navigation = useNavigation();\n    return (\n      <Screen\n        safeAreaEdges={["top", "bottom"]}\n        style={$root}\n        preset="scroll"\n        contentContainerStyle={$container}\n      >\n        <View>\n          <Text text={`${codeStore.codes.length} codes scanned`} />\n\n          {codeStore.codes.map((code, index) => (\n            <Text key={`code-index-${index}`} text={code} />\n          ))}\n        </View>\n\n        <Button text="Go back" onPress={() => navigation.goBack()} />\n      </Screen>\n    );\n  }\n);\n\nconst $root: ViewStyle = {\n  flex: 1,\n};\n\nconst $container: ViewStyle = {\n  flex: 1,\n  justifyContent: "space-between",\n  paddingHorizontal: spacing.md,\n};\n'})}),"\n",(0,o.jsx)(n.h2,{id:"displaying-the-camera",children:"Displaying the Camera"}),"\n",(0,o.jsxs)(n.p,{children:["We have the dough prepped, we added the sauce - now it's time for the pizza toppings! Back in ",(0,o.jsx)(n.code,{children:"screens/Welcome.tsx"}),", we'll begin adding more of the camera code by adding the ",(0,o.jsx)(n.code,{children:"Camera"})," component and wire it up to the ",(0,o.jsx)(n.code,{children:"useCodeScanner"})," hook, both of which are provided by ",(0,o.jsx)(n.code,{children:"react-native-vision-camera"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import { observer } from "mobx-react-lite";\nimport React, { FC } from "react";\nimport { AppStackScreenProps } from "../navigators";\n// success-line-start\nimport {\n  Camera,\n  CameraPermissionStatus,\n  useCameraDevice,\n  useCodeScanner,\n} from "react-native-vision-camera";\nimport {\n  Alert,\n  Linking,\n  StyleSheet,\n  TouchableOpacity,\n  View,\n  ViewStyle,\n} from "react-native";\nimport { Button, Icon, Screen, Text } from "app/components";\nimport { useSafeAreaInsets } from "react-native-safe-area-context";\nimport { useStores } from "app/models";\nimport { spacing } from "app/theme";\n// success-line-end\n\ninterface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}\n\nexport const WelcomeScreen: FC<WelcomeScreenProps> = observer(\n  function WelcomeScreen(_props) {\n    const [cameraPermission, setCameraPermission] =\n      React.useState<CameraPermissionStatus>();\n    // success-line-start\n    const [showScanner, setShowScanner] = React.useState(false);\n    const [isActive, setIsActive] = React.useState(false);\n\n    const { codeStore } = useStores();\n    // success-line-end\n\n    React.useEffect(() => {\n      Camera.getCameraPermissionStatus().then(setCameraPermission);\n    }, []);\n\n    const promptForCameraPermissions = React.useCallback(async () => {\n      const permission = await Camera.requestCameraPermission();\n      Camera.getCameraPermissionStatus().then(setCameraPermission);\n\n      if (permission === "denied") await Linking.openSettings();\n    }, [cameraPermission]);\n\n    // success-line-start\n    const codeScanner = useCodeScanner({\n      codeTypes: ["qr", "ean-13"],\n      onCodeScanned: (codes) => {\n        setIsActive(false);\n\n        codes.every((code) => {\n          if (code.value) {\n            codeStore.addCode(code.value);\n          }\n          return true;\n        });\n\n        setShowScanner(false);\n        Alert.alert("Code scanned!");\n      },\n    });\n\n    const device = useCameraDevice("back");\n\n    const { right, top } = useSafeAreaInsets();\n    // success-line-end\n\n    if (cameraPermission == null) {\n      // still loading\n      return null;\n    }\n\n    // success-line-start\n    if (showScanner && device) {\n      return (\n        <View style={$cameraContainer}>\n          <Camera\n            isActive={isActive}\n            device={device}\n            codeScanner={codeScanner}\n            style={StyleSheet.absoluteFill}\n            photo\n            video\n          />\n          <View\n            style={[\n              $cameraButtons,\n              { right: right + spacing.md, top: top + spacing.md },\n            ]}\n          >\n            <TouchableOpacity\n              style={$closeCamera}\n              onPress={() => setShowScanner(false)}\n            >\n              <Icon icon="x" size={50} />\n            </TouchableOpacity>\n          </View>\n        </View>\n      );\n    }\n    // success-line-end\n\n    return (\n      <Screen contentContainerStyle={$container}>\n        <View>\n          <Text>\n            Camera Permission:{" "}\n            {cameraPermission === null ? "Loading..." : cameraPermission}\n          </Text>\n          {cameraPermission !== "granted" && (\n            <Button\n              onPress={promptForCameraPermissions}\n              text="Request Camera Permission"\n            />\n          )}\n        </View>\n        // success-line-start\n        <View>\n          <Button\n            onPress={() => {\n              setIsActive(true);\n              setShowScanner(true);\n            }}\n            text="Scan Barcodes"\n          />\n        </View>\n        <View>\n          <Button\n            onPress={() => _props.navigation.navigate("Codes")}\n            text={`View Scans (${codeStore.codes.length})`}\n          />\n          // success-line-end\n        </View>\n      </Screen>\n    );\n  }\n);\n\nconst $container: ViewStyle = {\n  flex: 1,\n  padding: 20,\n  justifyContent: "space-evenly",\n};\n\n// success-line-start\nconst $cameraContainer: ViewStyle = {\n  flex: 1,\n};\n\nconst $cameraButtons: ViewStyle = {\n  position: "absolute",\n};\n\nconst $closeCamera: ViewStyle = {\n  marginBottom: spacing.md,\n  width: 100,\n  height: 100,\n  borderRadius: 100 / 2,\n  backgroundColor: "rgba(140, 140, 140, 0.3)",\n  justifyContent: "center",\n  alignItems: "center",\n};\n// success-line-end\n'})}),"\n",(0,o.jsx)(n.p,{children:"And that's everything! Check out the Demo Preview to see it in action."}),"\n",(0,o.jsxs)(t,{children:[(0,o.jsx)("summary",{children:"Demo Preview"}),(0,o.jsx)("video",{width:"320",height:"240",controls:!0,children:(0,o.jsx)("source",{src:"https://github.com/frankcalise/CookbookVisionCamera/assets/374022/93a732bf-f6a4-4a7f-8a65-24e6af101a90",type:"video/mp4"})})]})]})}function p(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},2172:(e,n,t)=>{t.d(n,{I:()=>r,M:()=>s});var o=t(1504);const i={},a=o.createContext(i);function s(e){const n=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(a.Provider,{value:n},e.children)}}}]);