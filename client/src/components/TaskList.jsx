import React from 'react';
import TaskAdd from './TaskAdd';
import TaskTable from './TaskTable';

const GRAPHQL_ENDPOINT = '/graphql';

/**
 * TaskList Component
 * Main parent Stateful Class Component for TaskNest.
 * 
 * Responsibilities:
 * - Maintains application state (tasks list, loading, notifications).
 * - Executes GraphQL queries and mutations using the native Fetch API.
 * - Implements Lifting State Up by providing callback functions to child components.
 * - Updates state immutably without mutating existing arrays.
 */
class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isLoading: true,
      alertMessage: null,
      alertType: 'info' // 'info', 'success', 'error'
    };

    // Method bindings
    this.loadTasks = this.loadTasks.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.clearAlert = this.clearAlert.bind(this);
  }

  // Lifecycle method: Fetch initial task data when component mounts
  componentDidMount() {
    this.loadTasks();
  }

  // Display notification message with auto-dismiss
  showAlert(message, type = 'info') {
    this.setState({ alertMessage: message, alertType: type });
    setTimeout(() => {
      // Clear alert after 3.5 seconds if message is still the same
      this.setState(prevState => {
        if (prevState.alertMessage === message) {
          return { alertMessage: null };
        }
        return null;
      });
    }, 3500);
  }

  clearAlert() {
    this.setState({ alertMessage: null });
  }

  /**
   * 1. Query: taskList
   * Retrieves all tasks from the GraphQL backend.
   */
  loadTasks() {
    this.setState({ isLoading: true });

    const query = `
      query GetTaskList {
        taskList {
          id
          title
          status
        }
      }
    `;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }
        // Immutable state update
        this.setState({
          tasks: result.data.taskList || [],
          isLoading: false
        });
      })
      .catch(error => {
        console.error('Error loading tasks:', error);
        this.setState({
          isLoading: false
        });
        this.showAlert(`Failed to load tasks: ${error.message}`, 'error');
      });
  }

  /**
   * 2. Mutation: addTask
   * Adds a new task with the specified title.
   */
  handleAddTask(title) {
    const mutation = `
      mutation AddNewTask($title: String!) {
        addTask(title: $title) {
          id
          title
          status
        }
      }
    `;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: { title }
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }

        const newTask = result.data.addTask;

        // Immutably append new task to state array using array concatenation
        this.setState(prevState => ({
          tasks: prevState.tasks.concat([newTask])
        }));

        this.showAlert(`Task "${newTask.title}" added successfully!`, 'success');
      })
      .catch(error => {
        console.error('Error adding task:', error);
        this.showAlert(`Failed to add task: ${error.message}`, 'error');
      });
  }

  /**
   * 3. Mutation: updateTask
   * Updates an existing task's title.
   */
  handleEditTask(id, newTitle) {
    const mutation = `
      mutation UpdateExistingTask($id: Int!, $title: String!) {
        updateTask(id: $id, title: $title) {
          id
          title
          status
        }
      }
    `;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: { id, title: newTitle }
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }

        const updatedTask = result.data.updateTask;

        // Immutably update task item in array using map
        this.setState(prevState => ({
          tasks: prevState.tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        }));

        this.showAlert(`Task #${id} updated successfully!`, 'success');
      })
      .catch(error => {
        console.error('Error updating task:', error);
        this.showAlert(`Failed to update task: ${error.message}`, 'error');
      });
  }

  /**
   * 4. Mutation: updateTaskStatus
   * Changes the task status to 'Completed'.
   */
  handleUpdateStatus(id, newStatus) {
    const mutation = `
      mutation UpdateStatus($id: Int!, $status: String!) {
        updateTaskStatus(id: $id, status: $status) {
          id
          title
          status
        }
      }
    `;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: { id, status: newStatus }
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }

        const updatedTask = result.data.updateTaskStatus;

        // Immutably update task in array
        this.setState(prevState => ({
          tasks: prevState.tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        }));

        this.showAlert(`Task #${id} marked as ${newStatus}!`, 'success');
      })
      .catch(error => {
        console.error('Error updating task status:', error);
        this.showAlert(`Failed to update status: ${error.message}`, 'error');
      });
  }

  /**
   * 5. Mutation: deleteTask
   * Deletes a task by id from MongoDB.
   */
  handleDeleteTask(id) {
    const mutation = `
      mutation RemoveTask($id: Int!) {
        deleteTask(id: $id)
      }
    `;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: { id }
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteTask) {
          // Immutably remove task using filter
          this.setState(prevState => ({
            tasks: prevState.tasks.filter(task => task.id !== id)
          }));
          this.showAlert(`Task #${id} deleted successfully.`, 'info');
        } else {
          this.showAlert(`Task #${id} could not be deleted.`, 'error');
        }
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        this.showAlert(`Failed to delete task: ${error.message}`, 'error');
      });
  }

  render() {
    const { tasks, isLoading, alertMessage, alertType } = this.state;

    // Calculate quick counts for summary
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingCount = totalCount - completedCount;

    return (
      <div className="tasknest-container">
        {/* Header Section */}
        <header className="app-header">
          <div className="brand">
            <span className="brand-logo">TaskNest</span>
          </div>
          <p className="app-subtitle">
            Personal Task Management System – Organize, Track, and Accomplish Your Daily Goals
          </p>
        </header>

        {/* Notifications / Alerts */}
        {alertMessage && (
          <div className={`alert-banner alert-${alertType}`}>
            <span>{alertMessage}</span>
            <button
              type="button"
              className="alert-close"
              onClick={this.clearAlert}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        {/* Task Summary Badges */}
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
          <div className="stat-card stat-completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedCount}</span>
          </div>
        </div>

        {/* Task Addition Form (Child Component) */}
        <section className="section-card">
          <h2 className="section-title">Add New Task</h2>
          <TaskAdd onAddTask={this.handleAddTask} />
        </section>

        {/* Task Table Section (Child Component) */}
        <section className="section-card">
          <div className="section-header-flex">
            <h2 className="section-title">Your Tasks</h2>
            {isLoading && <span className="loading-indicator">Loading tasks...</span>}
          </div>

          <TaskTable
            tasks={tasks}
            onEdit={this.handleEditTask}
            onUpdateStatus={this.handleUpdateStatus}
            onDelete={this.handleDeleteTask}
          />
        </section>
      </div>
    );
  }
}

export default TaskList;

