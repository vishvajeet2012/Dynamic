const categoryModel = require("../models/CategoryModel");

exports.CreateCategory =async(req,res)=>{
    try{
        console.log(req.body ,"dsf   ")
        const {categoryName,categoryImage,categoryDescription}=req.body
    if(!categoryName || !categoryImage || !categoryDescription ){
        return res.status(400).json({message:"Please provide all required fields"})
    }


const newCategory=new categoryModel({
    categoryName,
    categoryImage,
    categoryDescription,
    
});
await newCategory.save()
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }



}