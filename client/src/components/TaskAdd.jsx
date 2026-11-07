import React from 'react';

/**
 * TaskAdd Component
 * Stateful Class Component providing a form to enter and submit a new task title.
 * Validates input and triggers parent callback to perform GraphQL mutation.
 */
class TaskAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      inputError: ''
    };

    // Method bindings
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle task title input changes
  handleInputChange(event) {
    this.setState({
      title: event.target.value,
      inputError: ''
    });
  }

  // Handle form submission
  handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = this.state.title.trim();

    if (!trimmedTitle) {
      this.setState({ inputError: 'Please enter a valid task title.' });
      return;
    }

    // Call parent callback passed via props
    this.props.onAddTask(trimmedTitle);

    // Reset input field after submission
    this.setState({
      title: '',
      inputError: ''
    });
  }

  render() {
    const { title, inputError } = this.state;

    return (
      <div className="task-add-container">
        <form className="task-add-form" onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className={`task-input ${inputError ? 'input-invalid' : ''}`}
              placeholder="What needs to be done? Enter task title..."
              value={title}
              onChange={this.handleInputChange}
            />
            <button type="submit" className="btn btn-add">
              <span className="btn-icon">+</span> Add Task
            </button>
          </div>
          {inputError && <p className="validation-error">{inputError}</p>}
        </form>
      </div>
    );
  }
}

export default TaskAdd;

