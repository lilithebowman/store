import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Alert } from '@mui/material';
import { renderComponent } from './ComponentRegistry';

const PageRenderer = ({ components = [], containerProps = {} }) => {
	if (!Array.isArray(components)) {
		console.error('PageRenderer: components prop must be an array');
		return <Alert severity="error">Invalid page configuration</Alert>;
	}

	// Check if we should use full width (no container)
	const useFullWidth =
		containerProps?.maxWidth === false ||
		containerProps?.disableGutters === true;

	if (useFullWidth) {
		// Render without Container for full-width layouts
		return (
			<Box sx={{ width: '100%', ...containerProps?.sx }}>
				{components.length === 0 ? (
					<Container>
						<Alert severity="info">
							This page has no components yet.
						</Alert>
					</Container>
				) : (
					components.map((component, index) => (
						<Box key={component.id || index} sx={{ mb: 2 }}>
							{renderComponent(component)}
						</Box>
					))
				)}
			</Box>
		);
	}

	// Default behavior with Container
	return (
		<Container {...containerProps}>
			<Box sx={{ py: 2 }}>
				{components.length === 0 ? (
					<Alert severity="info">
						This page has no components yet.
					</Alert>
				) : (
					components.map((component, index) => (
						<Box key={component.id || index} sx={{ mb: 2 }}>
							{renderComponent(component)}
						</Box>
					))
				)}
			</Box>
		</Container>
	);
};

PageRenderer.propTypes = {
	components: PropTypes.array,
	containerProps: PropTypes.object,
};

export default PageRenderer;
