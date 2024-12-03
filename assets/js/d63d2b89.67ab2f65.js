"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[5276],{6960:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>l,metadata:()=>r,toc:()=>d});var s=t(7624),o=t(2172),i=t(2180);const l={title:"SelectField using `react-native-bottom-sheet`",description:"Extending Ignite's TextField to be used as a SelectField with react-native-bottom-sheet",tags:["TextField","SelectField","UI"],last_update:{author:"Yulian Glukhenko"},publish_date:new Date("2023-02-15T00:00:00.000Z")},a="SelectField using react-native-bottom-sheet",r={id:"recipes/SelectFieldWithBottomSheet",title:"SelectField using `react-native-bottom-sheet`",description:"Extending Ignite's TextField to be used as a SelectField with react-native-bottom-sheet",source:"@site/docs/recipes/SelectFieldWithBottomSheet.mdx",sourceDirName:"recipes",slug:"/recipes/SelectFieldWithBottomSheet",permalink:"/docs/recipes/SelectFieldWithBottomSheet",draft:!1,unlisted:!1,tags:[{label:"TextField",permalink:"/docs/tags/text-field"},{label:"SelectField",permalink:"/docs/tags/select-field"},{label:"UI",permalink:"/docs/tags/ui"}],version:"current",lastUpdatedBy:"Yulian Glukhenko",lastUpdatedAt:1728940271,formattedLastUpdatedAt:"Oct 14, 2024",frontMatter:{title:"SelectField using `react-native-bottom-sheet`",description:"Extending Ignite's TextField to be used as a SelectField with react-native-bottom-sheet",tags:["TextField","SelectField","UI"],last_update:{author:"Yulian Glukhenko"},publish_date:"2023-02-15T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Sample YAML for CircleCi for Ignite",permalink:"/docs/recipes/SampleYAMLCircleCI"},next:{title:"Switch Between Expo Go and Expo CNG",permalink:"/docs/recipes/SwitchBetweenExpoGoCNG"}},c={},d=[{value:"1. Installation",id:"1-installation",level:2},{value:"2. Create the <code>SelectField.tsx</code> Component File",id:"2-create-the-selectfieldtsx-component-file",level:2},{value:"3. Add New Props and Customize the TextField",id:"3-add-new-props-and-customize-the-textfield",level:2},{value:"Add a Caret Icon Accessory",id:"add-a-caret-icon-accessory",level:3},{value:"Add Props",id:"add-props",level:3},{value:"Add Logic to Display Selected Options",id:"add-logic-to-display-selected-options",level:3},{value:"Full Code For This Step",id:"full-code-for-this-step",level:3},{value:"4. Add the Sheet Components",id:"4-add-the-sheet-components",level:2},{value:"Add the <code>BottomSheetModalProvider</code>",id:"add-the-bottomsheetmodalprovider",level:3},{value:"Add the Necessary Components to <code>SelectField</code>",id:"add-the-necessary-components-to-selectfield",level:3},{value:"5. Add Selected State to Options and Hook Up Callback",id:"5-add-selected-state-to-options-and-hook-up-callback",level:2}];function p(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",p:"p",pre:"pre",...(0,o.M)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"selectfield-using-react-native-bottom-sheet",children:["SelectField using ",(0,s.jsx)(n.code,{children:"react-native-bottom-sheet"})]}),"\n",(0,s.jsxs)(n.p,{children:["In this guide, we'll be creating a ",(0,s.jsx)(n.code,{children:"SelectField"})," component by extending the ",(0,s.jsx)(n.code,{children:"TextField"})," with a scrollable options View and additional props to handle its customization."]}),"\n",(0,s.jsx)(i.c,{width:"100%",controls:!0,url:"https://user-images.githubusercontent.com/1775841/219038677-bcc9c61d-1776-4aad-bb50-1e932721bc04.mp4"}),"\n",(0,s.jsxs)(n.p,{children:["We will be using the ",(0,s.jsx)(n.a,{href:"https://gorhom.github.io/react-native-bottom-sheet/",children:(0,s.jsx)(n.code,{children:"react-native-bottom-sheet"})})," library for the options list, the ",(0,s.jsx)(n.code,{children:"ListItem"})," component for displaying individual options, and the ",(0,s.jsx)(n.code,{children:"TextField"})," component for opening the options list and displaying selected options."]}),"\n",(0,s.jsxs)(n.p,{children:["There are many ways you can setup ",(0,s.jsx)(n.code,{children:"react-native-bottom-sheet"})," to function as a ",(0,s.jsx)(n.code,{children:"Picker"}),". We'll keep it simple - pressing the ",(0,s.jsx)(n.code,{children:"TextField"})," will open the options-list. Pressing the option(s) will update the value via callback. You can customize this to fit your usecase."]}),"\n",(0,s.jsx)(n.h2,{id:"1-installation",children:"1. Installation"}),"\n",(0,s.jsxs)(n.p,{children:["Let's start by installing the necessary dependencies. You can see complete installation instructions for ",(0,s.jsx)(n.code,{children:"react-native-bottom-sheet"})," ",(0,s.jsx)(n.a,{href:"https://gorhom.github.io/react-native-bottom-sheet/",children:"here"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn add @gorhom/bottom-sheet@^4\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The library requires the ",(0,s.jsx)(n.code,{children:"react-native-gesture-handler"})," and ",(0,s.jsx)(n.code,{children:"react-native-reanimated"})," dependencies, but if you're using a newer Ignite boilerplate version, those should already be installed. Just check your ",(0,s.jsx)(n.code,{children:"package.json"})," file and if you don't see them, follow these steps:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn add react-native-reanimated react-native-gesture-handler\n# or\nexpo install react-native-reanimated react-native-gesture-handler\n"})}),"\n",(0,s.jsxs)(n.h2,{id:"2-create-the-selectfieldtsx-component-file",children:["2. Create the ",(0,s.jsx)(n.code,{children:"SelectField.tsx"})," Component File"]}),"\n",(0,s.jsxs)(n.p,{children:["Instead of extending the ",(0,s.jsx)(n.code,{children:"TextField"})," component with more props and functionality, we'll be creating a wrapper for the ",(0,s.jsx)(n.code,{children:"TextField"})," component that contains additional functionality."]}),"\n",(0,s.jsx)(n.p,{children:"We'll start by creating a new file in the components directory."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"touch ./app/components/SelectField.tsx\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Let's add some preliminary code to the file. Since the ",(0,s.jsx)(n.code,{children:"TextInput"})," has its own touch handlers for focus, we'll want to disable that by wrapping it in a ",(0,s.jsx)(n.code,{children:"View"})," with no pointer-events. The new ",(0,s.jsx)(n.code,{children:"TouchableOpacity"})," will trigger our options sheet."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import React, { forwardRef, Ref, useImperativeHandle } from "react";\nimport { View, TouchableOpacity } from "react-native";\nimport { TextField, TextFieldProps } from "./TextField";\n\nexport interface SelectFieldProps\n  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange" | "value"> {}\nexport interface SelectFieldRef {}\n\nexport const SelectField = forwardRef(function SelectField(\n  props: SelectFieldProps,\n  ref: Ref<SelectFieldRef>\n) {\n  const { ...TextFieldProps } = props;\n\n  const disabled = TextFieldProps.editable === false || TextFieldProps.status === "disabled";\n\n  useImperativeHandle(ref, () => ({}));\n\n  return (\n    <>\n      <TouchableOpacity activeOpacity={1}>\n        <View pointerEvents="none">\n          <TextField {...TextFieldProps} />\n        </View>\n      </TouchableOpacity>\n    </>\n  );\n});\n'})}),"\n",(0,s.jsxs)(t,{children:[(0,s.jsx)("summary",{children:"Demo Preview"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import { SelectField } from "../components/SelectField";\n\nfunction FavoriteNBATeamsScreen() {\n  return (\n    <SelectField\n      label="NBA Team(s)"\n      helper="Select your team(s)"\n      placeholder="e.g. Trail Blazers"\n    />\n  );\n}\n'})}),(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:"https://user-images.githubusercontent.com/1775841/219003766-5331678b-a5b9-42fb-b393-3851bf2ebeaf.jpg",alt:"yulolimum-capture-2023-02-15--02-34-52"})})]}),"\n",(0,s.jsx)(n.h2,{id:"3-add-new-props-and-customize-the-textfield",children:"3. Add New Props and Customize the TextField"}),"\n",(0,s.jsxs)(n.p,{children:["Now, we can start modifying the code we added in the previous step to support multiple options as well as making the ",(0,s.jsx)(n.code,{children:"TextField"})," ",(0,s.jsx)(n.em,{children:"look"})," like a ",(0,s.jsx)(n.code,{children:"SelectField"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"add-a-caret-icon-accessory",children:"Add a Caret Icon Accessory"}),"\n",(0,s.jsxs)(n.p,{children:["Let's add an accessory to the input to make it look like a ",(0,s.jsx)(n.code,{children:"SelectField"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'<TextField\n  {...TextFieldProps}\n  RightAccessory={(props) => <Icon icon="caretRight" containerStyle={props.style} />}\n/>\n'})}),"\n",(0,s.jsx)(n.h3,{id:"add-props",children:"Add Props"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"options"})," prop can be any structure that you want (e.g. flat array of values, object where the key is the option value and the value is the label, etc). For our ",(0,s.jsx)(n.code,{children:"SelectField"})," guide, we'll be doing an array of objects."]}),"\n",(0,s.jsx)(n.p,{children:"We will support multi-select (by default) as well as a single select."}),"\n",(0,s.jsxs)(n.p,{children:["We will override the ",(0,s.jsx)(n.code,{children:"value"})," prop."]}),"\n",(0,s.jsxs)(n.p,{children:["A new ",(0,s.jsx)(n.code,{children:"renderValue"})," prop can be used to format and display a custom text value. This can be useful when the ",(0,s.jsx)(n.code,{children:"TextField"})," is not multiline, but your ",(0,s.jsx)(n.code,{children:"SelectField"})," is."]}),"\n",(0,s.jsxs)(n.p,{children:["Additionally, we'll add a new event callback called ",(0,s.jsx)(n.code,{children:"onSelect"})," since that makes more sense for a ",(0,s.jsx)(n.code,{children:"SelectField"}),". However, feel free to override ",(0,s.jsx)(n.code,{children:"TextField"}),"'s ",(0,s.jsx)(n.code,{children:"onChange"})," if you prefer."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'export interface SelectFieldProps\n  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange"> {\n  value?: string[];\n  renderValue?: (value: string[]) => string;\n  onSelect?: (newValue: string[]) => void;\n  multiple?: boolean;\n  options: { label: string; value: string }[];\n}\n\n// ...\n\nconst {\n  value = [],\n  renderValue,\n  onSelect,\n  options = [],\n  multiple = true,\n  ...TextFieldProps\n} = props;\n'})}),"\n",(0,s.jsx)(n.h3,{id:"add-logic-to-display-selected-options",children:"Add Logic to Display Selected Options"}),"\n",(0,s.jsxs)(n.p,{children:["We'll add some code to display the selected options inside the ",(0,s.jsx)(n.code,{children:"TextField"}),". This will attempt to use the ",(0,s.jsx)(n.code,{children:"renderValue"})," formatter function and fallback to a joined string."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'const valueString =\n  renderValue?.(value) ??\n  value\n    .map((v) => options.find((o) => o.value === v)?.label)\n    .filter(Boolean)\n    .join(", ");\n'})}),"\n",(0,s.jsx)(n.h3,{id:"full-code-for-this-step",children:"Full Code For This Step"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import React, { forwardRef, Ref, useImperativeHandle } from "react";\nimport { TouchableOpacity, View } from "react-native";\n// success-line\nimport { Icon } from "./Icon";\nimport { TextField, TextFieldProps } from "./TextField";\n\nexport interface SelectFieldProps\n  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange" | "value"> {\n  // success-line-start\n  value?: string[];\n  renderValue?: (value: string[]) => string;\n  onSelect?: (newValue: string[]) => void;\n  multiple?: boolean;\n  options: { label: string; value: string }[];\n  // success-line-end\n}\nexport interface SelectFieldRef {}\n\nexport const SelectField = forwardRef(function SelectField(\n  props: SelectFieldProps,\n  ref: Ref<SelectFieldRef>\n) {\n  const {\n    // success-line-start\n    value = [],\n    onSelect,\n    renderValue,\n    options = [],\n    multiple = true,\n    // success-line-end\n    ...TextFieldProps\n  } = props;\n\n  const disabled = TextFieldProps.editable === false || TextFieldProps.status === "disabled";\n\n  useImperativeHandle(ref, () => ({}));\n\n  // success-line-start\n  const valueString =\n    renderValue?.(value) ??\n    value\n      .map((v) => options.find((o) => o.value === v)?.label)\n      .filter(Boolean)\n      .join(", ");\n  // success-line-end\n\n  return (\n    <>\n      <TouchableOpacity activeOpacity={1}>\n        <View pointerEvents="none">\n          <TextField\n            {...TextFieldProps}\n            // success-line-start\n            value={valueString}\n            RightAccessory={(props) => <Icon icon="caretRight" containerStyle={props.style} />}\n            // success-line-end\n          />\n        </View>\n      </TouchableOpacity>\n    </>\n  );\n});\n'})}),"\n",(0,s.jsxs)(t,{children:[(0,s.jsx)("summary",{children:"Demo Preview"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import { SelectField } from "../components/SelectField";\n\nconst teams = [\n  { label: "Hawks", value: "ATL" },\n  { label: "Celtics", value: "BOS" },\n  // ...\n  { label: "Jazz", value: "UTA" },\n  { label: "Wizards", value: "WAS" },\n];\n\n// prettier-ignore\nfunction FavoriteNBATeamsScreen() {\n  return (\n    <>\n      <SelectField\n        label="NBA Team(s)"\n        helper="Select your team(s)"\n        placeholder="e.g. Trail Blazers"\n        value={["POR", "MEM", "NOP", "CHI", "CLE", "SAS", "MIL", "LAL", "PHX", "WAS"]}\n        options={teams}\n        containerStyle={{ marginBottom: spacing.lg }}\n      />\n\n      <SelectField\n        label="NBA Team(s)"\n        helper="Select your team(s)"\n        placeholder="e.g. Trail Blazers"\n        value={["POR", "MEM", "NOP", "CHI", "CLE", "SAS", "MIL", "LAL", "PHX", "WAS"]}\n        options={teams}\n        containerStyle={{ marginBottom: spacing.lg }}\n        multiline\n      />\n\n      <SelectField\n        label="NBA Team(s)"\n        helper="Select your team(s)"\n        placeholder="e.g. Trail Blazers"\n        value={["POR", "MEM", "NOP", "CHI", "CLE", "SAS", "MIL", "LAL", "PHX", "WAS"]}\n        options={teams}\n        containerStyle={{ marginBottom: spacing.lg }}\n        renderValue={(value) => `Selected ${value.length} Teams`}\n      />\n    </>\n  )\n}\n'})}),(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:"https://user-images.githubusercontent.com/1775841/219011088-688696b8-05a6-43e8-8e9b-43578320d70a.jpg",alt:"yulolimum-capture-2023-02-15--03-07-33"})})]}),"\n",(0,s.jsx)(n.h2,{id:"4-add-the-sheet-components",children:"4. Add the Sheet Components"}),"\n",(0,s.jsxs)(n.p,{children:["In this step, we'll be adding the ",(0,s.jsx)(n.code,{children:"BottomSheetModal"})," and related components and setting up the touch-events to show/hide it."]}),"\n",(0,s.jsxs)(n.h3,{id:"add-the-bottomsheetmodalprovider",children:["Add the ",(0,s.jsx)(n.code,{children:"BottomSheetModalProvider"})]}),"\n",(0,s.jsxs)(n.p,{children:["Since we will be using the ",(0,s.jsx)(n.code,{children:"BottomSheetModal"})," component instead of ",(0,s.jsx)(n.code,{children:"BottomSheet"}),", we will need to add a provider to your entry file."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",metastring:'title="./app/app.tsx"',children:'//...\n// success-line\nimport { BottomSheetModalProvider } from "@gorhom/bottom-sheet";\n\n//...\n\nreturn (\n  <SafeAreaProvider initialMetrics={initialWindowMetrics}>\n    <ErrorBoundary catchErrors={Config.catchErrors}>\n      // success-line\n      <BottomSheetModalProvider>\n        <AppNavigator\n          linking={linking}\n          initialState={initialNavigationState}\n          onStateChange={onNavigationStateChange}\n        />\n        // success-line\n      </BottomSheetModalProvider>\n    </ErrorBoundary>\n  </SafeAreaProvider>\n);\n\n//...\n'})}),"\n",(0,s.jsxs)(n.h3,{id:"add-the-necessary-components-to-selectfield",children:["Add the Necessary Components to ",(0,s.jsx)(n.code,{children:"SelectField"})]}),"\n",(0,s.jsx)(n.p,{children:"Now we will add the UI components that will display our options. This will be a basic example and can be customized as needed."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'// success-line-start\nimport {\n  BottomSheetBackdrop,\n  BottomSheetFlatList,\n  BottomSheetFooter,\n  BottomSheetModal,\n} from "@gorhom/bottom-sheet";\n// success-line-end\nimport React, { forwardRef, Ref, useImperativeHandle, useRef } from "react";\nimport { TouchableOpacity, View, ViewStyle } from "react-native";\nimport type { ThemedStyle } from "app/theme";\nimport { useAppTheme } from "app/utils/useAppTheme";\n// success-line\nimport { useSafeAreaInsets } from "react-native-safe-area-context";\n// success-line\nimport { spacing } from "../theme";\n// success-line\nimport { Button } from "./Button";\nimport { Icon } from "./Icon";\n// success-line\nimport { ListItem } from "./ListItem";\nimport { TextField, TextFieldProps } from "./TextField";\n\nexport interface SelectFieldProps\n  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange" | "value"> {\n  value?: string[];\n  renderValue?: (value: string[]) => string;\n  onSelect?: (newValue: string[]) => void;\n  multiple?: boolean;\n  options: { label: string; value: string }[];\n}\nexport interface SelectFieldRef {\n  // success-line-start\n  presentOptions: () => void;\n  dismissOptions: () => void;\n  // success-line-end\n}\n\nexport const SelectField = forwardRef(function SelectField(\n  props: SelectFieldProps,\n  ref: Ref<SelectFieldRef>\n) {\n  const {\n    value = [],\n    onSelect,\n    renderValue,\n    options = [],\n    multiple = true,\n    ...TextFieldProps\n  } = props;\n  // success-line-start\n  const sheet = useRef<BottomSheetModal>(null);\n  const { bottom } = useSafeAreaInsets();\n  // success-line-end\n\n  const { themed } = useAppTheme();\n\n  const disabled = TextFieldProps.editable === false || TextFieldProps.status === "disabled";\n\n  // success-line\n  useImperativeHandle(ref, () => ({ presentOptions, dismissOptions }));\n\n  const valueString =\n    renderValue?.(value) ??\n    value\n      .map((v) => options.find((o) => o.value === v)?.label)\n      .filter(Boolean)\n      .join(", ");\n\n  // success-line-start\n  function presentOptions() {\n    if (disabled) return;\n    sheet.current?.present();\n  }\n\n  function dismissOptions() {\n    sheet.current?.dismiss();\n  }\n  // success-line-end\n\n  return (\n    <>\n      <TouchableOpacity\n        activeOpacity={1}\n        // success-line\n        onPress={presentOptions}\n      >\n        <View pointerEvents="none">\n          <TextField\n            {...TextFieldProps}\n            value={valueString}\n            RightAccessory={(props) => <Icon icon="caretRight" containerStyle={props.style} />}\n          />\n        </View>\n      </TouchableOpacity>\n\n      {/* success-line-start */}\n      <BottomSheetModal\n        ref={sheet}\n        snapPoints={["50%"]}\n        stackBehavior="replace"\n        enableDismissOnClose\n        backdropComponent={(props) => (\n          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />\n        )}\n        footerComponent={\n          !multiple\n            ? undefined\n            : (props) => (\n                <BottomSheetFooter\n                  {...props}\n                  style={themed($bottomSheetFooter)}\n                  bottomInset={bottom}\n                >\n                  <Button text="Dismiss" preset="reversed" onPress={dismissOptions} />\n                </BottomSheetFooter>\n              )\n        }\n      >\n        <BottomSheetFlatList\n          style={{ marginBottom: bottom + (multiple ? spacing.xl * 2 : 0) }}\n          data={options}\n          keyExtractor={(o) => o.value}\n          renderItem={({ item, index }) => (\n            <ListItem text={item.label} topSeparator={index !== 0} style={themed($listItem)} />\n          )}\n        />\n      </BottomSheetModal>\n      {/* success-line-end */}\n    </>\n  );\n});\n\n// success-line-start\nconst $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({\n  paddingHorizontal: spacing.lg,\n  paddingBottom: spacing.xs,\n});\n\nconst $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({\n  paddingHorizontal: spacing.lg,\n});\n// success-line-end\n'})}),"\n",(0,s.jsxs)(t,{children:[(0,s.jsx)("summary",{children:"Demo Preview"}),(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:"https://user-images.githubusercontent.com/1775841/219029547-3c92dbdc-5f04-4f02-a82e-0af9392af6ad.gif",alt:"yulolimum-capture-2023-02-15--04-38-11"})})]}),"\n",(0,s.jsx)(n.h2,{id:"5-add-selected-state-to-options-and-hook-up-callback",children:"5. Add Selected State to Options and Hook Up Callback"}),"\n",(0,s.jsx)(n.p,{children:"The last step is to add the selected state to our options inside the sheet as well as hook up the callback to change the value."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import {\n  BottomSheetBackdrop,\n  BottomSheetFlatList,\n  BottomSheetFooter,\n  BottomSheetModal,\n} from "@gorhom/bottom-sheet";\nimport React, { forwardRef, Ref, useImperativeHandle, useRef } from "react";\nimport { TouchableOpacity, View, ViewStyle } from "react-native";\nimport { useSafeAreaInsets } from "react-native-safe-area-context";\nimport type { ThemedStyle } from "app/theme";\nimport { useAppTheme } from "app/utils/useAppTheme";\nimport { Button } from "./Button";\nimport { Icon } from "./Icon";\nimport { ListItem } from "./ListItem";\nimport { TextField, TextFieldProps } from "./TextField";\n\nexport interface SelectFieldProps\n  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange" | "value"> {\n  value?: string[];\n  renderValue?: (value: string[]) => string;\n  onSelect?: (newValue: string[]) => void;\n  multiple?: boolean;\n  options: { label: string; value: string }[];\n}\nexport interface SelectFieldRef {\n  presentOptions: () => void;\n  dismissOptions: () => void;\n}\n\n// success-line-start\nfunction without<T>(array: T[], value: T) {\n  return array.filter((v) => v !== value);\n}\n// success-line-end\n\nexport const SelectField = forwardRef(function SelectField(\n  props: SelectFieldProps,\n  ref: Ref<SelectFieldRef>\n) {\n  const {\n    value = [],\n    onSelect,\n    renderValue,\n    options = [],\n    multiple = true,\n    ...TextFieldProps\n  } = props;\n  const sheet = useRef<BottomSheetModal>(null);\n  const { bottom } = useSafeAreaInsets();\n  const {\n    themed,\n    // success-line-start\n    theme: { colors },\n    // success-line-end\n  } = useAppTheme();\n\n  const disabled = TextFieldProps.editable === false || TextFieldProps.status === "disabled";\n\n  useImperativeHandle(ref, () => ({ presentOptions, dismissOptions }));\n\n  const valueString =\n    renderValue?.(value) ??\n    value\n      .map((v) => options.find((o) => o.value === v)?.label)\n      .filter(Boolean)\n      .join(", ");\n\n  function presentOptions() {\n    if (disabled) return;\n\n    sheet.current?.present();\n  }\n\n  function dismissOptions() {\n    sheet.current?.dismiss();\n  }\n\n  // success-line-start\n  function updateValue(optionValue: string) {\n    if (value.includes(optionValue)) {\n      onSelect?.(multiple ? without(value, optionValue) : []);\n    } else {\n      onSelect?.(multiple ? [...value, optionValue] : [optionValue]);\n      if (!multiple) dismissOptions();\n    }\n  }\n  // success-line-end\n\n  return (\n    <>\n      <TouchableOpacity activeOpacity={1} onPress={presentOptions}>\n        <View pointerEvents="none">\n          <TextField\n            {...TextFieldProps}\n            value={valueString}\n            RightAccessory={(props) => <Icon icon="caretRight" containerStyle={props.style} />}\n          />\n        </View>\n      </TouchableOpacity>\n\n      <BottomSheetModal\n        ref={sheet}\n        snapPoints={["50%"]}\n        stackBehavior="replace"\n        enableDismissOnClose\n        backdropComponent={(props) => (\n          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />\n        )}\n        footerComponent={\n          !multiple\n            ? undefined\n            : (props) => (\n                <BottomSheetFooter\n                  {...props}\n                  style={themed($bottomSheetFooter)}\n                  bottomInset={bottom}\n                >\n                  <Button text="Dismiss" preset="reversed" onPress={dismissOptions} />\n                </BottomSheetFooter>\n              )\n        }\n      >\n        <BottomSheetFlatList\n          style={{ marginBottom: bottom + (multiple ? spacing.xl * 2 : 0) }}\n          data={options}\n          keyExtractor={(o) => o.value}\n          renderItem={({ item, index }) => (\n            <ListItem\n              text={item.label}\n              topSeparator={index !== 0}\n              style={themed($listItem)}\n              // success-line-start\n              rightIcon={value.includes(item.value) ? "check" : undefined}\n              rightIconColor={colors.palette.angry500}\n              onPress={() => updateValue(item.value)}\n              // success-line-end\n            />\n          )}\n        />\n      </BottomSheetModal>\n    </>\n  );\n});\n\nconst $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({\n  paddingHorizontal: spacing.lg,\n  paddingBottom: spacing.xs,\n});\n\nconst $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({\n  paddingHorizontal: spacing.lg,\n});\n'})}),"\n",(0,s.jsx)(n.p,{children:"And we're done!"}),"\n",(0,s.jsxs)(t,{children:[(0,s.jsx)("summary",{children:"Demo Preview"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import { SelectField } from "../components/SelectField";\n\nconst teams = [\n  { label: "Hawks", value: "ATL" },\n  { label: "Celtics", value: "BOS" },\n  // ...\n  { label: "Jazz", value: "UTA" },\n  { label: "Wizards", value: "WAS" },\n];\n\nfunction FavoriteNBATeamsScreen() {\n  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);\n  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);\n\n  return (\n    <>\n      <SelectField\n        label="NBA Team(s)"\n        helper="Select your team(s)"\n        placeholder="e.g. Knicks"\n        value={selectedTeam}\n        onSelect={setSelectedTeam}\n        options={teams}\n        multiple={false}\n        containerStyle={{ marginBottom: spacing.lg }}\n      />\n\n      <SelectField\n        label="NBA Team(s)"\n        helper="Select your team(s)"\n        placeholder="e.g. Trail Blazers"\n        value={selectedTeams}\n        onSelect={setSelectedTeams}\n        options={teams}\n        containerStyle={{ marginBottom: spacing.lg }}\n        renderValue={(value) => `Selected ${value.length} Teams`}\n      />\n    </>\n  );\n}\n'})}),(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:"https://user-images.githubusercontent.com/1775841/219036892-e7e38288-b859-487d-b51a-ca67f91c83ff.gif",alt:"yulolimum-capture-2023-02-15--05-11-11"})})]})]})}function h(e={}){const{wrapper:n}={...(0,o.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}}}]);