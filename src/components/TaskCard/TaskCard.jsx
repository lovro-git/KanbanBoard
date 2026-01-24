import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useBoard } from '../../context/BoardContext';
import styles from './TaskCard.module.css';

export function TaskCard({ task, onEdit, isDragging: isOverlay, index = 0 }) {
  const { deleteTask } = useBoard();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const subtasks = task.subtasks || [];
  const images = task.images || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const totalSubtasks = subtasks.length;
  const imageCount = images.length;

  const hasIndicators = totalSubtasks > 0 || imageCount > 0;

  if (isOverlay) {
    return (
      <div className={`${styles.card} ${styles.overlay}`}>
        <div className={styles.content}>
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}
        </div>
        {hasIndicators && (
          <div className={styles.indicators}>
            {totalSubtasks > 0 && (
              <span className={styles.indicator}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
            {imageCount > 0 && (
              <span className={styles.indicator}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {imageCount}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      layout
      {...attributes}
      {...listeners}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
      </div>

      {hasIndicators && (
        <div className={styles.indicators}>
          {totalSubtasks > 0 && (
            <span className={`${styles.indicator} ${completedSubtasks === totalSubtasks ? styles.complete : ''}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}
          {imageCount > 0 && (
            <span className={styles.indicator}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {imageCount}
            </span>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={handleEdit}
          aria-label="Edit task"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={handleDelete}
          aria-label="Delete task"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
