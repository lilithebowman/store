import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	Container,
	Paper,
	Typography,
	Box,
	CircularProgress,
	Alert,
	Chip,
	Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PageRenderer from '../components/pageBuilder/PageRenderer';

// Styled component for content with basic markdown-like styling
const PageContent = styled(Box)(({ theme }) => ({
	'& p': {
		marginBottom: theme.spacing(2),
		lineHeight: 1.6,
	},
	'& h1, & h2, & h3, & h4, & h5, & h6': {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
		fontWeight: 600,
	},
	'& h1': {
		fontSize: '2rem',
	},
	'& h2': {
		fontSize: '1.75rem',
	},
	'& h3': {
		fontSize: '1.5rem',
	},
	'& ul, & ol': {
		marginBottom: theme.spacing(2),
		paddingLeft: theme.spacing(3),
	},
	'& li': {
		marginBottom: theme.spacing(0.5),
	},
	'& blockquote': {
		borderLeft: `4px solid ${theme.palette.primary.main}`,
		paddingLeft: theme.spacing(2),
		margin: theme.spacing(2, 0),
		fontStyle: 'italic',
		backgroundColor: theme.palette.grey[50],
		padding: theme.spacing(1, 2),
	},
	'& code': {
		backgroundColor: theme.palette.grey[100],
		padding: theme.spacing(0.25, 0.5),
		borderRadius: theme.shape.borderRadius,
		fontFamily: 'monospace',
		fontSize: '0.875rem',
	},
	'& pre': {
		backgroundColor: theme.palette.grey[100],
		padding: theme.spacing(2),
		borderRadius: theme.shape.borderRadius,
		overflow: 'auto',
		'& code': {
			backgroundColor: 'transparent',
			padding: 0,
		},
	},
}));

const Page = () => {
	const { slug } = useParams();
	const [page, setPage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPage = async () => {
			try {
				setLoading(true);
				const baseURL =
					process.env.REACT_APP_API_BASE_URL ||
					`http://${window.location.hostname}:2048/api`;

				const response = await fetch(`${baseURL}/pages/slug/${slug}`);

				if (response.ok) {
					const data = await response.json();
					setPage(data);
				} else if (response.status === 404) {
					setError('Page not found');
				} else {
					throw new Error('Failed to fetch page');
				}
			} catch (error) {
				console.error('Error fetching page:', error);
				setError('Failed to load page');
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchPage();
		}
	}, [slug]);

	// Function to render content - now handles HTML from RichTextEditor
	const renderContent = content => {
		if (!content) return null;

		// If content contains HTML tags, render as HTML
		if (content.includes('<') && content.includes('>')) {
			return (
				<Box
					dangerouslySetInnerHTML={{ __html: content }}
					sx={{
						'& p': { marginBottom: 2 },
						'& h1, & h2, & h3, & h4, & h5, & h6': {
							marginTop: 3,
							marginBottom: 2,
							fontWeight: 600,
						},
						'& ul, & ol': {
							marginBottom: 2,
							paddingLeft: 3,
						},
						'& li': {
							marginBottom: 0.5,
						},
						'& a': {
							color: 'primary.main',
							textDecoration: 'underline',
							'&:hover': {
								color: 'primary.dark',
							},
						},
						'& strong, & b': {
							fontWeight: 'bold',
						},
						'& em, & i': {
							fontStyle: 'italic',
						},
					}}
				/>
			);
		}

		// Fallback for plain text content (legacy support)
		const paragraphs = content.split('\n\n').filter(p => p.trim());

		return paragraphs.map((paragraph, index) => {
			// Handle different content types
			if (paragraph.startsWith('# ')) {
				return (
					<Typography
						key={index}
						variant="h3"
						component="h1"
						gutterBottom
					>
						{paragraph.substring(2)}
					</Typography>
				);
			}
			if (paragraph.startsWith('## ')) {
				return (
					<Typography
						key={index}
						variant="h4"
						component="h2"
						gutterBottom
					>
						{paragraph.substring(3)}
					</Typography>
				);
			}
			if (paragraph.startsWith('### ')) {
				return (
					<Typography
						key={index}
						variant="h5"
						component="h3"
						gutterBottom
					>
						{paragraph.substring(4)}
					</Typography>
				);
			}

			// Regular paragraph
			return (
				<Typography key={index} variant="body1" paragraph>
					{paragraph}
				</Typography>
			);
		});
	};

	if (loading) {
		return (
			<Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
				<CircularProgress />
				<Typography variant="h6" sx={{ mt: 2 }}>
					Loading page...
				</Typography>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
				<Typography variant="body1">
					The page you&apos;re looking for doesn&apos;t exist or is
					not published.
				</Typography>
			</Container>
		);
	}

	if (!page) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="warning">Page not found</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={2} sx={{ p: 4 }}>
				{/* Page Header */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="h2" component="h1" gutterBottom>
						{page.title}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							mb: 2,
						}}
					>
						<Chip
							label={page.status}
							color={
								page.status === 'published'
									? 'success'
									: 'default'
							}
							size="small"
						/>
						{page.publishedAt && (
							<Typography variant="body2" color="text.secondary">
								Published on{' '}
								{new Date(
									page.publishedAt
								).toLocaleDateString()}
							</Typography>
						)}
					</Box>

					{page.metaDescription && (
						<Typography
							variant="subtitle1"
							color="text.secondary"
							sx={{ fontStyle: 'italic', mb: 2 }}
						>
							{page.metaDescription}
						</Typography>
					)}

					{page.author && (
						<Typography variant="body2" color="text.secondary">
							By {page.author.username}
						</Typography>
					)}
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* Page Content */}
				<PageContent>
					{/* Render components if they exist */}
					{page.components && page.components.length > 0 ? (
						<PageRenderer
							components={page.components}
							containerProps={{
								maxWidth: false,
								disableGutters: true,
							}}
						/>
					) : page.content ? (
						renderContent(page.content)
					) : (
						<Typography variant="body1" color="text.secondary">
							This page has no content yet.
						</Typography>
					)}
				</PageContent>

				{/* Page Footer */}
				{(page.createdAt || page.updatedAt) && (
					<>
						<Divider sx={{ mt: 4, mb: 2 }} />
						<Box sx={{ display: 'flex', gap: 3 }}>
							{page.createdAt && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Created:{' '}
									{new Date(
										page.createdAt
									).toLocaleDateString()}
								</Typography>
							)}
							{page.updatedAt &&
								page.updatedAt !== page.createdAt && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Last updated:{' '}
									{new Date(
										page.updatedAt
									).toLocaleDateString()}
								</Typography>
							)}
						</Box>
					</>
				)}
			</Paper>
		</Container>
	);
};

export default Page;
