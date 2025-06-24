const Banner = require('../models/admin/home/bannerSchema');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
    try {
        const { type, active } = req.query;
        
        let query = {};
        
        if (type) {
            query.bannerType = type;
        }
        
        if (active === 'true') {
            query.isActive = true;
            // Also filter banners that are within their date range if dates exist
            query.$or = [
                { startDate: { $exists: false }, endDate: { $exists: false } },
                { 
                    $and: [
                        { startDate: { $lte: new Date() } },
                        { endDate: { $gte: new Date() } }
                    ]
                }
            ];
        }
        
        const banners = await Banner.find(query)
            .sort({ position: 1, createdAt: -1 })
            .populate('uploadedBy', 'name email');
            
        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public// @desc    Get banners by type (using POST)
// @route   POST /api/banners/filter
// @access  Public
exports.getBannersByType = async (req, res) => {
    try {
        const { bannerType, isActive } = req.body;
        
        // Validate bannerType against enum values
        const validTypes = ['homepage', 'promotional', 'category', 'product', 'sidebar', 'footer'];
        
        if (bannerType && !validTypes.includes(bannerType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid banner type',
                validTypes: validTypes
            });
        }
        
        // Build query object
        const query = {};
        
        if (bannerType) {
            query.bannerType = bannerType;
        }
        
        if (typeof isActive !== 'undefined') {
            query.isActive = isActive;
            
            // If active, also check date ranges
            if (isActive) {
                query.$or = [
                    { startDate: { $exists: false }, endDate: { $exists: false } },
                    { 
                        $and: [
                            { startDate: { $lte: new Date() } },
                            { endDate: { $gte: new Date() } }
                        ]
                    }
                ];
            }
        }
        
        const banners = await Banner.find(query)
            .sort({ position: 1, createdAt: -1 })
            .populate('uploadedBy', 'name email');
            
        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin

exports.createBanner = async (req, res) => {
    try {
        const { url, publicId, bannerType, isActive, startDate, endDate, redirectUrl, uploadedBy } = req.body;
        
        // Validate required fields
        if (!url || !publicId || !uploadedBy) {
            return res.status(400).json({
                success: false,
                error: 'URL, publicId, and uploadedBy are required fields'
            });
        }

        const banner = await Banner.create({
            url,
            publicId,
            bannerType: bannerType || 'homepage',
            isActive: isActive !== undefined ? isActive : true,
            startDate,
            endDate,
            redirectUrl,
            uploadedBy
        });
        
        res.status(201).json({
            success: true,
            data: banner
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            console.error(err);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};
// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
    try {
        let banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        
        // Check if user is authorized to update this banner
        // if (banner.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(401).json({
        //         success: false,
        //         error: 'Not authorized to update this banner'
        //     });
        // }
        
        const { image, publicId, ...updateData } = req.body;
        
        // If you want to handle image updates
        // if (image) {
        //     // First delete old image from Cloudinary
        //     await cloudinary.uploader.destroy(banner.publicId);
            
        //     // Upload new image
        //     const uploadedResponse = await cloudinary.uploader.upload(image, {
        //         upload_preset: 'banner_preset'
        //     });
            
        //     updateData.url = uploadedResponse.secure_url;
        //     updateData.publicId = uploadedResponse.public_id;
        // }
        
        banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        } else if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        
        // Check if user is authorized to delete this banner
        // if (banner.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(401).json({
        //         success: false,
        //         error: 'Not authorized to delete this banner'
        //     });
        // }
        
        // Delete image from Cloudinary
        // await cloudinary.uploader.destroy(banner.publicId);
        
        await banner.remove();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Toggle banner active status
// @route   PATCH /api/banners/:id/toggle-active
// @access  Private/Admin
exports.toggleBannerActive = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        
        banner.isActive = !banner.isActive;
        await banner.save();
        
        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};