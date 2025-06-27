import React, { useState } from 'react';
import { fn } from '@storybook/test';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import RichTextEditor from '../components/common/RichTextEditor/RichTextEditor';

const theme = createTheme();

export default {
	title: 'Common/RichTextEditor',
	component: RichTextEditor,
	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<Story />
			</ThemeProvider>
		),
	],
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'A rich text editor component that supports bold, italic, and link formatting. Uses contentEditable with HTML output. Supports keyboard shortcuts: Ctrl+B for bold, Ctrl+I for italic.'
			}
		}
	},
	argTypes: {
		value: {
			control: 'text',
			description: 'The current HTML value/content of the editor'
		},
		onChange: {
			action: 'content-changed',
			description: 'Callback fired when the editor content changes'
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text shown when editor is empty'
		},
		height: {
			control: { type: 'number', min: 100, max: 800, step: 50 },
			description: 'Height of the editor in pixels'
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the editor is disabled/readonly'
		},
		className: {
			control: 'text',
			description: 'Additional CSS class name'
		}
	},
	args: {
		onChange: fn(),
		placeholder: 'Start typing...',
		height: 200,
		disabled: false,
		className: ''
	}
};

// Template components for stories
const DefaultTemplate = (args) => {
	const [value, setValue] = useState('');

	return (
		<RichTextEditor
			{...args}
			value={value}
			onChange={(content) => {
				setValue(content);
				args.onChange(content);
			}}
		/>
	);
};

const WithContentTemplate = (args) => {
	const [value, setValue] = useState(`<p>Welcome to the <strong>Rich Text Editor</strong>!</p>
<p>This editor supports:</p>
<ul>
<li><strong>Bold text</strong> (Ctrl+B or toolbar button)</li>
<li><em>Italic text</em> (Ctrl+I or toolbar button)</li>
<li><a href="https://example.com">Links</a> (click link button in toolbar)</li>
</ul>
<p>Try selecting text and using the toolbar buttons or keyboard shortcuts!</p>`);

	return (
		<Box>
			<RichTextEditor
				{...args}
				value={value}
				onChange={(content) => {
					setValue(content);
					args.onChange(content);
				}}
			/>
			<Box mt={2}>
				<Typography variant="h6" gutterBottom>
					HTML Output:
				</Typography>
				<Box
					component="pre"
					sx={{
						background: '#f5f5f5',
						padding: 2,
						borderRadius: 1,
						fontSize: '0.875rem',
						overflow: 'auto',
						border: '1px solid #ddd'
					}}
				>
					{value || '<empty>'}
				</Box>
			</Box>
		</Box>
	);
};

const DisabledTemplate = (args) => {
	const [value] = useState(`<p>This is a <strong>disabled</strong> rich text editor.</p>
<p>You can see the content but cannot edit it. The toolbar buttons are also disabled.</p>
<p>This might be useful for displaying formatted content in read-only mode.</p>`);

	return (
		<RichTextEditor
			{...args}
			value={value}
			onChange={args.onChange}
		/>
	);
};

const CompactTemplate = (args) => {
	const [value, setValue] = useState('<p>Compact editor for quick edits</p>');

	return (
		<RichTextEditor
			{...args}
			value={value}
			onChange={(content) => {
				setValue(content);
				args.onChange(content);
			}}
		/>
	);
};

const LargeTemplate = (args) => {
	const [value, setValue] = useState(`<h1>Large Editor for Extensive Content</h1>
<p>This is a larger editor instance perfect for writing long-form content like:</p>
<ul>
<li>Blog posts</li>
<li>Articles</li>
<li>Documentation</li>
<li>Product descriptions</li>
</ul>

<h2>Formatting Features</h2>
<p>The editor supports <strong>bold text</strong>, <em>italic text</em>, and <a href="https://example.com">hyperlinks</a>.</p>

<h3>Keyboard Shortcuts</h3>
<ul>
<li><strong>Ctrl+B</strong> - Toggle bold formatting</li>
<li><strong>Ctrl+I</strong> - Toggle italic formatting</li>
</ul>

<p>You can also use the toolbar buttons to apply formatting to selected text.</p>

<h3>Creating Links</h3>
<ol>
<li>Select the text you want to turn into a link</li>
<li>Click the link button in the toolbar</li>
<li>Enter the URL and optionally modify the link text</li>
<li>Click Apply</li>
</ol>

<p>This editor outputs clean HTML that can be safely displayed in your application.</p>`);

	return (
		<RichTextEditor
			{...args}
			value={value}
			onChange={(content) => {
				setValue(content);
				args.onChange(content);
			}}
		/>
	);
};

const CustomStylingTemplate = (args) => {
	const [value, setValue] = useState('<p>This editor has custom styling applied</p>');

	return (
		<Box sx={{ padding: 3, background: '#f8f9fa', borderRadius: 2 }}>
			<Typography variant="h5" gutterBottom color="primary">
				Custom Styled Editor
			</Typography>
			<RichTextEditor
				{...args}
				value={value}
				onChange={(content) => {
					setValue(content);
					args.onChange(content);
				}}
			/>
		</Box>
	);
};

// Stories
export const Default = {
	render: DefaultTemplate
};

export const WithContent = {
	render: WithContentTemplate
};

export const Disabled = {
	args: {
		disabled: true
	},
	render: DisabledTemplate
};

export const Compact = {
	args: {
		height: 150
	},
	render: CompactTemplate
};

export const Large = {
	args: {
		height: 400
	},
	render: LargeTemplate
};

export const CustomStyling = {
	args: {
		className: 'custom-styled',
		height: 250
	},
	render: CustomStylingTemplate
};

export const PlainText = {
	args: {
		placeholder: 'Type some text and then format it...'
	},
	render: DefaultTemplate
};

const KeyboardShortcutsTemplate = (args) => {
	const [value, setValue] = useState('<p>Try these keyboard shortcuts:</p><ul><li><strong>Ctrl+B</strong> for bold</li><li><strong>Ctrl+I</strong> for italic</li></ul>');

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Keyboard Shortcuts Demo
			</Typography>
			<Typography variant="body2" color="text.secondary" gutterBottom>
				Select text and press Ctrl+B for bold or Ctrl+I for italic
			</Typography>
			<RichTextEditor
				{...args}
				value={value}
				onChange={(content) => {
					setValue(content);
					args.onChange(content);
				}}
			/>
		</Box>
	);
};

export const KeyboardShortcuts = {
	render: KeyboardShortcutsTemplate
};
