const { DecodeToken } = require('../helpers/TokenHelper');

const VerifyAuthentication = (req, res, next) => {
   const token = req.headers['token'];

   if (!token) {
      token = req.cookies['token'];
   }

   const decoded = DecodeToken(token);

   if (!decoded) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

   const email = decoded['email'];
   const user_id = decoded['user_id'];
   req.headers.email = email;
   req.headers.user_id = user_id;

   next();
};

module.exports = VerifyAuthentication;
