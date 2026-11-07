import React from 'react';
import TaskList from './components/TaskList';
import './App.css';

/**
 * App Component
 * Root Class Component that renders the TaskList container.
 */
class App extends React.Component {
  render() {
    return (
      <div className="app-root">
        <TaskList />
      </div>
    );
  }
}

export default App;

