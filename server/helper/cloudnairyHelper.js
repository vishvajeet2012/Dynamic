require("dotenv").config();
const cloudnairy = require("cloudinary").v2;

// Configure only once at the top level
cloudnairy.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary using upload_stream
 * @param {Buffer} fileBuffer - req.file.buffer
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadedToCloudnairy = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudnairy.uploader.upload_stream(
      {
        folder: "your-folder-name", // optional: customize
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer); // <-- pass buffer from memoryStorage
  });
};

module.exports = uploadedToCloudnairy;
