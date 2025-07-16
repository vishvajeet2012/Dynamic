const mongoose = require('mongoose');

const subCategoriesSchema = new mongoose.Schema({
    subCategoryName: { 
        type: String,
        required: true
        ,unique: true
    },
    subCategoryImage: {  
        type: String,
        required: false
    },
    imagePublicId:{
        type:String,

    },
    bannerImage:{
        type:String,
        default:null
    },
      childCategory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChildCategory'
          }],
    subCategoryDescription: {  
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
});

const SubCategoryModel = mongoose.model('SubCategory', subCategoriesSchema);
module.exports = SubCategoryModel;