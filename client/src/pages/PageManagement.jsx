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
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Link,
	Tab,
	Tabs,
	Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import WebIcon from '@mui/icons-material/Web';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BuildIcon from '@mui/icons-material/Build';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import PageBuilder from '../components/pageBuilder/PageBuilder';

const PageManagement = () => {
	const { user, userPermissions } = useAuth();
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);
	const [editedPage, setEditedPage] = useState({
		title: '',
		slug: '',
		content: '',
		components: [],
		status: 'draft',
		metaDescription: '',
	});
	const [editorTab, setEditorTab] = useState(0); // 0: Visual Builder, 1: Text Editor
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

	const handleDeletePage = async () => {
		if (!selectedPage) return;

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
				setPages(pages.filter(p => p.id !== selectedPage.id));
				setSnackbar({
					open: true,
					message: 'Page deleted successfully',
					severity: 'success',
				});
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete page');
			}
		} catch (error) {
			console.error('Error deleting page:', error);
			setSnackbar({
				open: true,
				message: error.message || 'Failed to delete page',
				severity: 'error',
			});
		} finally {
			setDeleteDialogOpen(false);
			setSelectedPage(null);
		}
	};

	const openDeleteDialog = pageToDelete => {
		setSelectedPage(pageToDelete);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedPage(null);
	};

	const openEditDialog = (pageToEdit = null) => {
		if (pageToEdit) {
			setSelectedPage(pageToEdit);
			setEditedPage({
				title: pageToEdit.title,
				slug: pageToEdit.slug,
				content: pageToEdit.content || '',
				components: pageToEdit.components || [],
				status: pageToEdit.status,
				metaDescription: pageToEdit.metaDescription || '',
			});
		} else {
			// Creating new page
			setSelectedPage(null);
			setEditedPage({
				title: '',
				slug: '',
				content: '',
				components: [],
				status: 'draft',
				metaDescription: '',
			});
		}
		setEditorTab(0); // Start with visual builder
		setEditDialogOpen(true);
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
		setSelectedPage(null);
		setEditedPage({
			title: '',
			slug: '',
			content: '',
			components: [],
			status: 'draft',
			metaDescription: '',
		});
	};

	const handleSavePage = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;

			const method = selectedPage ? 'PUT' : 'POST';
			const url = selectedPage
				? `${baseURL}/pages/${selectedPage.id}`
				: `${baseURL}/pages`;

			const response = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editedPage),
			});

			if (response.ok) {
				const savedPage = await response.json();

				if (selectedPage) {
					// Update existing page
					setPages(
						pages.map(p =>
							p.id === selectedPage.id ? savedPage : p
						)
					);
				} else {
					// Add new page
					setPages([...pages, savedPage]);
				}

				setSnackbar({
					open: true,
					message: `Page ${selectedPage ? 'updated' : 'created'} successfully`,
					severity: 'success',
				});
				closeEditDialog();
			} else {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						`Failed to ${selectedPage ? 'update' : 'create'} page`
				);
			}
		} catch (error) {
			console.error('Error saving page:', error);
			setSnackbar({
				open: true,
				message:
					error.message ||
					`Failed to ${selectedPage ? 'update' : 'create'} page`,
				severity: 'error',
			});
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const generateSlug = title => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleTitleChange = title => {
		setEditedPage({
			...editedPage,
			title,
			slug: !selectedPage ? generateSlug(title) : editedPage.slug,
		});
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
							onClick={() => openEditDialog()}
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
										{page.status === 'published' && (
											<Tooltip title="View Page">
												<IconButton
													color="info"
													size="small"
													component={RouterLink}
													to={`/pages/${page.slug}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													<OpenInNewIcon />
												</IconButton>
											</Tooltip>
										)}
										{canEditPage && (
											<Tooltip title="Edit Page">
												<IconButton
													color="primary"
													size="small"
													onClick={() =>
														openEditDialog(page)
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

			{/* Edit Page Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={closeEditDialog}
				maxWidth="xl"
				fullWidth
				PaperProps={{ sx: { height: '90vh' } }}
			>
				<DialogTitle>
					{selectedPage ? 'Edit Page' : 'Create Page'}
				</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<Box sx={{ pt: 2, px: 3 }}>
						<TextField
							fullWidth
							label="Page Title"
							value={editedPage.title}
							onChange={e => handleTitleChange(e.target.value)}
							margin="normal"
							required
						/>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField
								fullWidth
								label="URL Slug"
								value={editedPage.slug}
								onChange={e =>
									setEditedPage({
										...editedPage,
										slug: e.target.value,
									})
								}
								margin="normal"
								required
								helperText="The URL-friendly version of the title"
							/>
							<FormControl fullWidth margin="normal">
								<InputLabel>Status</InputLabel>
								<Select
									value={editedPage.status}
									onChange={e =>
										setEditedPage({
											...editedPage,
											status: e.target.value,
										})
									}
									label="Status"
								>
									<MenuItem value="draft">Draft</MenuItem>
									<MenuItem value="published">
										Published
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<TextField
							fullWidth
							label="Meta Description"
							value={editedPage.metaDescription}
							onChange={e =>
								setEditedPage({
									...editedPage,
									metaDescription: e.target.value,
								})
							}
							margin="normal"
							helperText="Brief description for search engines"
						/>
					</Box>

					<Divider sx={{ my: 2 }} />

					{/* Editor Tabs */}
					<Box
						sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
					>
						<Tabs
							value={editorTab}
							onChange={(e, newValue) => setEditorTab(newValue)}
						>
							<Tab
								label="Visual Builder"
								icon={<BuildIcon />}
								iconPosition="start"
							/>
							<Tab label="Text Editor" />
						</Tabs>
					</Box>

					{/* Tab Content */}
					<Box sx={{ flex: 1, overflow: 'hidden' }}>
						{editorTab === 0 && (
							<Box sx={{ height: '400px', p: 2 }}>
								<PageBuilder
									initialComponents={
										editedPage.components || []
									}
									onChange={components =>
										setEditedPage({
											...editedPage,
											components,
										})
									}
								/>
							</Box>
						)}

						{editorTab === 1 && (
							<Box sx={{ p: 3 }}>
								<TextField
									fullWidth
									label="Content"
									value={editedPage.content}
									onChange={e =>
										setEditedPage({
											...editedPage,
											content: e.target.value,
										})
									}
									multiline
									rows={12}
									helperText="Page content (Markdown supported)"
								/>
							</Box>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button
						onClick={handleSavePage}
						color="primary"
						variant="contained"
						disabled={
							!editedPage.title.trim() || !editedPage.slug.trim()
						}
					>
						{selectedPage ? 'Update Page' : 'Create Page'}
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
				<DialogTitle>Confirm Page Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the page &quot;
						{selectedPage?.title}&quot;? This action cannot be
						undone.
					</Typography>
					<Alert severity="warning" sx={{ mt: 2 }}>
						Deleting a page will make it inaccessible to visitors
						and may break existing links.
					</Alert>
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
