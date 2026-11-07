import React from 'react';
import TaskRow from './TaskRow';

/**
 * TaskTable Component
 * Stateless Class Component that receives tasks list and callback functions via props.
 * Displays all tasks in an HTML table, delegating row rendering and interactions to TaskRow.
 */
class TaskTable extends React.Component {
  render() {
    const { tasks, onEdit, onUpdateStatus, onDelete } = this.props;

    // Display empty state message when no tasks are present
    if (!tasks || tasks.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Tasks Found</h3>
          <p>Your task list is empty. Add a task using the input field above to get started!</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-title">Task Title</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={onEdit}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TaskTable;

