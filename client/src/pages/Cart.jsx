import React from 'react';
import {
	Container,
	Typography,
	List,
	ListItem,
	Box,
	IconButton,
	TextField,
	Button,
	Card,
	CardContent,
	Divider,
	Avatar,
} from '@mui/material';
import {
	Delete as DeleteIcon,
	Add as AddIcon,
	Remove as RemoveIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
	const {
		cartItems,
		removeFromCart,
		updateQuantity,
		getTotalPrice,
		clearCart,
	} = useCart();

	const handleQuantityChange = (itemId, newQuantity) => {
		const quantity = parseInt(newQuantity, 10);
		if (!isNaN(quantity) && quantity >= 0) {
			updateQuantity(itemId, quantity);
		}
	};

	const handleIncrement = (itemId, currentQuantity) => {
		updateQuantity(itemId, currentQuantity + 1);
	};

	const handleDecrement = (itemId, currentQuantity) => {
		if (currentQuantity > 1) {
			updateQuantity(itemId, currentQuantity - 1);
		}
	};

	const formatPrice = price => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" gutterBottom>
				Your Cart
			</Typography>

			{cartItems.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Typography
						variant="h6"
						color="text.secondary"
						gutterBottom
					>
						Your cart is empty
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Add some items to get started!
					</Typography>
				</Box>
			) : (
				<>
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<List>
								{cartItems.map((item, index) => (
									<React.Fragment key={item.id}>
										<ListItem
											sx={{
												py: 2,
												px: 0,
												display: 'flex',
												alignItems: 'center',
												gap: 2,
											}}
										>
											<Avatar
												src={item.imageUrl}
												alt={item.name}
												variant="rounded"
												sx={{ width: 80, height: 80 }}
											/>

											<Box sx={{ flex: 1, minWidth: 0 }}>
												<Typography variant="h6" noWrap>
													{item.name}
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													noWrap
												>
													{item.description}
												</Typography>
												<Typography
													variant="h6"
													color="primary"
													sx={{ mt: 1 }}
												>
													{formatPrice(item.price)}
												</Typography>
											</Box>

											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 1,
												}}
											>
												<IconButton
													size="small"
													onClick={() =>
														handleDecrement(
															item.id,
															item.quantity
														)
													}
													disabled={
														item.quantity <= 1
													}
												>
													<RemoveIcon />
												</IconButton>

												<TextField
													size="small"
													value={item.quantity}
													onChange={e =>
														handleQuantityChange(
															item.id,
															e.target.value
														)
													}
													inputProps={{
														min: 1,
														style: {
															textAlign: 'center',
															width: '50px',
														},
													}}
													variant="outlined"
												/>

												<IconButton
													size="small"
													onClick={() =>
														handleIncrement(
															item.id,
															item.quantity
														)
													}
												>
													<AddIcon />
												</IconButton>
											</Box>

											<Box
												sx={{
													minWidth: 100,
													textAlign: 'right',
												}}
											>
												<Typography variant="h6">
													{formatPrice(
														item.price *
															item.quantity
													)}
												</Typography>
											</Box>

											<IconButton
												onClick={() =>
													removeFromCart(item.id)
												}
												color="error"
												sx={{ ml: 1 }}
											>
												<DeleteIcon />
											</IconButton>
										</ListItem>
										{index < cartItems.length - 1 && (
											<Divider />
										)}
									</React.Fragment>
								))}
							</List>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									mb: 2,
								}}
							>
								<Typography variant="h5">
									Total: {formatPrice(getTotalPrice())}
								</Typography>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Button
										variant="outlined"
										color="error"
										onClick={clearCart}
									>
										Clear Cart
									</Button>
									<Button
										variant="contained"
										color="primary"
										size="large"
									>
										Proceed to Checkout
									</Button>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</>
			)}
		</Container>
	);
};

export default Cart;
