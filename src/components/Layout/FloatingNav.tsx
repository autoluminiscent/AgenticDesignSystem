import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Eye } from 'lucide-react';
import figmaDark2 from '../../assets/figma-dark2.svg';
import reactDark2 from '../../assets/react-dark2.svg';

interface FloatingNavProps {
  onGoToStep?: (step: number) => void;
  currentStep?: number;
}

const ITEMS = [
  { step: 1, label: 'Vue d\'ensemble', icon: null, lucideIcon: Eye },
  { step: 2, label: 'Figma Design System', icon: figmaDark2, lucideIcon: null },
  { step: 3, label: 'Fichiers de Design', icon: figmaDark2, lucideIcon: null },
  { step: 4, label: 'Librairie React', icon: reactDark2, lucideIcon: null },
  { step: 5, label: 'Application finale', icon: reactDark2, lucideIcon: null },
];

const FloatingNav: React.FC<FloatingNavProps> = ({ onGoToStep, currentStep = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (step: number) => {
    onGoToStep?.(step);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={styles.menuItems}
          >
            {ITEMS.map(({ step, label, icon, lucideIcon: LucideIcon }) => (
              <motion.button
                key={step}
                style={{
                  ...styles.navItem,
                  backgroundColor: currentStep === step ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onClick={() => handleItemClick(step)}
              >
                <div style={styles.iconWrapper}>
                  {LucideIcon
                    ? <LucideIcon size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                    : <img src={icon!} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain', filter: 'brightness(0.7)' }} />
                  }
                </div>
                <span style={{
                  ...styles.label,
                  opacity: currentStep === step ? 1 : 0.7,
                }}>{label}</span>
                {currentStep === step && (
                  <div style={styles.activeDot} />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        style={{
          ...styles.fab,
          backgroundColor: isOpen ? '#c2410c' : '#EA580C',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X color="rgba(255,255,255,0.85)" size={22} /> : <Menu color="rgba(255,255,255,0.85)" size={22} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '16px',
    zIndex: 1000,
  },
  fab: {
    width: '52px',
    height: '52px',
    borderRadius: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    cursor: 'pointer',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    backgroundColor: 'rgba(40, 44, 50, 0.9)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    padding: '10px',
    borderRadius: '20px',
    boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px 10px 10px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '10px',
  },
  label: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontWeight: 500,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '-0.3px',
    whiteSpace: 'nowrap',
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginLeft: 'auto',
  },
};

export default FloatingNav;
