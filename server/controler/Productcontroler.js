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

    // ✅ Required Fields Validation
    if (!name || !description || !basePrice || !category || !subcategories) {
      return res.status(400).json({
        message: "Missing required fields: name, description, basePrice, category, subcategories"
      });
    }

    // ✅ Number Validation
    if (isNaN(basePrice) || basePrice <= 0) {
      return res.status(400).json({ message: "basePrice must be a number greater than 0" });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: "Discount must be between 0 and 100" });
    }

    // ✅ Check if Category exists
    const categoryDoc = await Category.findById(category).lean();
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Validate Subcategories belong to Category
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

    // ✅ Get childCategory list from SubCategory documents
    const subDocs = await SubCategory.find({ _id: { $in: givenSubIds } }).lean();

    // ✅ Flatten all valid childCategory IDs
    const validChildIds = subDocs.flatMap(sub =>
      Array.isArray(sub.childCategory) ? sub.childCategory.map(id => id.toString()) : []
    );

    // ✅ Validate Child Category
    const givenChildIds = Array.isArray(childCategory)
      ? childCategory.map(id => id.toString())
      : [childCategory.toString()];

    const invalidChildIds = givenChildIds.filter(id => !validChildIds.includes(id));
    if (invalidChildIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid child categories for selected subcategories: ${invalidChildIds.join(", ")}`
      });
    }

    // ✅ Calculate Selling Price
    const sellingPrice = basePrice - (basePrice * discount) / 100;

    // ✅ Create Product
    const newProduct = await Product.create({
      name,
      description,
      basePrice,
      discount,
      sellingPrice,
      category,
      subcategories: givenSubIds,
      childCategory: givenChildIds,
      images: {
        publicId,
        imagesUrls
      },
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
}




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
      childCategory,
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

    // ✅ Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ Validate basePrice
    if (basePrice !== undefined) {
      if (isNaN(basePrice) || basePrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "basePrice must be a number greater than 0"
        });
      }
    }

    // ✅ Validate discount
    if (discount !== undefined) {
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount must be a number between 0 and 100"
        });
      }
    }

    // ✅ Validate stock
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative"
      });
    }

    let givenSubIds = product.subcategories;
    let givenChildIds = product.childCategory;

    // ✅ Validate Category and Subcategories
    if (category) {
      const categoryDoc = await Category.findById(category).lean();
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

      if (subcategories) {
        const validSubIds = categoryDoc.subcategories.map(id => id.toString());
        givenSubIds = Array.isArray(subcategories)
          ? subcategories.map(id => id.toString())
          : [subcategories.toString()];

        const invalidSubIds = givenSubIds.filter(id => !validSubIds.includes(id));
        if (invalidSubIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid subcategories for this category: ${invalidSubIds.join(", ")}`
          });
        }

        // ✅ Validate ChildCategory based on selected subcategories
        const subDocs = await SubCategory.find({ _id: { $in: givenSubIds } }).lean();

        if (!subDocs || subDocs.length === 0) {
          return res.status(404).json({
            success: false,
            message: "One or more subcategories not found"
          });
        }

        const validChildIds = subDocs.flatMap(sub =>
          Array.isArray(sub.childCategory)
            ? sub.childCategory.map(id => id.toString())
            : []
        );

        if (childCategory) {
          givenChildIds = Array.isArray(childCategory)
            ? childCategory.map(id => id.toString())
            : [childCategory.toString()];

          const invalidChildIds = givenChildIds.filter(id => !validChildIds.includes(id));
          if (invalidChildIds.length > 0) {
            return res.status(400).json({
              success: false,
              message: `Invalid child categories for selected subcategories: ${invalidChildIds.join(", ")}`
            });
          }
        }
      }
    }

    // ✅ Recalculate Selling Price if needed
    let sellingPrice = product.sellingPrice;
    if (basePrice !== undefined || discount !== undefined) {
      const newBase = basePrice !== undefined ? basePrice : product.basePrice;
      const newDisc = discount !== undefined ? discount : product.discount;
      sellingPrice = newBase - (newBase * newDisc) / 100;
    }

    // ✅ Build update payload
    const updatePayload = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      basePrice: basePrice !== undefined ? basePrice : product.basePrice,
      discount: discount !== undefined ? discount : product.discount,
      sellingPrice,
      category: category !== undefined ? category : product.category,
      subcategories: givenSubIds,
      childCategory: givenChildIds,
      images: {
        publicId: publicId !== undefined ? publicId : product.images?.publicId,
        imagesUrls: imagesUrls !== undefined ? imagesUrls : product.images?.imagesUrls
      },
      stock: stock !== undefined ? stock : product.stock,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : product.isNewArrival,
      color: color !== undefined ? color : product.color,
      gender: gender !== undefined ? gender : product.gender,
      size: size !== undefined ? size : product.size,
      weight: weight !== undefined ? weight : product.weight,
      slug: slug !== undefined ? slug : product.slug
    };

    // ✅ Update the product
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
    console.error("🔥 Product update error:", err);

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
      message: "Internal Server Error",
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
               
              
                  }).populate ({
                    path: 'childCategory',
                    select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
                    match: { isActive: true } // Only populate active child categories
                })
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/////////////////////// get product by cateogry /////////////////////

// routes/productRoutes.js

const { Types } = require('mongoose'); // Import Types for ObjectId validation

/**
 * @route   POST /api/products/search
 * @desc    Search, filter, and paginate products
 * @access  Public
 * * This endpoint provides a robust and scalable way to search for products.
 * It uses MongoDB's native text search for performance and supports pagination.
 * * Request Body (JSON):
 * {
 * "keyword": "optional search term",
 * "categoryIds": ["optional", "array", "of", "category", "IDs"]
 * }
 * * Query Parameters:
 * ?page=1&limit=10
 */
exports.getProductbykeys= async (req, res) => {
  

  try {
    // --- 1. VALIDATION & PAGINATION SETUP ---

    const { keyword, categoryIds } = req.body;
    
    // Set up pagination from query parameters, with safe defaults.
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // --- Input Validation ---
    // Ensure categoryIds, if provided, is a valid array of ObjectIDs.
    if (categoryIds) {
      if (!Array.isArray(categoryIds)) {
        return res.status(400).json({ 
          success: false, 
          message: 'categoryIds must be an array.' 
        });
      }
      for (const id of categoryIds) {
        if (!Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: `Invalid category ID provided: ${id}`
          });
        }
      }
    }

    // --- 2. BUILD THE DATABASE QUERY ---

    const query = {};

    // Use MongoDB's high-performance text search.
    // NOTE: This requires a text index on the relevant fields in your Product model.
    // Example in productModel.js: 
    // productSchema.index({ name: 'text', description: 'text', brand: 'text' });
    if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
      query.$text = { $search: keyword.trim() };
    }

    // Filter by an array of category IDs.
    if (categoryIds && categoryIds.length > 0) {
      query.category = { $in: categoryIds };
    }

    // --- 3. EXECUTE QUERIES CONCURRENTLY ---

    // For production, it's more efficient to run the find and count queries in parallel.
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate('category')
        .populate('subcategories')
        .populate('childCategory')
        .sort(keyword ? { score: { $meta: 'textScore' } } : { createdAt: -1 }) // Sort by relevance if searching
        .skip(skip)
        .limit(limit)
        .lean(), // Use .lean() for faster, read-only operations
      Product.countDocuments(query)
    ]);

    // --- 4. SEND THE RESPONSE ---

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          hasNextPage: page * limit < totalProducts,
          hasPrevPage: page > 1,
        }
      }
    });

  } catch (error) {
    console.error('Error searching products:', error); // Log the actual error on the server
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while searching for products.' 
    });
  }
}

