const cron = require('node-cron');
const Task = require('../models/Task.js');

cron.schedule('0 9 * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({ dueDate: { $lte: tomorrow }, isCompleted: false });

  tasks.forEach(task => {
    console.log(`Reminder: Task "${task.title}" is due soon!`);
    // You could integrate email/SMS notifications here
  });
});
