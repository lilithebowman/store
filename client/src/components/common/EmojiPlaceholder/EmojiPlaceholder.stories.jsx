// client/src/components/common/EmojiPlaceholder/EmojiPlaceholder.stories.jsx
import React from 'react';
import EmojiPlaceholder from './EmojiPlaceholder';

export default {
	title: 'Common/EmojiPlaceholder',
	component: EmojiPlaceholder,
	argTypes: {
		width: { control: 'number' },
		height: { control: 'number' },
		emojiCount: { control: 'number' },
	},
};

const Template = (args) => <EmojiPlaceholder {...args} />;

export const Default = Template.bind({});
Default.args = {
	width: 200,
	height: 200,
	emojiCount: 10,
};