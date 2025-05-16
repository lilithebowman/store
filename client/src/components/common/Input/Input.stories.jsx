import React from 'react';
import Input from './Input';

export default {
  title: 'Common/Input',
  component: Input,
};

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter text...',
  value: '',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Input Label',
  placeholder: 'Enter text...',
  value: '',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Input Label',
  placeholder: 'Enter text...',
  value: '',
  error: 'This field is required',
};