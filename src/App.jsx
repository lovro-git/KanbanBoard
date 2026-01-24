import { useState, useEffect } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import { TaskModal } from './components/TaskModal/TaskModal';
import styles from './App.module.css';

function AppContent() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    state,
    updateTask,
    addReview,
    deleteReview,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
    addSubtaskReport,
    deleteSubtaskReport,
    addImage,
    deleteImage,
  } = useBoard();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [pendingEditTaskId, setPendingEditTaskId] = useState(null);

  // Get fresh task data from state to reflect review updates
  const editingTask = editingTaskId ? state.tasks[editingTaskId] : null;

  // Handle opening a newly created task once it appears in state
  useEffect(() => {
    if (pendingEditTaskId && state.tasks[pendingEditTaskId]) {
      setEditingTaskId(pendingEditTaskId);
      setPendingEditTaskId(null);
    }
  }, [pendingEditTaskId, state.tasks]);

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
  };

  const handleTaskCreated = (taskId) => {
    // Queue the task to be opened once it appears in state
    setPendingEditTaskId(taskId);
  };

  const handleSaveEdit = (title, description) => {
    if (editingTaskId) {
      updateTask(editingTaskId, title, description);
      setEditingTaskId(null);
    }
  };

  const handleCloseEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <div className={styles.app}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <main className={styles.main}>
        <Board onEditTask={handleEditTask} onTaskCreated={handleTaskCreated} />
      </main>

      <TaskModal
        isOpen={!!editingTask}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        onAddReview={addReview}
        onDeleteReview={deleteReview}
        onAddSubtask={addSubtask}
        onUpdateSubtask={updateSubtask}
        onDeleteSubtask={deleteSubtask}
        onToggleSubtask={toggleSubtask}
        onAddSubtaskReport={addSubtaskReport}
        onDeleteSubtaskReport={deleteSubtaskReport}
        onAddImage={addImage}
        onDeleteImage={deleteImage}
        title="Edit Task"
        task={editingTask}
      />
    </div>
  );
}

function App() {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  );
}

export default App;
