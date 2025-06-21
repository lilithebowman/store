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
	IconButton,
	Snackbar,
	Alert,
	Input,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
	const { user, updateProfileImage } = useAuth();
	const [open, setOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	const handleOpenDialog = () => {
		setSelectedFile(null);
		setPreviewUrl('');
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
		setSelectedFile(null);
		setPreviewUrl('');
	};

	const handleFileSelect = event => {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setSnackbar({
					open: true,
					message: 'Please select an image file',
					severity: 'error',
				});
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				setSnackbar({
					open: true,
					message: 'File size must be less than 5MB',
					severity: 'error',
				});
				return;
			}

			setSelectedFile(file);

			// Create preview URL
			const reader = new FileReader();
			reader.onload = e => {
				setPreviewUrl(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpdateImage = async () => {
		if (!selectedFile) {
			setSnackbar({
				open: true,
				message: 'Please select an image file',
				severity: 'warning',
			});
			return;
		}

		setLoading(true);
		try {
			await updateProfileImage(selectedFile);
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

	const getImageUrl = imagePath => {
		if (!imagePath) return null;
		// If it's already a full URL, return as is
		if (imagePath.startsWith('http')) return imagePath;
		// Otherwise, construct the URL from the server
		const baseURL =
			process.env.REACT_APP_API_URL ||
			`http://${window.location.hostname}:2048`;
		return `${baseURL}/${imagePath}`;
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
							src={getImageUrl(user.profileImage)}
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'primary.main',
								fontSize: '2rem',
							}}
						>
							{!user.profileImage
								? user.username
									? user.username.charAt(0).toUpperCase()
									: user.email.charAt(0).toUpperCase()
								: null}
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

			{/* Profile Image Upload Dialog */}
			<Dialog
				open={open}
				onClose={handleCloseDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Update Profile Image</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2, mb: 3 }}>
						<Input
							type="file"
							accept="image/*"
							onChange={handleFileSelect}
							sx={{ display: 'none' }}
							id="image-upload-input"
						/>
						<label htmlFor="image-upload-input">
							<Button
								variant="outlined"
								component="span"
								startIcon={<CloudUploadIcon />}
								fullWidth
								sx={{ mb: 2 }}
							>
								Choose Image File
							</Button>
						</label>

						{selectedFile && (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 2 }}
							>
								Selected: {selectedFile.name}
							</Typography>
						)}

						{previewUrl && (
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 1 }}
								>
									Preview:
								</Typography>
								<Avatar
									src={previewUrl}
									sx={{ width: 120, height: 120, mx: 'auto' }}
								/>
							</Box>
						)}

						<Typography
							variant="caption"
							color="text.secondary"
							display="block"
							sx={{ mt: 2 }}
						>
							• Supported formats: JPG, PNG, GIF, WebP
							<br />
							• Maximum file size: 5MB
							<br />• Recommended size: 300x300 pixels
						</Typography>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button
						onClick={handleUpdateImage}
						variant="contained"
						disabled={loading || !selectedFile}
					>
						{loading ? 'Uploading...' : 'Upload Image'}
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
