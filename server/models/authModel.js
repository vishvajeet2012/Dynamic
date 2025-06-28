require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
  
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
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
        type: String, // URL to the image
        default: ''
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be longer than 500 characters'],
        default: ''
    },
    originalId: {
        type: String,
        required: true
    },
  
    socialMedia: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    mobileNumber:{
        type:"String",
        default:""
    },
    address:{
        type:"String",
        default:""  
    },
   
    
    state:{
        type:"String",
        default:""  
    },
    city:{
        type:"String",
        default:""  
    },
    pincode:{
        type:"String",
        default:""  
    },
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


userSchema.methods.genrateAuthToken = function() {
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

const User = model('User', userSchema);  
module.exports = User;