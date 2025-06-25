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
	transformIgnorePatterns: [
		'node_modules/(?!(axios)/)'
	],
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
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		},
		'client/src/components/**/*.{js,jsx}': {
			branches: 50,
			functions: 50,
			lines: 5,
			statements: 5
		},
		'client/src/contexts/**/*.{js,jsx}': {
			branches: 50,
			functions: 50,
			lines: 5,
			statements: 5
		}
	},
	testMatch: [
		'<rootDir>/client/src/**/__tests__/**/*.{js,jsx}',
		'<rootDir>/client/src/**/*.{test,spec}.{js,jsx}',
		'<rootDir>/server/**/__tests__/**/*.js',
		'<rootDir>/server/**/*.{test,spec}.js'
	]
};