import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subtasks } from '../Subtasks/Subtasks';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import styles from './TaskModal.module.css';

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  onAddReview,
  onDeleteReview,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onToggleSubtask,
  onAddSubtaskReport,
  onDeleteSubtaskReport,
  onAddImage,
  onDeleteImage,
  title,
  task = null,
}) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState('subtasks');
  const inputRef = useRef(null);

  const isEditing = !!task;

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
    } else {
      setTaskTitle('');
      setTaskDescription('');
    }
    setReviewContent('');
    setError('');
  }, [task, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }

    onSave(trimmedTitle, taskDescription.trim());
    setTaskTitle('');
    setTaskDescription('');
    setError('');
  };

  const handleAddReview = () => {
    const trimmed = reviewContent.trim();
    if (!trimmed || !task) return;

    onAddReview(task.id, trimmed);
    setReviewContent('');
  };

  const handleReviewKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddReview();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const reviews = task?.reviews || [];
  const subtasks = task?.subtasks || [];
  const images = task?.images || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className={`${styles.modal} ${isEditing ? styles.modalWide : ''}`}
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerAccent} />
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
                {isEditing && task?.createdAt && (
                  <span className={styles.meta}>
                    Created {formatDate(task.createdAt)}
                  </span>
                )}
              </div>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
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

            <div className={styles.body}>
              {/* Main Content */}
              <div className={styles.mainContent}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="task-title" className={styles.label}>
                      Title
                    </label>
                    <input
                      ref={inputRef}
                      id="task-title"
                      type="text"
                      value={taskTitle}
                      onChange={(e) => {
                        setTaskTitle(e.target.value);
                        setError('');
                      }}
                      placeholder="What needs to be done?"
                      className={`${styles.input} ${styles.inputTitle} ${error ? styles.inputError : ''}`}
                    />
                    {error && <span className={styles.error}>{error}</span>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="task-description" className={styles.label}>
                      Description <span className={styles.optional}>optional</span>
                    </label>
                    <textarea
                      id="task-description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Add more details..."
                      className={styles.textarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      {task ? 'Save Changes' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar - Only when editing */}
              {isEditing && (
                <div className={styles.sidebar}>
                  {/* Subtasks Accordion */}
                  <div className={styles.accordion}>
                    <button
                      type="button"
                      className={`${styles.accordionHeader} ${expandedSection === 'subtasks' ? styles.accordionOpen : ''}`}
                      onClick={() => toggleSection('subtasks')}
                    >
                      <div className={styles.accordionTitle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span>Subtasks</span>
                        {subtasks.length > 0 && (
                          <span className={styles.accordionBadge}>
                            {completedSubtasks}/{subtasks.length}
                          </span>
                        )}
                      </div>
                      <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.accordionChevron}
                        animate={{ rotate: expandedSection === 'subtasks' ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSection === 'subtasks' && (
                        <motion.div
                          className={styles.accordionContent}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <div className={styles.accordionInner}>
                            <Subtasks
                              subtasks={subtasks}
                              taskId={task.id}
                              onAddSubtask={onAddSubtask}
                              onUpdateSubtask={onUpdateSubtask}
                              onDeleteSubtask={onDeleteSubtask}
                              onToggleSubtask={onToggleSubtask}
                              onAddReport={onAddSubtaskReport}
                              onDeleteReport={onDeleteSubtaskReport}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Attachments Accordion */}
                  <div className={styles.accordion}>
                    <button
                      type="button"
                      className={`${styles.accordionHeader} ${expandedSection === 'attachments' ? styles.accordionOpen : ''}`}
                      onClick={() => toggleSection('attachments')}
                    >
                      <div className={styles.accordionTitle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Attachments</span>
                        {images.length > 0 && (
                          <span className={styles.accordionBadge}>{images.length}</span>
                        )}
                      </div>
                      <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.accordionChevron}
                        animate={{ rotate: expandedSection === 'attachments' ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSection === 'attachments' && (
                        <motion.div
                          className={styles.accordionContent}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <div className={styles.accordionInner}>
                            <ImageUpload taskId={task.id} onAddImage={onAddImage} />
                            <ImageGallery
                              images={images}
                              taskId={task.id}
                              onDeleteImage={onDeleteImage}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Reviews Accordion */}
                  <div className={styles.accordion}>
                    <button
                      type="button"
                      className={`${styles.accordionHeader} ${expandedSection === 'reviews' ? styles.accordionOpen : ''}`}
                      onClick={() => toggleSection('reviews')}
                    >
                      <div className={styles.accordionTitle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Reviews</span>
                        {reviews.length > 0 && (
                          <span className={styles.accordionBadge}>{reviews.length}</span>
                        )}
                      </div>
                      <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.accordionChevron}
                        animate={{ rotate: expandedSection === 'reviews' ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSection === 'reviews' && (
                        <motion.div
                          className={styles.accordionContent}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <div className={styles.accordionInner}>
                            <div className={styles.addReview}>
                              <input
                                type="text"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                onKeyDown={handleReviewKeyDown}
                                placeholder="Add a note..."
                                className={styles.reviewInput}
                              />
                              <button
                                type="button"
                                onClick={handleAddReview}
                                disabled={!reviewContent.trim()}
                                className={styles.addReviewButton}
                                aria-label="Add review"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                              </button>
                            </div>

                            {reviews.length === 0 ? (
                              <p className={styles.emptyState}>No reviews yet</p>
                            ) : (
                              <ul className={styles.reviewsList}>
                                {reviews.map((review, index) => (
                                  <motion.li
                                    key={review.id}
                                    className={styles.reviewItem}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                  >
                                    <div className={styles.reviewContent}>
                                      <p className={styles.reviewText}>{review.content}</p>
                                      <span className={styles.reviewDate}>
                                        {formatDate(review.createdAt)}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => onDeleteReview(task.id, review.id)}
                                      className={styles.deleteReviewButton}
                                      aria-label="Delete review"
                                    >
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </svg>
                                    </button>
                                  </motion.li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
