const categoryModel = require("../models/CategoryModel");
const SubCategoryModel = require('../models/SubCategoryModel');
exports.CreateCategory =async(req,res)=>{
    try{
        console.log(req.body ,"dsf   ")
        const {categoryName,categoryImage,categoryDescription,isActive ,bannerImage}=req.body
    if(!categoryName  || !categoryDescription ){
        return res.status(400).json({message:"Please provide all required fields"})
    }


const newCategory=new categoryModel({
    categoryName,
    categoryImage,
    categoryDescription,
    isActive,
    bannerImage
    
});
      await newCategory.save()
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }

}

    exports.GetAllCategories = async (req, res) => {
        try {
            const categories = await categoryModel.find()
             .populate({
                path: 'subcategories',
                select: 'subCategoryName subCategoryImage subCategoryDescription isActive bannerImage',
                match: { isActive: true }, // Only populate active subcategories
                populate: {
                    path: 'childCategory',
                    select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
                    match: { isActive: true } // Only populate active child categories
                }
            });
                // .populate({
                //     path: 'subcategories',
                //     select: 'subCategoryName subCategoryImage subCategoryDescription isActive bannerImage'
                // ,match: { isActive: true } // Only populate active subcategories
                // }).populate({
                //     path:"childCategory",
                //     select:"categoryName categoryImage categoryDescription isActive bannerImage"
                // }) 

            if (!categories || categories.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'No categories found' 
                });
            }

            res.status(200).json(
            categories
            );

        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Error fetching categories',
                error: error.message 
            });
        }
    };


exports.UpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, categoryImage, categoryDescription, isActive ,imagePublicId,bannerImage } = req.body;

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            {
                categoryName,
                categoryImage,
                categoryDescription,
                isActive,
                imagePublicId,bannerImage
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

exports.DeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

exports.GetCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
};

