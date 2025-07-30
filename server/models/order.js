const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],

  shippingInfo: {
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String,default:"India" },
    phoneNo: { type: String, }
  },

  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },

  placedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
