const {
   BrandListService,
   CategoryListService,
   SliderListService,
   ListByCategoryService,
   ListByBrandService,
   ListByRemarkService,
   ListBySimilarService,
   ListByKeywordService,
   DetailsService,
   ReviewListService,
} = require('../services/ProductServices');

const ProductBrandList = async (req, res) => {
   const result = await BrandListService();
   return res.status(200).json(result);
};

const ProductCategoryList = async (req, res) => {
   const result = await CategoryListService();
   return res.status(200).json(result);
};

const ProductSliderList = async (req, res) => {
   const result = await SliderListService();
   return res.status(200).json(result);
};

const ProductListByBrand = async (req, res) => {
   const result = await ListByBrandService(req);
   return res.status(200).json(result);
};

const ProductListByCategory = async (req, res) => {
   const result = await ListByCategoryService(req);
   return res.status(200).json(result);
};

const ProductListBySimilar = async (req, res) => {
   const result = await ListBySimilarService(req);
   return res.status(200).json(result);
};

const ProductListByKeyword = async (req, res) => {
   const result = await ListByKeywordService(req);
   return res.status(200).json(result);
};

const ProductListByRemark = async (req, res) => {
   const result = await ListByRemarkService(req);
   return res.status(200).json(result);
};

const ProductDetails = async (req, res) => {
   const result = await DetailsService(req);
   return res.status(200).json(result);
};

const ProductReviewList = async (req, res) => {
   const result = await ReviewListService(req);
   return res.status(200).json(result);
};

module.exports = {
   ProductBrandList,
   ProductCategoryList,
   ProductSliderList,
   ProductListByBrand,
   ProductListByCategory,
   ProductListBySimilar,
   ProductListByKeyword,
   ProductListByRemark,
   ProductDetails,
   ProductReviewList,
};
