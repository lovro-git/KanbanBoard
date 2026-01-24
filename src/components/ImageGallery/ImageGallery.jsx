import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageGallery.module.css';

export function ImageGallery({ images = [], taskId, onDeleteImage }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleDelete = (e, imageId) => {
    e.stopPropagation();
    onDeleteImage(taskId, imageId);
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.gallery}>
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.id}
              className={styles.item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.data}
                alt={image.name}
                className={styles.image}
              />
              <button
                type="button"
                onClick={(e) => handleDelete(e, image.id)}
                className={styles.deleteButton}
                aria-label={`Delete ${image.name}`}
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
              <span className={styles.name}>{image.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            className={styles.previewBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePreview}
          >
            <motion.div
              className={styles.previewContent}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage.data}
                alt={previewImage.name}
                className={styles.previewImage}
              />
              <div className={styles.previewInfo}>
                <span className={styles.previewName}>{previewImage.name}</span>
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className={styles.closeButton}
                  aria-label="Close preview"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
