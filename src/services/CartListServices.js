const CartListModel = require('../models/CartListModel');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const CartListService = async req => {
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

      const data = await CartListModel.aggregate([
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

const UpdateCartListService = async req => {
   try {
      const user_id = req.headers.user_id;
      const cartID = req.params.cartID;
      const reqBody = req.body;

      const result = await CartListModel.updateOne({ _id: cartID, userID: user_id }, { $set: reqBody });

      return { status: 'success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const SaveCartListService = async req => {
   try {
      const user_id = req.headers.user_id;
      const reqBody = req.body;
      reqBody.userID = user_id;

      const result = await CartListModel.create(reqBody);

      return { status: 'success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const RemoveCartListService = async req => {
   try {
      const user_id = req.headers.user_id;
      const reqBody = req.body;
      reqBody.userID = user_id;

      const result = await CartListModel.deleteOne(reqBody);

      return { status: 'success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

module.exports = {
   UpdateCartListService,
   CartListService,
   SaveCartListService,
   RemoveCartListService,
};
