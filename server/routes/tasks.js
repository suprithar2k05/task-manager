const express = require('express');
const Task = require('../models/Task');
const mongoose = require('mongoose');
const authenticate = require('../middleware/auth');
const { check, body, param, query} = require('express-validator');
const validationResult = require('../middleware/validateRequest');
const router  = express.Router();
const validateRequest = require('../middleware/validateRequest');
router.use(authenticate);

// Create task
router.post('/', [
   check('title', 'Title is required').notEmpty(),
   body('priority')
      .optional()
      .isIn(['High', 'Medium', 'Low'])
      .withMessage('Priority must be High, Medium or Low'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
], validationResult, async (req, res) => {
   try {
    console.log('req.body >>>', req.body);
      const task = await Task.create({ ...req.body, userId: req.user.id });
      await task.save();
      res.status(201).json(task);
   } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
   }
 });

 //update 
 router.put(
   '/:id',
   [
     param('id').custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('Invalid task ID'),
     body('title').optional().notEmpty().withMessage('Title cannot be empty'),
     body('priority')
       .optional()
       .isIn(['High', 'Medium', 'Low'])
       .withMessage('Invalid priority'),
     body('dueDate')
       .optional()
       .isISO8601()
       .withMessage('Invalid date format for dueDate'),
   ],
   validateRequest,
   async (req, res, next) => {
     try {
       const updated = await Task.findOneAndUpdate(
         { _id: req.params.id, userId: req.user.id },
         req.body,
         { new: true }
       );

       if (!updated) return res.status(404).json({ message: 'Task not found' });
       res.json(updated);
     } catch (err) {
       next(err);
     }
   }
 );


// delete 
router.delete(
   '/:id',
   [
     param('id').custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('Invalid task ID'),
   ],
   validateRequest,
   async (req, res, next) => {
     try {
       const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
       if (!deleted) return res.status(404).json({ message: 'Task not found' });
       res.json({ message: 'Task deleted' });
     } catch (err) {
       next(err);
     }
   }
 );
 
 //find
 router.get(
   '/',
   [
     query('category').optional().isString().withMessage('Invalid category'),
     query('status')
       .optional()
       .isIn(['completed', 'pending'])
       .withMessage('Status must be "completed" or "pending"'),
     query('search').optional().isString(),
   ],
   validateRequest,
   async (req, res, next) => {
     try {
       const { category, status, search } = req.query;
       const query = { userId: req.user.id };
 
       if (category) query.category = category;
       if (status) query.isCompleted = status === 'completed';
       if (search) query.title = { $regex: search, $options: 'i' };
 
       const tasks = await Task.find(query);
       res.json(tasks);
     } catch (err) {
       next(err);
     }
   }
 );
 
//summary 
router.get('/summary', async (req, res, next) => {
   try {
     const userId = req.user.id;
     const [total, completed, pending] = await Promise.all([
       Task.countDocuments({ userId }),
       Task.countDocuments({ userId, isCompleted: true }),
       Task.countDocuments({ userId, isCompleted: false }),
     ]);
     res.json({ total, completed, pending });
   } catch (err) {
     next(err);
   }
 });

module.exports = router;
 