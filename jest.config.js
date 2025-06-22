module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	collectCoverageFrom: [
		'client/src/**/*.{js,jsx}',
		'server/**/*.js',
		'!client/src/index.js',
		'!client/src/setupTests.js',
		'!client/src/stories/**',
		'!server/migrations/**',
		'!**/node_modules/**',
		'!**/coverage/**',
		'!**/*.config.js',
		'!**/*.setup.js'
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 75,
			lines: 75,
			statements: 75
		},
		'client/src/components/**/*.{js,jsx}': {
			branches: 80,
			functions: 85,
			lines: 85,
			statements: 85
		},
		'client/src/contexts/**/*.{js,jsx}': {
			branches: 75,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},
	testMatch: [
		'<rootDir>/client/src/**/__tests__/**/*.{js,jsx}',
		'<rootDir>/client/src/**/*.{test,spec}.{js,jsx}',
		'<rootDir>/server/**/__tests__/**/*.js',
		'<rootDir>/server/**/*.{test,spec}.js'
	],
	moduleNameMapping: {
		'^@/(.*)$': '<rootDir>/client/src/$1'
	}
};