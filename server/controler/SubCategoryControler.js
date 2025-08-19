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
                $addToSet: { subcategories: newSubCategory._id },
                $set: { isActive: true } 
            },
            { new: true }
        );

        if (!updatedCategory) {
            await SubCategoryModel.findByIdAndDelete(newSubCategory._id);
            return res.status(404).json({ message: 'Category not found' });
        }

    

        res.status(201).json({
            success: true,
            data: {
                subcategory: newSubCategory,
             
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



// controllers/subCategoryController.js

exports.updateSubCategory = async (req, res) => {
  try {
    const {
      category,
      subCategoryId,
      subCategoryName,
      subCategoryImage,
      subCategoryDescription,
      isActive,
      imagePublicId,
      bannerImage
    } = req.body;

    // 1️⃣ Update the subcategory itself
    const result = await SubCategoryModel.findByIdAndUpdate(
      subCategoryId,
      {
        subCategoryName,
        subCategoryImage,
        subCategoryDescription,
        isActive,
        imagePublicId,
        bannerImage
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // 2️⃣ Link subcategory to category without creating duplicates
    await categoryModel.findByIdAndUpdate(
      category,
      { 
        $addToSet: { subcategories: result._id }, // prevents duplicate adds
        $set: { isActive: true }
      },
      { new: true }
    );

    // 3️⃣ (Optional) Deduplicate existing old data if needed
    await categoryModel.updateOne(
      { _id: category },
      [
        { 
          $set: {
            subcategories: { $setUnion: ["$subcategories", []] } // keeps only unique IDs
          }
        }
      ]
    );

    // 4️⃣ Respond to client
    res.status(200).json({
      message: 'Subcategory updated successfully',
      subcategory: result
    });

  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Error updating subcategory', error });
  }
};








/////// get child categoryby subcategory//////////////////////
exports.getChildCategoryById = async (req, res) => {
  try {
    const { subCategoryId } = req.body;
console.log(subCategoryId)
    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'subCategoryId is required',
      });
    }

    // Find the subcategory by ID and populate active child categories
    const subCategory = await SubCategoryModel.findById(subCategoryId).populate({
      path: 'childCategory',
      select: 'childCategoryName childCategoryImage isActive bannerImage',
      match: { isActive: true },
    });

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategory',
      error: error.message,
    });
  }
};
