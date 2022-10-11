// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const npm2yarn = require('@docusaurus/remark-plugin-npm2yarn');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ignite Cookbook for React Native',
  tagline: 'Cooking up some cool recipes in Ignite for React Native!',
  url: 'https://infinitered.github.io',
  baseUrl: '/ignite-cookbook/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'infinitered', // Usually your GitHub org/user name.
  projectName: 'ignite-cookbook', // Usually your repo name.

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
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
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: 
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Ignite Cookbook for React Native',
        logo: {
          alt: 'React Native Cookbook Logo',
          src: 'img/ignite.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Recipes',
          },
          {
            href: 'https://github.com/infinitered/ignite',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Intro',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1e1gob8vn-pcFjKM~n1c~aXFsTnvHpdg',
              },
            ],
          },
          {
            title: 'More Resources',
            items: [
              {
                label: 'React Native Radio',
                href: 'https://reactnativeradio.com/',
              },
              {
                label: 'React Native Newsletter',
                href: 'https://reactnative.cc/',
              },
              {
                label: 'Red Shift - Blog',
                href: 'https://shift.infinite.red/'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/infinitered/ignite',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Infinite Red, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
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
