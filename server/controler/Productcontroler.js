const Product = require('../models/ProductModel');

// Create a new product
const Products = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const cache = require('../utils/cache')
const child = require('../models/childCategoryModel'); // Assuming this is the correct path for ChildCategory model
const slugify = require('slugify');


exports.createProduct = async (req, res) => {
  try {
    const {
      isFeatured,
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
      slug,
      theme
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



 let productSlug = slug;
    if (!productSlug) {
      productSlug = slugify(name, {
        lower: true,           // Convert to lowercase
        strict: true,          // Strip special characters except replacement
        remove: /[*+~.()'"!:@]/g // Remove specific characters
      });
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
      basePrice:Number(basePrice),
      discount:Number(discount),
      sellingPrice:Number(sellingPrice),
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
      slug,
      theme ,
      isFeatured
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
      isFeatured,
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
      slug:productSlug
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
      basePrice: basePrice !== undefined ? Number(basePrice) : Number(product.basePrice),
      discount: discount !== undefined ? discount : product.discount,
      sellingPrice:Number(sellingPrice),
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
    const {slug}=req.body //slug is used to find the product
    if (!slug) {
      return res.status(400).json({ message: 'Product slug is required' });
    }
    const product = await Products.find(slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Get all products with optional filtering
// exports.getProducts = async (req, res) => {
//   try {
//     // Build filter object based on query parameters
//     const filter = {};
//         const userId = req?.user;

//         console.log(userId)
//     // Add filters for enum fields if they exist in query
//     if (req.query.gender) filter.gender = req.query.gender;
//     if (req.query.category) filter.category = req.query.category;
//     if (req.query.subCategory) filter.subCategory = req.query.subCategory;
//     if (req.query.color) filter.color = req.query.color;
//     if (req.query.size) filter.size = { $in: [req.query.size] };
//     if (req.query.isNewArrival) filter.isNewArrival = req.query.isNewArrival === 'true';
//     if (req.query.isFeatured) filter.theme = req.query.theme =
    
//   const products = await Product.find(filter).populate({
//                     path: 'category',
//                     select: 'categoryName categoryImage categoryDescription isActive'
//                 }).populate({
//                     path: 'subcategories',
//                     select: 'subCategoryName subCategoryImage subCategoryDescription isActive',
//                     match: { isActive: true }, // Only populate active subcategories
               
              
//                   }).populate ({
//                     path: 'childCategory',
//                     select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
//                     match: { isActive: true } // Only populate active child categories
//                 })
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getProducts = async (req, res) => {
//   try {
//     const filter = {};
//     const userId = req?.user;

//     // Add filters from request body
//     if (req.body.gender) filter.gender = req.body.gender;
//     if (req.body.category) filter.category = req.body.category;
//     if (req.body.subCategory) filter.subCategory = req.body.subCategory;
//     if (req.body.color) filter.color = req.body.color;
//     if (req.body.size) filter.size = { $in: [req.body.size] };
//     if (req.body.isNewArrival !== undefined) filter.isNewArrival = req.body.isNewArrival;
//     if (req.body.isFeatured !== undefined) filter.isFeatured = req.body.isFeatured;

//     const products = await Product.find(filter)
//       .populate({
//         path: 'category',
//         select: 'categoryName categoryImage categoryDescription isActive'
//       })
//       .populate({
//         path: 'subcategories',
//         select: 'subCategoryName subCategoryImage subCategoryDescription isActive',
//         match: { isActive: true }
//       })
//       .populate({
//         path: 'childCategory',
//         select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
//         match: { isActive: true }
//       });

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.getProducts = async (req, res) => {
  try {
    const filter = {};
    const userId = req?.user;
    
    // Add filters from request body
    if (req.body.gender) filter.gender = req.body.gender;
    if (req.body.category) filter.category = req.body.category;
    if (req.body.subCategory) filter.subCategory = req.body.subCategory;
    if (req.body.color) filter.color = req.body.color;
    if (req.body.size) filter.size = { $in: [req.body.size] };
    if (req.body.isNewArrival !== undefined) filter.isNewArrival = req.body.isNewArrival;
    if (req.body.isFeatured !== undefined) filter.isFeatured = req.body.isFeatured;
    
    // Create a unique cache key based on the filter object
    const cacheKey = `products:${JSON.stringify(filter)}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      // Convert cached plain objects back to proper format
      return res.status(200).json(JSON.parse(JSON.stringify(cachedData)));
    }
    
    // If not in cache, fetch from DB
    const products = await Product.find(filter)
      .populate({
        path: 'category',
        select: 'categoryName categoryImage categoryDescription isActive'
      })
      .populate({
        path: 'subcategories',
        select: 'subCategoryName subCategoryImage subCategoryDescription isActive',
        match: { isActive: true }
      })
      .populate({
        path: 'childCategory',
        select: 'childCategoryName childCategoryImage childCategoryDescription isActive bannerImage',
        match: { isActive: true }
      });
    
    // Convert to plain objects for caching (to avoid populated references issues)
    const plainProducts = JSON.parse(JSON.stringify(products));
    
    // Store plain objects in cache
    cache.set(cacheKey, plainProducts);
    
    res.status(200).json(plainProducts);
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ message: err.message });
  }
};


/////////////////////// get product by cateogry /////////////////////

// routes/productRoutes.js

const { Types } = require('mongoose'); // Import Types for ObjectId validation

/**

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

// exports.getProductbykeys = async (req, res) => {
//   try {
//     const { categoryId, subcategoryIds, childCategoryIds, page = 1, limit = 10 } = req.body;

//     const query = {};

//     if (categoryId) {
//       query.category = categoryId;
//     }

//     if (subcategoryIds && Array.isArray(subcategoryIds)) {
//       query.subcategories = { $in: subcategoryIds };
//     }

//     if (childCategoryIds && Array.isArray(childCategoryIds)) {
//       query.childCategory = { $in: childCategoryIds };
//     }

//     const skip = (page - 1) * limit;

//     const [products, total] = await Promise.all([
//       Product.find(query)
//         .populate('category')
//         .populate('subcategories')
//         .populate('childCategory')
//         .skip(skip)
//         .limit(Number(limit)),
//       Product.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       data: products,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message,
//     });
//   }
// };











// exports.getProductbykeys = async (req, res) => {
//   try {
//     const {
//       categoryId,
//       subcategoryIds,
//       childCategoryIds,
//       page = 1,
//       limit = 10
//     } = req.body;

//     const query = {};

//     // Main category filter
//     if (categoryId) {
//       query.category = categoryId;
//     }

//     // Subcategories filter
//     if (subcategoryIds && Array.isArray(subcategoryIds)) {
//       query.subcategories = { $in: subcategoryIds };
//     }

//     // Child categories filter
//     if (childCategoryIds && Array.isArray(childCategoryIds)) {
//       query.childCategory = { $in: childCategoryIds };
//     }

//     const skip = (page - 1) * limit;

//     const [products, total] = await Promise.all([
//       Product.find(query)
//         .populate('category')
//         .populate('subcategories')
//         .populate('childCategory')
//         .skip(skip)
//         .limit(Number(limit)),
//       Product.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       data: products,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message,
//     });
//   }
// };


exports.getProductbykeys = async (req, res) => {
  try {
    const {
      data: {
        categoryId,
        subcategoryIds,
        childCategoryIds,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10
      }
    } = req.body;

    // 🚫 Reject if no filters are provided
    if (
      !categoryId &&
      (!subcategoryIds || subcategoryIds.length === 0) &&
      (!childCategoryIds || childCategoryIds.length === 0) &&
      minPrice === undefined &&
      maxPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one filter is required to fetch products."
      });
    }

    const query = {};

    // Filters
    if (categoryId) query.category = categoryId;

    if (subcategoryIds && Array.isArray(subcategoryIds) && subcategoryIds.length > 0) {
      query.subcategories = { $in: subcategoryIds };
    }

    if (childCategoryIds && Array.isArray(childCategoryIds) && childCategoryIds.length > 0) {
      query.childCategory = { $in: childCategoryIds };
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice !== undefined) priceQuery.$gte = Number(minPrice);
      if (maxPrice !== undefined) priceQuery.$lte = Number(maxPrice);

      query.$expr = {
        $and: [
          { $gte: [{ $toDouble: "$basePrice" }, priceQuery.$gte || 0] },
          { $lte: [{ $toDouble: "$basePrice" }, priceQuery.$lte || Number.MAX_SAFE_INTEGER] }
        ]
      };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category')
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};







exports.getFiltersForSubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.body;

    if (!subcategoryId) {
      return res.status(400).json({ success: false, message: "Subcategory ID is required" });
    }

    // Step 1: Get all products with this subcategory
    const products = await Product.find({
      subcategories: subcategoryId
    }).select("basePrice childCategory");

    // Step 2: Convert basePrice strings to numbers
    const priceNumbers = products
      .map(p => parseFloat(p.basePrice)) // Clean string like "Rs. 500"
      .filter(price => !isNaN(price));

    // Step 3: Count how many prices fall in each range
    const priceRanges = [
      { label: "₹0–₹500", min: 0, max: 500, count: 0 },
      { label: "₹501–₹1000", min: 501, max: 1000, count: 0 },
      { label: "₹1001–₹2000", min: 1001, max: 2000, count: 0 },
      { label: "₹2000+", min: 2001, max: Infinity, count: 0 }
    ];

    priceNumbers.forEach(price => {
      for (const range of priceRanges) {
        if (price >= range.min && price <= range.max) {
          range.count += 1;
          break;
        }
      }
    });

    // Step 4: Filter only ranges that have products
    const availablePriceFilters = priceRanges.filter(r => r.count > 0).map(r => r.label);

    // Step 5: Get unique child category IDs
    const childCategorySet = new Set();
    products.forEach(p => {
      p.childCategory?.forEach(id => {
        childCategorySet.add(id.toString());
      });
    });

    const childCategoryIds = Array.from(childCategorySet);

    // Step 6: Fetch child category details
    const childCategories = await child.find({
      _id: { $in: childCategoryIds }
    });

    res.status(200).json({
      success: true,
      priceFilters: availablePriceFilters,
      childCategories
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};




exports.getProductSearchPage =async (req, res) => { 
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const regex = new RegExp(keyword, 'i');

    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    }).populate('category').populate('subcategories').populate('childCategory');

    if(products.length==0){
      res.status(200).json({message:"no result ",product:null,count:null})
    }

    res.status(200).json({product:products ,message:"MatchProduct",count:products.length});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ message: "Product slug is required" });
    }

    const product = await Product.findOne({ slug })
      .populate('category')
      .populate('subcategories')
      .populate('childCategory')


    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }else{
      
      res.status(200).json({ product, message: "Product found",status: true });
    }

  }catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// Search for unique theme names

exports.searchThemeNames = async (req, res) => {
  try {
    let { keyword } = req.body;

    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    keyword = keyword.trim();

    const themes = await Product.distinct('theme', {
      theme: { $regex: keyword, $options: 'i' }
    });

    res.status(200).json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

