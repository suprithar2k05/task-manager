const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
      console.log('error >>', errors);
      return res.status(422).json({ errors: errors.array()});
   }
   next();
}

module.exports = validateResult;