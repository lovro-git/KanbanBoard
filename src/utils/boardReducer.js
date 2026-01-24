// Action types
export const ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  SET_BOARD: 'SET_BOARD',
  ADD_REVIEW: 'ADD_REVIEW',
  DELETE_REVIEW: 'DELETE_REVIEW',
  // Subtasks
  ADD_SUBTASK: 'ADD_SUBTASK',
  UPDATE_SUBTASK: 'UPDATE_SUBTASK',
  DELETE_SUBTASK: 'DELETE_SUBTASK',
  TOGGLE_SUBTASK: 'TOGGLE_SUBTASK',
  REORDER_SUBTASKS: 'REORDER_SUBTASKS',
  // Subtask Reports
  ADD_SUBTASK_REPORT: 'ADD_SUBTASK_REPORT',
  DELETE_SUBTASK_REPORT: 'DELETE_SUBTASK_REPORT',
  // Images
  ADD_IMAGE: 'ADD_IMAGE',
  DELETE_IMAGE: 'DELETE_IMAGE',
};

// Default columns
export const DEFAULT_COLUMNS = ['todo', 'in-progress', 'done'];

export const COLUMN_TITLES = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

// Initial state
export const initialState = {
  tasks: {},
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: [],
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: DEFAULT_COLUMNS,
};

// Generate unique ID
export const generateId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Reducer function
export function boardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOARD: {
      return action.payload || initialState;
    }

    case ACTIONS.ADD_TASK: {
      const { columnId, title, description, taskId: providedTaskId } = action.payload;
      const taskId = providedTaskId || generateId();

      const newTask = {
        id: taskId,
        title,
        description: description || '',
        createdAt: Date.now(),
        reviews: [],
        subtasks: [],
        images: [],
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: newTask,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: [...state.columns[columnId].taskIds, taskId],
          },
        },
      };
    }

    case ACTIONS.DELETE_TASK: {
      const { taskId } = action.payload;

      // Find which column contains this task
      const columnId = Object.keys(state.columns).find(
        (colId) => state.columns[colId].taskIds.includes(taskId)
      );

      if (!columnId) return state;

      // Remove task from tasks object
      const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;

      // Remove taskId from column
      return {
        ...state,
        tasks: remainingTasks,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: state.columns[columnId].taskIds.filter((id) => id !== taskId),
          },
        },
      };
    }

    case ACTIONS.UPDATE_TASK: {
      const { taskId, title, description } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            title,
            description,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case ACTIONS.MOVE_TASK: {
      const { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;

      // Same column reordering
      if (sourceColumnId === destinationColumnId) {
        const column = state.columns[sourceColumnId];
        const newTaskIds = Array.from(column.taskIds);
        newTaskIds.splice(sourceIndex, 1);
        newTaskIds.splice(destinationIndex, 0, taskId);

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        };
      }

      // Moving between columns
      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destinationColumnId];

      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(sourceIndex, 1);

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destinationIndex, 0, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumnId]: {
            ...destColumn,
            taskIds: destTaskIds,
          },
        },
      };
    }

    case ACTIONS.ADD_REVIEW: {
      const { taskId, content } = action.payload;

      if (!state.tasks[taskId]) return state;

      const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newReview = {
        id: reviewId,
        content,
        createdAt: Date.now(),
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            reviews: [...(state.tasks[taskId].reviews || []), newReview],
          },
        },
      };
    }

    case ACTIONS.DELETE_REVIEW: {
      const { taskId, reviewId } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            reviews: (state.tasks[taskId].reviews || []).filter((r) => r.id !== reviewId),
          },
        },
      };
    }

    // Subtask actions
    case ACTIONS.ADD_SUBTASK: {
      const { taskId, title } = action.payload;

      if (!state.tasks[taskId]) return state;

      const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newSubtask = {
        id: subtaskId,
        title,
        completed: false,
        createdAt: Date.now(),
        reports: [],
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: [...(state.tasks[taskId].subtasks || []), newSubtask],
          },
        },
      };
    }

    case ACTIONS.UPDATE_SUBTASK: {
      const { taskId, subtaskId, title } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: (state.tasks[taskId].subtasks || []).map((s) =>
              s.id === subtaskId ? { ...s, title } : s
            ),
          },
        },
      };
    }

    case ACTIONS.DELETE_SUBTASK: {
      const { taskId, subtaskId } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: (state.tasks[taskId].subtasks || []).filter((s) => s.id !== subtaskId),
          },
        },
      };
    }

    case ACTIONS.TOGGLE_SUBTASK: {
      const { taskId, subtaskId } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: (state.tasks[taskId].subtasks || []).map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          },
        },
      };
    }

    case ACTIONS.REORDER_SUBTASKS: {
      const { taskId, subtasks } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks,
          },
        },
      };
    }

    // Subtask Report actions
    case ACTIONS.ADD_SUBTASK_REPORT: {
      const { taskId, subtaskId, content } = action.payload;

      if (!state.tasks[taskId]) return state;

      const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newReport = {
        id: reportId,
        content,
        createdAt: Date.now(),
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: (state.tasks[taskId].subtasks || []).map((s) =>
              s.id === subtaskId
                ? { ...s, reports: [...(s.reports || []), newReport] }
                : s
            ),
          },
        },
      };
    }

    case ACTIONS.DELETE_SUBTASK_REPORT: {
      const { taskId, subtaskId, reportId } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            subtasks: (state.tasks[taskId].subtasks || []).map((s) =>
              s.id === subtaskId
                ? { ...s, reports: (s.reports || []).filter((r) => r.id !== reportId) }
                : s
            ),
          },
        },
      };
    }

    // Image actions
    case ACTIONS.ADD_IMAGE: {
      const { taskId, imageData } = action.payload;

      if (!state.tasks[taskId]) return state;

      const imageId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newImage = {
        id: imageId,
        name: imageData.name,
        data: imageData.data,
        createdAt: Date.now(),
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            images: [...(state.tasks[taskId].images || []), newImage],
          },
        },
      };
    }

    case ACTIONS.DELETE_IMAGE: {
      const { taskId, imageId } = action.payload;

      if (!state.tasks[taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            images: (state.tasks[taskId].images || []).filter((i) => i.id !== imageId),
          },
        },
      };
    }

    default:
      return state;
  }
}
