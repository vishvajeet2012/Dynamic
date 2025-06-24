const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({

  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  originalId: {
    type: String,
    required: true
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