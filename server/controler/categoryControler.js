const categoryModel = require("../models/CategoryModel");

exports.CreateCategory =async(req,res)=>{
    try{
        console.log(req.body ,"dsf   ")
        const {categoryName,categoryImage,categoryDescription,isActive}=req.body
    if(!categoryName  || !categoryDescription ){
        return res.status(400).json({message:"Please provide all required fields"})
    }


const newCategory=new categoryModel({
    categoryName,
    categoryImage,
    categoryDescription,
    isActive
    
});
await newCategory.save()
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }

}

exports.GetAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};