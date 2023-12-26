const WishListModel = require('../models/WishListModel');

const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const WishListService = async req => {
   try {
      const user_id = new ObjectID(req.headers.user_id);
      const matchStage = { $match: { userID: user_id } };

      const JoinStageProduct = {
         $lookup: { from: 'products', localField: 'productID', foreignField: '_id', as: 'product' },
      };
      const unwindProductStage = { $unwind: '$product' };
      const JoinStageBrand = {
         $lookup: { from: 'brands', localField: 'product.brandID', foreignField: '_id', as: 'brand' },
      };
      const unwindBrandStage = { $unwind: '$brand' };
      const JoinStageCategory = {
         $lookup: { from: 'categories', localField: 'product.categoryID', foreignField: '_id', as: 'category' },
      };
      const unwindCategoryStage = { $unwind: '$category' };

      const projectionStage = {
         $project: {
            _id: 0,
            userID: 0,
            createAt: 0,
            updatedAt: 0,
            'product._id': 0,
            'product.categoryID': 0,
            'product.brandID': 0,
            'brand._id': 0,
            'category._id': 0,
         },
      };

      const data = await WishListModel.aggregate([
         matchStage,
         JoinStageProduct,
         unwindProductStage,
         JoinStageBrand,
         unwindBrandStage,
         JoinStageCategory,
         unwindCategoryStage,
         projectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const SaveWishListService = async req => {
   try {
      const user_id = req.headers.user_id;
      const reqBody = req.body;
      reqBody.userID = user_id;

      const result = await WishListModel.updateOne(reqBody, { $set: reqBody }, { upsert: true });

      return { status: 'success', message: 'Wish List Saved Successfully', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const RemoveWishListService = async req => {
   try {
      const user_id = req.headers.user_id;
      const reqBody = req.body;
      reqBody.userID = user_id;

      const result = await WishListModel.deleteOne(reqBody);

      return { status: 'success', message: 'Wish List Removed Successfully', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

module.exports = {
   WishListService,
   SaveWishListService,
   RemoveWishListService,
};
