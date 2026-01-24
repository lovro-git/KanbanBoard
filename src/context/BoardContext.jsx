import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { boardReducer, initialState, ACTIONS } from '../utils/boardReducer';

const BoardContext = createContext(null);

const STORAGE_KEY = 'kanban-board-state';

// Load initial state from localStorage
const loadInitialState = () => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error('Failed to parse saved board state:', e);
    }
  }
  return initialState;
};

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, null, loadInitialState);
  const isInitialMount = useRef(true);

  // Save to localStorage on state change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Action creators
  const addTask = (columnId, title, description) => {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    dispatch({
      type: ACTIONS.ADD_TASK,
      payload: { columnId, title, description, taskId },
    });
    return taskId;
  };

  const deleteTask = (taskId) => {
    dispatch({
      type: ACTIONS.DELETE_TASK,
      payload: { taskId },
    });
  };

  const updateTask = (taskId, title, description) => {
    dispatch({
      type: ACTIONS.UPDATE_TASK,
      payload: { taskId, title, description },
    });
  };

  const moveTask = (taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex) => {
    dispatch({
      type: ACTIONS.MOVE_TASK,
      payload: { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex },
    });
  };

  const addReview = (taskId, content) => {
    dispatch({
      type: ACTIONS.ADD_REVIEW,
      payload: { taskId, content },
    });
  };

  const deleteReview = (taskId, reviewId) => {
    dispatch({
      type: ACTIONS.DELETE_REVIEW,
      payload: { taskId, reviewId },
    });
  };

  // Subtask actions
  const addSubtask = (taskId, title) => {
    dispatch({
      type: ACTIONS.ADD_SUBTASK,
      payload: { taskId, title },
    });
  };

  const updateSubtask = (taskId, subtaskId, title) => {
    dispatch({
      type: ACTIONS.UPDATE_SUBTASK,
      payload: { taskId, subtaskId, title },
    });
  };

  const deleteSubtask = (taskId, subtaskId) => {
    dispatch({
      type: ACTIONS.DELETE_SUBTASK,
      payload: { taskId, subtaskId },
    });
  };

  const toggleSubtask = (taskId, subtaskId) => {
    dispatch({
      type: ACTIONS.TOGGLE_SUBTASK,
      payload: { taskId, subtaskId },
    });
  };

  const reorderSubtasks = (taskId, subtasks) => {
    dispatch({
      type: ACTIONS.REORDER_SUBTASKS,
      payload: { taskId, subtasks },
    });
  };

  // Subtask report actions
  const addSubtaskReport = (taskId, subtaskId, content) => {
    dispatch({
      type: ACTIONS.ADD_SUBTASK_REPORT,
      payload: { taskId, subtaskId, content },
    });
  };

  const deleteSubtaskReport = (taskId, subtaskId, reportId) => {
    dispatch({
      type: ACTIONS.DELETE_SUBTASK_REPORT,
      payload: { taskId, subtaskId, reportId },
    });
  };

  // Image actions
  const addImage = (taskId, imageData) => {
    dispatch({
      type: ACTIONS.ADD_IMAGE,
      payload: { taskId, imageData },
    });
  };

  const deleteImage = (taskId, imageId) => {
    dispatch({
      type: ACTIONS.DELETE_IMAGE,
      payload: { taskId, imageId },
    });
  };

  const value = {
    state,
    dispatch,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    addReview,
    deleteReview,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
    reorderSubtasks,
    addSubtaskReport,
    deleteSubtaskReport,
    addImage,
    deleteImage,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}

export { ACTIONS };
