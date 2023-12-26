const {
   CartListService,
   RemoveCartListService,
   SaveCartListService,
   UpdateCartListService,
} = require('../services/CartListServices');

const CartList = async (req, res) => {
   const result = await CartListService(req);
   return res.status(200).json(result);
};

const SaveCartList = async (req, res) => {
   const result = await SaveCartListService(req);
   return res.status(200).json(result);
};

const UpdateCartList = async (req, res) => {
   const result = await UpdateCartListService(req);
   return res.status(200).json(result);
};

const RemoveCartList = async (req, res) => {
   const result = await RemoveCartListService(req);
   return res.status(200).json(result);
};

module.exports = {
   CartList,
   SaveCartList,
   UpdateCartList,
   RemoveCartList,
};
