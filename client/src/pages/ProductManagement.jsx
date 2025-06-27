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
	InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/common/RichTextEditor/RichTextEditor';

const ProductManagement = () => {
	const { user, userPermissions } = useAuth();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [editedProduct, setEditedProduct] = useState({
		name: '',
		description: '',
		price: '',
		imageUrl: '',
		stock: '',
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(`${baseURL}/products`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				setProducts(data);
			} else {
				throw new Error('Failed to fetch products');
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			setSnackbar({
				open: true,
				message: 'Failed to load products',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProduct = async () => {
		if (!selectedProduct) return;

		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const response = await fetch(
				`${baseURL}/products/${selectedProduct.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setProducts(products.filter(p => p.id !== selectedProduct.id));
				setSnackbar({
					open: true,
					message: 'Product deleted successfully',
					severity: 'success',
				});
			} else {
				const errorData = await response.json();
				throw new Error(
					errorData.message || 'Failed to delete product'
				);
			}
		} catch (error) {
			console.error('Error deleting product:', error);
			setSnackbar({
				open: true,
				message: error.message || 'Failed to delete product',
				severity: 'error',
			});
		} finally {
			setDeleteDialogOpen(false);
			setSelectedProduct(null);
		}
	};

	const openDeleteDialog = productToDelete => {
		setSelectedProduct(productToDelete);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedProduct(null);
	};

	const openEditDialog = (productToEdit = null) => {
		if (productToEdit) {
			setSelectedProduct(productToEdit);
			setEditedProduct({
				name: productToEdit.name,
				description: productToEdit.description || '',
				price: productToEdit.price
					? productToEdit.price.toString()
					: '',
				imageUrl: productToEdit.imageUrl || '',
				stock: productToEdit.stock
					? productToEdit.stock.toString()
					: '0',
			});
		} else {
			// Creating new product
			setSelectedProduct(null);
			setEditedProduct({
				name: '',
				description: '',
				price: '',
				imageUrl: '',
				stock: '0',
			});
		}
		setEditDialogOpen(true);
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
		setSelectedProduct(null);
		setEditedProduct({
			name: '',
			description: '',
			price: '',
			imageUrl: '',
			stock: '0',
		});
	};

	const handleSaveProduct = async () => {
		try {
			const baseURL =
				process.env.REACT_APP_API_BASE_URL ||
				`http://${window.location.hostname}:2048/api`;
			const method = selectedProduct ? 'PUT' : 'POST';
			const url = selectedProduct
				? `${baseURL}/products/${selectedProduct.id}`
				: `${baseURL}/products`;

			const productData = {
				...editedProduct,
				price: parseFloat(editedProduct.price) || 0,
				stock: parseInt(editedProduct.stock) || 0,
			};

			const response = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productData),
			});

			if (response.ok) {
				const savedProduct = await response.json();
				if (selectedProduct) {
					// Update existing product
					setProducts(
						products.map(p =>
							p.id === selectedProduct.id ? savedProduct : p
						)
					);
				} else {
					// Add new product
					setProducts([...products, savedProduct]);
				}
				setSnackbar({
					open: true,
					message: `Product ${selectedProduct ? 'updated' : 'created'} successfully`,
					severity: 'success',
				});
				closeEditDialog();
			} else {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						`Failed to ${selectedProduct ? 'update' : 'create'} product`
				);
			}
		} catch (error) {
			console.error('Error saving product:', error);
			setSnackbar({
				open: true,
				message:
					error.message ||
					`Failed to ${selectedProduct ? 'update' : 'create'} product`,
				severity: 'error',
			});
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Check permissions
	const canAddProduct =
		user && (user.isAdmin || userPermissions?.add_product);
	const canEditProduct =
		user && (user.isAdmin || userPermissions?.edit_product);
	const canDeleteProduct =
		user && (user.isAdmin || userPermissions?.delete_product);

	// Check if current user has any product permissions
	if (
		!user ||
		(!user.isAdmin &&
			!userPermissions?.add_product &&
			!userPermissions?.edit_product &&
			!userPermissions?.delete_product)
	) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="error">
					Access denied. Product management permissions required.
				</Alert>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Typography variant="h6">Loading products...</Typography>
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
						<Inventory2Icon sx={{ mr: 2, color: 'primary.main' }} />
						<Typography variant="h4" component="h1">
							Product Management
						</Typography>
					</Box>
					{canAddProduct && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => openEditDialog()}
						>
							Add Product
						</Button>
					)}
				</Box>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Price</TableCell>
								<TableCell>Stock</TableCell>
								<TableCell>Created</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{products.map(product => (
								<TableRow key={product.id}>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="medium"
										>
											{product.name}
										</Typography>
									</TableCell>
									<TableCell>
										<Box
											sx={{
												maxWidth: 200,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
											dangerouslySetInnerHTML={{
												__html:
													product.description ||
													'No description',
											}}
										/>
									</TableCell>
									<TableCell>
										$
										{(() => {
											const price =
												typeof product.price ===
												'number'
													? product.price
													: parseFloat(
															product.price || 0
														);
											return isNaN(price)
												? '0.00'
												: price.toFixed(2);
										})()}
									</TableCell>
									<TableCell>
										{product.stock !== undefined
											? product.stock
											: 'N/A'}
									</TableCell>
									<TableCell>
										{product.createdAt
											? new Date(
													product.createdAt
												).toLocaleDateString()
											: 'Unknown'}
									</TableCell>
									<TableCell align="center">
										{canEditProduct && (
											<Tooltip title="Edit Product">
												<IconButton
													color="primary"
													size="small"
													onClick={() =>
														openEditDialog(product)
													}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
										)}
										{canDeleteProduct && (
											<Tooltip title="Delete Product">
												<IconButton
													color="error"
													size="small"
													onClick={() =>
														openDeleteDialog(
															product
														)
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

				{products.length === 0 && (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" color="text.secondary">
							No products found
						</Typography>
					</Box>
				)}
			</Paper>

			{/* Edit Product Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={closeEditDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					{selectedProduct ? 'Edit Product' : 'Create Product'}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<TextField
							fullWidth
							label="Product Name"
							value={editedProduct.name}
							onChange={e =>
								setEditedProduct({
									...editedProduct,
									name: e.target.value,
								})
							}
							margin="normal"
							required
						/>
						<Box sx={{ mb: 2 }}>
							<Typography variant="subtitle2" gutterBottom>
								Description
							</Typography>
							<RichTextEditor
								value={editedProduct.description || ''}
								onChange={content =>
									setEditedProduct({
										...editedProduct,
										description: content,
									})
								}
								placeholder="Enter product description..."
								height={150}
							/>
						</Box>
						<TextField
							fullWidth
							label="Price"
							type="number"
							value={editedProduct.price}
							onChange={e =>
								setEditedProduct({
									...editedProduct,
									price: e.target.value,
								})
							}
							margin="normal"
							required
							inputProps={{
								min: 0,
								step: 0.01,
							}}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										$
									</InputAdornment>
								),
							}}
						/>
						<TextField
							fullWidth
							label="Stock Quantity"
							type="number"
							value={editedProduct.stock}
							onChange={e =>
								setEditedProduct({
									...editedProduct,
									stock: e.target.value,
								})
							}
							margin="normal"
						/>
						<TextField
							fullWidth
							label="Image URL"
							value={editedProduct.imageUrl}
							onChange={e =>
								setEditedProduct({
									...editedProduct,
									imageUrl: e.target.value,
								})
							}
							margin="normal"
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button
						onClick={handleSaveProduct}
						color="primary"
						variant="contained"
						disabled={
							!editedProduct.name.trim() ||
							!editedProduct.price ||
							isNaN(parseFloat(editedProduct.price)) ||
							parseFloat(editedProduct.price) < 0
						}
					>
						{selectedProduct ? 'Update Product' : 'Create Product'}
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
				<DialogTitle>Confirm Product Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the product &quot;
						{selectedProduct?.name}&quot;? This action cannot be
						undone.
					</Typography>
					<Alert severity="warning" sx={{ mt: 2 }}>
						Deleting a product will permanently remove it from the
						store and may affect existing orders.
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog}>Cancel</Button>
					<Button
						onClick={handleDeleteProduct}
						color="error"
						variant="contained"
					>
						Delete Product
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

export default ProductManagement;
