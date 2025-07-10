const childModel = require("../models/childCategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");

exports.createChildCategory = async(req,res)=>{
try {
    const {
      subCategory,
      childCategoryName,
      childCategoryImage,
      imagePublicId,
      childCategoryDescription,
      bannerImage,
      isActive
    } = req.body;

    // Validation
    if (
      !childCategoryName ||
      !childCategoryImage ||
    
      !childCategoryDescription
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        status: 400
      });
    }

    // Create child category
    const child = await childModel.create({
      childCategoryName,
      childCategoryImage,
      imagePublicId,
      childCategoryDescription,
      bannerImage,
      isActive
    });

    if (!child) {
      return res.status(500).json({ message: "Error while creating child category" });
    }

    // Handle subCategory update only if it's present
    if (subCategory && subCategory !== "") {
      const updatedChildCategory = await SubCategoryModel.findByIdAndUpdate(
        subCategory,
        {
          $push: { childCategory: child._id },
          $set: { isActive: true }
        },
        { new: true }
      );

      if (!updatedChildCategory) {
        // Rollback: delete created child category
        await childModel.findByIdAndDelete(child._id);
        return res.status(404).json({ message: "Subcategory not found" });
      }
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Child category created successfully",
      data: {
        childCategory: child
      }
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: e.message
    });
  }
};
