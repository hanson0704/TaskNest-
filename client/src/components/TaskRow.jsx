import React from 'react';

/**
 * TaskRow Component
 * Stateful Class Component that displays an individual task row.
 * Handles local UI state for inline editing and communicates user
 * actions (edit, complete, delete) to the parent TaskList component via callbacks.
 */
class TaskRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editTitle: props.task.title
    };

    // Method bindings
    this.handleStartEdit = this.handleStartEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCompleteClick = this.handleCompleteClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  // Update local edit title if props change
  componentDidUpdate(prevProps) {
    if (prevProps.task.title !== this.props.task.title) {
      this.setState({ editTitle: this.props.task.title });
    }
  }

  // Enable edit mode
  handleStartEdit() {
    this.setState({
      isEditing: true,
      editTitle: this.props.task.title
    });
  }

  // Cancel edit mode and reset input
  handleCancelEdit() {
    this.setState({
      isEditing: false,
      editTitle: this.props.task.title
    });
  }

  // Handle input changes during editing
  handleTitleChange(event) {
    this.setState({ editTitle: event.target.value });
  }

  // Save the updated title via parent callback
  handleSaveEdit() {
    const trimmedTitle = this.state.editTitle.trim();
    if (!trimmedTitle) {
      alert('Task title cannot be empty.');
      return;
    }
    // Call parent callback
    this.props.onEdit(this.props.task.id, trimmedTitle);
    this.setState({ isEditing: false });
  }

  // Mark task as Completed via parent callback
  handleCompleteClick() {
    this.props.onUpdateStatus(this.props.task.id, 'Completed');
  }

  // Delete task via parent callback
  handleDeleteClick() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete task "${this.props.task.title}"?`
    );
    if (confirmDelete) {
      this.props.onDelete(this.props.task.id);
    }
  }

  render() {
    const { task } = this.props;
    const { isEditing, editTitle } = this.state;
    const isCompleted = task.status === 'Completed';

    return (
      <tr className={`task-row ${isCompleted ? 'row-completed' : 'row-pending'}`}>
        {/* Task ID */}
        <td className="cell-id">#{task.id}</td>

        {/* Task Title (or inline edit input) */}
        <td className="cell-title">
          {isEditing ? (
            <div className="inline-edit-box">
              <input
                type="text"
                className="edit-input"
                value={editTitle}
                onChange={this.handleTitleChange}
                autoFocus
                placeholder="Enter updated task title"
              />
              <button
                type="button"
                className="btn btn-save"
                onClick={this.handleSaveEdit}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={this.handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <span className={`task-title-text ${isCompleted ? 'text-completed' : ''}`}>
              {task.title}
            </span>
          )}
        </td>

        {/* Task Status Badge */}
        <td className="cell-status">
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
            {task.status}
          </span>
        </td>

        {/* Action Buttons */}
        <td className="cell-actions">
          {!isEditing && (
            <div className="actions-wrapper">
              {/* Mark Completed button (only shown if task is Pending) */}
              {!isCompleted && (
                <button
                  type="button"
                  className="btn btn-complete"
                  onClick={this.handleCompleteClick}
                  title="Mark this task as Completed"
                >
                  ✓ Complete
                </button>
              )}

              {/* Edit Button */}
              <button
                type="button"
                className="btn btn-edit"
                onClick={this.handleStartEdit}
                title="Edit task title"
              >
                ✎ Edit
              </button>

              {/* Delete Button */}
              <button
                type="button"
                className="btn btn-delete"
                onClick={this.handleDeleteClick}
                title="Delete this task"
              >
                ✕ Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }
}

export default TaskRow;

