import React from 'react';
import {
	Container,
	Paper,
	Typography,
	Box,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemText,
	Button,
	Card,
	CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
	const { user } = useAuth();

	if (!user) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Typography variant="h6" color="text.secondary">
					Please log in to view your profile.
				</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
					<Avatar
						sx={{
							width: 80,
							height: 80,
							mr: 3,
							bgcolor: 'primary.main',
							fontSize: '2rem',
						}}
					>
						{user.username
							? user.username.charAt(0).toUpperCase()
							: user.email.charAt(0).toUpperCase()}
					</Avatar>
					<Box>
						<Typography variant="h4" gutterBottom>
							{user.username || 'User'}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{user.email}
						</Typography>
					</Box>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Typography variant="h5" gutterBottom>
					Account Information
				</Typography>

				<Card sx={{ mb: 3 }}>
					<CardContent>
						<List>
							<ListItem>
								<PersonIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Username"
									secondary={user.username || 'Not set'}
								/>
							</ListItem>
							<ListItem>
								<EmailIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Email"
									secondary={user.email}
								/>
							</ListItem>
							<ListItem>
								<CalendarTodayIcon
									sx={{ mr: 2, color: 'primary.main' }}
								/>
								<ListItemText
									primary="Member Since"
									secondary={
										user.createdAt
											? new Date(
													user.createdAt
												).toLocaleDateString()
											: 'Unknown'
									}
								/>
							</ListItem>
						</List>
					</CardContent>
				</Card>

				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button variant="outlined" color="primary" disabled>
						Edit Profile (Coming Soon)
					</Button>
					<Button variant="outlined" color="secondary" disabled>
						Change Password (Coming Soon)
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default Profile;
