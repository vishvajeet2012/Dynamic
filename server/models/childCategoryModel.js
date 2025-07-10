const mongoose = require('mongoose');

const ChildCategorySchema = new mongoose.Schema({
    ChildCategoryName: { 
        type: String,
        required: true
    },
    ChildCategoryImage: {  
        type: String,
        required: false
    },
    imagePublicId:{
        type:String,

    },
    childCategoryDescription: {  
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: false
    }
    ,
    bannerImage:{
        type:String,
        default:""
    }

});

const ChildCategoryModel = mongoose.model('childCategory', ChildCategorySchema);
module.exports = ChildCategoryModel;