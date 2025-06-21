import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
	const { getTotalItems } = useCart();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleUserMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	const handleProfile = () => {
		handleUserMenuClose();
		navigate('/profile');
	};

	const handleAdminPanel = () => {
		handleUserMenuClose();
		navigate('/admin/users');
	};

	const handleRoles = () => {
		handleUserMenuClose();
		navigate('/admin/roles');
	};

	const handleLogout = async () => {
		handleUserMenuClose();
		try {
			await logout();
			navigate('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

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
						color: 'inherit',
					}}
				>
					E-Commerce Store
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Button color="inherit" component={RouterLink} to="/">
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
						<>
							<IconButton
								color="inherit"
								onClick={handleUserMenuClick}
								aria-controls={open ? 'user-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
							>
								<AccountCircleIcon />
							</IconButton>
							<Menu
								id="user-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleUserMenuClose}
								MenuListProps={{
									'aria-labelledby': 'user-button',
								}}
								transformOrigin={{
									horizontal: 'right',
									vertical: 'top',
								}}
								anchorOrigin={{
									horizontal: 'right',
									vertical: 'bottom',
								}}
							>
								<MenuItem disabled>
									<ListItemText
										primary={user.username || user.email}
										secondary={user.email}
									/>
								</MenuItem>
								<Divider />
								<MenuItem onClick={handleProfile}>
									<ListItemIcon>
										<PersonIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Profile</ListItemText>
								</MenuItem>
								{user.isAdmin && (
									<>
										<MenuItem onClick={handleAdminPanel}>
											<ListItemIcon>
												<AdminPanelSettingsIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText>
												User Management
											</ListItemText>
										</MenuItem>
										<MenuItem onClick={handleRoles}>
											<ListItemIcon>
												<SupervisorAccountIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText>Roles</ListItemText>
										</MenuItem>
									</>
								)}
								<MenuItem onClick={handleLogout}>
									<ListItemIcon>
										<LogoutIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Logout</ListItemText>
								</MenuItem>
							</Menu>
						</>
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
