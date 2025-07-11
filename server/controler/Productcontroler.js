const Product = require('../models/ProductModel');

// Create a new product
const Products = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');



exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      basePrice,
      discount = 0,
      category,
      subcategories,
      childCategory,
      images = [],
      stock = 0,
      isNewArrival = false,
      color,
       imagesUrls,
      publicId,
      gender,
      size,
      weight,
      slug
    } = req.body;

    // Validate required fields
    if (!name || !description || !basePrice || !category || !subcategories) {
      return res.status(400).json({
        message: "Missing required fields: name, description, basePrice, category, subcategories"
      });
    }

    // Validate numeric values
    if (isNaN(basePrice) || basePrice <= 0) {
      return res.status(400).json({ message: "basePrice must be a number greater than 0" });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: "Discount must be between 0 and 100" });
    }

    // Fetch category and its subcategories
    const categoryDoc = await Category.findById(category).lean();
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const validSubIds = categoryDoc.subcategories.map(id => id.toString());
    const givenSubIds = Array.isArray(subcategories)
      ? subcategories.map(id => id.toString())
      : [subcategories.toString()];

    const invalidSubIds = givenSubIds.filter(id => !validSubIds.includes(id));
    if (invalidSubIds.length > 0) {
      return res.status(400).json({
        message: `These subcategories do not belong to the selected category: ${invalidSubIds.join(", ")}`
      });
    }
     
      const validChildIds = categoryDoc?.subcategories?.childCategory.map(id => id.toString());
      const givenChildIds = Array.isArray(childCategory)
      ? childCategory.map(id => id.toString())
      : [childCategory.toString()];
    
    const invalidChildIds = givenChildIds.filter(id => !validChildIds.includes(id));
    if (invalidChildIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid child categories for this category: ${invalidChildIds.join(", ")}`
      });
    }

    // Calculate selling price
    const sellingPrice = basePrice - (basePrice * discount) / 100;

    // Create product
    const newProduct = await Product.create({
      name,
      description,
      basePrice,
      discount,
      sellingPrice,
      category,
      childCategory:givenChildIds,
      subcategories: givenSubIds,
      images:{
        publicId,
        imagesUrls},
      stock,
      isNewArrival,
      color,
      gender,
      size,
      weight,
      slug
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });

  } catch (err) {
    console.error("🔥 Product creation error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: `Duplicate value for field: ${Object.keys(err.keyValue)[0]}`
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};


 exports.updateProduct = async (req, res) => {
  try {
    
    const {
      id,
      name,
      description,
      basePrice,
      discount,
      category,
      subcategories,
      childCategories,
      stock,
      isNewArrival,
      color,
      imagesUrls,
      publicId,
      gender,
      size,
      weight,
      slug
    } = req.body;

    // Validate product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // Validate numeric fields
    if (basePrice !== undefined) {
      if (isNaN(basePrice)) {
        return res.status(400).json({ 
          success: false,
          message: "Base price must be a number" 
        });
      }
      if (basePrice <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Base price must be greater than 0" 
        });
      }
    }

    if (discount !== undefined) {
      if (isNaN(discount)) {
        return res.status(400).json({ 
          success: false,
          message: "Discount must be a number" 
        });
      }
      if (discount < 0 || discount > 100) {
        return res.status(400).json({ 
          success: false,
          message: "Discount must be between 0 and 100" 
        });
      }
    }

    // Validate stock
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ 
        success: false,
        message: "Stock cannot be negative" 
      });
    }

    // Handle category and subcategory updates
    if (category) {
      const categoryDoc = await Category.findById(category).lean();
      if (!categoryDoc) {
        return res.status(404).json({ 
          success: false,
          message: "Category not found" 
        });
      }

      // If subcategories are provided, validate them
      if (subcategories) {
        const validSubIds = categoryDoc.subcategories.map(id => id.toString());
        const givenSubIds = Array.isArray(subcategories)
          ? subcategories.map(id => id.toString())
          : [subcategories.toString()];

        const invalidSubIds = givenSubIds.filter(id => !validSubIds.includes(id));
        if (invalidSubIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid subcategories for this category: ${invalidSubIds.join(", ")}`
          });
        }
      }
    }
    if(childCategories){
      const validChildIds = categoryDoc?.subcategories?.childCategories.map(id => id.toString());
      const givenChildIds = Array.isArray(childCategories)
      ? childCategories.map(id => id.toString())
      : [childCategories.toString()];
    
    const invalidChildIds = givenChildIds.filter(id => !validChildIds.includes(id));
    if (invalidChildIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid child categories for this category: ${invalidChildIds.join(", ")}`
      });
    }
  }
    // Calculate selling price if basePrice or discount changes
    let sellingPrice = product.sellingPrice;
    if (basePrice !== undefined || discount !== undefined) {
      const newBasePrice = basePrice !== undefined ? basePrice : product.basePrice;
      const newDiscount = discount !== undefined ? discount : product.discount;
      sellingPrice = newBasePrice - (newBasePrice * newDiscount) / 100;
    }

    // Prepare update payload matching your structure
    const updatePayload = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      basePrice: basePrice !== undefined ? basePrice : product.basePrice,
      discount: discount !== undefined ? discount : product.discount,
      sellingPrice,
      category: category !== undefined ? category : product.category,
      subcategories: subcategories !== undefined 
        ? (Array.isArray(subcategories) ? subcategories : [subcategories])
        : product.subcategories,
        childCategory: childCategories !== undefined ? childCategories : product.childCategories,
      images: {
        publicId: publicId !== undefined ? publicId : product.images.publicId,
        imagesUrls: imagesUrls !== undefined ? imagesUrls : product.images.imagesUrls
      },
      stock: stock !== undefined ? stock : product.stock,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : product.isNewArrival,
      color: color !== undefined ? color : product.color,
      gender: gender !== undefined ? gender : product.gender,
      size: size !== undefined ? size : product.size,
      weight: weight !== undefined ? weight : product.weight,
      slug: slug !== undefined ? slug : product.slug
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    console.error("Product update error:", err);

    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `Product with this ${duplicateField} already exists`
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors 
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};



exports.productDelete = async(req,res)=>{
 
  try{
    const {id} = req.body;
    console.log(req.body);
    const response = await Products.findByIdAndDelete(id);
    if(response){
      
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        product: response
      });
    }else{
      res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}


// Get single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products with optional filtering
exports.getProducts = async (req, res) => {
  try {
    // Build filter object based on query parameters
    const filter = {};
    
    // Add filters for enum fields if they exist in query
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subCategory) filter.subCategory = req.query.subCategory;
    if (req.query.color) filter.color = req.query.color;
    if (req.query.size) filter.size = { $in: [req.query.size] };
    if (req.query.isNewArrival) filter.isNewArrival = req.query.isNewArrival === 'true';

  const products = await Product.find(filter).populate({
                    path: 'category',
                    select: 'categoryName categoryImage categoryDescription isActive'
                }).populate({
                    path: 'subcategories',
                    select: 'subCategoryName subCategoryImage subCategoryDescription isActive',
                    match: { isActive: true }, // Only populate active subcategories
               
               populate: {
                    path: 'childCategory',
                    select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
                    match: { isActive: true } // Only populate active child categories
                }
                  })
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};