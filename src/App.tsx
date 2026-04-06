import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { initRouting } from './store/useAppStore';
import './index.css';
import IntroScreen from './components/Intro/IntroScreen';
import SpatialScrolly from './components/Scrollytelling/SpatialScrolly';
import FloatingNav from './components/Layout/FloatingNav';
import CustomCursor from './components/Layout/CustomCursor';

function App() {
  const [step, setStep] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1280);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const isTransitioning = useRef(false);

  useEffect(() => {
    initRouting();
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Don't navigate steps when user is zooming (Cmd/Ctrl + scroll)
      if (e.metaKey || e.ctrlKey) return;
      if (isTransitioning.current) return;

      if (e.deltaY > 5 && step < 6) {
        isTransitioning.current = true;
        setStep(s => s + 1);
        setTimeout(() => { isTransitioning.current = false; }, 800);
      } else if (e.deltaY < -5 && step > 0) {
        isTransitioning.current = true;
        setStep(s => s - 1);
        setTimeout(() => { isTransitioning.current = false; }, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [step]);

  if (isSmallScreen) {
    return (
      <div style={styles.smallScreen}>
        <div style={styles.smallScreenCard}>
          <div style={styles.smallScreenIcon}>🖥️</div>
          <h1 style={styles.smallScreenTitle}>Conçu pour grand écran</h1>
          <p style={styles.smallScreenText}>
            Ce site est une expérience interactive conçue pour être explorée sur un ordinateur.
            Ouvre-le depuis un écran d'au moins 1280px de large.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <CustomCursor />
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 1 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            transition={{ duration: 0.6 }}
            style={styles.screenWrapper}
          >
            <IntroScreen />
          </motion.div>
        )}
        
        {step > 0 && (
          <motion.div
            key="spatial-scrolly"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            style={styles.screenWrapper}
          >
            <SpatialScrolly step={Math.min(step, 5)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* OUTRO OVERLAY — step 6 */}
      <AnimatePresence>
        {step === 6 && (
          <motion.div
            key="outro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={styles.outroOverlay}
          >
            {/* Radial vignette to make it feel like fading from the canvas */}
            <div style={styles.outroNoise} />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              style={styles.outroContent}
            >
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={styles.outroPill}
              >
                <span style={styles.outroPillDot} />
                <span style={styles.outroPillText}>En cours de construction</span>
              </motion.div>
              <h2 style={styles.outroTitle}>
                Plus de workflows et<br />de détails à venir.
              </h2>
              <p style={styles.outroSub}>
                Scrollez vers le haut pour revenir au diagramme.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step > 0 && step < 6 && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={styles.scrollHint}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              style={styles.scrollHintInner}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v12M9 15l-4-4M9 15l4-4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <span style={styles.scrollHintLabel}>Scroll</span>
          </motion.div>
        )}
      </AnimatePresence>

      {step > 0 && step < 6 && (
        <FloatingNav
          currentStep={step}
          onGoToStep={(s) => {
            if (!isTransitioning.current) {
              isTransitioning.current = true;
              setStep(s);
              setTimeout(() => { isTransitioning.current = false; }, 800);
            }
          }}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  screenWrapper: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallScreen: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f13 0%, #1a1a24 100%)',
    padding: '24px',
    boxSizing: 'border-box',
  },
  smallScreenCard: {
    textAlign: 'center',
    maxWidth: '360px',
  },
  smallScreenIcon: {
    fontSize: '52px',
    marginBottom: '24px',
    lineHeight: 1,
  },
  smallScreenTitle: {
    fontFamily: "'Canela Deck', Georgia, serif",
    fontSize: '26px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.92)',
    margin: '0 0 16px',
    lineHeight: 1.2,
  },
  scrollHint: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    zIndex: 50,
    pointerEvents: 'none',
  },
  scrollHintInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollHintLabel: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
  },
  outroOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'radial-gradient(ellipse at 50% 60%, #0d0d10 0%, #000000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outroNoise: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    opacity: 0.04,
    pointerEvents: 'none' as const,
  },
  outroContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '28px',
    textAlign: 'center' as const,
    padding: '40px',
  },
  outroPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '100px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
  },
  outroPillDot: {
    display: 'block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#EA580C',
  },
  outroPillText: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.45)',
  },
  outroTitle: {
    fontFamily: "'Canela Deck', Georgia, serif",
    fontSize: '52px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    lineHeight: 1.15,
    letterSpacing: '-2px',
  },
  outroSub: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '14px',
    color: 'rgba(255,255,255,0.25)',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  smallScreenText: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '15px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
};

export default App;
