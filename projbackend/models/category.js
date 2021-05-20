const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 32
    }
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model('Category', categorySchema);
