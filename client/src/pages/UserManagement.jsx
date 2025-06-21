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
	Avatar,
	TextField,
	FormControlLabel,
	Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
	const { user } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editedUser, setEditedUser] = useState({
		username: '',
		email: '',
		isAdmin: false,
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(`${baseURL}/users`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUsers(data);
			} else {
				throw new Error('Failed to fetch users');
			}
		} catch (error) {
			console.error('Error fetching users:', error);
			setSnackbar({
				open: true,
				message: 'Failed to load users',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async () => {
		if (!selectedUser) return;

		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(
				`${baseURL}/users/${selectedUser.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setUsers(users.filter(u => u.id !== selectedUser.id));
				setSnackbar({
					open: true,
					message: 'User deleted successfully',
					severity: 'success',
				});
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete user');
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			setSnackbar({
				open: true,
				message: error.message || 'Failed to delete user',
				severity: 'error',
			});
		} finally {
			setDeleteDialogOpen(false);
			setSelectedUser(null);
		}
	};

	const openDeleteDialog = userToDelete => {
		setSelectedUser(userToDelete);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedUser(null);
	};

	const openEditDialog = userToEdit => {
		setSelectedUser(userToEdit);
		setEditedUser({
			username: userToEdit.username,
			email: userToEdit.email,
			isAdmin: userToEdit.isAdmin,
		});
		setEditDialogOpen(true);
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
		setSelectedUser(null);
		setEditedUser({ username: '', email: '', isAdmin: false });
	};

	const handleEditUser = async () => {
		if (!selectedUser) return;

		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(
				`${baseURL}/users/${selectedUser.id}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(editedUser),
				}
			);

			if (response.ok) {
				const updatedUser = await response.json();
				setUsers(
					users.map(u => (u.id === selectedUser.id ? updatedUser : u))
				);
				setSnackbar({
					open: true,
					message: 'User updated successfully',
					severity: 'success',
				});
				closeEditDialog();
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to update user');
			}
		} catch (error) {
			console.error('Error updating user:', error);
			setSnackbar({
				open: true,
				message: error.message || 'Failed to update user',
				severity: 'error',
			});
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const getImageUrl = imagePath => {
		if (!imagePath) return null;
		if (imagePath.startsWith('http')) return imagePath;
		const baseURL =
			process.env.REACT_APP_API_BASE_URL ||
			`http://${window.location.hostname}:2048/api`;
		// Remove /api from the end since we're serving static files from root
		const serverURL = baseURL.replace('/api', '');
		return `${serverURL}/${imagePath}`;
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
				<Typography variant="h6">Loading users...</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 3 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
					<AdminPanelSettingsIcon
						sx={{ mr: 2, color: 'primary.main' }}
					/>
					<Typography variant="h4" component="h1">
						User Management
					</Typography>
				</Box>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Joined</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map(userItem => (
								<TableRow key={userItem.id}>
									<TableCell>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Box
												sx={{
													position: 'relative',
													mr: 2,
												}}
											>
												<Avatar
													src={getImageUrl(
														userItem.profileImage
													)}
													sx={{
														width: 40,
														height: 40,
													}}
												>
													{!userItem.profileImage &&
													userItem.username ? (
														userItem.username
															.charAt(0)
															.toUpperCase()
													) : (
														<PersonIcon />
													)}
												</Avatar>
												{userItem.isAdmin && (
													<Box
														sx={{
															position:
																'absolute',
															top: -4,
															left: -4,
															fontSize: '1rem',
															background:
																'rgba(255, 255, 255, 0.9)',
															borderRadius: '50%',
															width: 20,
															height: 20,
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															boxShadow: 1,
														}}
														title="Administrator"
													>
														👑
													</Box>
												)}
											</Box>
											<Box>
												<Typography
													variant="body1"
													fontWeight="medium"
												>
													{userItem.username}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													ID: {userItem.id}
												</Typography>
											</Box>
										</Box>
									</TableCell>
									<TableCell>{userItem.email}</TableCell>
									<TableCell>
										{userItem.isAdmin ? (
											<Chip
												label="Admin"
												color="primary"
												size="small"
												icon={
													<AdminPanelSettingsIcon />
												}
											/>
										) : (
											<Chip
												label="User"
												color="default"
												size="small"
												variant="outlined"
											/>
										)}
									</TableCell>
									<TableCell>
										{userItem.createdAt
											? new Date(
													userItem.createdAt
												).toLocaleDateString()
											: 'Unknown'}
									</TableCell>
									<TableCell align="center">
										<Tooltip title="Edit User">
											<IconButton
												color="primary"
												size="small"
												onClick={() =>
													openEditDialog(userItem)
												}
												disabled={
													userItem.id === user.id
												} // Can't edit yourself
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete User">
											<IconButton
												color="error"
												size="small"
												onClick={() =>
													openDeleteDialog(userItem)
												}
												disabled={
													userItem.id === user.id
												} // Can't delete yourself
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

				{users.length === 0 && (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" color="text.secondary">
							No users found
						</Typography>
					</Box>
				)}
			</Paper>

			{/* Edit User Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={closeEditDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Edit User</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<TextField
							fullWidth
							label="Username"
							value={editedUser.username}
							onChange={e =>
								setEditedUser({
									...editedUser,
									username: e.target.value,
								})
							}
							margin="normal"
						/>
						<TextField
							fullWidth
							label="Email"
							type="email"
							value={editedUser.email}
							onChange={e =>
								setEditedUser({
									...editedUser,
									email: e.target.value,
								})
							}
							margin="normal"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={editedUser.isAdmin}
									onChange={e =>
										setEditedUser({
											...editedUser,
											isAdmin: e.target.checked,
										})
									}
									color="primary"
								/>
							}
							label="Administrator"
							sx={{ mt: 2 }}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button
						onClick={handleEditUser}
						color="primary"
						variant="contained"
					>
						Update User
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
				<DialogTitle>Confirm User Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete user &quot;
						{selectedUser?.username}&quot;? This action cannot be
						undone.
					</Typography>
					<Alert severity="warning" sx={{ mt: 2 }}>
						Deleting a user will permanently remove their account
						and all associated data.
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog}>Cancel</Button>
					<Button
						onClick={handleDeleteUser}
						color="error"
						variant="contained"
					>
						Delete User
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

export default UserManagement;
