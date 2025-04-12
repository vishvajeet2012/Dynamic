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
    // subcategories: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'SubCategory'
    //   }],
      isActive: {
        type: Boolean,
        default: true
      },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const categoryModel=mongoose.model('Category',categorySchema)
module.exports=categoryModel