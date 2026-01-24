import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtaskReports } from '../SubtaskReports/SubtaskReports';
import styles from './SubtaskItem.module.css';

export function SubtaskItem({
  subtask,
  taskId,
  onUpdate,
  onDelete,
  onToggle,
  onAddReport,
  onDeleteReport,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const [showReports, setShowReports] = useState(false);

  const reportsCount = subtask.reports?.length || 0;

  const handleToggle = () => {
    onToggle(taskId, subtask.id);
  };

  const handleDelete = () => {
    onDelete(taskId, subtask.id);
  };

  const handleStartEdit = () => {
    setEditTitle(subtask.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== subtask.title) {
      onUpdate(taskId, subtask.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(subtask.title);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <button
          type="button"
          onClick={handleToggle}
          className={`${styles.checkbox} ${subtask.completed ? styles.checked : ''}`}
          aria-label={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {subtask.completed && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus
            className={styles.editInput}
          />
        ) : (
          <span
            className={`${styles.title} ${subtask.completed ? styles.completed : ''}`}
            onDoubleClick={handleStartEdit}
          >
            {subtask.title}
          </span>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setShowReports(!showReports)}
            className={`${styles.actionButton} ${showReports ? styles.active : ''}`}
            aria-label={showReports ? 'Hide reports' : 'Show reports'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {reportsCount > 0 && (
              <span className={styles.badge}>{reportsCount}</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            aria-label="Delete subtask"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showReports && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.reportsWrapper}
          >
            <SubtaskReports
              reports={subtask.reports || []}
              taskId={taskId}
              subtaskId={subtask.id}
              onAddReport={onAddReport}
              onDeleteReport={onDeleteReport}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
