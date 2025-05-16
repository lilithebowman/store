import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
	const { getTotalItems } = useCart();
	const { user } = useAuth();
	
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography 
					variant="h6" 
					component={RouterLink} 
					to="/" 
					sx={{ 
						flexGrow: 1, 
						textDecoration: 'none', 
						color: 'inherit' 
					}}
				>
					E-Commerce Store
				</Typography>
				
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Button 
						color="inherit" 
						component={RouterLink} 
						to="/"
					>
						Home
					</Button>
					
					<IconButton 
						color="inherit" 
						component={RouterLink} 
						to="/cart"
					>
						<Badge badgeContent={getTotalItems()} color="secondary">
							<ShoppingCartIcon />
						</Badge>
					</IconButton>
					
					{user ? (
						<IconButton color="inherit">
							<AccountCircleIcon />
						</IconButton>
					) : (
						<Button 
							color="inherit" 
							component={RouterLink} 
							to="/auth"
						>
							Login
						</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;