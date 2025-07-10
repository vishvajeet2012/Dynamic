const SubCategoryModel = require('../models/SubCategoryModel');
const categoryModel = require('../models/CategoryModel');



exports.createSubCategory = async (req, res) => {
    try {
        const { subCategoryName, subCategoryImage, subCategoryDescription, category, isActive ,imagePublicId,bannerImage} = req.body;
        
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
            isActive: isActive !== undefined ? isActive : true,
            imagePublicId,
            bannerImage
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

        // Get fully populated category in a separate query
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



exports.updateSubCategory = async (req, res) => {
    try {
     
        const {category,subCategoryId, subCategoryName, subCategoryImage, subCategoryDescription, isActive ,imagePublicId,bannerImage} = req.body
                const result = await SubCategoryModel.findByIdAndUpdate(subCategoryId, {
                    subCategoryName,
                    subCategoryImage,
                    subCategoryDescription,
                    isActive,
                    imagePublicId,
                    bannerImage
                }, { new: true });

                  // Update category (without populate first)
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            category,
            { 
                $push: { subcategories: result._id },
                $set: { isActive: true } 
            },
            { new: true }
        );


                res.status(200).json({
                    message: 'Subcategory updated successfully',
                    subcategory: result     
                })
    }catch(error)
    {
        res.status(500).json({ message: 'Error updating subcategory', error });
    }

}