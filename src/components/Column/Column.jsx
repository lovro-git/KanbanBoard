import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskModal } from '../TaskModal/TaskModal';
import { useBoard } from '../../context/BoardContext';
import styles from './Column.module.css';

const emptyStateIcons = {
  'todo': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="8" width="32" height="32" rx="4" />
      <line x1="16" y1="18" x2="32" y2="18" />
      <line x1="16" y1="24" x2="28" y2="24" />
      <line x1="16" y1="30" x2="24" y2="30" />
    </svg>
  ),
  'in-progress': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 16v8l6 4" strokeLinecap="round" />
    </svg>
  ),
  'done': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="16" />
      <path d="M16 24l6 6 12-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const emptyStateMessages = {
  'todo': 'No tasks to do',
  'in-progress': 'Nothing in progress',
  'done': 'No completed tasks',
};

export function Column({ column, tasks, onEditTask, onTaskCreated, index }) {
  const { addTask } = useBoard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleAddTask = (title, description) => {
    const newTaskId = addTask(column.id, title, description);
    setIsAddModalOpen(false);
    // Notify parent to open the task in edit mode for adding subtasks/images
    onTaskCreated?.(newTaskId);
  };

  return (
    <motion.div
      className={styles.column}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{column.title}</h2>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <div className={styles.accentLine} />
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`${styles.taskList} ${isOver ? styles.isOver : ''}`}
        >
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task, taskIndex) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(task)}
                  index={taskIndex}
                />
              ))
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.emptyIcon}>
                  {emptyStateIcons[column.id]}
                </div>
                <p className={styles.emptyText}>
                  {emptyStateMessages[column.id]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SortableContext>

      <button
        className={styles.addButton}
        onClick={() => setIsAddModalOpen(true)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.addIcon}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add task
      </button>

      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
        title="Add New Task"
      />
    </motion.div>
  );
}
