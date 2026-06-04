import styles from "./Drawer.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, children }: Props) {
  return (
    <aside className={`${styles.drawer} ${open ? styles.open : ""}`}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
      <div>{children}</div>
    </aside>
  );
}
