const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Product Baseprice is required'],
    maxlength: [8, 'Price cannot exceed 8 characters'],
    default: 0.0
  },
  details: {
    type: String,
    default: '',
    trim: true,
    minlength: [10, 'Details must be at least 10 characters'],
    maxlength: [500, 'Details cannot exceed 500 characters']
  },
  sellingPrice: {
    type: Number,
    maxlength: [8, 'Discount price cannot exceed 8 characters']
  },
  discount: {
    type: String,
    default: Number
  },
  color: {
    type: String,
    required: [true, 'Please specify color']
  },
  size: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'OS'] // OS for One Size/Oversized
  }],
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }],
  childCategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChildCategory'
  }],
  ratings: {
    type: Number,
    default: 0
  },
  images: [
    {
      publicIds: {
        type: String,
        // required: tru
      },
      imagesUrls: {
        type: String,
        // required: true
      }
    }
  ],

  //  publicIds: {
  //      type: String,
  //       required: true
  //     },
  //  imagesUrls: {
  //       type: String,
  //       required: true
  //     },
  stock: {
    type: String,
    required: [true, 'Please enter product stock'],
    maxlength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },

  isNewArrival: {
    type: Boolean,
    default: false
  },
  isWishlist: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAddToCart: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    default: name => name.toLowerCase().replace(/ /g, '-'),
    unique: true,
  },


  isDeleted: {
    type: Boolean,
    default: false
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },

  theme: {
    type: String,
    default: ""

  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Product', productSchema)