import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
} from '@mui/material';

const Auth = () => {
	const { login, register, error, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [isRegistering, setIsRegistering] = useState(false);
	const [localError, setLocalError] = useState('');
	const history = useHistory();

	const handleSubmit = async e => {
		e.preventDefault();
		setLocalError('');

		try {
			if (isRegistering) {
				if (!username.trim()) {
					setLocalError('Username is required');
					return;
				}
				await register({ username, email, password });
				// After successful registration, switch to login
				setIsRegistering(false);
				setUsername('');
				setPassword('');
			} else {
				await login(email, password);
				history.push('/'); // Redirect to home after login
			}
		} catch (err) {
			console.error('Auth error:', err);
			setLocalError(err.message || 'Authentication failed');
		}
	};

	const toggleMode = () => {
		setIsRegistering(!isRegistering);
		setLocalError('');
		setUsername('');
		setPassword('');
		setEmail('');
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					align="center"
				>
					{isRegistering ? 'Create Account' : 'Sign In'}
				</Typography>

				{(error || localError) && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{localError || error}
					</Alert>
				)}

				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					{isRegistering && (
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					)}

					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={loading}
					>
						{loading
							? 'Loading...'
							: isRegistering
								? 'Create Account'
								: 'Sign In'}
					</Button>

					<Button
						fullWidth
						variant="text"
						onClick={toggleMode}
						disabled={loading}
					>
						{isRegistering
							? 'Already have an account? Sign In'
							: "Don't have an account? Create one"}
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default Auth;
