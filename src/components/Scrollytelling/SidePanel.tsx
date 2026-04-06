import React from 'react';
import { motion } from 'framer-motion';

interface SidePanelProps {
  side: 'left' | 'right';
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ side, title, icon, children }) => {
  const isLeft = side === 'left';

  return (
    <motion.div
      style={{
        ...styles.panel,
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
        alignItems: isLeft ? 'flex-start' : 'flex-end',
      }}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -30 : 30 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <div style={{
        ...styles.header,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        flexDirection: isLeft ? 'row' : 'row',
      }}>
        {!isLeft && <span style={{ ...styles.title, textAlign: 'right' }}>{title}</span>}
        {icon}
        {isLeft && <span style={styles.title}>{title}</span>}
      </div>
      <div style={{
        ...styles.body,
        alignItems: isLeft ? 'flex-start' : 'flex-end',
      }}>
        {children}
      </div>
    </motion.div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    top: 0,
    width: '440px',
    height: '100%',
    background: 'rgba(34, 37, 41, 0.3)',
    backdropFilter: 'blur(40px) saturate(140%)',
    WebkitBackdropFilter: 'blur(40px) saturate(140%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '48px 40px',
    zIndex: 10,
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '40px',
  },
  title: {
    fontFamily: "'Canela Deck', Georgia, serif",
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--neutral-50)',
    letterSpacing: '-1.2px',
    lineHeight: 1.1,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
    overflow: 'auto',
  },
};

export const PanelText: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'right';
}> = ({ children, align = 'left' }) => (
  <p style={{
    fontFamily: "'Graphik LCG', var(--font-display), sans-serif",
    fontSize: '16px',
    lineHeight: '1.5',
    color: 'var(--neutral-100)',
    opacity: 0.85,
    fontWeight: 400,
    margin: 0,
    letterSpacing: '-0.4px',
    textAlign: align,
  }}>
    {children}
  </p>
);

export const PanelStrong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    fontWeight: 600,
    opacity: 1,
    color: 'var(--neutral-50)',
  }}>
    {children}
  </span>
);

export default SidePanel;
