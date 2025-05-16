import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import { useCart } from '../../../contexts/CartContext';

const ProductCard = ({ product }) => {
	const { addToCart } = useCart();
	
	const handleAddToCart = () => {
		addToCart(product);
	};
	
	return (
		<Card sx={{ maxWidth: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
			<CardMedia
				component="img"
				height="300"
				image={product.image}
				alt={product.name}
			/>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography gutterBottom variant="h5" component="div">
					{product.name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{product.description}
				</Typography>
				<Box sx={{ mt: 2 }}>
					<Typography variant="h6" color="primary">
						${product.price}
					</Typography>
				</Box>
			</CardContent>
			<CardActions>
				<Button 
					size="small" 
					variant="contained" 
					startIcon={<ShoppingCartIcon />}
					onClick={handleAddToCart}
					fullWidth
				>
					Add to Cart
				</Button>
			</CardActions>
		</Card>
	);
};

ProductCard.propTypes = {
	product: PropTypes.shape({
		image: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.number.isRequired,
	}).isRequired,
};

export default ProductCard;