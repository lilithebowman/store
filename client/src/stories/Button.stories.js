import { fn } from '@storybook/test';

import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	title: 'Example/Button',
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		onClick: fn((event) => {
			console.log('Button clicked!', event);
		})
	},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
	args: {
		primary: true,
		label: 'Primary Button',
		onClick: fn((event) => {
			console.log('Primary button clicked!', event.target);
			alert('Primary button was clicked!');
		}),
	},
};

export const Secondary = {
	args: {
		label: 'Secondary Button',
		onClick: fn((event) => {
			console.log('Secondary button clicked!', event.target);
			alert('Secondary button was clicked!');
		}),
	},
};

export const Large = {
	args: {
		size: 'large',
		label: 'Large Button',
		onClick: fn((event) => {
			console.log('Large button clicked!', event.target);
			alert('Large button was clicked!');
		}),
	},
};

export const Small = {
	args: {
		size: 'small',
		label: 'Small Button',
		onClick: fn((event) => {
			console.log('Small button clicked!', event.target);
			alert('Small button was clicked!');
		}),
	},
};

// New story showcasing different types of interactions
export const WithCustomActions = {
	args: {
		primary: true,
		label: 'Save Changes',
		onClick: fn((event) => {
			console.log('Save button clicked!', event.target);
			// Simulate a save operation
			const button = event.target;
			const originalText = button.textContent;
			button.textContent = 'Saving...';
			button.disabled = true;

			setTimeout(() => {
				button.textContent = 'Saved!';
				setTimeout(() => {
					button.textContent = originalText;
					button.disabled = false;
				}, 1000);
			}, 2000);
		}),
	},
};

// Story demonstrating form submission
export const SubmitButton = {
	args: {
		primary: true,
		label: 'Submit Form',
		onClick: fn((event) => {
			event.preventDefault();
			console.log('Form submitted!', event.target);

			// Simulate form validation and submission
			const isValid = Math.random() > 0.3; // 70% chance of success

			if (isValid) {
				alert('Form submitted successfully!');
			} else {
				alert('Form validation failed. Please check your inputs.');
			}
		}),
	},
};

// Story for destructive actions
export const DeleteButton = {
	args: {
		label: 'Delete Item',
		backgroundColor: '#dc3545',
		onClick: fn((event) => {
			console.log('Delete button clicked!', event.target);

			// Simulate confirmation dialog
			const confirmed = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');

			if (confirmed) {
				alert('Item deleted successfully!');
			} else {
				alert('Delete action cancelled.');
			}
		}),
	},
};
