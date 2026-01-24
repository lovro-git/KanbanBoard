import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SubtaskReports.module.css';

export function SubtaskReports({
  reports = [],
  taskId,
  subtaskId,
  onAddReport,
  onDeleteReport,
}) {
  const [newReportContent, setNewReportContent] = useState('');

  const handleAdd = () => {
    const trimmed = newReportContent.trim();
    if (!trimmed) return;

    onAddReport(taskId, subtaskId, trimmed);
    setNewReportContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (reportId) => {
    onDeleteReport(taskId, subtaskId, reportId);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      {reports.length > 0 && (
        <ul className={styles.list}>
          <AnimatePresence initial={false}>
            {reports.map((report) => (
              <motion.li
                key={report.id}
                className={styles.item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className={styles.connector} />
                <div className={styles.content}>
                  <p className={styles.text}>{report.content}</p>
                  <span className={styles.date}>{formatDate(report.createdAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(report.id)}
                  className={styles.deleteButton}
                  aria-label="Delete report"
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
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className={styles.addReport}>
        <div className={styles.connector} />
        <input
          type="text"
          value={newReportContent}
          onChange={(e) => setNewReportContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add report..."
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newReportContent.trim()}
          className={styles.addButton}
        >
          Add
        </button>
      </div>
    </div>
  );
}
