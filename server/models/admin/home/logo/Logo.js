const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  settingType: {
    type: String,
    default: 'mainLogo',
    enum: ['mainLogo', 'footerLogo', 'favicon'],
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  format: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Add index for faster querying
logoSchema.index({ settingType: 1 }, { unique: true });

module.exports = mongoose.model('Logo', logoSchema);