import { SecureAuth } from './secureAuth';

describe('SecureAuth Utility', () => {
	beforeEach(() => {
		// Mock localStorage
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: jest.fn(),
			},
			writable: true,
		});

		// Mock console methods
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('setToken', () => {
		test('stores valid JWT token with expiration', () => {
			// Mock a valid JWT token (simplified)
			const mockToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lhw3-lXvfgZxhW_5aA3vNXlWJ-P8XkQ8BfP9y7K5qV8';

			const result = SecureAuth.setToken(mockToken);

			expect(result).toBe(true);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'token',
				mockToken
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'token_exp',
				expect.any(String)
			);
		});

		test('handles invalid token gracefully', () => {
			const result = SecureAuth.setToken('invalid.token');

			expect(result).toBe(false);
			// Note: console.error is only called when there's an actual error in the try block
		});

		test('handles null token', () => {
			const result = SecureAuth.setToken(null);

			expect(result).toBe(false);
		});
	});

	describe('getToken', () => {
		test('returns valid token when not expired', () => {
			const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
			localStorage.getItem.mockImplementation(key => {
				if (key === 'token') return 'valid-token';
				if (key === 'token_exp') return futureExp.toString();
				return null;
			});

			const token = SecureAuth.getToken();

			expect(token).toBe('valid-token');
		});

		test('returns null when token is expired', () => {
			const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
			localStorage.getItem.mockImplementation(key => {
				if (key === 'token') return 'expired-token';
				if (key === 'token_exp') return pastExp.toString();
				return null;
			});

			const token = SecureAuth.getToken();

			expect(token).toBe(null);
			expect(localStorage.removeItem).toHaveBeenCalledWith('token');
			expect(localStorage.removeItem).toHaveBeenCalledWith('token_exp');
		});

		test('returns null when no token exists', () => {
			localStorage.getItem.mockReturnValue(null);

			const token = SecureAuth.getToken();

			expect(token).toBe(null);
		});
	});

	describe('clearAuth', () => {
		test('removes all auth data from localStorage', () => {
			SecureAuth.clearAuth();

			expect(localStorage.removeItem).toHaveBeenCalledWith('token');
			expect(localStorage.removeItem).toHaveBeenCalledWith('token_exp');
			expect(localStorage.removeItem).toHaveBeenCalledWith('user');
		});
	});

	describe('setUserData', () => {
		test('stores user data without sensitive information', () => {
			const userData = {
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				password: 'sensitive-data', // Should be filtered out
				token: 'also-sensitive', // Should be filtered out
			};

			SecureAuth.setUserData(userData);

			expect(localStorage.setItem).toHaveBeenCalledWith(
				'user',
				expect.not.stringContaining('password')
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'user',
				expect.not.stringContaining('sensitive-data')
			);
		});
	});

	describe('getUserData', () => {
		test('returns parsed user data', () => {
			const userData = { id: 1, username: 'testuser' };
			localStorage.getItem.mockReturnValue(JSON.stringify(userData));

			const result = SecureAuth.getUserData();

			expect(result).toEqual(userData);
		});

		test('returns null for invalid JSON', () => {
			localStorage.getItem.mockReturnValue('invalid-json');

			const result = SecureAuth.getUserData();

			expect(result).toBeNull();
		});

		test('returns null when no user data exists', () => {
			localStorage.getItem.mockReturnValue(null);

			const result = SecureAuth.getUserData();

			expect(result).toBeNull();
		});
	});

	describe('isAuthenticated', () => {
		test('returns true when valid token exists', () => {
			const futureExp = Math.floor(Date.now() / 1000) + 3600;
			localStorage.getItem.mockImplementation(key => {
				if (key === 'token') return 'valid-token';
				if (key === 'token_exp') return futureExp.toString();
				if (key === 'user') return '{"id":1,"username":"test"}';
				return null;
			});

			const result = SecureAuth.isAuthenticated();

			expect(result).toBe(true);
		});

		test('returns false when no token exists', () => {
			localStorage.getItem.mockReturnValue(null);

			const result = SecureAuth.isAuthenticated();

			expect(result).toBe(false);
		});

		test('returns false when token is expired', () => {
			const pastExp = Math.floor(Date.now() / 1000) - 3600;
			localStorage.getItem.mockImplementation(key => {
				if (key === 'token') return 'expired-token';
				if (key === 'token_exp') return pastExp.toString();
				return null;
			});

			const result = SecureAuth.isAuthenticated();

			expect(result).toBe(false);
		});
	});

	describe('decodeJWT', () => {
		test('decodes valid JWT token', () => {
			// Simple JWT token with payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
			const token =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

			const result = SecureAuth.decodeJWT(token);

			expect(result).toEqual({
				sub: '1234567890',
				name: 'John Doe',
				iat: 1516239022,
			});
		});

		test('returns null for invalid token', () => {
			const result = SecureAuth.decodeJWT('invalid-token');

			expect(result).toBeNull();
		});

		test('handles malformed JWT', () => {
			const result = SecureAuth.decodeJWT('not.a.jwt');

			expect(result).toBeNull();
		});
	});
});
