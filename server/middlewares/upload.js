const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile-images');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		// Generate unique filename: userId-timestamp-originalname
		const userId = req.userId || req.user?.id || 'anonymous';
		const timestamp = Date.now();
		const extension = path.extname(file.originalname);
		const filename = `${userId}-${timestamp}${extension}`;
		cb(null, filename);
	}
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
	// Check if file is an image
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed!'), false);
	}
};

// Configure multer
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	}
});

// Export single file upload for profile images
module.exports = {
	uploadProfileImage: upload.single('profileImage'),
	uploadDir
};
