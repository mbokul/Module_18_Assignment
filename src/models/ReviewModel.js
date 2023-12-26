const mongoose = require('mongoose');

const reveiwSchema = new mongoose.Schema(
   {
      productID: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
      userID: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
      des: {
         type: String,
         required: true,
      },
      rating: {
         type: String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false }
);

const ReviewModel = mongoose.model('reviews', reveiwSchema);

module.exports = ReviewModel;
