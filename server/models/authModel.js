require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    firstName: {
        type: String,
        default: "guest"
    },
    lastName: {
        type: String,
        default: "user"
    },
    email: {
        type: String,
        default: "",
        lowercase: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        default: 'prefer-not-to-say'
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be longer than 500 characters'],
        default: ''
    },
    originalId: {
        type: String,
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    addedToCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    isGuest: {
        type: Boolean,
        default: false
    },
    guestToken: {
        type: String
    },
    guestExpiry: {
        type: Date
    },
    otpExpiry: {
        type: Date,
    },
    lastLogin: {
        type: Date
    },
    mobileNumber: {
        type: String,
        unique: true,
        default: ""
    },

    // ✅ Updated Address Schema (Multiple addresses)
    addresses: [
        {       email:{type:String,default:function (){
        return this.parent().email 
        }},
            fullAddress: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
            isDefault: { type: Boolean, default: false },
            phoneNo:{type:String ,default:function (){
                return this.parent().mobileNumber}}
        }
    ],

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: {
                type: String,
                required: true
            },
            size: {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'OS'],
                required: true
            },
        }
    ],
    preferences: {
        newsletter: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        }
    }
}, { timestamps: true });

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            isAdmin: this.isAdmin,
            isSeller: this.isSeller
        },
        process.env.JWT_KEY,
        { expiresIn: '30d' }
    );
};

// Generate OTP
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return otp;
};

const User = model('User', userSchema);
module.exports = User;
