const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   title: { type: String, required: true },
   description: String,
   category: String,
   tags: [String],
   priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
   dueDate: Date,
   isCompleted: { type: Boolean, default: false }
 }, { timestamps: true });

 module.exports = mongoose.model('Task', taskSchema);
 