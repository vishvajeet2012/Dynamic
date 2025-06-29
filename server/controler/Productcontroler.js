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

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate basePrice is a positive number
    if (isNaN(basePrice)) {
      return res.status(400).json({ message: 'Base price must be a number' });
    }

    if (basePrice <= 0) {
      return res.status(400).json({ message: 'Base price must be greater than 0' });
    }

    // Validate discount is a number between 0 and 100 if provided
    if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
      return res.status(400).json({ message: 'Discount must be a number between 0 and 100' });
    }

    // Validate category ID (single, not array)
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ 
        message: `Invalid category ID: ${category}`
      });
    }

    // Validate subcategory IDs (array)
    let subcategoryIds = Array.isArray(subcategories) ? subcategories : [subcategories];

    const existingSubCategories = await SubCategory.find({ _id: { $in: subcategoryIds } });

    if (existingSubCategories.length !== subcategoryIds.length) {
      const foundIds = existingSubCategories.map(sub => sub._id.toString());
      const missingIds = subcategoryIds.filter(id => !foundIds.includes(id.toString()));
      return res.status(400).json({ 
        message: `Invalid subcategory ID(s): ${missingIds.join(', ')}`
      });
    }

   /// Also verify that subcategories belong to the selected category
    const invalidSubcategories = existingSubCategories.filter(
      sub => sub.category.toString() !== category.toString()
    );
    
    if (invalidSubcategories.length > 0) {
      const invalidIds = invalidSubcategories.map(sub => sub._id.toString());
      return res.status(400).json({
        message: `The following subcategories don't belong to the selected category: ${invalidIds.join(', ')}`
      });
    }

    // Calculate selling price
    const sellingPrice = basePrice - (basePrice * (discount || 0) / 100);

    // Create the product
    const productData = {
      name,
      description,
      basePrice,
      sellingPrice,
      discount: discount || 0,
      category: category,  // Single ID
      subcategory: subcategoryIds,  // Array of IDs
      images: {imagesUrls:imagesUrls, publicIds:publicId} || [],
      stock: stock || 0,
      isNewArrival: isNewArrival || false,
      color: color || null,
      gender: gender || null,
      size: size || null,
      weight: weight || null,
      slug: slug || null
    };

    // Optional fields
  

    const product = await Products.create(productData);

    // // Update category and subcategory references
    // await Category.findByIdAndUpdate(
    //   category,
    //   { $addToSet: { products: product._id } }
    // );

    // await SubCategory.updateMany(
    //   { _id: { $in: subcategoryIds } },
    //   { $addToSet: { products: product._id } }
    // );

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });

  } catch (err) {
    console.error('Create Product Error:', err);
    
    // Handle duplicate key error (e.g., duplicate slug)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `Product with this ${field} already exists` 
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
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
                });;
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};