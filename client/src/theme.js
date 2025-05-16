import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#4a90e2',
			light: '#7cbaf9',
			dark: '#1565c0',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#f50057',
			light: '#ff5983',
			dark: '#bb002f',
			contrastText: '#ffffff',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: '2.5rem',
			fontWeight: 500,
		},
		h2: {
			fontSize: '2rem',
			fontWeight: 500,
		},
		button: {
			textTransform: 'none',
		},
	},
	shape: {
		borderRadius: 4,
	},
});

export default theme;