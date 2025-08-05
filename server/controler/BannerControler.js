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
            .sort({ 'images.order': 1, createdAt: -1 })
            .populate('uploadedBy', 'name email');
            
        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get banners by type (using POST)
// @route   POST /api/banner/filter
// @access  Public
exports.getBannersByType = async (req, res) => {
    try {
        const { bannerType, isActive } = req.body;
        
        // Validate bannerType against enum values
        const validTypes = ['homepage', 'promotional', 'category', 'product', 'sidebar', 'footer', 'loginPage', 'signupPage'];
        
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
            .sort({ 'images.order': 1, createdAt: -1 })
            .populate('uploadedBy', 'name email');
            
        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (err) {
        console.error(err);
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
                const userId =req?.user?._id

        const { images, bannerType, isActive, startDate, endDate, redirectUrl } = req.body;
        // Validate required fields
        if (!images || !Array.isArray(images) || images.length === 0 ) {
            return res.status(400).json({
                success: false,
                error: 'Images array and uploadedBy are required fields'
            });
        }

        // Validate each image in the array
        for (const image of images) {
            if (!image.url || !image.publicId || !image.mobilePublicId) {
                return res.status(400).json({
                    success: false,
                    error: 'Each image must have url, publicId, and mobilePublicId'
                });
            }
        }

        const banner = await Banner.create({
            images,
            bannerType: bannerType || 'homepage',
            isActive: isActive !== undefined ? isActive : true,
            startDate,
            endDate,
            redirectUrl,
            uploadedBy:userId|| "",
            
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
        
        const { images, ...updateData } = req.body;
        
        // If updating images array
        if (images && Array.isArray(images)) {
            // Validate each image in the array
            for (const image of images) {
                if (!image.url || !image.publicId || !image.mobilePublicId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Each image must have url, publicId, and mobilePublicId'
                    });
                }
            }
            updateData.images = images;
        }
        
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
            console.error(err);
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
        
        // Here you would typically delete images from Cloudinary
        // for (const image of banner.images) {
        //     await cloudinary.uploader.destroy(image.publicId);
        //     await cloudinary.uploader.destroy(image.mobilePublicId);
        // }
        
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
        console.error(err);
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
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update banner image order
// @route   PATCH /api/banners/:id/order
// @access  Private/Admin
exports.updateBannerImageOrder = async (req, res) => {
    try {
        const { imageId, newOrder } = req.body;
        
        if (!imageId || newOrder === undefined) {
            return res.status(400).json({
                success: false,
                error: 'imageId and newOrder are required'
            });
        }
        
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                error: 'Banner not found'
            });
        }
        
        // Find the image in the array
        const imageIndex = banner.images.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Image not found in banner'
            });
        }
        
        // Update the order
        banner.images[imageIndex].order = newOrder;
        
        // Sort images by order
        banner.images.sort((a, b) => a.order - b.order);
        
        await banner.save();
        
        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};