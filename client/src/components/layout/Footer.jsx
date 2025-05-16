import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
	return (
		<Box 
			component="footer" 
			sx={{
				py: 3,
				px: 2,
				mt: 'auto',
				backgroundColor: (theme) => theme.palette.grey[200],
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="text.primary" gutterBottom>
							About Us
						</Typography>
						<Typography variant="body2" color="text.secondary">
							We provide high-quality products at competitive prices.
						</Typography>
					</Grid>
					
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="text.primary" gutterBottom>
							Links
						</Typography>
						<Link component={RouterLink} to="/privacy-policy" color="inherit" display="block">
							Privacy Policy
						</Link>
						<Link component={RouterLink} to="/terms-of-service" color="inherit" display="block">
							Terms of Service
						</Link>
						<Link component={RouterLink} to="/contact" color="inherit" display="block">
							Contact Us
						</Link>
					</Grid>
					
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="text.primary" gutterBottom>
							Customer Service
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Email: support@example.com
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Phone: +1 (555) 123-4567
						</Typography>
					</Grid>
				</Grid>
				
				<Box mt={3}>
					<Typography variant="body2" color="text.secondary" align="center">
						&copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;