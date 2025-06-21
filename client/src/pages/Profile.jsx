import React, { useState } from 'react';
import {
	Container,
	Paper,
	Typography,
	Box,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemText,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	Snackbar,
	Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
	const { user, updateProfileImage } = useAuth();
	const [open, setOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	const handleOpenDialog = () => {
		setImageUrl(user?.profileImage || '');
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
		setImageUrl('');
	};

	const handleUpdateImage = async () => {
		setLoading(true);
		try {
			await updateProfileImage(imageUrl);
			setSnackbar({
				open: true,
				message: 'Profile image updated successfully!',
				severity: 'success',
			});
			setOpen(false);
		} catch (error) {
			setSnackbar({
				open: true,
				message: error.message || 'Failed to update profile image',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbar({ ...snackbar, open: false });
	};

	if (!user) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Typography variant="h6" color="text.secondary">
					Please log in to view your profile.
				</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
					<Box sx={{ position: 'relative', mr: 3 }}>
						<Avatar
							src={user.profileImage}
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'primary.main',
								fontSize: '2rem',
							}}
						>
							{user.profileImage
								? null
								: user.username
									? user.username.charAt(0).toUpperCase()
									: user.email.charAt(0).toUpperCase()}
						</Avatar>
						<IconButton
							sx={{
								position: 'absolute',
								bottom: -8,
								right: -8,
								bgcolor: 'primary.main',
								color: 'white',
								'&:hover': {
									bgcolor: 'primary.dark',
								},
								width: 32,
								height: 32,
							}}
							onClick={handleOpenDialog}
						>
							<PhotoCameraIcon fontSize="small" />
						</IconButton>
					</Box>
					<Box>
						<Typography variant="h4" gutterBottom>
							{user.username || 'User'}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{user.email}
						</Typography>
					</Box>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Typography variant="h5" gutterBottom>
					Account Information
				</Typography>

				<Card sx={{ mb: 3 }}>
					<CardContent>
						<List>
							<ListItem>
								<PersonIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Username"
									secondary={user.username || 'Not set'}
								/>
							</ListItem>
							<ListItem>
								<EmailIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Email"
									secondary={user.email}
								/>
							</ListItem>
							<ListItem>
								<CalendarTodayIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Member Since"
									secondary={
										user.createdAt
											? new Date(
													user.createdAt
												).toLocaleDateString()
											: 'Unknown'
									}
								/>
							</ListItem>
						</List>
					</CardContent>
				</Card>

				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button variant="outlined" color="primary" disabled>
						Edit Profile (Coming Soon)
					</Button>
					<Button variant="outlined" color="secondary" disabled>
						Change Password (Coming Soon)
					</Button>
				</Box>
			</Paper>

			{/* Profile Image Dialog */}
			<Dialog
				open={open}
				onClose={handleCloseDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Update Profile Image</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Image URL"
						type="url"
						fullWidth
						variant="outlined"
						value={imageUrl}
						onChange={e => setImageUrl(e.target.value)}
						placeholder="https://example.com/image.jpg"
						helperText="Enter a valid image URL"
					/>
					{imageUrl && (
						<Box sx={{ mt: 2, textAlign: 'center' }}>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 1 }}
							>
								Preview:
							</Typography>
							<Avatar
								src={imageUrl}
								sx={{ width: 100, height: 100, mx: 'auto' }}
								onError={() => {
									setSnackbar({
										open: true,
										message: 'Invalid image URL',
										severity: 'warning',
									});
								}}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button
						onClick={handleUpdateImage}
						variant="contained"
						disabled={loading || !imageUrl.trim()}
					>
						{loading ? 'Updating...' : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default Profile;
