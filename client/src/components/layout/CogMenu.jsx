import React, { useState } from 'react';
import {
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WebIcon from '@mui/icons-material/Web';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CogMenu = () => {
	const { user, userPermissions } = useAuth();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProductsClick = () => {
		handleClose();
		navigate('/admin/products');
	};

	const handlePagesClick = () => {
		handleClose();
		navigate('/admin/pages');
	};

	// Check if user has permissions to manage products or pages
	const hasProductPermissions =
		user &&
		(user.isAdmin ||
			userPermissions?.add_product ||
			userPermissions?.edit_product ||
			userPermissions?.delete_product);

	const hasPagePermissions =
		user &&
		(user.isAdmin ||
			userPermissions?.add_page ||
			userPermissions?.edit_page ||
			userPermissions?.delete_page);

	// Don't show the cog menu if user has no relevant permissions
	if (!hasProductPermissions && !hasPagePermissions) {
		return null;
	}

	return (
		<>
			<Tooltip title="Management">
				<IconButton
					color="inherit"
					onClick={handleClick}
					aria-controls={open ? 'cog-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					aria-label="settings"
				>
					<SettingsIcon />
				</IconButton>
			</Tooltip>
			<Menu
				id="cog-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'cog-button',
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
				{hasProductPermissions && (
					<MenuItem onClick={handleProductsClick}>
						<ListItemIcon>
							<Inventory2Icon fontSize="small" />
						</ListItemIcon>
						<ListItemText>Products</ListItemText>
					</MenuItem>
				)}
				{hasPagePermissions && (
					<MenuItem onClick={handlePagesClick}>
						<ListItemIcon>
							<WebIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>Pages</ListItemText>
					</MenuItem>
				)}
			</Menu>
		</>
	);
};

export default CogMenu;
