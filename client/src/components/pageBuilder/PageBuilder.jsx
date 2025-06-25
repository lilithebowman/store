import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
	Box,
	Paper,
	Typography,
	IconButton,
	Tooltip,
	Grid,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Card,
	CardContent,
	Button,
	Divider,
} from '@mui/material';
import {
	Delete as DeleteIcon,
	Edit as EditIcon,
	DragIndicator as DragIcon,
	ExpandMore as ExpandMoreIcon,
	Add as AddIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { getComponentsByCategory, renderComponent } from './ComponentRegistry';
import ComponentPropsEditor from './ComponentPropsEditor';

const PageBuilder = ({
	initialComponents = [],
	onChange,
	height = '100vh',
}) => {
	const [components, setComponents] = useState(initialComponents);
	const [editingComponent, setEditingComponent] = useState(null);
	const [propsEditorOpen, setPropsEditorOpen] = useState(false);

	const componentsByCategory = getComponentsByCategory() || {};

	const handleDragEnd = useCallback(
		result => {
			const { destination, source, draggableId, type } = result;

			if (!destination) return;

			if (type === 'component-reorder') {
				// Reordering existing components
				if (destination.index === source.index) return;

				const newComponents = Array.from(components);
				const [reorderedComponent] = newComponents.splice(
					source.index,
					1
				);
				newComponents.splice(destination.index, 0, reorderedComponent);

				setComponents(newComponents);
				onChange?.(newComponents);
			} else if (type === 'component-add') {
				// Adding new component from palette
				const componentId = draggableId;
				const newComponent = {
					id: uuidv4(),
					componentId,
					props: {},
				};

				const newComponents = Array.from(components);
				newComponents.splice(destination.index, 0, newComponent);

				setComponents(newComponents);
				onChange?.(newComponents);
			}
		},
		[components, onChange]
	);

	const addComponent = componentId => {
		const newComponent = {
			id: uuidv4(),
			componentId,
			props: {},
		};

		const newComponents = [...components, newComponent];
		setComponents(newComponents);
		onChange?.(newComponents);
	};

	const deleteComponent = componentId => {
		const newComponents = components.filter(
			comp => comp.id !== componentId
		);
		setComponents(newComponents);
		onChange?.(newComponents);
	};

	const editComponent = component => {
		setEditingComponent(component);
		setPropsEditorOpen(true);
	};

	const updateComponentProps = (componentId, newProps) => {
		const newComponents = components.map(comp =>
			comp.id === componentId
				? { ...comp, props: { ...comp.props, ...newProps } }
				: comp
		);
		setComponents(newComponents);
		onChange?.(newComponents);
	};

	const handlePropsEditorClose = () => {
		setPropsEditorOpen(false);
		setEditingComponent(null);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Grid
				container
				spacing={3}
				sx={{
					height: height === 'auto' ? 'auto' : height,
					minHeight: '500px',
				}}
			>
				{/* Component Palette */}
				<Grid item xs={12} md={3}>
					<Paper
						sx={{
							p: 2,
							height: height === 'auto' ? 'auto' : '100%',
							minHeight: '500px',
							overflowY: 'auto',
						}}
					>
						<Typography variant="h6" gutterBottom>
							Component Library
						</Typography>

						{Object.entries(componentsByCategory).map(
							([category, categoryComponents]) => (
								<Accordion key={category} defaultExpanded>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
									>
										<Typography variant="subtitle1">
											{category}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												gap: 1,
											}}
										>
											{categoryComponents.map(
												component => (
													<Droppable
														key={component.id}
														droppableId={`palette-${component.id}`}
														type="component-add"
														isDropDisabled={true}
													>
														{provided => (
															<Card
																ref={
																	provided.innerRef
																}
																{...provided.droppableProps}
																sx={{
																	cursor: 'grab',
																	'&:hover': {
																		bgcolor:
																			'action.hover',
																		transform:
																			'scale(1.02)',
																	},
																	transition:
																		'all 0.2s ease',
																}}
															>
																<Draggable
																	draggableId={
																		component.id
																	}
																	index={0}
																	type="component-add"
																>
																	{(
																		provided,
																		snapshot
																	) => (
																		<CardContent
																			ref={
																				provided.innerRef
																			}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																			sx={{
																				p: 1.5,
																				'&:last-child':
																					{
																						pb: 1.5,
																					},
																				opacity:
																					snapshot.isDragging
																						? 0.5
																						: 1,
																				display:
																					'flex',
																				alignItems:
																					'center',
																				gap: 1,
																			}}
																		>
																			<span
																				style={{
																					fontSize:
																						'1.2em',
																				}}
																			>
																				{
																					component.icon
																				}
																			</span>
																			<Box
																				sx={{
																					flex: 1,
																				}}
																			>
																				<Typography
																					variant="body2"
																					fontWeight="medium"
																				>
																					{
																						component.name
																					}
																				</Typography>
																			</Box>
																			<Button
																				size="small"
																				startIcon={
																					<AddIcon />
																				}
																				onClick={e => {
																					e.stopPropagation();
																					addComponent(
																						component.id
																					);
																				}}
																			>
																				Add
																			</Button>
																		</CardContent>
																	)}
																</Draggable>
																{
																	provided.placeholder
																}
															</Card>
														)}
													</Droppable>
												)
											)}
										</Box>
									</AccordionDetails>
								</Accordion>
							)
						)}
					</Paper>
				</Grid>

				{/* Page Canvas */}
				<Grid item xs={12} md={9}>
					<Paper
						sx={{
							p: 2,
							height: height === 'auto' ? 'auto' : '100%',
							minHeight: '500px',
							overflowY: 'auto',
						}}
					>
						<Typography variant="h6" gutterBottom>
							Page Canvas
						</Typography>
						<Divider sx={{ mb: 2 }} />

						<Droppable
							droppableId="page-canvas"
							type="component-reorder"
						>
							{(provided, snapshot) => (
								<Box
									ref={provided.innerRef}
									{...provided.droppableProps}
									sx={{
										minHeight: 400,
										bgcolor: snapshot.isDraggingOver
											? 'action.hover'
											: 'background.default',
										border: '2px dashed',
										borderColor: snapshot.isDraggingOver
											? 'primary.main'
											: 'divider',
										borderRadius: 1,
										p: 2,
										transition: 'all 0.2s ease',
									}}
								>
									{components.length === 0 ? (
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												height: 200,
												color: 'text.secondary',
												flexDirection: 'column',
												gap: 1,
											}}
										>
											<Typography variant="h6">
												Drag components here to build
												your page
											</Typography>
											<Typography variant="body2">
												Or click &quot;Add&quot; buttons
												from the component library
											</Typography>
										</Box>
									) : (
										components.map((component, index) => (
											<Draggable
												key={component.id}
												draggableId={component.id}
												index={index}
												type="component-reorder"
											>
												{(provided, snapshot) => (
													<Box
														ref={provided.innerRef}
														{...provided.draggableProps}
														sx={{
															mb: 2,
															position:
																'relative',
															opacity:
																snapshot.isDragging
																	? 0.5
																	: 1,
															transform:
																snapshot.isDragging
																	? 'rotate(5deg)'
																	: 'none',
															transition:
																'all 0.2s ease',
															'&:hover .component-controls':
																{
																	opacity: 1,
																},
														}}
													>
														{/* Component Controls */}
														<Box
															className="component-controls"
															sx={{
																position:
																	'absolute',
																top: -8,
																right: -8,
																display: 'flex',
																gap: 0.5,
																opacity: 0,
																transition:
																	'opacity 0.2s ease',
																zIndex: 10,
															}}
														>
															<Tooltip title="Drag to reorder">
																<IconButton
																	{...provided.dragHandleProps}
																	size="small"
																	sx={{
																		bgcolor:
																			'background.paper',
																		boxShadow: 1,
																	}}
																>
																	<DragIcon />
																</IconButton>
															</Tooltip>
															<Tooltip title="Edit properties">
																<IconButton
																	size="small"
																	onClick={() =>
																		editComponent(
																			component
																		)
																	}
																	sx={{
																		bgcolor:
																			'background.paper',
																		boxShadow: 1,
																	}}
																>
																	<EditIcon />
																</IconButton>
															</Tooltip>
															<Tooltip title="Delete component">
																<IconButton
																	size="small"
																	onClick={() =>
																		deleteComponent(
																			component.id
																		)
																	}
																	color="error"
																	sx={{
																		bgcolor:
																			'background.paper',
																		boxShadow: 1,
																	}}
																>
																	<DeleteIcon />
																</IconButton>
															</Tooltip>
														</Box>

														{/* Component Wrapper */}
														<Paper
															variant="outlined"
															sx={{
																p: 1,
																border: snapshot.isDragging
																	? '2px solid'
																	: '1px solid',
																borderColor:
																	snapshot.isDragging
																		? 'primary.main'
																		: 'divider',
																bgcolor:
																	'background.paper',
															}}
														>
															{renderComponent(
																component
															)}
														</Paper>
													</Box>
												)}
											</Draggable>
										))
									)}
									{provided.placeholder}
								</Box>
							)}
						</Droppable>
					</Paper>
				</Grid>
			</Grid>

			{/* Props Editor Dialog */}
			{editingComponent && (
				<ComponentPropsEditor
					open={propsEditorOpen}
					component={editingComponent}
					onClose={handlePropsEditorClose}
					onSave={newProps => {
						updateComponentProps(editingComponent.id, newProps);
						handlePropsEditorClose();
					}}
				/>
			)}
		</DragDropContext>
	);
};

PageBuilder.propTypes = {
	initialComponents: PropTypes.array,
	onChange: PropTypes.func,
	height: PropTypes.string,
};

export default PageBuilder;
