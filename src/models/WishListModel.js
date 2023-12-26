const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema(
   {
      productID: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
      userID: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
   },
   { timestamps: true, versionKey: false }
);

const WishListModel = mongoose.model('wishlists', wishListSchema);

module.exports = WishListModel;
