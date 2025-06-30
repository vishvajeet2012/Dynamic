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


  exports.updateAdminProduct =async (req,res)=>{
  try{
        const {
      name,
      description,
      basePrice,
      discount,
      ratings,
      images,
      stock,
      imagesUrls,
      publicId,
      numOfReviews,
      isNewArrival,
      category,         // Single ID (not array)
      subcategories,      // Array of IDs
      color,
      gender,
      size,
      weight,
      slug
    } = req.body;

    // Required fields check
    const requiredFields = ['name', 'description', 'basePrice', 'category', 'subcategories'];
    const missingFields = requiredFields.filter(field => !req.body[field] && req.body[field] !== 0);

      
    
  }catch(error){
    res.status(500).json({message:"Error updating product",error,status:false})
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
                    select: 'subCategoryName subCategoryImage subCategoryDescription isActive'
                })
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};