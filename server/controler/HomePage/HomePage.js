const logoModel = require("../../models/admin/home/logo/Logo");

// Create or Update Logo (replaces any existing logo)
exports.createLogo = async (req, res) => {
  try {
    const { url, publicId , uploadedBy ,_id} = req.body;
   
    // Validate required fields
    if (!url || !publicId || !uploadedBy) {
      return res.status(400).json({ 
        success: false,
        message: "All fields (logoUrl, publicId, uploadedBy) are required" 
      });
    }

    // Remove all existing logos (only one logo allowed)
    await logoModel.deleteMany({});
    
    // Create new logo
    const newLogo = new logoModel({ url, publicId, uploadedBy,originalId:_id });
    await newLogo.save();
    
    res.status(201).json({ 
      success: true,
      message: "Logo created successfully", 
      logo: newLogo 
    });
    
  } catch (error) {
    console.error("Error creating logo:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating logo", 
      error: error.message
    });
  }
};

// Get Current Logo
exports.getLogo = async (req, res) => {
  try {
    // Since we only maintain one logo, we can use findOne
    const logo = await logoModel.findOne({});
    
    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "No logo found"
      });
    }
    
    res.status(200).json({
      success: true,
      logo
    });
    
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching logo",
      error: error.message
    });
  }
};

// Delete Logo
exports.deleteLogo = async (req, res) => {
  try {
    // Delete all logos (though there should only be one)
    const result = await logoModel.deleteMany({});
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No logo found to delete"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Logo deleted successfully",
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting logo",
      error: error.message
    });
  }
};