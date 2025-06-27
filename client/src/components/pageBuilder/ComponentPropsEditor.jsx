import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	FormControlLabel,
	InputLabel,
	Select,
	MenuItem,
	Switch,
	Box,
	Typography,
	Tab,
	Tabs,
	Alert,
} from '@mui/material';
import { getComponentById } from './ComponentRegistry';
import RichTextEditor from '../common/RichTextEditor/RichTextEditor';

const ComponentPropsEditor = ({ open, component, onClose, onSave }) => {
	const [props, setProps] = useState({});
	const [tabValue, setTabValue] = useState(0);
	const [jsonError, setJsonError] = useState('');

	const componentConfig = getComponentById(component?.componentId);

	useEffect(() => {
		if (component && componentConfig) {
			setProps({ ...componentConfig.defaultProps, ...component.props });
		}
	}, [component, componentConfig]);

	const handlePropChange = (propPath, value) => {
		setProps(prev => {
			const newProps = { ...prev };

			// Handle nested property paths (e.g., "product.name")
			if (propPath.includes('.')) {
				const parts = propPath.split('.');
				let current = newProps;

				for (let i = 0; i < parts.length - 1; i++) {
					if (!current[parts[i]]) {
						current[parts[i]] = {};
					}
					current = current[parts[i]];
				}

				current[parts[parts.length - 1]] = value;
			} else {
				newProps[propPath] = value;
			}

			return newProps;
		});
	};

	const getPropValue = propPath => {
		if (propPath.includes('.')) {
			const parts = propPath.split('.');
			let current = props;

			for (const part of parts) {
				if (!current || typeof current !== 'object') return '';
				current = current[part];
			}

			return current || '';
		}
		return props[propPath] || '';
	};

	const handleJsonChange = jsonText => {
		try {
			const parsed = JSON.parse(jsonText);
			setProps(parsed);
			setJsonError('');
		} catch (error) {
			setJsonError(error.message);
		}
	};

	const renderPropEditor = (propKey, propConfig) => {
		const value = getPropValue(propKey);

		switch (propConfig.type) {
		case 'text':
			return (
				<TextField
					key={propKey}
					fullWidth
					label={propConfig.label}
					value={value}
					onChange={e =>
						handlePropChange(propKey, e.target.value)
					}
					margin="normal"
				/>
			);

		case 'textarea':
			return (
				<TextField
					key={propKey}
					fullWidth
					label={propConfig.label}
					value={value}
					onChange={e =>
						handlePropChange(propKey, e.target.value)
					}
					margin="normal"
					multiline
					rows={4}
				/>
			);

		case 'richtext':
			return (
				<Box key={propKey} sx={{ mb: 2 }}>
					<Typography variant="subtitle2" gutterBottom>
						{propConfig.label}
					</Typography>
					<RichTextEditor
						value={value || ''}
						onChange={content =>
							handlePropChange(propKey, content)
						}
						placeholder="Enter your content..."
						height={200}
					/>
					<Typography variant="caption" color="text.secondary">
						Use the toolbar to format text with bold, italic,
						and links
					</Typography>
				</Box>
			);

		case 'number':
			return (
				<TextField
					key={propKey}
					fullWidth
					label={propConfig.label}
					type="number"
					value={value}
					onChange={e =>
						handlePropChange(
							propKey,
							parseFloat(e.target.value) || 0
						)
					}
					margin="normal"
				/>
			);

		case 'boolean':
			return (
				<FormControlLabel
					key={propKey}
					control={
						<Switch
							checked={Boolean(value)}
							onChange={e =>
								handlePropChange(propKey, e.target.checked)
							}
						/>
					}
					label={propConfig.label}
					sx={{ mt: 2, mb: 1 }}
				/>
			);

		case 'select':
			return (
				<FormControl key={propKey} fullWidth margin="normal">
					<InputLabel>{propConfig.label}</InputLabel>
					<Select
						value={value}
						label={propConfig.label}
						onChange={e =>
							handlePropChange(propKey, e.target.value)
						}
					>
						{propConfig.options?.map(option => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			);

		case 'color':
			return (
				<TextField
					key={propKey}
					fullWidth
					label={propConfig.label}
					type="color"
					value={value}
					onChange={e =>
						handlePropChange(propKey, e.target.value)
					}
					margin="normal"
				/>
			);

		case 'object':
			return (
				<Box key={propKey} sx={{ mb: 2 }}>
					<Typography variant="subtitle2" gutterBottom>
						{propConfig.label}
					</Typography>
					<TextField
						fullWidth
						value={JSON.stringify(value, null, 2)}
						onChange={e => {
							try {
								const parsed = JSON.parse(e.target.value);
								handlePropChange(propKey, parsed);
								setJsonError('');
							} catch (error) {
								setJsonError(
									`${propKey}: ${error.message}`
								);
							}
						}}
						multiline
						rows={4}
						variant="outlined"
						placeholder="Enter valid JSON..."
					/>
					<Typography variant="caption" color="text.secondary">
						Enter valid JSON object
					</Typography>
				</Box>
			);

		default:
			return (
				<TextField
					key={propKey}
					fullWidth
					label={propConfig.label}
					value={value}
					onChange={e =>
						handlePropChange(propKey, e.target.value)
					}
					margin="normal"
				/>
			);
		}
	};

	if (!componentConfig) {
		return null;
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>Edit {componentConfig.name} Properties</DialogTitle>
			<DialogContent>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
					<Tabs
						value={tabValue}
						onChange={(e, newValue) => setTabValue(newValue)}
					>
						<Tab label="Visual Editor" />
						<Tab label="JSON Editor" />
					</Tabs>
				</Box>

				{tabValue === 0 && (
					<Box sx={{ pt: 1 }}>
						{Object.entries(
							componentConfig.editableProps || {}
						).map(([propKey, propConfig]) => {
							// For buttons, conditionally show properties based on actionType
							if (component?.componentId === 'button') {
								const currentActionType =
									getPropValue('actionType') || 'custom';

								// Always show basic properties
								if (
									[
										'label',
										'variant',
										'color',
										'size',
										'fullWidth',
										'actionType',
									].includes(propKey)
								) {
									return renderPropEditor(
										propKey,
										propConfig
									);
								}

								// Show link properties only when actionType is 'link'
								if (
									propKey === 'linkUrl' &&
									currentActionType !== 'link'
								) {
									return null;
								}

								// Show product properties only when actionType is 'addToCart'
								if (
									[
										'productId',
										'productName',
										'productPrice',
										'productImage',
										'productDescription',
									].includes(propKey) &&
									currentActionType !== 'addToCart'
								) {
									return null;
								}
							}

							return renderPropEditor(propKey, propConfig);
						})}

						{Object.keys(componentConfig.editableProps || {})
							.length === 0 && (
							<Alert severity="info">
								This component has no editable properties.
							</Alert>
						)}
					</Box>
				)}

				{tabValue === 1 && (
					<Box sx={{ pt: 1 }}>
						<Typography variant="subtitle2" gutterBottom>
							Edit Raw JSON Properties
						</Typography>
						<TextField
							fullWidth
							value={JSON.stringify(props, null, 2)}
							onChange={e => handleJsonChange(e.target.value)}
							multiline
							rows={12}
							variant="outlined"
							placeholder="Enter valid JSON..."
							error={!!jsonError}
							helperText={jsonError}
						/>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ mt: 1, display: 'block' }}
						>
							Advanced users can edit the raw JSON properties
							here. Make sure the JSON is valid.
						</Typography>
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={() => onSave(props)}
					variant="contained"
					disabled={!!jsonError}
				>
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ComponentPropsEditor.propTypes = {
	open: PropTypes.bool.isRequired,
	component: PropTypes.shape({
		componentId: PropTypes.string.isRequired,
		props: PropTypes.object,
	}),
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export default ComponentPropsEditor;
