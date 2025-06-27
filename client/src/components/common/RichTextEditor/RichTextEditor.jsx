import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
	Box,
	IconButton,
	Toolbar,
	Paper,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import PropTypes from 'prop-types';
import './RichTextEditor.css';

const StyledEditor = styled('div')(({ theme, height }) => ({
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
	'&:focus-within': {
		borderColor: theme.palette.primary.main,
		borderWidth: 2,
	},
	'& .editor-content': {
		minHeight: height || 200,
		padding: theme.spacing(1),
		outline: 'none',
		fontSize: '14px',
		lineHeight: 1.5,
		fontFamily: theme.typography.fontFamily,
		'&:empty:before': {
			content: 'attr(data-placeholder)',
			color: theme.palette.text.secondary,
			fontStyle: 'italic',
		},
	},
}));

const RichTextEditor = ({
	value = '',
	onChange,
	placeholder = 'Start typing...',
	height = 200,
	disabled = false,
	className = '',
	...props
}) => {
	const editorRef = useRef(null);
	const lastInternalContentRef = useRef('');
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');
	const [linkText, setLinkText] = useState('');
	const [selectedRange, setSelectedRange] = useState(null);

	// Set initial content and handle external value changes
	useEffect(() => {
		if (editorRef.current) {
			// Only update if the value is different from what we last sent internally
			// and it's different from the current content
			const currentContent = editorRef.current.innerHTML;
			if (
				value !== lastInternalContentRef.current &&
				value !== currentContent
			) {
				// Save cursor position
				const selection = window.getSelection();
				const range =
					selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
				const startOffset = range ? range.startOffset : 0;
				const endOffset = range ? range.endOffset : 0;
				const startContainer = range ? range.startContainer : null;

				// Update content
				editorRef.current.innerHTML = value;
				lastInternalContentRef.current = value;

				// Try to restore cursor position
				if (
					range &&
					startContainer &&
					editorRef.current.contains(startContainer)
				) {
					try {
						const newRange = document.createRange();
						newRange.setStart(
							startContainer,
							Math.min(
								startOffset,
								startContainer.textContent?.length || 0
							)
						);
						newRange.setEnd(
							startContainer,
							Math.min(
								endOffset,
								startContainer.textContent?.length || 0
							)
						);
						selection.removeAllRanges();
						selection.addRange(newRange);
					} catch (e) {
						// If we can't restore the exact position, just place cursor at the end
						const newRange = document.createRange();
						newRange.selectNodeContents(editorRef.current);
						newRange.collapse(false);
						selection.removeAllRanges();
						selection.addRange(newRange);
					}
				}
			}
		}
	}, [value]);

	// Handle content changes
	const handleContentChange = useCallback(() => {
		if (editorRef.current && onChange) {
			const content = editorRef.current.innerHTML;
			lastInternalContentRef.current = content;
			onChange(content);
		}
	}, [onChange]);

	// Execute command and update content
	const executeCommand = useCallback(
		(command, value = null) => {
			document.execCommand(command, false, value);
			handleContentChange();
		},
		[handleContentChange]
	);

	// Handle keyboard shortcuts
	const handleKeyDown = useCallback(
		e => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key.toLowerCase()) {
				case 'b':
					e.preventDefault();
					executeCommand('bold');
					break;
				case 'i':
					e.preventDefault();
					executeCommand('italic');
					break;
				default:
					break;
				}
			}
		},
		[executeCommand]
	);

	// Handle bold toggle
	const handleBold = useCallback(() => {
		executeCommand('bold');
	}, [executeCommand]);

	// Handle italic toggle
	const handleItalic = useCallback(() => {
		executeCommand('italic');
	}, [executeCommand]);

	// Handle link creation
	const handleLink = useCallback(() => {
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			setSelectedRange(range);
			setLinkText(selection.toString());
			setLinkDialogOpen(true);
		}
	}, []);

	// Apply link
	const applyLink = useCallback(() => {
		if (selectedRange && linkUrl) {
			// Restore selection
			const selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(selectedRange);

			if (linkText && linkText !== selection.toString()) {
				// Replace selected text with new text
				selection.deleteFromDocument();
				const textNode = document.createTextNode(linkText);
				selectedRange.insertNode(textNode);
				selection.selectNode(textNode);
			}

			// Create link
			executeCommand('createLink', linkUrl);
		}
		setLinkDialogOpen(false);
		setLinkUrl('');
		setLinkText('');
		setSelectedRange(null);
	}, [selectedRange, linkUrl, linkText, executeCommand]);

	// Cancel link dialog
	const cancelLink = useCallback(() => {
		setLinkDialogOpen(false);
		setLinkUrl('');
		setLinkText('');
		setSelectedRange(null);
	}, []);

	// Check if command is active
	const isCommandActive = useCallback(command => {
		try {
			return document.queryCommandState(command);
		} catch (e) {
			return false;
		}
	}, []);

	return (
		<Box className={`rich-text-editor ${className}`} {...props}>
			<Paper elevation={1}>
				{/* Toolbar */}
				<Toolbar
					variant="dense"
					role="toolbar"
					sx={{
						minHeight: 48,
						borderBottom: 1,
						borderColor: 'divider',
					}}
				>
					<IconButton
						size="small"
						onClick={handleBold}
						color={isCommandActive('bold') ? 'primary' : 'default'}
						disabled={disabled}
						title="Bold (Ctrl+B)"
					>
						<FormatBoldIcon />
					</IconButton>
					<IconButton
						size="small"
						onClick={handleItalic}
						color={
							isCommandActive('italic') ? 'primary' : 'default'
						}
						disabled={disabled}
						title="Italic (Ctrl+I)"
					>
						<FormatItalicIcon />
					</IconButton>
					<IconButton
						size="small"
						onClick={handleLink}
						disabled={disabled}
						title="Insert Link"
					>
						<LinkIcon />
					</IconButton>
				</Toolbar>

				{/* Editor Content */}
				<StyledEditor height={height}>
					<div
						ref={editorRef}
						className="editor-content"
						contentEditable={!disabled}
						onInput={handleContentChange}
						onKeyDown={handleKeyDown}
						data-placeholder={placeholder}
						suppressContentEditableWarning={true}
					/>
				</StyledEditor>
			</Paper>

			{/* Link Dialog */}
			<Dialog
				open={linkDialogOpen}
				onClose={cancelLink}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Create Link</DialogTitle>
				<DialogContent>
					<TextField
						label="Link Text"
						value={linkText}
						onChange={e => setLinkText(e.target.value)}
						fullWidth
						margin="normal"
						variant="outlined"
					/>
					<TextField
						label="URL"
						value={linkUrl}
						onChange={e => setLinkUrl(e.target.value)}
						fullWidth
						margin="normal"
						variant="outlined"
						placeholder="https://example.com"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={cancelLink}>Cancel</Button>
					<Button
						onClick={applyLink}
						variant="contained"
						disabled={!linkUrl}
					>
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

RichTextEditor.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

export default RichTextEditor;
