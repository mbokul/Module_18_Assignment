const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const UserController = require('../controllers/UserController');
const CartListController = require('../controllers/CartListController');
const WishListController = require('../controllers/WishListController');
const InvoiceController = require('../controllers/InvoiceController');

const VerifyAuthentication = require('../middlewares/VerifyAuthentication');

// Routes To Manage Products
router.get('/product-brandList', ProductController.ProductBrandList);
router.get('/product-categoryList', ProductController.ProductCategoryList);
router.get('/product-sliderList', ProductController.ProductSliderList);
router.get('/product-list-by-brand/:BrandID', ProductController.ProductListByBrand);
router.get('/product-list-by-category/:CategoryID', ProductController.ProductListByCategory);
router.get('/product-list-by-similar/:CategoryID', ProductController.ProductListBySimilar);
router.get('/product-list-by-keyword/:Keyword', ProductController.ProductListByKeyword);
router.get('/product-list-by-remark/:Remark', ProductController.ProductListByRemark);
router.get('/product-details/:ProductID', ProductController.ProductDetails);
router.get('/product-review-list/:ProductID', ProductController.ProductReviewList);

// Routes To Manage Users
router.get('/user-otp/:email', UserController.UserOTP);
router.get('/verify-login/:email/:otp', UserController.VerifyLogin);
router.get('/user-logout', VerifyAuthentication, UserController.UserLogout);
router.post('/create-profile', VerifyAuthentication, UserController.CreateProfile);
router.post('/update-profile', VerifyAuthentication, UserController.UpdateProfile);
router.get('/read-profile', VerifyAuthentication, UserController.ReadProfile);

// Routes for Cart Lists
router.post('/save-cartlist', VerifyAuthentication, CartListController.SaveCartList);
router.post('/remove-cartlist', VerifyAuthentication, CartListController.RemoveCartList);
router.get('/cartlist', VerifyAuthentication, CartListController.CartList);
router.post('/update-cartlist/:cartID', VerifyAuthentication, CartListController.UpdateCartList);

// Routes for WishLists
router.post('/save-wishlist', VerifyAuthentication, WishListController.SaveWishList);
router.post('/remove-wishlist', VerifyAuthentication, WishListController.RemoveWishList);
router.get('/wishlist', VerifyAuthentication, WishListController.WishList);

// Routes for Invoices
router.get('/create-invoice', VerifyAuthentication, InvoiceController.CreateInvoice);
router.get('/invoice-list', VerifyAuthentication, InvoiceController.InvoiceList);
router.get('/invoice-product-list/:invoice_id', VerifyAuthentication, InvoiceController.InvoiceProductList);

// Routes for Invoice Payment
router.post('/payment-success/:trxID', InvoiceController.PaymentSuccess);
router.post('/payment-cancel/:trxID', InvoiceController.PaymentCancel);
router.post('/payment-fail/:trxID', InvoiceController.PaymentFail);
router.post('/payment-IPN/:trxID', InvoiceController.PaymentIPN);

module.exports = router;
