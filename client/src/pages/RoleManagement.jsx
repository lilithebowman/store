import React, { useState, useEffect } from 'react';
import {
	Container,
	Paper,
	Typography,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	Alert,
	Snackbar,
	Tooltip,
	TextField,
	FormControlLabel,
	Checkbox,
	FormGroup,
	Card,
	CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useAuth } from '../contexts/AuthContext';

const RoleManagement = () => {
	const { user } = useAuth();
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);
	const [editedRole, setEditedRole] = useState({
		name: '',
		description: '',
		permissions: {},
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	const availablePermissions = [
		{ key: 'add_user', label: 'Add User' },
		{ key: 'edit_user', label: 'Edit User' },
		{ key: 'delete_user', label: 'Delete User' },
		{ key: 'add_product', label: 'Add Product' },
		{ key: 'edit_product', label: 'Edit Product' },
		{ key: 'delete_product', label: 'Delete Product' },
		{ key: 'add_page', label: 'Add Page' },
		{ key: 'edit_page', label: 'Edit Page' },
		{ key: 'delete_page', label: 'Delete Page' },
	];

	useEffect(() => {
		fetchRoles();
	}, []);

	const fetchRoles = async () => {
		try {
			const response = await fetch('/api/roles', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				setRoles(data);
			} else {
				throw new Error('Failed to fetch roles');
			}
		} catch (error) {
			console.error('Error fetching roles:', error);
			setSnackbar({
				open: true,
				message: 'Failed to load roles',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRole = async () => {
		if (!selectedRole) return;

		try {
			const response = await fetch(`/api/roles/${selectedRole.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				setRoles(roles.filter(r => r.id !== selectedRole.id));
				setSnackbar({
					open: true,
					message: 'Role deleted successfully',
					severity: 'success',
				});
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete role');
			}
		} catch (error) {
			console.error('Error deleting role:', error);
			setSnackbar({
				open: true,
				message: error.message || 'Failed to delete role',
				severity: 'error',
			});
		} finally {
			setDeleteDialogOpen(false);
			setSelectedRole(null);
		}
	};

	const openDeleteDialog = roleToDelete => {
		setSelectedRole(roleToDelete);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedRole(null);
	};

	const openEditDialog = (roleToEdit = null) => {
		if (roleToEdit) {
			setSelectedRole(roleToEdit);
			setEditedRole({
				name: roleToEdit.name,
				description: roleToEdit.description || '',
				permissions: roleToEdit.permissions || {},
			});
		} else {
			// Creating new role
			setSelectedRole(null);
			setEditedRole({
				name: '',
				description: '',
				permissions: {},
			});
		}
		setEditDialogOpen(true);
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
		setSelectedRole(null);
		setEditedRole({ name: '', description: '', permissions: {} });
	};

	const handleSaveRole = async () => {
		try {
			const method = selectedRole ? 'PUT' : 'POST';
			const url = selectedRole
				? `/api/roles/${selectedRole.id}`
				: '/api/roles';

			const response = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editedRole),
			});

			if (response.ok) {
				const savedRole = await response.json();
				if (selectedRole) {
					// Update existing role
					setRoles(
						roles.map(r =>
							r.id === selectedRole.id ? savedRole.role : r
						)
					);
				} else {
					// Add new role
					setRoles([...roles, savedRole.role]);
				}
				setSnackbar({
					open: true,
					message: `Role ${selectedRole ? 'updated' : 'created'} successfully`,
					severity: 'success',
				});
				closeEditDialog();
			} else {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						`Failed to ${selectedRole ? 'update' : 'create'} role`
				);
			}
		} catch (error) {
			console.error('Error saving role:', error);
			setSnackbar({
				open: true,
				message:
					error.message ||
					`Failed to ${selectedRole ? 'update' : 'create'} role`,
				severity: 'error',
			});
		}
	};

	const handlePermissionChange = (permissionKey, checked) => {
		setEditedRole({
			...editedRole,
			permissions: {
				...editedRole.permissions,
				[permissionKey]: checked,
			},
		});
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const getPermissionCount = permissions => {
		return Object.values(permissions || {}).filter(Boolean).length;
	};

	// Check if current user is admin
	if (!user || !user.isAdmin) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="error">
					Access denied. Administrator privileges required.
				</Alert>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Typography variant="h6">Loading roles...</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 3 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 3,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<SupervisorAccountIcon
							sx={{ mr: 2, color: 'primary.main' }}
						/>
						<Typography variant="h4" component="h1">
							Role Management
						</Typography>
					</Box>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => openEditDialog()}
					>
						Create Role
					</Button>
				</Box>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Role Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Permissions</TableCell>
								<TableCell>Created</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{roles.map(role => (
								<TableRow key={role.id}>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="medium"
										>
											{role.name}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{role.description ||
												'No description'}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={`${getPermissionCount(role.permissions)} permissions`}
											color="primary"
											size="small"
										/>
									</TableCell>
									<TableCell>
										{role.createdAt
											? new Date(
													role.createdAt
												).toLocaleDateString()
											: 'Unknown'}
									</TableCell>
									<TableCell align="center">
										<Tooltip title="Edit Role">
											<IconButton
												color="primary"
												size="small"
												onClick={() =>
													openEditDialog(role)
												}
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete Role">
											<IconButton
												color="error"
												size="small"
												onClick={() =>
													openDeleteDialog(role)
												}
											>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{roles.length === 0 && (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" color="text.secondary">
							No roles found
						</Typography>
					</Box>
				)}
			</Paper>

			{/* Edit/Create Role Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={closeEditDialog}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{selectedRole ? 'Edit Role' : 'Create New Role'}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<TextField
							fullWidth
							label="Role Name"
							value={editedRole.name}
							onChange={e =>
								setEditedRole({
									...editedRole,
									name: e.target.value,
								})
							}
							margin="normal"
							required
						/>
						<TextField
							fullWidth
							label="Description"
							value={editedRole.description}
							onChange={e =>
								setEditedRole({
									...editedRole,
									description: e.target.value,
								})
							}
							margin="normal"
							multiline
							rows={3}
						/>

						<Card sx={{ mt: 3 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Permissions
								</Typography>
								<FormGroup>
									{availablePermissions.map(permission => (
										<FormControlLabel
											key={permission.key}
											control={
												<Checkbox
													checked={
														editedRole.permissions[
															permission.key
														] || false
													}
													onChange={e =>
														handlePermissionChange(
															permission.key,
															e.target.checked
														)
													}
												/>
											}
											label={permission.label}
										/>
									))}
								</FormGroup>
							</CardContent>
						</Card>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button
						onClick={handleSaveRole}
						color="primary"
						variant="contained"
						disabled={!editedRole.name.trim()}
					>
						{selectedRole ? 'Update Role' : 'Create Role'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={closeDeleteDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Confirm Role Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the role &quot;
						{selectedRole?.name}&quot;? This action cannot be
						undone.
					</Typography>
					<Alert severity="warning" sx={{ mt: 2 }}>
						Deleting a role may affect users who currently have this
						role assigned.
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog}>Cancel</Button>
					<Button
						onClick={handleDeleteRole}
						color="error"
						variant="contained"
					>
						Delete Role
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default RoleManagement;
