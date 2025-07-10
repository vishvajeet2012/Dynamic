const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryImage:{
        type:String,
      
    },
    imagePublicId:{
        type:String,

    },
    categoryDescription:{
        type:String,
        required:true
    },
    bannerImage:{
        type:String,
        default:null
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
      }],
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