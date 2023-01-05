// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const npm2yarn = require("@docusaurus/remark-plugin-npm2yarn");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const fs = require("fs");
const readline = require("readline");
const { gitlogPromise } = require("gitlog");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Ignite Cookbook for React Native",
  tagline: "Cooking up some cool recipes in Ignite for React Native!",
  url: "https://infinitered.github.io",
  baseUrl: "/ignite-cookbook/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  organizationName: "infinitered", // Usually your GitHub org/user name.
  projectName: "ignite-cookbook", // Usually your repo name.

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Leaving this here for setting up a multi-doc instance for a community hub
  // plugins: [
  //   [
  //     '@docusaurus/plugin-content-docs',
  //     /** @type {import('@docusaurus/plugin-content-docs').Options} */
  //     ({
  //       id: 'community',
  //       path: 'community',
  //       routeBasePath: 'community',
  //       sidebarPath: require.resolve('./sidebarsCommunity.js'),
  //       remarkPlugins: [npm2yarn],
  //       editCurrentVersion: true,
  //       showLastUpdateAuthor: true,
  //       showLastUpdateTime: true,
  //     }),
  //   ],
  // ],
  plugins: [
    async function exampleCodeSnippets(context, options) {
      return {
        name: "example-code-snippets",
        async loadContent() {
          const snippets = [];
          const docs = fs.readdirSync("docs/recipes");

          // read each doc and extract code snippets
          for await (const doc of docs) {
            const docGitLog = await gitlogPromise({
              repo: ".",
              number: 1,
              file: "docs/recipes/" + doc,
              fields: ["authorDateRel"],
            });

            const lastUpdated = docGitLog?.[0]?.authorDateRel;

            let author = ""; // Do we w÷nt to use the author from the doc or git log?
            const contents = [];
            const input = fs.createReadStream("docs/recipes/" + doc);
            const rl = readline.createInterface({
              input,
              crlfDelay: Infinity,
            });

            let recordContents = false;
            for await (const line of rl) {
              // extract author
              if (/author:/.test(line)) {
                author = line.split(":")[1].trim();
                continue;
              }

              // extract snippet contents
              if (/```/.test(line)) {
                recordContents = !recordContents;
                if (!recordContents) contents.push("\n");
                continue;
              }
              if (recordContents) contents.push(line + "\n");
            }

            // skip if no author or no contents
            if (!author || !contents.length) continue;

            snippets.push({ author, content: contents.join(""), lastUpdated });
          }

          return snippets;
        },
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;
          setGlobalData({ snippets: content });
        },
      };
    },
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Disabling dark mode for now until we have a better dark mode theme
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
      },
      navbar: {
        hideOnScroll: true,
        logo: {
          alt: "React Native Cookbook Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "right",
            label: "Recipes",
          },
          {
            position: "right",
            label: "Boilerplate",
            to: "https://github.com/infinitered/ignite",
          },
          {
            position: "right",
            label: "Submit an Idea",
            to: "https://github.com/infinitered/ignite-cookbook/issues/new?assignees=&labels=new+recipe&template=recipe_idea.yml",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                // label: 'Slack Community',
                // href: 'https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1e1gob8vn-pcFjKM~n1c~aXFsTnvHpdg',
                html: '<a href="https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1e1gob8vn-pcFjKM~n1c~aXFsTnvHpdg" target="_blank" rel="noopener noreferrer" class="footer__link-item">Slack Community<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                // label: 'React Native Radio',
                // href: 'https://reactnativeradio.com/',
                html: '<a href="https://reactnativeradio.com/" target="_blank" rel="noopener noreferrer" class="footer__link-item">React Native Radio<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                // label: 'React Native Newsletter',
                // href: 'https://reactnative.cc/',
                html: '<a href="https://reactnative.cc/" target="_blank" rel="noopener noreferrer" class="footer__link-item">React Native Newsletter<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                html: '<a href="https://github.com/infinitered/ignite-cookbook/issues" target="_blank" rel="noopener noreferrer" class="footer__link-item">Submit a Recipe<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://github.com/infinitered/ignite-cookbook" target="_blank" rel="noopener noreferrer" class="footer__link-item">GitHub - Ignite Cookbook<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://github.com/infinitered/ignite" target="_blank" rel="noopener noreferrer" class="footer__link-item">GitHub - Ignite Boilerplate<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://shift.infinite.red/" target="_blank" rel="noopener noreferrer" class="footer__link-item">RedShift Blog <div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
            ],
          },
        ],
        logo: {
          alt: "Ignite Cookbook Logo",
          src: "img/hero-graphic.svg",
          width: 310,
          height: 250,
        },
        // copyright: `Copyright © ${new Date().getFullYear()} Infinite Red, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-error-line",
            line: "error-line",
          },
          {
            className: "code-block-success-line",
            line: "success-line",
          },
        ],
      },
      // TO-DO: Once our repo is open source, we can fill out an application for Algolia DocSearch and get free search usage : https://docsearch.algolia.com/apply/
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: 'YOUR_APP_ID',

      //   // Public API key: it is safe to commit it
      //   apiKey: 'YOUR_SEARCH_API_KEY',

      //   indexName: 'YOUR_INDEX_NAME',

      //   // Optional: see doc section below
      //   contextualSearch: true,

      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: 'external\\.com|domain\\.com',

      //   // Optional: Algolia search parameters
      //   searchParameters: {},

      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',

      //   //... other Algolia params
      // },
    }),
};

module.exports = config;
