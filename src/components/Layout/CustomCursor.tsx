import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DOT = 8;
const RING = 38;

const CustomCursor: React.FC = () => {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const sx = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 180, damping: 20, mass: 0.4 });

  const dotLeft = useTransform(mx, v => v - DOT / 2);
  const dotTop  = useTransform(my, v => v - DOT / 2);
  const ringLeft = useTransform(sx, v => v - RING / 2);
  const ringTop  = useTransform(sy, v => v - RING / 2);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  return (
    <>
      {/* Outer ring — spring lag */}
      <motion.div
        style={{
          position: 'fixed',
          left: ringLeft,
          top: ringTop,
          width: RING,
          height: RING,
          borderRadius: '50%',
          border: '1.5px solid white',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      {/* Inner dot — exact position */}
      <motion.div
        style={{
          position: 'fixed',
          left: dotLeft,
          top: dotTop,
          width: DOT,
          height: DOT,
          borderRadius: '50%',
          backgroundColor: 'white',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default CustomCursor;
