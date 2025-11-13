import type { Preview } from '@storybook/angular';

// Optional: Uncomment if you have compodoc documentation
// import { setCompodocJson } from '@storybook/addon-docs/angular';
// import docJson from '../documentation.json';
// if (docJson) {
//   setCompodocJson(docJson);
// }

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

