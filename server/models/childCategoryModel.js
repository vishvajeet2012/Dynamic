const mongoose = require('mongoose');

const ChildCategorySchema = new mongoose.Schema({
  childCategoryName: {
    type: String,

  },
  childCategoryImage: {
    type: String,
    required: false
  },
  imagePublicId: {
    type: String
  },
  childCategoryDescription: {
    type: String,

  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  },
  bannerImage: {
    type: String,
    default: ""
  }
});

const ChildCategoryModel = mongoose.model('ChildCategory', ChildCategorySchema);
module.exports = ChildCategoryModel;
