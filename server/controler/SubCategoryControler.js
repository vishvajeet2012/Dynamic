const SubCategoryModel = require('../models/SubCategoryModel');
exports.CreateSubCategory =async(req,res)=>{
    try{
        console.log(req.body ,"dsf   ")
        const {SubCategoryName, SubCategoryImage,SubCategoryDescription,}=req.body
    if(!SubCategoryName || !SubCategoryImage || !SubCategoryDescription ){
        return res.status(400).json({message:"Please provide all required fields"})
    }


const newSubCategory=new SubCategoryModel({
     SubCategoryName,
    SubCategoryImage,
SubCategoryDescription,
    
    
});
await newSubCategory.save()
        res.status(201).json({ message: 'Subcategory created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subcategory', error });
    }



}