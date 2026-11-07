const mongoose = require('mongoose');

// Mongoose schema matching the required Task structure:
// Only id, title, and status are stored.
const taskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
  },
  {
    versionKey: false // Exclude __v field
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

