import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const fs = require("fs");
const readline = require("readline");
const { gitlogPromise } = require("gitlog");

/** @type {import('@docusaurus/types').Config} */
const config: Config = {
  title: "Ignite Cookbook for React Native",
  tagline: "Cooking up some cool recipes in Ignite for React Native!",
  url: "https://infinitered.github.io",
  baseUrl: "/",
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
    async function exampleCodeSnippets(_context, _options) {
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
            let title = "";
            let publish_date = "";
            const doc_name = doc;
            const contents = [];
            const input = fs.createReadStream("docs/recipes/" + doc);
            const rl = readline.createInterface({
              input,
              crlfDelay: Infinity,
            });

            let recordContents = false;
            for await (const line of rl) {
              // extract author
              if (!author && /author:/.test(line)) {
                author = line.split(":")[1].trim();
                continue;
              }

              // extract title
              if (!title && /title:/.test(line)) {
                title = line.split(":")[1].trim();
                continue;
              }

              // extract publish_date
              if (!publish_date && /publish_date:/.test(line)) {
                publish_date = line.split(":")[1].trim();
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

            snippets.push({
              author,
              content: contents.join(""),
              lastUpdated,
              title,
              publish_date,
              doc_name,
            });
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
      {
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
        gtag: {
          trackingID: "G-1NP64B0XVM",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig:
    {
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
            type: "search",
            position: "right",
          },
          {
            type: "doc",
            docId: "intro",
            position: "right",
            html: '<div class="hover-underline">Recipes</div>',
          },
          {
            position: "right",
            html: '<div class="hover-underline">Ignite Boilerplate</div>',
            to: "https://github.com/infinitered/ignite",
          },
          {
            position: "right",
            html: '<div class="hover-underline">Infinite Red</div>',
            to: "https://infinite.red",
          },
          {
            //override CSS only for this last item
            style: { marginRight: "0px" },
            type: "dropdown",
            html: ` <div class="hover-underline">
                      Community
                      <img src="/img/caret-down.svg" alt="dropdown" class="icon" />
                    </div>
                  `,
            position: "right",
            items: [
              {
                html: ` <div>
                          <div class="dropdown-item  hover-underline">
                            Slack community
                            <img src="/img/arrow.svg" alt="dropdown" class="icon" />
                          </div>
                          <div class="dropdown-item-description">
                            <p>Join a growing React Native community with 2,000 developers and counting.<p>
                          </div>
                        </div>
                      `,
                to: "https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1e1gob8vn-pcFjKM~n1c~aXFsTnvHpdg",
              },
              {
                html: ` <div>
                          <div class="dropdown-item  hover-underline">
                            Submit an idea
                            <img src="/img/arrow.svg" alt="dropdown" class="icon" />
                          </div>
                          <div class="dropdown-item-description">
                            <p>Have an recipe idea for the cookbook? Contribute your ideas on GitHub!<p>
                          </div>
                        </div>
                      `,
                to: "https://github.com/infinitered/ignite-cookbook/issues/new?assignees=&labels=new+recipe&template=recipe_idea.yml",
              },
            ],
          },
        ],
      },
      footer: {
        copyright: 'From the team at <a href="https://infinite.red/" target="_blank" rel="noopener noreferrer" class="ir-footer-link">Infinite Red</a> <img width="32" height="32" src="/img/ir-mark.svg" alt="dropdown" class="ir-mark" />',
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                html: '<a href="https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1e1gob8vn-pcFjKM~n1c~aXFsTnvHpdg" target="_blank" rel="noopener noreferrer" class="footer__link-item">Slack Community<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://reactnativeradio.com/" target="_blank" rel="noopener noreferrer" class="footer__link-item">React Native Radio<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://reactnativenewsletter.com/" target="_blank" rel="noopener noreferrer" class="footer__link-item">React Native Newsletter<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
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
              {
                html: '<a href="https://infinite.red/privacy-policy" target="_blank" rel="noopener noreferrer" class="footer__link-item">Privacy Policy<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
            ],
          },
          {
            title: "Infinite Red",
            items: [
              {
                html: '<a href="https://infinite.red/" target="_blank" rel="noopener noreferrer" class="footer__link-item">Website<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://docs.infinite.red/" target="_blank" rel="noopener noreferrer" class="footer__link-item">IR Docs<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              },
              {
                html: '<a href="https://chainreactconf.com" target="_blank" rel="noopener noreferrer" class="footer__link-item">Chain React Conf<div class="footer__links__custom"><svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="" role="img"><g clip-path="url(#a)" stroke="#F4F2F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.312 18.781 19.245 6.85M19.245 17.986V6.849H8.108"></path></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(45 6.534 16.072)" d="M0 0h18v18H0z"></path></clipPath></defs></svg></div></a>',
              }
            ]
          }
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "bash",
          "ruby",
          "json",
          "ejs",
          "diff",
          "markup-templating",
        ],
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
            block: { start: "error-line-start", end: "error-line-end" },
          },
          {
            className: "code-block-success-line",
            line: "success-line",
            block: { start: "success-line-start", end: "success-line-end" },
          },
        ],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'MFHD60DIB5',

        // Public API key: it is safe to commit it
        apiKey: '4e924e740d603ec90f106067754ccf50',

        indexName: 'ignite-cookbook',

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
    } satisfies Preset.ThemeConfig,
};

module.exports = config;
