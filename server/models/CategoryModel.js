const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryImage:{
        type:String,
        required:true
    },
    categoryDescription:{
        type:String,
        required:true
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
      }],
      isActive: {
        type: Boolean,
        default: true
      },
})
const categoryModel=mongoose.model('Category',categorySchema)
module.exports=categoryModel