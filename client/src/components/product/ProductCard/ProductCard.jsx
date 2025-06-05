import React, { useRef, useEffect } from 'react';
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
	const canvasRef = useRef(null);

	const handleAddToCart = () => {
		addToCart(product);
	};
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const width = canvas.width;
			const height = canvas.height;

			// Clear the canvas
			ctx.clearRect(0, 0, width, height);

			// Draw no-entry emoji
			ctx.font = '100px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('⛔', width / 2, height / 2 - 20);

			// Draw "Image Not Found" text with stroke
			ctx.font = '20px Arial';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.strokeText('Image Not Found', width / 2, height / 2 + 40);
			ctx.fillStyle = 'white';
			ctx.fillText('Image Not Found', width / 2, height / 2 + 40);
		}
	}, []);

	const handleImageError = (e) => {
		e.target.style.display = 'none';
		const canvas = canvasRef.current;
		canvas.style.display = 'block';
	};

	const imageSrc = product.image || 'path/to/substitute/image.jpg'; // Replace with the actual path to the substitute image

	return (
		<Card sx={{ maxWidth: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
			<CardMedia
				component="img"
				height="300"
				image={imageSrc}
				alt={product.name}
				onError={handleImageError}
				style={{ display: 'block' }}
			/>
			<canvas
				ref={canvasRef}
				width="400"
				height="300"
				style={{ display: 'none' }}
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
		image: PropTypes.string,
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.string.isRequired,
	}).isRequired,
};

export default ProductCard;