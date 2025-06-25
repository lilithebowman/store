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
	Alert,
	Snackbar,
	Tooltip,
	Chip,
	Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import WebIcon from '@mui/icons-material/Web';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const PageManagement = () => {
	const { user, userPermissions } = useAuth();
	const navigate = useNavigate();
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	useEffect(() => {
		fetchPages();
	}, []);

	const fetchPages = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(`${baseURL}/pages`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				setPages(data);
			} else {
				throw new Error('Failed to fetch pages');
			}
		} catch (error) {
			console.error('Error fetching pages:', error);
			setSnackbar({
				open: true,
				message: 'Failed to load pages',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const openDeleteDialog = page => {
		setSelectedPage(page);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedPage(null);
	};

	const handleCreatePage = () => {
		navigate('/admin/pages/edit/new');
	};

	const handleEditPage = page => {
		navigate(`/admin/pages/edit/${page.id}`);
	};

	const handleDeletePage = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(
				`${baseURL}/pages/${selectedPage.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setPages(pages.filter(page => page.id !== selectedPage.id));
				setSnackbar({
					open: true,
					message: 'Page deleted successfully',
					severity: 'success',
				});
			} else {
				throw new Error('Failed to delete page');
			}
		} catch (error) {
			console.error('Error deleting page:', error);
			setSnackbar({
				open: true,
				message: 'Failed to delete page',
				severity: 'error',
			});
		} finally {
			closeDeleteDialog();
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Check permissions
	const canAddPage = user && (user.isAdmin || userPermissions?.add_page);
	const canEditPage = user && (user.isAdmin || userPermissions?.edit_page);
	const canDeletePage =
		user && (user.isAdmin || userPermissions?.delete_page);

	// Check if current user has any page permissions
	if (
		!user ||
		(!user.isAdmin &&
			!userPermissions?.add_page &&
			!userPermissions?.edit_page &&
			!userPermissions?.delete_page)
	) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="error">
					Access denied. Page management permissions required.
				</Alert>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Typography variant="h6">Loading pages...</Typography>
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
						<WebIcon sx={{ mr: 2, color: 'primary.main' }} />
						<Typography variant="h4" component="h1">
							Page Management
						</Typography>
					</Box>
					{canAddPage && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreatePage}
						>
							Add Page
						</Button>
					)}
				</Box>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell>Slug</TableCell>
								<TableCell>Route</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Updated</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{pages.map(page => (
								<TableRow key={page.id}>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="medium"
										>
											{page.title}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ fontFamily: 'monospace' }}
										>
											/{page.slug}
										</Typography>
									</TableCell>
									<TableCell>
										<Link
											component={RouterLink}
											to={`/pages/${page.slug}`}
											variant="body2"
											sx={{
												fontFamily: 'monospace',
												textDecoration: 'none',
												color: 'primary.main',
												'&:hover': {
													textDecoration: 'underline',
												},
											}}
										>
											/pages/{page.slug}
										</Link>
									</TableCell>
									<TableCell>
										<Chip
											label={page.status}
											color={
												page.status === 'published'
													? 'success'
													: 'default'
											}
											size="small"
											icon={
												page.status === 'published' ? (
													<VisibilityIcon />
												) : (
													<VisibilityOffIcon />
												)
											}
										/>
									</TableCell>
									<TableCell>
										{page.createdAt
											? new Date(
												page.createdAt
											).toLocaleDateString()
											: 'Unknown'}
									</TableCell>
									<TableCell>
										{page.updatedAt
											? new Date(
												page.updatedAt
											).toLocaleDateString()
											: 'Unknown'}
									</TableCell>
									<TableCell align="center">
										{canEditPage && (
											<Tooltip title="Edit Page">
												<IconButton
													color="primary"
													size="small"
													onClick={() =>
														handleEditPage(page)
													}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
										)}
										{canDeletePage && (
											<Tooltip title="Delete Page">
												<IconButton
													color="error"
													size="small"
													onClick={() =>
														openDeleteDialog(page)
													}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{pages.length === 0 && (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" color="text.secondary">
							No pages found
						</Typography>
					</Box>
				)}
			</Paper>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={closeDeleteDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Confirm Page Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the page &quot;
						{selectedPage?.title}&quot;? This action cannot be
						undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog}>Cancel</Button>
					<Button
						onClick={handleDeletePage}
						color="error"
						variant="contained"
					>
						Delete Page
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

export default PageManagement;
