import React from 'react';
import Button from './Button';

export default {
  title: 'Common/Button',
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Danger Button',
  variant: 'danger',
};