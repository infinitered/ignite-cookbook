"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[5708],{3356:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var s=n(7624),o=n(2172);const i={title:"Zustand",description:"How to migrate a Mobx-State-Tree project to Zustand",tags:["Zustand","MobX","State Management"],last_update:{author:"Justin Poliachik"},publish_date:new Date("2024-02-05T00:00:00.000Z")},a="Zustand",r={id:"recipes/Zustand",title:"Zustand",description:"How to migrate a Mobx-State-Tree project to Zustand",source:"@site/docs/recipes/Zustand.md",sourceDirName:"recipes",slug:"/recipes/Zustand",permalink:"/docs/recipes/Zustand",draft:!1,unlisted:!1,tags:[{label:"Zustand",permalink:"/docs/tags/zustand"},{label:"MobX",permalink:"/docs/tags/mob-x"},{label:"State Management",permalink:"/docs/tags/state-management"}],version:"current",lastUpdatedBy:"Justin Poliachik",lastUpdatedAt:1731687461,formattedLastUpdatedAt:"Nov 15, 2024",frontMatter:{title:"Zustand",description:"How to migrate a Mobx-State-Tree project to Zustand",tags:["Zustand","MobX","State Management"],last_update:{author:"Justin Poliachik"},publish_date:"2024-02-05T00:00:00.000Z"},sidebar:"mainSidebar",previous:{title:"Using Screen Readers",permalink:"/docs/recipes/UsingScreenReaders"},next:{title:"Overview",permalink:"/docs/communityRecipes/"}},d={},l=[{value:"Convert MobX-State-Tree Models to Zustand",id:"convert-mobx-state-tree-models-to-zustand",level:2},{value:"Remove MobX-State-Tree",id:"remove-mobx-state-tree",level:2},{value:"Create Store",id:"create-store",level:2},{value:"Use Zustand in Components",id:"use-zustand-in-components",level:2},{value:"Persist Zustand Store",id:"persist-zustand-store",level:2}];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.M)(),...e.components},{Details:n}=t;return n||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"zustand",children:"Zustand"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://github.com/pmndrs/zustand",children:"Zustand"}),' is a "bearbones" state management solution (hence the cute bear mascot).\nIts a relatively simple and unopinionated option to manage application state, with a hooks-based API for easy use in a React app.']}),"\n",(0,s.jsx)(t.p,{children:"This guide will show you how to migrate a MobX-State-Tree project (Ignite's default) to Zustand, using a new Ignite project as an example:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"npx ignite-cli new ZustandApp --yes\n"})}),"\n",(0,s.jsx)(t.p,{children:"If you are converting an existing project these steps still apply, but you may also need to migrate other related functionality."}),"\n",(0,s.jsxs)(t.p,{children:["Check out the ",(0,s.jsx)(t.a,{href:"https://github.com/Jpoliachik/ignite-zustand",children:"Final Source Code"})," or follow along below!"]}),"\n",(0,s.jsx)(t.h2,{id:"convert-mobx-state-tree-models-to-zustand",children:"Convert MobX-State-Tree Models to Zustand"}),"\n",(0,s.jsxs)(t.p,{children:["Our Ignite Demo App includes a few MobX-State-Tree models inside ",(0,s.jsx)(t.code,{children:"app/models"}),". Before we remove those, let's convert them to Zustand!"]}),"\n",(0,s.jsxs)(t.p,{children:["First, add ",(0,s.jsx)(t.code,{children:"zustand"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"yarn add zustand\n"})}),"\n",(0,s.jsx)(t.p,{children:"Create a directory for our new Zustand store files:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"mkdir app/store\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.p,{children:["If you Ignited a demo-free project ",(0,s.jsx)(t.code,{children:"npx ignite-cli new ZustandApp --yes --removeDemo"})," or if you don't have any existing models to convert and you're already familiar with Zustand, feel free to ",(0,s.jsx)(t.a,{href:"#remove-mobx-state-tree",children:"skip this section"}),"."]})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.strong,{children:"AuthenticationStore"})}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"For reference, here's the original AuthenticationStore with MobX-State-Tree:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/models/AuthenticationStore.ts"',children:'import { Instance, SnapshotOut, types } from "mobx-state-tree";\n\nexport const AuthenticationStoreModel = types\n  .model("AuthenticationStore")\n  .props({\n    authToken: types.maybe(types.string),\n    authEmail: "",\n  })\n  .views((store) => ({\n    get isAuthenticated() {\n      return !!store.authToken;\n    },\n    get validationError() {\n      if (store.authEmail.length === 0) return "can\'t be blank";\n      if (store.authEmail.length < 6) return "must be at least 6 characters";\n      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(store.authEmail)) return "must be a valid email address";\n      return "";\n    },\n  }))\n  .actions((store) => ({\n    setAuthToken(value?: string) {\n      store.authToken = value;\n    },\n    setAuthEmail(value: string) {\n      store.authEmail = value.replace(/ /g, "");\n    },\n    logout() {\n      store.authToken = undefined;\n      store.authEmail = "";\n    },\n  }));\n\nexport interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}\nexport interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}\n'})})]}),"\n",(0,s.jsx)(t.p,{children:'MobX-State-Tree models declare the data type, initial values, derived values, and actions all in one.\nZustand takes a "barebones" approach and defines a store as a basic state object with data and actions co-located.'}),"\n",(0,s.jsxs)(t.p,{children:["Create a new file ",(0,s.jsx)(t.code,{children:"app/store/AuthenticationStore.ts"})," and convert the model to Zustand to look like this:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/AuthenticationStore.ts"',children:'import { StateCreator } from "zustand";\nimport { RootStore } from "./RootStore";\n\n// Typescript interface for this store slice\nexport interface AuthenticationStore {\n  authToken?: string;\n  authEmail: string;\n  setAuthToken: (value?: string) => void;\n  setAuthEmail: (value: string) => void;\n  logout: () => void;\n}\n\n// create our store slice with default data and actions\nexport const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (set) => ({\n  authToken: undefined,\n  authEmail: "",\n  setAuthToken: (value) => set({ authToken: value }),\n  setAuthEmail: (value) => set({ authEmail: value.replace(/ /g, "") }),\n  logout: () => set({ authToken: undefined, authEmail: "" }),\n});\n\n// a selector can be used to grab the full AuthenticationStore\nexport const authenticationStoreSelector = (state: RootStore) => ({\n  authToken: state.authToken,\n  authEmail: state.authEmail,\n  isAuthenticated: isAuthenticatedSelector(state),\n  setAuthToken: state.setAuthToken,\n  setAuthEmail: state.setAuthEmail,\n  logout: state.logout,\n});\n\n// selectors can also be used for derived values\nexport const isAuthenticatedSelector = (state: RootStore) => !!state.authToken;\n\nexport const validationErrorSelector = (state: RootStore) => {\n  if (state.authEmail.length === 0) return "can\'t be blank";\n  if (state.authEmail.length < 6) return "must be at least 6 characters";\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(state.authEmail)) return "must be a valid email address";\n  return "";\n};\n'})}),"\n",(0,s.jsx)(t.p,{children:"A few things to note:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["We're using the ",(0,s.jsx)(t.a,{href:"https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md",children:"slices pattern"})," to create AuthenticationStore as a slice of the overall state."]}),"\n",(0,s.jsxs)(t.li,{children:["Zustand doesn't validate data, so we need to explicitly define the Typescript interface ",(0,s.jsx)(t.code,{children:"AuthenticationStore"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["We've created several selectors for our derived values. These can be chained together, or used directly in a component via ",(0,s.jsx)(t.code,{children:"useStore(mySelector)"}),". You'll see how these are used in components later."]}),"\n",(0,s.jsx)(t.li,{children:"Zustand is very non-opinionated, so there are many different ways to achieve this! Keep this in mind if your app has different use cases, or if you'd like to experiment with alternative strategies for creating your stores."}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.strong,{children:"EpisodeStore"})}),"\n",(0,s.jsxs)(t.p,{children:["Follow the same pattern to convert ",(0,s.jsx)(t.code,{children:"app/models/EpisodeStore.ts"})]}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Original MobX-State-Tree EpisodeStore for reference:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/models/EpisodeStore.ts"',children:'import { Instance, SnapshotOut, types } from "mobx-state-tree";\nimport { api } from "../services/api";\nimport { Episode, EpisodeModel } from "./Episode";\nimport { withSetPropAction } from "./helpers/withSetPropAction";\n\nexport const EpisodeStoreModel = types\n  .model("EpisodeStore")\n  .props({\n    episodes: types.array(EpisodeModel),\n    favorites: types.array(types.reference(EpisodeModel)),\n    favoritesOnly: false,\n  })\n  .actions(withSetPropAction)\n  .actions((store) => ({\n    async fetchEpisodes() {\n      const response = await api.getEpisodes();\n      if (response.kind === "ok") {\n        store.setProp("episodes", response.episodes);\n      } else {\n        console.error(`Error fetching episodes: ${JSON.stringify(response)}`);\n      }\n    },\n    addFavorite(episode: Episode) {\n      store.favorites.push(episode);\n    },\n    removeFavorite(episode: Episode) {\n      store.favorites.remove(episode);\n    },\n  }))\n  .views((store) => ({\n    get episodesForList() {\n      return store.favoritesOnly ? store.favorites : store.episodes;\n    },\n\n    hasFavorite(episode: Episode) {\n      return store.favorites.includes(episode);\n    },\n  }))\n  .actions((store) => ({\n    toggleFavorite(episode: Episode) {\n      if (store.hasFavorite(episode)) {\n        store.removeFavorite(episode);\n      } else {\n        store.addFavorite(episode);\n      }\n    },\n  }));\n\nexport interface EpisodeStore extends Instance<typeof EpisodeStoreModel> {}\nexport interface EpisodeStoreSnapshot extends SnapshotOut<typeof EpisodeStoreModel> {}\n'})})]}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Converted EpisodeStore using Zustand:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/EpisodeStore.ts"',children:'import { api } from "../services/api";\nimport { Episode } from "./Episode";\nimport { StateCreator } from "zustand";\nimport { RootStore } from "./RootStore";\n\nexport interface EpisodeStore {\n  episodes: Episode[];\n  favorites: string[];\n  favoritesOnly: boolean;\n\n  fetchEpisodes: () => Promise<void>;\n  addFavorite: (episode: Episode) => void;\n  removeFavorite: (episode: Episode) => void;\n  toggleFavorite: (episode: Episode) => void;\n  setFavoritesOnly: (value: boolean) => void;\n}\n\nexport const createEpisodeSlice: StateCreator<RootStore, [], [], EpisodeStore> = (set, get) => ({\n  episodes: [],\n  favorites: [],\n  favoritesOnly: false,\n\n  // Zustand supports async actions\n  fetchEpisodes: async () => {\n    const response = await api.getEpisodes();\n    if (response.kind === "ok") {\n      set({ episodes: response.episodes });\n    } else {\n      console.error(`Error fetching episodes: ${JSON.stringify(response)}`);\n    }\n  },\n  addFavorite: (episode) => set((state) => ({ favorites: [...state.favorites, episode.guid] })),\n  removeFavorite: (episode) => set((state) => ({ favorites: state.favorites.filter((guid) => guid !== episode.guid) })),\n  toggleFavorite: (episode) => {\n    // get() can be used within actions\n    if (get().favorites.includes(episode.guid)) {\n      get().removeFavorite(episode);\n    } else {\n      get().addFavorite(episode);\n    }\n  },\n  setFavoritesOnly: (value: boolean) => set({ favoritesOnly: value }),\n});\n\nexport const episodeStoreSelector = (state: RootStore) => ({\n  episodes: state.episodes,\n  favorites: state.favorites,\n  favoritesOnly: state.favoritesOnly,\n\n  // derived values can be included in selectors like this\n  episodesForList: getEpisodesForList(state),\n\n  fetchEpisodes: state.fetchEpisodes,\n  addFavorite: state.addFavorite,\n  removeFavorite: state.removeFavorite,\n  toggleFavorite: state.toggleFavorite,\n  setFavoritesOnly: state.setFavoritesOnly,\n\n  // we can also include helper functions that have access to state\n  hasFavorite: (episode: Episode) => {\n    return state.favorites.includes(episode.guid);\n  },\n});\n\nexport const getEpisodesForList = (store: EpisodeStore) => {\n  return store.favoritesOnly ? store.episodes.filter((a) => store.favorites.includes(a.guid)) : store.episodes;\n};\n'})})]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.strong,{children:"Episode"})}),"\n",(0,s.jsxs)(t.p,{children:["So far, ",(0,s.jsx)(t.code,{children:"AuthenticationStore"})," and ",(0,s.jsx)(t.code,{children:"EpisodeStore"})," converted cleanly into Zustand store slices. But we also have ",(0,s.jsx)(t.code,{children:"app/models/Episode.ts"}),", which is less of a data store and more of a basic data model. We don't need a Zustand slice for ",(0,s.jsx)(t.code,{children:"Episode"}),", and Zustand is not opinionated about how data models are defined, so let's convert this into a set of Typescript types to define the data model and a few basic util functions for the derived values."]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Another very popular method is to use ",(0,s.jsx)(t.a,{href:"https://zod.dev/",children:"Zod"}),", which also enables data validation at runtime for better safety."]}),"\n"]}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Original MobX-State-Tree Episode.ts file for reference:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/models/Episode.ts"',children:'import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";\nimport { withSetPropAction } from "./helpers/withSetPropAction";\nimport { formatDate } from "../utils/formatDate";\nimport { translate } from "../i18n";\n\ninterface Enclosure {\n  link: string;\n  type: string;\n  length: number;\n  duration: number;\n  rating: { scheme: string; value: string };\n}\n\n/**\n * This represents an episode of React Native Radio.\n */\nexport const EpisodeModel = types\n  .model("Episode")\n  .props({\n    guid: types.identifier,\n    title: "",\n    pubDate: "", // Ex: 2022-08-12 21:05:36\n    link: "",\n    author: "",\n    thumbnail: "",\n    description: "",\n    content: "",\n    enclosure: types.frozen<Enclosure>(),\n    categories: types.array(types.string),\n  })\n  .actions(withSetPropAction)\n  .views((episode) => ({\n    get parsedTitleAndSubtitle() {\n      const defaultValue = { title: episode.title?.trim(), subtitle: "" };\n\n      if (!defaultValue.title) return defaultValue;\n\n      const titleMatches = defaultValue.title.match(/^(RNR.*\\d)(?: - )(.*$)/);\n\n      if (!titleMatches || titleMatches.length !== 3) return defaultValue;\n\n      return { title: titleMatches[1], subtitle: titleMatches[2] };\n    },\n    get datePublished() {\n      try {\n        const formatted = formatDate(episode.pubDate);\n        return {\n          textLabel: formatted,\n          accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {\n            date: formatted,\n          }),\n        };\n      } catch (error) {\n        return { textLabel: "", accessibilityLabel: "" };\n      }\n    },\n    get duration() {\n      const seconds = Number(episode.enclosure.duration);\n      const h = Math.floor(seconds / 3600);\n      const m = Math.floor((seconds % 3600) / 60);\n      const s = Math.floor((seconds % 3600) % 60);\n\n      const hDisplay = h > 0 ? `${h}:` : "";\n      const mDisplay = m > 0 ? `${m}:` : "";\n      const sDisplay = s > 0 ? s : "";\n      return {\n        textLabel: hDisplay + mDisplay + sDisplay,\n        accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {\n          hours: h,\n          minutes: m,\n          seconds: s,\n        }),\n      };\n    },\n  }));\n\nexport interface Episode extends Instance<typeof EpisodeModel> {}\nexport interface EpisodeSnapshotOut extends SnapshotOut<typeof EpisodeModel> {}\nexport interface EpisodeSnapshotIn extends SnapshotIn<typeof EpisodeModel> {}\n'})})]}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:(0,s.jsx)(t.p,{children:"Updated Episode.ts model using Typescript types and util functions"})}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/Episode.ts"',children:'import { formatDate } from "../utils/formatDate";\nimport { translate } from "../i18n";\n\ninterface Enclosure {\n  link: string;\n  type: string;\n  length: number;\n  duration: number;\n  rating: { scheme: string; value: string };\n}\n\nexport type Episode = {\n  guid: string;\n  title: string;\n  pubDate: string;\n  link: string;\n  author: string;\n  thumbnail: string;\n  description: string;\n  content: string;\n  enclosure: Enclosure;\n  categories: string[];\n};\n\nexport const getParsedTitleAndSubtitle = (episode: Episode) => {\n  const defaultValue = { title: episode.title?.trim(), subtitle: "" };\n\n  if (!defaultValue.title) return defaultValue;\n\n  const titleMatches = defaultValue.title.match(/^(RNR.*\\d)(?: - )(.*$)/);\n\n  if (!titleMatches || titleMatches.length !== 3) return defaultValue;\n\n  return { title: titleMatches[1], subtitle: titleMatches[2] };\n};\n\nexport const getDatePublished = (episode: Episode) => {\n  try {\n    const formatted = formatDate(episode.pubDate);\n    return {\n      textLabel: formatted,\n      accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {\n        date: formatted,\n      }),\n    };\n  } catch (error) {\n    return { textLabel: "", accessibilityLabel: "" };\n  }\n};\n\nexport const getDuration = (episode: Episode) => {\n  const seconds = Number(episode.enclosure.duration);\n  const h = Math.floor(seconds / 3600);\n  const m = Math.floor((seconds % 3600) / 60);\n  const s = Math.floor((seconds % 3600) % 60);\n\n  const hDisplay = h > 0 ? `${h}:` : "";\n  const mDisplay = m > 0 ? `${m}:` : "";\n  const sDisplay = s > 0 ? s : "";\n  return {\n    textLabel: hDisplay + mDisplay + sDisplay,\n    accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {\n      hours: h,\n      minutes: m,\n      seconds: s,\n    }),\n  };\n};\n'})})]}),"\n",(0,s.jsx)(t.h2,{id:"remove-mobx-state-tree",children:"Remove MobX-State-Tree"}),"\n",(0,s.jsxs)(t.p,{children:["Now that our models have been converted, follow our recipe to ",(0,s.jsx)(t.a,{href:"/docs/recipes/RemoveMobxStateTree",children:"Remove MobX-State-Tree"})," entirely from your project."]}),"\n",(0,s.jsx)(t.h2,{id:"create-store",children:"Create Store"}),"\n",(0,s.jsxs)(t.p,{children:["Let's create our main Zustand store. Create a new file ",(0,s.jsx)(t.code,{children:"app/store/RootStore.ts"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/RootStore.ts"',children:'import { create } from "zustand";\nimport { useShallow } from "zustand/react/shallow";\nimport { AuthenticationStore, authenticationStoreSelector, createAuthenticationSlice } from "./AuthenticationStore";\nimport { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore";\n\nexport interface RootStore extends AuthenticationStore, EpisodeStore {}\n\nexport const useStore = create<RootStore>()((...a) => ({\n  ...createAuthenticationSlice(...a),\n  ...createEpisodeSlice(...a),\n  // add your state slices here\n}));\n\n// optional: custom hooks can be used to pick pieces from state\n// useShallow is used to help prevent unnecessary rerenders\nexport const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector));\nexport const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector));\n'})}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"We're combining AuthenticationStore and EpisodeStore into one Zustand store for simplicity. Again, Zustand is very non-opinionated so you can modify this structure if desired."}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"useAuthenticationStore"})," and ",(0,s.jsx)(t.code,{children:"useEpisodeStore"})," are exported as custom hooks to make it easier to select common pieces of state. Feel free to create additional custom hooks for reusable lookup patterns and prevent unnecessary re-renders ",(0,s.jsx)(t.a,{href:"https://github.com/pmndrs/zustand?tab=readme-ov-file#selecting-multiple-state-slices",children:"Read more about this"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Create ",(0,s.jsx)(t.code,{children:"store/index.ts"})," file to export our hooks and selectors for easy use across our app:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/index.ts"',children:'export * from "./RootStore";\nexport * from "./AuthenticationStore";\nexport * from "./EpisodeStore";\nexport * from "./Episode";\n'})}),"\n",(0,s.jsx)(t.h2,{id:"use-zustand-in-components",children:"Use Zustand in Components"}),"\n",(0,s.jsx)(t.p,{children:"Zustand's hooks-based API makes it easy to pull data into components."}),"\n",(0,s.jsx)(t.p,{children:"In the Ignite Demo App, we'll update the following components to use our exported Zustand hooks and selectors:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",metastring:'title="/app/navigators/AppNavigator.tsx"',children:'import { useStore, isAuthenticatedSelector } from "app/store";\n\nconst AppStack = () => {\n\n  // use a selector to pick only that value\n  const isAuthenticated = useStore(isAuthenticatedSelector)\n\n  return (\n    <Stack.Navigator\n    ...\n'})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",metastring:'title="/app/screens/LoginScreen.tsx"',children:"// pick several values & actions from the AuthenticationStore\nconst { authEmail, setAuthEmail, setAuthToken } = useAuthenticationStore();\n// we can also use multiple hooks\nconst validationError = useStore(validationErrorSelector);\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Several changes are needed here. We'll use ",(0,s.jsx)(t.code,{children:"useEpisodeStore"})," to select all the data and actions we need from EpisodeStore:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/screens/DemoPodcastListScreen.tsx"',children:'import {\n  useEpisodeStore,\n  Episode,\n  getDatePublished,\n  getDuration,\n  getParsedTitleAndSubtitle,\n} from "app/store"\n\n...\n\nconst episodeStore = useEpisodeStore();\n'})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:"useEffect(() => {\n      ;(async function load() {\n        setIsLoading(true)\n        await episodeStore.fetchEpisodes()\n        setIsLoading(false)\n      })()\n--    }, [episodeStore])\n++    }, [])\n\n"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:'<Switch\n  value={episodeStore.favoritesOnly}\n  onValueChange={() =>\n--  episodeStore.setProp("favoritesOnly", !episodeStore.favoritesOnly)\n++  episodeStore.setFavoritesOnly(!episodeStore.favoritesOnly)\n  }\n\n'})}),"\n",(0,s.jsxs)(t.p,{children:["We also need to update how we get derived values from ",(0,s.jsx)(t.code,{children:"Episode"})," now that we're working with a plain object in Zustand without custom getters. Instead of ",(0,s.jsx)(t.code,{children:"episode.duration"})," we can use our util function ",(0,s.jsx)(t.code,{children:"getDuration"}),". Add these lines to the render function of ",(0,s.jsx)(t.code,{children:"EpisodeCard"}),", and replace a few spots those values are used."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const datePublished = getDatePublished(episode);\nconst duration = getDuration(episode);\nconst parsedTitleAndSubtitle = getParsedTitleAndSubtitle(episode);\n"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:' <Text\n  style={themed($metadataText)}\n  size="xxs"\n--accessibilityLabel={episode.datePublished.accessibilityLabel}\n++accessibilityLabel={datePublished.accessibilityLabel}\n>\n--{episode.datePublished.textLabel}\n++{datePublished.textLabel}\n</Text>\n'})}),"\n",(0,s.jsx)(t.p,{children:"A few additional updates to make in Ignite's Demo App:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",metastring:'title="/app/screens/WelcomeScreen.tsx"',children:'++import { useStore } from "app/store"\n\n--const {\n--  authenticationStore: { logout },\n--} = useStores()\n++const logout = useStore((state) => state.logout)\n'})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",metastring:'title="/app/screens/DemoDebugScreen.tsx"',children:'++import { useStore } from "app/store"\n\n--const {\n--  authenticationStore: { logout },\n--} = useStores()\n++const logout = useStore((state) => state.logout)\n'})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",metastring:'title="/app/services/api/api.ts"',children:'+import { Episode } from "app/store/Episode";\n\n-const episodes: EpisodeSnapshotIn[] =\n+const episodes: Episode[] =\n'})}),"\n",(0,s.jsx)(t.h2,{id:"persist-zustand-store",children:"Persist Zustand Store"}),"\n",(0,s.jsxs)(t.p,{children:["Zustand ships with ",(0,s.jsx)(t.a,{href:"https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md",children:"persistence middlware"}),". Let's hook it up!"]}),"\n",(0,s.jsxs)(t.p,{children:["Update ",(0,s.jsx)(t.code,{children:"RootStore"})," to look like this:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="/app/store/RootStore.ts"',children:'import { create } from "zustand";\nimport { useShallow } from "zustand/react/shallow";\nimport { persist, createJSONStorage } from "zustand/middleware";\n\nimport { AuthenticationStore, authenticationStoreSelector, createAuthenticationSlice } from "./AuthenticationStore";\nimport { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore";\nimport AsyncStorage from "@react-native-async-storage/async-storage";\n\nexport interface RootStore extends AuthenticationStore, EpisodeStore {\n  _hasHydrated: boolean;\n  setHasHydrated: (state: boolean) => void;\n}\n\nexport const useStore = create<RootStore>()(\n  persist(\n    (...a) => ({\n      ...createAuthenticationSlice(...a),\n      ...createEpisodeSlice(...a),\n      // add your state slices here\n\n      _hasHydrated: false,\n      setHasHydrated: (state) => {\n        const set = a[0];\n        set({\n          _hasHydrated: state,\n        });\n      },\n    }),\n    {\n      name: "zustand-app",\n      storage: createJSONStorage(() => AsyncStorage),\n      onRehydrateStorage: () => (state) => {\n        state?.setHasHydrated(true);\n      },\n    }\n  )\n);\n\nexport const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector));\nexport const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector));\n'})}),"\n",(0,s.jsxs)(t.p,{children:["We added the ",(0,s.jsx)(t.code,{children:"persist"})," middleware and created ",(0,s.jsx)(t.code,{children:"_hasHydrated"})," property & action to track ",(0,s.jsx)(t.code,{children:"AsyncStorage"})," hydration. This will automatically persist and hydrate your Zustand store! We just need to handle the loading state during initial hydration:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",metastring:'title="/app/app.tsx"',children:'+import { useStore } from "./store"\n\n...\n\nconst [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)\n\n-const { rehydrated } = useInitialRootStore(() => {\n-   setTimeout(hideSplashScreen, 500)\n-})\n\n\n+const rehydrated = useStore((state) => state._hasHydrated)\n+useEffect(() => {\n+  if (rehydrated) {\n+    setTimeout(hideSplashScreen, 500)\n+  }\n+}, [rehydrated])\n\n'})}),"\n",(0,s.jsx)(t.p,{children:"And we're all set!"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/Jpoliachik/ignite-zustand",children:"Full Source Code"})})]})}function p(e={}){const{wrapper:t}={...(0,o.M)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},2172:(e,t,n)=>{n.d(t,{I:()=>r,M:()=>a});var s=n(1504);const o={},i=s.createContext(o);function a(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);