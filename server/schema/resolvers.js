const Task = require('../models/Task');

// GraphQL Resolvers for Task Operations
const resolvers = {
  Query: {
    // Retrieve all tasks sorted by id
    taskList: async () => {
      try {
        const tasks = await Task.find({}).sort({ id: 1 });
        return tasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks from database');
      }
    }
  },

  Mutation: {
    // Add a new task with auto-incremented integer id and 'Pending' status
    addTask: async (_, { title }) => {
      try {
        if (!title || title.trim() === '') {
          throw new Error('Task title cannot be empty');
        }

        // Find the task with the highest id to determine the next id
        const lastTask = await Task.findOne().sort({ id: -1 });
        const nextId = lastTask && lastTask.id ? lastTask.id + 1 : 1;

        const newTask = new Task({
          id: nextId,
          title: title.trim(),
          status: 'Pending'
        });

        const savedTask = await newTask.save();
        return savedTask;
      } catch (error) {
        console.error('Error adding task:', error);
        throw new Error(error.message || 'Failed to add task');
      }
    },

    // Update an existing task's title
    updateTask: async (_, { id, title }) => {
      try {
        if (!title || title.trim() === '') {
          throw new Error('Task title cannot be empty');
        }

        const updatedTask = await Task.findOneAndUpdate(
          { id: id },
          { title: title.trim() },
          { new: true }
        );

        if (!updatedTask) {
          throw new Error(`Task with id ${id} not found`);
        }

        return updatedTask;
      } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error.message || 'Failed to update task');
      }
    },

    // Update an existing task's status ('Pending' or 'Completed')
    updateTaskStatus: async (_, { id, status }) => {
      try {
        if (!['Pending', 'Completed'].includes(status)) {
          throw new Error("Status must be either 'Pending' or 'Completed'");
        }

        const updatedTask = await Task.findOneAndUpdate(
          { id: id },
          { status: status },
          { new: true }
        );

        if (!updatedTask) {
          throw new Error(`Task with id ${id} not found`);
        }

        return updatedTask;
      } catch (error) {
        console.error('Error updating task status:', error);
        throw new Error(error.message || 'Failed to update task status');
      }
    },

    // Delete a task by id
    deleteTask: async (_, { id }) => {
      try {
        const result = await Task.findOneAndDelete({ id: id });
        if (!result) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
      }
    }
  }
};

module.exports = resolvers;

