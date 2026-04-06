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

      if (e.deltaY > 5 && step < 5) {
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
            Ouvre-le depuis un écran d'au moins 1000px de large.
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
            <SpatialScrolly step={step} />
          </motion.div>
        )}
      </AnimatePresence>

      {step > 0 && (
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
  smallScreenText: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '15px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
};

export default App;
