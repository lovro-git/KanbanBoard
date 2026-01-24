import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtaskItem } from '../SubtaskItem/SubtaskItem';
import styles from './Subtasks.module.css';

export function Subtasks({
  subtasks = [],
  taskId,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onToggleSubtask,
  onAddReport,
  onDeleteReport,
}) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;

  const handleAdd = () => {
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) return;

    onAddSubtask(taskId, trimmed);
    setNewSubtaskTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.addSubtask}>
        <div className={styles.addIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add subtask..."
          className={styles.addInput}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newSubtaskTitle.trim()}
          className={styles.addButton}
        >
          Add
        </button>
      </div>

      {totalCount === 0 ? (
        <p className={styles.empty}>No subtasks yet</p>
      ) : (
        <ul className={styles.list}>
          <AnimatePresence initial={false}>
            {subtasks.map((subtask) => (
              <motion.li
                key={subtask.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SubtaskItem
                  subtask={subtask}
                  taskId={taskId}
                  onUpdate={onUpdateSubtask}
                  onDelete={onDeleteSubtask}
                  onToggle={onToggleSubtask}
                  onAddReport={onAddReport}
                  onDeleteReport={onDeleteReport}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
