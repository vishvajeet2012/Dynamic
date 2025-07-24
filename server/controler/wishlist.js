const User = require('../models/authModel'); // Capitalized model for clarity

const Product = require('../models/ProductModel'); // Ensure this is the correct path to your Product model

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

    // ✅ Fetch the actual user document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);

    if (index === -1) {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({ message: 'Product added to wishlist successfully' });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: 'Product removed from wishlist successfully' });
    }

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






exports.getAllProductsWithWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    let wishlist = [];

    if (userId) {
      const user = await User.findById(userId).select('wishlist');
      if (user) {
        wishlist = user.wishlist.map(id => id.toString());
      }
    }

    const products = await Product.find();

    const updatedProducts = products.map(prod => {
      const isWished = wishlist.includes(prod._id.toString());
      return {
        ...prod._doc,
        isWishlist: isWished,
      };
    });

    res.status(200).json({ products: updatedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

