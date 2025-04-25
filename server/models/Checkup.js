const mongoose = require('mongoose');

const checkupSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['requested', 'in-progress', 'completed'], 
    default: 'requested' 
  },
  images: [{
    path: { type: String },
    description: { type: String }
  }],
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Checkup', checkupSchema);