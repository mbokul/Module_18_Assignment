const jsonWebToken = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const KEY = process.env.Secret_Key;

const EncodeToken = (email, user_id) =>
   jsonWebToken.sign({ email: email, user_id: user_id }, KEY, { expiresIn: '24h' });

const DecodeToken = token => {
   try {
      return jsonWebToken.verify(token, KEY);
   } catch (e) {
      return null;
   }
};

module.exports = {
   EncodeToken,
   DecodeToken,
};
