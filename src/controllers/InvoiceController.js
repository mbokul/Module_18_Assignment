const {
   CreateInvoiceService,
   PaymentSuccessService,
   PaymentFailService,
   PaymentCancelService,
   PaymentIPNService,
   InvoiceListService,
   InvoiceProductListService,
} = require('../services/InvoiceServices');

const CreateInvoice = async (req, res) => {
   const result = await CreateInvoiceService(req);
   return res.status(200).json(result);
};

const PaymentSuccess = async (req, res) => {
   const result = await PaymentSuccessService(req);
   return res.status(200).json(result);
};

const PaymentFail = async (req, res) => {
   const result = await PaymentFailService(req);
   return res.status(200).json(result);
};

const PaymentCancel = async (req, res) => {
   const result = await PaymentCancelService(req);
   return res.status(200).json(result);
};

const PaymentIPN = async (req, res) => {
   const result = await PaymentIPNService(req);
   return res.status(200).json(result);
};

const InvoiceList = async (req, res) => {
   const result = await InvoiceListService(req);
   return res.status(200).json(result);
};

const InvoiceProductList = async (req, res) => {
   const result = await InvoiceProductListService(req);
   return res.status(200).json(result);
};

module.exports = {
   CreateInvoice,
   PaymentSuccess,
   PaymentFail,
   PaymentCancel,
   PaymentIPN,
   InvoiceList,
   InvoiceProductList,
};
