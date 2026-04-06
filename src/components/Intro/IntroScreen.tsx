import React from 'react';
import { motion } from 'framer-motion';
import figmaDark from '../../assets/figma-dark.svg';
import reactDark from '../../assets/react-dark.svg';

const sentence1 = "La mise en place d'un";
const sentence2 = "Design System";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 50, rotate: 2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

const IntroScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.gridOverlay} />
      <div style={styles.grid}>
        
        {/* Colonne de gauche : Textes & Scrollytelling */}
        <motion.div 
          style={styles.leftCol}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={styles.surtitle}
          >
            Exploration
          </motion.div>

          <motion.h1 
            style={styles.title}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Ligne 1 */}
            <div>
              {sentence1.split(" ").map((word, index) => (
                <span key={`w1-${index}`} style={{ display: 'inline-block', paddingBottom: '6px' }}>
                  <motion.span variants={wordVariants} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {word}&nbsp;
                  </motion.span>
                </span>
              ))}
            </div>
            
            {/* Ligne 2 */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', alignItems: 'baseline' }}>
              {sentence2.split(" ").map((word, index) => (
                <span key={`w2-${index}`} style={{ display: 'inline-block', paddingBottom: '6px' }}>
                  <motion.span variants={wordVariants} style={{ display: 'inline-block' }}>
                    {word}
                  </motion.span>
                </span>
              ))}
              <span style={{ display: 'inline-block', paddingBottom: '12px' }}>
                <motion.span 
                  variants={wordVariants}
                  style={{ ...styles.highlightItalic, display: 'inline-block' }}
                >
                  Agentique
                </motion.span>
              </span>
            </div>
          </motion.h1>

          <motion.p 
            style={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Il se composerait de 4 blocs distincts: Le Design System, le fichier de Design,
            la librairie de composants et le projet final.
          </motion.p>

          <motion.div 
            style={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div style={styles.mouseOutline}>
              <motion.div 
                style={styles.mouseDot} 
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            <span style={styles.scrollText}>Scrollez pour commencer</span>
          </motion.div>
        </motion.div>

        {/* Colonne de droite : Les 4 blocs */}
        <motion.div 
          style={styles.rightCol}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
        >
          <div style={styles.blocksGrid}>
            
            {/* Bloc 1 — Design System : grand coin extérieur haut-droite */}
            <motion.div 
              style={{ ...styles.block, borderRadius: '0 86px 0 0' }}
            >
              <img src={figmaDark} alt="Figma" style={styles.blockIcon} />
              <span style={styles.blockTitle}>Design System</span>
            </motion.div>

            {/* Bloc 2 — Fichier de Design : base complètement arrondie */}
            <motion.div 
              style={{ ...styles.block, borderRadius: '0 0 111px 111px' }}
            >
              <img src={figmaDark} alt="Figma" style={styles.blockIcon} />
              <span style={styles.blockTitle}>Fichier de Design</span>
            </motion.div>

            {/* Bloc 3 — Composants : haut complètement arrondi */}
            <motion.div 
              style={{ ...styles.block, borderRadius: '111px 111px 0 0' }}
            >
              <img src={reactDark} alt="React" style={styles.blockIcon} />
              <span style={styles.blockTitle}>Composants</span>
            </motion.div>

            {/* Bloc 4 — Projet final : grand coin extérieur bas-gauche */}
            <motion.div 
              style={{ ...styles.block, borderRadius: '0 0 0 86px' }}
            >
              <img src={reactDark} alt="React" style={styles.blockIcon} />
              <span style={styles.blockTitle}>Projet final</span>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    boxSizing: 'border-box',
    background: 'radial-gradient(ellipse at 67% 75%, var(--neutral-200) 0%, var(--neutral-400) 100%)',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: [
      'linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)',
    ].join(', '),
    backgroundSize: '56px 56px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '6rem',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px', // géré individuellement via marginTop
  },
  rightCol: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  surtitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--neutral-50)',
    fontSize: '24px',
    fontWeight: 500,
    letterSpacing: '-1.2px',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '50px',
    lineHeight: '60px',
    fontWeight: 500,
    color: 'var(--neutral-800)',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    letterSpacing: '-2.5px',
    marginBottom: '32px',
  },
  highlightItalic: {
    fontFamily: 'var(--font-serif)',
    color: 'var(--orange-600)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '50px',
    lineHeight: '60px',
    letterSpacing: '-2.5px',
  },
  description: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 400,
    letterSpacing: '-1.2px',
    color: 'var(--neutral-800)',
    maxWidth: '688px',
    marginBottom: '0px',
  },
  scrollIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '26px',
    marginTop: '64px',
    color: 'var(--neutral-800)',
  },
  mouseOutline: {
    width: '36px',
    height: '51px',
    borderRadius: '18px',
    border: '2px solid var(--c-agent)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  mouseDot: {
    width: '4px',
    height: '8px',
    backgroundColor: 'var(--c-agent)',
    borderRadius: '2px',
  },
  scrollText: {
    fontSize: '20px',
    fontWeight: 400,
    color: 'var(--neutral-800)',
    letterSpacing: '-1.2px',
  },
  blocksGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0px',
    width: '100%',
    maxWidth: '555px',
    overflow: 'visible',
  },
  block: {
    backgroundColor: 'var(--neutral-100)',
    width: '277px',
    height: '278px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    position: 'relative',
  },
  blockIcon: {
    width: 'auto',
    height: '48px',
    objectFit: 'contain',
  },
  blockTitle: {
    fontSize: '24px',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'normal',
    fontWeight: 300,
    color: 'var(--neutral-800)',
    lineHeight: 1.2,
    textAlign: 'center',
    letterSpacing: '-1.2px',
    marginTop: '12px',
  }
};

export default IntroScreen;
