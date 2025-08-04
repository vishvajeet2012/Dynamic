const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter function for images only
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
};

// Multer middleware configuration for multiple images
const upload = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files at once
  },
});

// Export for multiple images upload
// Option 1: Export ready-to-use middleware
module.exports = upload.array('images', 10);

// Option 2: Export base multer instance (if you want flexibility)
// module.exports = upload; // Upload up to 10 images with field name 'images'

// Usage in your route:
/*
const multipleImageUpload = require('./path-to-this-file');

// Option 1: If using ready-to-use export
app.post('/uploadImage', auth, multipleImageUpload, uploadImageController);

// Option 2: If using base multer export
// app.post('/uploadImage', auth, multipleImageUpload.array('images', 10), uploadImageController);
*/