const SubCategoryModel = require('../models/SubCategoryModel');
const categoryModel = require('../models/CategoryModel');

exports.createSubCategory = async (req, res) => {
    try {
        const { subCategoryName, subCategoryImage, subCategoryDescription, category, isActive } = req.body;
        
        // Validation
        if (!subCategoryName || !subCategoryDescription || !category) {
            return res.status(400).json({ 
                message: "Missing required fields" 
            });
        }

        // Create subcategory
        const newSubCategory = await SubCategoryModel.create({
            subCategoryName,
            subCategoryImage,
            subCategoryDescription,
            isActive: isActive !== undefined ? isActive : true
        });

        // Update category (without populate first)
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            category,
            { 
                $push: { subcategories: newSubCategory._id },
                $set: { isActive: true } 
            },
            { new: true }
        );

        if (!updatedCategory) {
            await SubCategoryModel.findByIdAndDelete(newSubCategory._id);
            return res.status(404).json({ message: 'Category not found' });
        }

        const populatedCategory = await categoryModel.findById(updatedCategory._id)
            .populate({
                path: 'subcategories',
                model: 'SubCategory',
                select: 'subCategoryName subCategoryImage subCategoryDescription isActive'
            });

        res.status(201).json({
            success: true,
            data: {
                subcategory: newSubCategory,
                category: populatedCategory
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};