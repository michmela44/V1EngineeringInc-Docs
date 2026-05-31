import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'V1 Engineering',
  tagline: 'Build something awesome',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://michmela44.github.io',
  baseUrl: '/V1EngineeringInc-Docs/',

  organizationName: 'michmela44',
  projectName: 'V1EngineeringInc-Docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lowrider',
        path: 'docs/lowrider',
        routeBasePath: 'lowrider',
        sidebarPath: './sidebars-lowrider.ts',
        lastVersion: 'current',
        versions: {
          current: {
            label: 'Current (v4)',
          },
          v3: {label: 'v3'},
          v2: {label: 'v2'},
          v1: {label: 'v1'},
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mpcnc',
        path: 'docs/mpcnc',
        routeBasePath: 'mpcnc',
        sidebarPath: './sidebars-mpcnc.ts',
        lastVersion: 'current',
        versions: {
          current: {label: 'Current (Primo)'},
          burly: {label: 'Burly'},
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mp3dp',
        path: 'docs/mp3dp',
        routeBasePath: 'mp3dp',
        sidebarPath: './sidebars-mp3dp.ts',
        lastVersion: 'current',
        versions: {
          current: {label: 'Current (V5)'},
          v4: {label: 'V4'},
          v3: {label: 'V3'},
          v2: {label: 'V2'},
          v1: {label: 'V1'},
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'V1 Engineering',
        src: 'img/v1-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'lowriderSidebar',
          docsPluginId: 'lowrider',
          position: 'left',
          label: 'LowRider',
        },
        {
          type: 'docSidebar',
          sidebarId: 'mpcncSidebar',
          docsPluginId: 'mpcnc',
          position: 'left',
          label: 'MPCNC',
        },
        {
          type: 'docSidebar',
          sidebarId: 'mp3dpSidebar',
          docsPluginId: 'mp3dp',
          position: 'left',
          label: 'MP3DP',
        },
        // Conditional version dropdowns — each only appears when viewing that machine's section
        {
          type: 'custom-docsVersionDropdown',
          docsPluginId: 'lowrider',
          routeBasePath: 'lowrider',
          position: 'right',
        },
        {
          type: 'custom-docsVersionDropdown',
          docsPluginId: 'mpcnc',
          routeBasePath: 'mpcnc',
          position: 'right',
        },
        {
          type: 'custom-docsVersionDropdown',
          docsPluginId: 'mp3dp',
          routeBasePath: 'mp3dp',
          position: 'right',
        },
        {
          href: 'https://github.com/V1EngineeringInc/V1EngineeringInc-Docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Machines',
          items: [
            {label: 'LowRider', to: '/lowrider/intro'},
            {label: 'MPCNC', to: '/mpcnc/intro'},
            {label: 'MP3DP', to: '/mp3dp/intro'},
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Forums',
              href: 'https://forum.v1e.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/V1EngineeringInc/V1EngineeringInc-Docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} V1 Engineering Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
