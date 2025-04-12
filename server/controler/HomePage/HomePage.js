const cloudinary = require('cloudinary').v2;
const { settingsCollection } = require('../../models/admin/home/logo/Logo');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  /**
   * Upload logo to Cloudinary
   */
  uploadLogo: async (req, res) => {
    try {
    
   console.log(req.body)
      if (!req.body.logo || !req.body.logo.startsWith('data:image/')) {
        return res.status(400).json({ success: false, message: "paga no iamge data" });
      }

      const uploadResult = await cloudinary.uploader.upload(req.body, {
        folder: 'company/logos',
        public_id: `logo_${Date.now()}`,
        transformation: [
          { width: 300, height: 300, crop: 'fit', quality: 'auto' },
          { format: 'png' }
        ]
      });

      await settingsCollection.findOneAndUpdate(
        { settingType: 'siteConfig' },
        { 
          $set: { 
            logo: uploadResult.secure_url,
            logoPublicId: uploadResult.public_id 
          } 
        },
        { upsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Logo uploaded successfully",
        logoUrl: uploadResult.secure_url
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload logo",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get current logo
   */
  getLogo: async (req, res) => {  // Changed from getCurrentLogo to getLogo
    try {
      const settings = await settingsCollection.findOne({ settingType: 'siteConfig' });
      
      if (!settings?.logo) {
        return res.status(404).json({ 
          success: false, 
          message: "No logo configured" 
        });
      }

      res.status(200).json({
        success: true,
        logoUrl: settings.logo,
        lastUpdated: settings.updatedAt
      });
    } catch (error) {
      console.error("Get logo error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch logo",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Delete logo
   */
  deleteLogo: async (req, res) => {
    try {
      const settings = await settingsCollection.findOne({ settingType: 'siteConfig' });
      
      if (!settings?.logoPublicId) {
        return res.status(404).json({ 
          success: false, 
          message: "No logo to delete" 
        });
      }

      await cloudinary.uploader.destroy(settings.logoPublicId);
      await settingsCollection.updateOne(
        { settingType: 'siteConfig' },
        { $unset: { logo: "", logoPublicId: "" } }
      );

      res.status(200).json({ 
        success: true,
        message: "Logo deleted successfully" 
      });
    } catch (error) {
      console.error("Delete logo error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete logo",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};