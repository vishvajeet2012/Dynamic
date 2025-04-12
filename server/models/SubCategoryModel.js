const mongoose=require('mongoose')
const subCategories = new mongoose.Schema({
    subCategoriesName: {
        type: String,
        required: true
    },
    SubCategoryImage: {
        type: String,
        required: false
    },
    SubCategoryDescription:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: false
      }
})
const subCatgoryModel =mongoose.model('SubCategory', subCategories)
module.exports = subCatgoryModel