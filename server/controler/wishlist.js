// const User = require('../models/authModel'); // Capitalized model for clarity

// const Product = require('../models/ProductModel'); // Ensure this is the correct path to your Product model

// exports.addtoWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     const { productId } = req.body;
//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     // ✅ Fetch the actual user document
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const index = user.wishlist.indexOf(productId);

//     if (index === -1) {
//       user.wishlist.push(productId);
//       await user.save();
//       return res.status(200).json({ message: 'Product added to wishlist successfully' });
//     } else {
//       user.wishlist.splice(index, 1);
//       await user.save();
//       return res.status(200).json({ message: 'Product removed from wishlist successfully' });
//     }

//   } catch (error) {
//     console.error('Error adding to wishlist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };






// exports.getAllProductsWithWishlist = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     let wishlist = [];

//     if (userId) {
//       const user = await User.findById(userId).select('wishlist');
//       if (user) {
//         wishlist = user.wishlist.map(id => id.toString());
//       }
//     }

//     const products = await Product.find();

//     const updatedProducts = products.map(prod => {
//       const isWished = wishlist.includes(prod._id.toString());
//       return {
//         ...prod._doc,
//         isWishlist: isWished,
//       };
//     });

//     res.status(200).json({ products: updatedProducts });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



const User = require('../models/authModel');
const Product = require('../models/ProductModel');
const mongoose = require('mongoose');

// Add/Remove from Wishlist
exports.addtoWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch the user document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert productId to ObjectId for proper comparison
    const productObjectId = new mongoose.Types.ObjectId(productId);
    
    // Check if product is already in wishlist using ObjectId comparison
    const existingIndex = user.wishlist.findIndex(item => 
      item.toString() === productObjectId.toString()
    );

    if (existingIndex === -1) {
      // Add to wishlist
      user.wishlist.push(productObjectId);
      await user.save();
      return res.status(200).json({ 
        message: 'Product added to wishlist successfully',
        action: 'added',
        isWishlist: true
      });
    } else {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1);
      await user.save();
      return res.status(200).json({ 
        message: 'Product removed from wishlist successfully',
        action: 'removed',
        isWishlist: false
      });
    }

  } catch (error) {
    console.error('Error managing wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all products with wishlist status
exports.getAllProductsWithWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    let wishlistIds = [];

    // Get user's wishlist if user is authenticated
    if (userId) {
      const user = await User.findById(userId).select('wishlist');
      if (user && user.wishlist) {
        wishlistIds = user.wishlist.map(id => id.toString());
      }
    }

    // Fetch all products
    const products = await Product.find();

    // Add wishlist status to each product
    const productsWithWishlist = products.map(product => {
      const isInWishlist = wishlistIds.includes(product._id.toString());
      return {
        ...product._doc,
        isWishlist: isInWishlist
      };
    });

    res.status(200).json({ 
      products: productsWithWishlist,
      totalProducts: productsWithWishlist.length
    });

  } catch (error) {
    console.error('Error fetching products with wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's wishlist with populated product details
exports.getUserWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).populate({
      path: 'wishlist',
      model: 'Product', // Make sure this matches your Product model name
      select: 'name price basePrice discount images ratings sellingPrice slug subcategories theme size numOfReviews isNewArrival color subcategories description category' // Select only needed fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out any null products (in case some products were deleted)
    const validWishlistItems = user.wishlist.filter(item => item !== null);

    res.status(200).json({
      wishlist: validWishlistItems,
      totalItems: validWishlistItems.length
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({ message: 'Wishlist cleared successfully' });

  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};