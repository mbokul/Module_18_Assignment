const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const ProductSliderModel = require('../models/ProductSliderModel');
const ProductModel = require('../models/ProductModel');
const ProductDetailModel = require('../models/ProductDetailsModel');
const ReviewModel = require('../models/ReviewModel');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const BrandListService = async () => {
   try {
      const data = await BrandModel.find();
      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const CategoryListService = async () => {
   try {
      const data = await CategoryModel.find();
      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const SliderListService = async () => {
   try {
      const data = await ProductSliderModel.find();
      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ListByBrandService = async req => {
   const id = req.params.BrandID;

   try {
      const BrandID = new ObjectId(id);
      const MatchStage = { $match: { brandID: BrandID } };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ListByCategoryService = async req => {
   const id = req.params.CategoryID;

   try {
      const CategoryID = new ObjectId(id);
      const MatchStage = { $match: { categoryID: CategoryID } };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ListByRemarkService = async req => {
   try {
      const Remark = req.params.Remark;
      const MatchStage = { $match: { remark: Remark } };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ListBySimilarService = async req => {
   try {
      const CategoryID = new ObjectId(req.params.CategoryID);
      const MatchStage = { $match: { categoryID: CategoryID } };
      const limitStage = { $limit: 20 };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         limitStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const DetailsService = async req => {
   try {
      const ProductID = new ObjectId(req.params.ProductID);
      const MatchStage = { $match: { _id: ProductID } };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const JoinWithDetailsStage = {
         $lookup: { from: 'productdetails', localField: '_id', foreignField: 'productID', as: 'details' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const UnwindDetailsStage = { $unwind: '$details' };

      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         JoinWithDetailsStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         UnwindDetailsStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ListByKeywordService = async req => {
   try {
      const SearchRegex = { $regex: req.params.Keyword, $options: 'i' };
      const SearchParams = [{ title: SearchRegex }, { shortDes: SearchRegex }];
      const SearchQuery = { $or: SearchParams };

      const MatchStage = { $match: SearchQuery };

      const JoinWithBrandStage = {
         $lookup: { from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand' },
      };

      const JoinWithCategoryStage = {
         $lookup: { from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category' },
      };

      const UnwindBrandStage = { $unwind: '$brand' };
      const UnwindCategoryStage = { $unwind: '$category' };
      const ProjectionStage = { $project: { 'brand._id': 0, 'category._id': 0, categoryID: 0, brandID: 0 } };

      const data = await ProductModel.aggregate([
         MatchStage,
         JoinWithBrandStage,
         JoinWithCategoryStage,
         UnwindBrandStage,
         UnwindCategoryStage,
         ProjectionStage,
      ]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ReviewListService = async req => {
   try {
      const ProductID = new ObjectId(req.params.ProductID);
      const MatchStage = { $match: { productID: ProductID } };

      const JoinWithProfileStage = {
         $lookup: { from: 'profiles', localField: 'userID', foreignField: 'userID', as: 'profile' },
      };

      const UnwindProfileStage = { $unwind: '$profile' };
      const ProjectionStage = { $project: { des: 1, rating: 1, 'profile.cus_name': 1 } };

      const data = await ReviewModel.aggregate([MatchStage, JoinWithProfileStage, UnwindProfileStage, ProjectionStage]);

      return { status: 'success', data: data };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

module.exports = {
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
};
