const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        mobileUrl: {
            type: String,
            default: ""
        },
        mobilePublicId: {
            type: String,
            required: true
        },
        order: {
            type: String,
            default:""
        }
        


    }],
    bannerType: {
        type: String,
        enum: ['homepage', 'promotional', 'category', 'product', 'sidebar', 'footer',"loginPage", "signupPage"],
        required: true,
        default: 'homepage'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    redirectUrl: {
        type: String,
        required: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

bannerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;