import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

export function Header({ isDark, onToggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className={styles.logoIcon}
          >
            <rect x="2" y="4" width="8" height="24" rx="2" fill="currentColor" opacity="0.9" />
            <rect x="12" y="8" width="8" height="16" rx="2" fill="currentColor" opacity="0.6" />
            <rect x="22" y="4" width="8" height="20" rx="2" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Kanban</h1>
          <span className={styles.subtitle}>Task Board</span>
        </div>
      </div>

      <div className={styles.actions}>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
