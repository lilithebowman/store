import { addParameters } from '@storybook/react';

addParameters({
  options: {
    storySort: {
      order: ['Introduction', 'Components', 'Common', 'Product', 'Layout'],
    },
  },
  backgrounds: [
    { name: 'light', value: '#ffffff', default: true },
    { name: 'dark', value: '#333333' },
  ],
});