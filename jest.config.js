module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	transform: {
		'^.+\\.(js|jsx)$': ['babel-jest', {
			presets: [
				['@babel/preset-env', { targets: { node: 'current' } }],
				['@babel/preset-react', { runtime: 'automatic' }]
			]
		}],
		'^.+\\.css$': 'jest-transform-stub'
	},
	moduleFileExtensions: ['js', 'jsx', 'json'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'^@/(.*)$': '<rootDir>/client/src/$1'
	},
	collectCoverageFrom: [
		'client/src/**/*.{js,jsx}',
		'server/**/*.js',
		'!client/src/index.js',
		'!client/src/setupTests.js',
		'!client/src/stories/**',
		'!client/src/**/*.stories.{js,jsx}',
		'!client/src/**/*.story.{js,jsx}',
		'!server/migrations/**',
		'!**/node_modules/**',
		'!**/coverage/**',
		'!**/*.config.js',
		'!**/*.setup.js'
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		},
		'client/src/components/**/*.{js,jsx}': {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		},
		'client/src/contexts/**/*.{js,jsx}': {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	},
	testMatch: [
		'<rootDir>/client/src/**/__tests__/**/*.{js,jsx}',
		'<rootDir>/client/src/**/*.{test,spec}.{js,jsx}',
		'<rootDir>/server/**/__tests__/**/*.js',
		'<rootDir>/server/**/*.{test,spec}.js'
	]
};