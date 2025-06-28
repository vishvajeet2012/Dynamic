const SubCategoryModel = require('../models/SubCategoryModel');
const categoryModel = require('../models/CategoryModel');



exports.createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, subCategoryImage, subCategoryDescription, category, isActive } = req.body;

    // Validation
    if (!subCategoryName || !subCategoryDescription || !category) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields (subCategoryName, subCategoryDescription, category)" 
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Create subcategory
    const newSubCategory = await SubCategory.create({
      subCategoryName,
      subCategoryImage,
      subCategoryDescription,
      category,
      isActive: isActive !== undefined ? isActive : true
    });

    // Update category with new subcategory
    const updatedCategory = await Category.findByIdAndUpdate(
      category,
      { 
        $push: { subcategories: newSubCategory._id },
        $set: { isActive: true } 
      },
      { new: true }
    ).populate('subcategories'); // Populate subcategories after update

    res.status(201).json({
      success: true,
      data: {
        subcategory: newSubCategory,
        category: updatedCategory
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