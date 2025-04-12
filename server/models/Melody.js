const mongoose = require('mongoose');

const MelodySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Melody', MelodySchema);