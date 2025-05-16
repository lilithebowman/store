import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const EmojiPlaceholder = ({ width = 200, height = 200, emojiCount = 10 }) => {
	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Generate random emojis
		const emojis = [];
		for (let i = 0; i < emojiCount; i++) {
			const emoji = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 80)); // Random emoji from U+1F600 to U+1F64F
			emojis.push(emoji);
		}

		// Draw emojis on the canvas
		emojis.forEach((emoji) => {
			const x = Math.random() * (canvas.width - 30); // Random x position
			const y = Math.random() * (canvas.height - 30); // Random y position
			ctx.font = '30px Arial';
			ctx.fillText(emoji, x, y);
		});
	}, [width, height, emojiCount]);

	return <canvas ref={canvasRef} width={width} height={height} />;
};

// Add PropTypes validation for EmojiPlaceholder
EmojiPlaceholder.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	emojiCount: PropTypes.number,
};

export default EmojiPlaceholder;