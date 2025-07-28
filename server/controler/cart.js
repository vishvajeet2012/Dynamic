const Product =require('../models/ProductModel')
const  User = require('../models/authModel')


exports.addToCartControler = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity || !size || !color) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.size.includes(size)) {
      return res
        .status(400)
        .json({ message: `Size ${size} is not available for this product` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingCartItem = user.cart.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (existingCartItem > -1) {
      user.cart[existingCartItem].quantity += quantity;
      await user.save();

      return res.status(200).json({
        message: 'Product already in cart, quantity updated',
        cart: user.cart,
        status: true,
      });
    }

    user.cart.push({
      product: productId,
      quantity,
      size,
      color,
    });

    await user.save();

    return res.status(200).json({
      message: 'Product added to cart successfully',
      hello:"vishvajeet",
      cart: user.cart,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', status: false });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, color, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) =>
          !(
            item.product.toString() === productId &&
            item.size === size &&
            item.color.toLowerCase() === color.toLowerCase()
          )
      );
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();

    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, color } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color.toLowerCase() === color.toLowerCase()
        )
    );

    await user.save();
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};