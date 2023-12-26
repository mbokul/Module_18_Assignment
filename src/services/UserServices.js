const SendMail = require('../helpers/SendMail');
const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');

const { EncodeToken } = require('../helpers/TokenHelper');

const UserOTPService = async req => {
   try {
      const email = req.params.email;
      const code = Math.floor(100000 + Math.random() * 900000);

      const EmailText = `Your Verification Code is ${code}`;
      const EmailSubject = 'Email Verification';

      SendMail(email, EmailText, EmailSubject);

      const result = await UserModel.updateOne({ email: email }, { $set: { otp: code } }, { upsert: true });

      return { status: 'success', message: '6 Digit OTP has been send to your email', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const VerifyOTPService = async req => {
   try {
      const email = req.params.email;
      const otp = req.params.otp;

      const user = await UserModel.find({ email: email, otp: otp }).count();
      if (user) {
         const user_id = await UserModel.find({ email: email, otp: otp }).select('_id');
         const token = EncodeToken(email, user_id[0]['_id'].toString());
         // OTP Code Update To 0
         await UserModel.updateOne({ email: email }, { $set: { otp: '0' } });

         return { status: 'success', message: 'Valid OTP', token: token };
      } else {
         return { status: 'fail', message: 'Invalid OTP' };
      }
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const SaveProfileService = async req => {
   try {
      const user_id = req.headers.user_id;
      const reqBody = req.body;
      reqBody.userID = user_id;

      const result = await ProfileModel.updateOne({ userID: user_id }, { $set: reqBody }, { upsert: true });

      return { status: 'success', message: 'Profile Save Success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

const ReadProfileService = async req => {
   try {
      const user_id = req.headers.user_id;
      const result = await ProfileModel.find({ userID: user_id });

      return { status: 'success', data: result };
   } catch (err) {
      return { status: 'fail', data: err };
   }
};

module.exports = {
   UserOTPService,
   VerifyOTPService,
   SaveProfileService,
   ReadProfileService,
};
