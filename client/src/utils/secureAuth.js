// Secure authentication utilities
export class SecureAuth {
	// Token storage with expiration check
	static setToken(token) {
		try {
			const payload = this.decodeJWT(token);
			if (payload && payload.exp) {
				localStorage.setItem('token', token);
				localStorage.setItem('token_exp', payload.exp.toString());
				return true;
			}
		} catch (error) {
			console.error('Invalid token format');
		}
		return false;
	}

	static getToken() {
		const token = localStorage.getItem('token');
		const exp = localStorage.getItem('token_exp');

		if (!token || !exp) return null;

		// Check if token is expired
		if (Date.now() >= parseInt(exp) * 1000) {
			this.clearAuth();
			return null;
		}

		return token;
	}

	static clearAuth() {
		localStorage.removeItem('token');
		localStorage.removeItem('token_exp');
		localStorage.removeItem('user');
	}

	// Secure user data storage (only non-sensitive data)
	static setUserData(userData) {
		const safeData = {
			id: userData.id,
			username: userData.username,
			email: userData.email,
			isAdmin: userData.isAdmin || false,
			profileImage: userData.profileImage || null,
			// Never store: passwords, tokens, sensitive personal info
		};
		localStorage.setItem('user', JSON.stringify(safeData));
	}

	static getUserData() {
		try {
			const userData = localStorage.getItem('user');
			return userData ? JSON.parse(userData) : null;
		} catch (error) {
			console.error('Error parsing user data');
			localStorage.removeItem('user');
			return null;
		}
	}

	// JWT decode (client-side only for expiration check)
	static decodeJWT(token) {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(
						c =>
							'%' +
							('00' + c.charCodeAt(0).toString(16)).slice(-2)
					)
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			return null;
		}
	}

	// Check if user is authenticated
	static isAuthenticated() {
		return this.getToken() !== null && this.getUserData() !== null;
	}
}

export default SecureAuth;
