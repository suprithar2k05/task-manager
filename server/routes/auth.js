const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const validationResult = require('../middleware/validateRequest');
const authenticate = require('../middleware/auth');

router.get('/profile', authenticate, async (req, res) => {
   const user = await User.findById(req.user.id).select('-password').lean();
   res.json({ user })
 })

router.post('/register', [
   check('name', 'Name is required').notEmpty(),
   check('email', 'Please include a valid email').isEmail(),
   check('password', 'Password must be 6 or more characters').isLength({ min: 6})
], validationResult, async (req, res) => {
   const { name, email, password } = req.body;

   try {
      let user = await User.findOne({ email });
      if(user) return res.status(400).json({ msg: 'User already exits'});

      user = new User({name, email, password});
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = { user: { id: user.id}}
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});
      res.status(201).json({ token });
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
   }
})

router.post('/login', [
   check('email', 'Please include a valid email').isEmail(),
   check('password', 'Password is required').notEmpty(),
], validationResult, async (req, res) => {
   const {email, password} = req.body;

   try {
      let user = await User.findOne({ email });
      if(!user) {
         return res.status(400).json({ msg: 'Invalid credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
         return res.status(400).json({ msg: 'Invalid credentials'});
      }

      const payload = { user: { id: user.id }};

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });

   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
   }
})

module.exports = router;