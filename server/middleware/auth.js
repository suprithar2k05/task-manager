const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1];
   if(!token) {
      return res.status(401).json({ msg: 'Unauthorized'});
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
      if(err) {
         return res.status(403).json({msg: 'Forbidden'});
      }
      req.user = userData.user;
      next();
   })
}

module.exports = authenticate;