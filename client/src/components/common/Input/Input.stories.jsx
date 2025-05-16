import React, { useState } from 'react';
import Input from './Input';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default {
	title: 'Common/Input',
	component: Input,
	argTypes: {
		variant: {
			control: { type: 'select', options: ['standard', 'filled', 'outlined'] },
		},
		size: {
			control: { type: 'select', options: ['small', 'medium'] },
		},
	},
};

const Template = (args) => {
	const [value, setValue] = useState(args.value || '');
	return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Default = Template.bind({});
Default.args = {
	label: 'Default Input',
	placeholder: 'Enter text...',
	value: '',
};

export const WithError = Template.bind({});
WithError.args = {
	label: 'Email',
	placeholder: 'Enter your email',
	value: 'invalid-email',
	error: true,
	helperText: 'Please enter a valid email address',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	label: 'Search',
	placeholder: 'Search products...',
	value: '',
	startAdornment: <SearchIcon />,
};

export const Password = Template.bind({});
Password.args = {
	label: 'Password',
	type: 'password',
	placeholder: 'Enter your password',
	value: '',
	endAdornment: <VisibilityIcon />,
};