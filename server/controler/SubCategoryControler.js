const SubCategoryModel = require('../models/SubCategoryModel');

exports.createSubCategory = async (req, res) => {
    try {
        console.log(req.body)
        const { subCategoryName, subCategoryImage, subCategoryDescription } = req.body;
        
        if (!subCategoryName || !subCategoryDescription) {  
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newSubCategory = new SubCategoryModel({
            subCategoryName,
            subCategoryImage,
            subCategoryDescription
        });

        await newSubCategory.save();
        res.status(201).json({ 
            message: 'Subcategory created successfully',
            data: newSubCategory 
        });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({ 
            message: 'Error creating subcategory', 
            error: error.message 
        });
    }
};