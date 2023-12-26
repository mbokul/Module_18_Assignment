const CartListModel = require('../models/CartListModel');
const ProfileModel = require('../models/ProfileModel');
const InvoiceModel = require('../models/InvoiceModel');
const InvoiceProductModel = require('../models/InvoiceProductModel');
const PaymentSettingModel = require('../models/PaymentSettingModel');

const FormData = require('form-data');
const axios = require('axios');

const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const CreateInvoiceService = async req => {
   // Step 01: Calculate Total Payable + Vat Amount
   const user_id = new ObjectID(req.headers.user_id);
   const cus_email = req.headers.email;

   const matchStage = { $match: { userID: user_id } };
   const JoinStageProduct = {
      $lookup: { from: 'products', localField: 'productID', foreignField: '_id', as: 'product' },
   };
   const unwindStage = { $unwind: '$product' };

   const CartProducts = await CartListModel.aggregate([matchStage, JoinStageProduct, unwindStage]);

   let totalAmount = 0;

   CartProducts.forEach(cartProduct => {
      let price;

      if (cartProduct['product']['discount']) {
         price = parseFloat(cartProduct['product']['discountPrice']);
      } else {
         price = parseFloat(cartProduct['product']['price']);
      }

      totalAmount += parseFloat(cartProduct['qty']) * price;
   });

   const vat = totalAmount * 0.05;
   const payable = totalAmount + vat;

   // Step 02: Prepare  Customer Details & Shipping Details

   const Profile = await ProfileModel.aggregate([{ $match: { userID: user_id } }]);
   const cus_details = `Name: ${Profile[0].cus_name}, Email: ${cus_email}, Address: ${Profile[0].cus_add}, Phone: ${Profile[0].cus_phone}`;
   const ship_details = `Name: ${Profile[0].ship_name}, City: ${Profile[0].ship_city}, Address: ${Profile[0].ship_add}, Phone: ${Profile[0].ship_phone}`;

   // Step 03: Transaction & Other's ID

   const tran_id = Math.floor(100000000 + Math.random() * 900000000);
   const val_id = 0;
   const delivery_status = 'pending';
   const payment_status = 'pending';

   // Step 04: Create Invoice

   const createInvoice = await InvoiceModel.create({
      userID: user_id,
      payable: payable,
      cus_details: cus_details,
      ship_details: ship_details,
      tran_id: tran_id,
      val_id: val_id,
      delivery_status: delivery_status,
      payment_status: payment_status,
      total: totalAmount,
      vat: vat,
   });

   // Step 05: Create Invoice Product

   const Invoice_id = createInvoice['_id'];

   CartProducts.forEach(async cartProduct => {
      await InvoiceProductModel.create({
         userID: user_id,
         productID: cartProduct['productID'],
         invoiceID: Invoice_id,
         qty: cartProduct['qty'],
         price: cartProduct['product']['discount']
            ? cartProduct['product']['discountPrice']
            : cartProduct['product']['price'],
         color: cartProduct['color'],
         size: cartProduct['size'],
      });
   });

   //Step 06: Remove CartList

   await CartListModel.deleteMany({ userID: user_id });

   //Step 07: Prepare SSL Commerz Payment

   const PaymentSetting = await PaymentSettingModel.find();

   const form = new FormData();

   form.append('store_id', PaymentSetting[0]['store_id']);
   form.append('store_passwd', PaymentSetting[0]['store_passwd']);
   form.append('total_amount', payable.toString());
   form.append('currency', PaymentSetting[0]['currency']);
   form.append('tran_id', tran_id);
   form.append('success_url', `${PaymentSetting[0]['success_url']}/${tran_id}`);
   form.append('fail_url', `${PaymentSetting[0]['fail_url']}/${tran_id}`);
   form.append('cancel_url', `${PaymentSetting[0]['cancel_url']}/${tran_id}`);
   form.append('ipn_url', `${PaymentSetting[0]['ipn_url']}/${tran_id}`);

   form.append('cus_name', Profile[0].cus_name);
   form.append('cus_email', cus_email);
   form.append('cus_add1', Profile[0].cus_add);
   form.append('cus_add2', Profile[0].cus_add);
   form.append('cus_city', Profile[0].cus_city);
   form.append('cus_state', Profile[0].cus_state);
   form.append('cus_postcode', Profile[0].cus_postcode);
   form.append('cus_country', Profile[0].cus_country);
   form.append('cus_phone', Profile[0].cus_phone);
   form.append('cus_fax', Profile[0].cus_phone);

   form.append('shipping_method', 'YES');
   form.append('ship_name', Profile[0].ship_name);
   form.append('ship_add1', Profile[0].ship_add);
   form.append('ship_add2', Profile[0].ship_add);
   form.append('ship_city', Profile[0].ship_city);
   form.append('ship_state', Profile[0].ship_state);
   form.append('ship_country', Profile[0].ship_country);
   form.append('ship_postcode', Profile[0].ship_postcode);
   form.append('product_name', 'product_name');
   form.append('product_category', 'category');
   form.append('product_profile', 'profile');
   form.append('product_amount', '5');

   const SSLRes = await axios.post(PaymentSetting[0]['init_url'], form);

   return { status: 'success', data: SSLRes.data };
};

const PaymentFailService = async req => {
   try {
      const trxID = req.params.trxID;

      const result = await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: 'fail' });

      return { status: 'payment fail', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const PaymentCancelService = async req => {
   try {
      const trxID = req.params.trxID;

      const result = await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: 'cancel' });

      return { status: 'payment fail', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const PaymentIPNService = async req => {
   try {
      const trxID = req.params.trxID;
      const status = req.body['status'];

      const result = await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: status });

      return { status: 'payment fail', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const PaymentSuccessService = async req => {
   try {
      const trxID = req.params.trxID;

      const result = await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: 'success' });

      return { status: 'payment success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const InvoiceListService = async req => {
   try {
      const user_id = req.headers.user_id;

      const invoice = await InvoiceModel.find({ userID: user_id });

      return { status: 'success', data: invoice };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const InvoiceProductListService = async req => {
   try {
      const user_id = new ObjectID(req.headers.user_id);
      const invoice_id = new ObjectID(req.params.invoice_id);

      const matchStage = { $match: { userID: user_id, invoiceID: invoice_id } };
      const JoinStageProduct = {
         $lookup: { from: 'products', localField: 'productID', foreignField: '_id', as: 'product' },
      };
      const unwindStage = { $unwind: '$product' };

      const invoice = await InvoiceProductModel.aggregate([matchStage, JoinStageProduct, unwindStage]);

      return { status: 'success', data: invoice };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

module.exports = {
   CreateInvoiceService,
   PaymentFailService,
   PaymentCancelService,
   PaymentIPNService,
   PaymentSuccessService,
   InvoiceListService,
   InvoiceProductListService,
};
