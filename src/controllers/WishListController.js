const { WishListService, SaveWishListService, RemoveWishListService } = require('../services/WishListServices');

const WishList = async (req, res) => {
   let result = await WishListService(req);
   return res.status(200).json(result);
};

const SaveWishList = async (req, res) => {
   let result = await SaveWishListService(req);
   return res.status(200).json(result);
};

const RemoveWishList = async (req, res) => {
   let result = await RemoveWishListService(req);
   return res.status(200).json(result);
};

module.exports = {
   WishList,
   SaveWishList,
   RemoveWishList,
};
