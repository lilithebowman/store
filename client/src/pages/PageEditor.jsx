import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Container,
	Paper,
	Typography,
	Box,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	Snackbar,
	Tab,
	Tabs,
	AppBar,
	Toolbar,
	IconButton,
	Breadcrumbs,
	Link,
} from '@mui/material';
import {
	Save as SaveIcon,
	Preview as PreviewIcon,
	ArrowBack as ArrowBackIcon,
	Build as BuildIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PageBuilder from '../components/pageBuilder/PageBuilder';

const PageEditor = () => {
	const { pageId } = useParams(); // 'new' for new pages or actual ID for editing
	const navigate = useNavigate();
	const { user, userPermissions } = useAuth();

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
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

	const isNewPage = pageId === 'new';

	useEffect(() => {
		if (!isNewPage) {
			fetchPage();
		}
	}, [pageId]);

	const fetchPage = async () => {
		try {
			setLoading(true);
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(`${baseURL}/pages/${pageId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const page = await response.json();
				setEditedPage({
					title: page.title,
					slug: page.slug,
					content: page.content || '',
					components: page.components || [],
					status: page.status,
					metaDescription: page.metaDescription || '',
				});
			} else {
				throw new Error('Failed to fetch page');
			}
		} catch (error) {
			console.error('Error fetching page:', error);
			setSnackbar({
				open: true,
				message: 'Failed to load page',
				severity: 'error',
			});
			navigate('/admin/pages');
		} finally {
			setLoading(false);
		}
	};

	const handleTitleChange = title => {
		setEditedPage(prev => ({
			...prev,
			title,
			slug: prev.slug || generateSlug(title),
		}));
	};

	const generateSlug = title => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	};

	const handleSavePage = async () => {
		try {
			setSaving(true);
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;

			const method = isNewPage ? 'POST' : 'PUT';
			const url = isNewPage
				? `${baseURL}/pages`
				: `${baseURL}/pages/${pageId}`;

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
				setSnackbar({
					open: true,
					message: isNewPage
						? 'Page created successfully!'
						: 'Page updated successfully!',
					severity: 'success',
				});

				// Navigate to edit mode if this was a new page
				if (isNewPage) {
					navigate(`/admin/pages/edit/${savedPage.id}`, {
						replace: true,
					});
				}
			} else {
				throw new Error('Failed to save page');
			}
		} catch (error) {
			console.error('Error saving page:', error);
			setSnackbar({
				open: true,
				message: 'Failed to save page',
				severity: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	const handlePreview = () => {
		if (editedPage.slug) {
			window.open(`/pages/${editedPage.slug}`, '_blank');
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Check permissions
	const canAddPage = user && (user.isAdmin || userPermissions?.add_page);
	const canEditPage = user && (user.isAdmin || userPermissions?.edit_page);

	if (!user || (!canAddPage && isNewPage) || (!canEditPage && !isNewPage)) {
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
				<Typography variant="h6">Loading page...</Typography>
			</Container>
		);
	}

	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: 'background.default',
			}}
		>
			{/* Header Bar */}
			<AppBar position="static" color="default" elevation={1}>
				<Toolbar>
					<IconButton
						edge="start"
						onClick={() => navigate('/admin/pages')}
						sx={{ mr: 2 }}
					>
						<ArrowBackIcon />
					</IconButton>

					<Box sx={{ flexGrow: 1 }}>
						<Breadcrumbs>
							<Link
								component="button"
								variant="body1"
								onClick={() => navigate('/admin/pages')}
								sx={{ textDecoration: 'none' }}
							>
								Page Management
							</Link>
							<Typography color="text.primary">
								{isNewPage ? 'New Page' : 'Edit Page'}
							</Typography>
						</Breadcrumbs>
						{editedPage.title && (
							<Typography variant="h6" sx={{ mt: 0.5 }}>
								{editedPage.title}
							</Typography>
						)}
					</Box>

					<Box sx={{ display: 'flex', gap: 1 }}>
						{!isNewPage && editedPage.slug && (
							<Button
								variant="outlined"
								startIcon={<PreviewIcon />}
								onClick={handlePreview}
							>
								Preview
							</Button>
						)}
						<Button
							variant="contained"
							startIcon={<SaveIcon />}
							onClick={handleSavePage}
							disabled={
								!editedPage.title.trim() ||
								!editedPage.slug.trim() ||
								saving
							}
						>
							{saving
								? 'Saving...'
								: isNewPage
									? 'Create Page'
									: 'Save Page'}
						</Button>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Container maxWidth="xl" sx={{ py: 3 }}>
				<Paper sx={{ mb: 3 }}>
					{/* Page Settings */}
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom>
							Page Settings
						</Typography>

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
				</Paper>

				{/* Editor Section */}
				<Paper>
					{/* Editor Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={editorTab}
							onChange={(e, newValue) => setEditorTab(newValue)}
							sx={{ px: 3 }}
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
					<Box>
						{editorTab === 0 && (
							<Box sx={{ p: 2 }}>
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
									height="auto"
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
									rows={20}
									helperText="Page content (Markdown supported)"
								/>
							</Box>
						)}
					</Box>
				</Paper>
			</Container>

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
		</Box>
	);
};

export default PageEditor;
