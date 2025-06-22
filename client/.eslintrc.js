module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	rules: {
		'indent': ['warn', 'tab'],
		'no-tabs': 'off',
		'react/jsx-indent': [0, 'tab'],
		'react/jsx-indent-props': [0, 'tab'],
	},
};