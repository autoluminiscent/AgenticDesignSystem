import { useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';
import claudeDark from '../../assets/claude-dark.svg';
import claudeColored from '../../assets/claude-colored.svg';
import reactDark2 from '../../assets/react-dark2.svg';
import reactColored from '../../assets/react-colored.svg';

type HoverTarget = null | 'mother' | 'packageLib' | 'claudeCode' | 'claudeMd';

const CARD_W = 490;
const D = 24;

const AppFinaleNode: React.FC = () => {
  const [hover, setHover] = useState<HoverTarget>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 28 });
  const ry = useSpring(0, { stiffness: 180, damping: 28 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    ry.set(x * 1.2);
    rx.set(-y * 1.2);
  }, [rx, ry]);

  const handleMouseLeaveWrapper = useCallback(() => {
    rx.set(0); ry.set(0); setHover(null);
  }, [rx, ry]);

  const isMotherHighlighted = hover === 'mother';
  const isChild = (n: HoverTarget) => hover === n || hover === 'mother';
  const hl = (n: string, o: string, on: boolean) => on ? `var(${o})` : `var(${n})`;

  return (
    <motion.div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: `${CARD_W + D}px`,
        transform,
        willChange: 'transform',
      }}
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      // @ts-ignore
      transition={{ type: 'spring', damping: 28, stiffness: 70, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveWrapper}
    >
      {/* ── Depth cards (LEFT offset) — stretch via top/bottom ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          position: 'absolute', top: D, left: 0,
          right: D,
          bottom: 0,
          borderRadius: '28px', zIndex: 0,
          backgroundColor: hl('--neutral-400', '--blue-400', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute', top: D / 2, left: D / 2,
          right: D / 2,
          bottom: D / 2,
          borderRadius: '22px', zIndex: 1,
          backgroundColor: hl('--neutral-300', '--blue-300', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />

      {/* ── Main card (bg1) — RELATIVE, content-based height ── */}
      <div
        style={{
          position: 'relative',
          marginLeft: D,
          width: `${CARD_W}px`,
          borderRadius: '16px', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          padding: '28px 32px', boxSizing: 'border-box',
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          cursor: 'inherit',
          backgroundColor: hl('--neutral-100', '--blue-100', isMotherHighlighted),
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={() => setHover('mother')}
      >
        {/* Header */}
        <div style={s.header}>
          <img
            src={isMotherHighlighted ? reactColored : reactDark2}
            alt="React"
            style={{ height: '32px', width: 'auto', transition: 'all 0.3s ease' }}
          />
          <span style={s.headerTitle}>Application finale</span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: hl('--neutral-300', '--blue-300', isMotherHighlighted),
          margin: '0 -32px 18px -32px',
          transition: 'background-color 0.4s ease',
        }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Package de la librairie */}
          <div
            style={{
              ...s.dashedCard,
              borderColor: hl('--neutral-500', '--blue-500', isChild('packageLib')),
              backgroundColor: isChild('packageLib') ? 'var(--blue-50)' : 'transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('packageLib'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <img
              src={isChild('packageLib') ? reactColored : reactDark2}
              alt="Package"
              style={{ width: '28px', height: '28px', objectFit: 'contain', transition: 'all 0.3s ease', marginBottom: '4px' }}
            />
            <h4 style={s.cardTitle}>Package de la librairie</h4>
            <ul style={s.bulletList}>
              <li>Composants</li>
              <li>Design Tokens</li>
              <li>Design-System.md</li>
            </ul>
          </div>

          {/* Claude Code */}
          <div
            style={{
              ...s.blockCard,
              backgroundColor: hl('--neutral-300', '--blue-300', isChild('claudeCode')),
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('claudeCode'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <img
              src={isChild('claudeCode') ? claudeColored : claudeDark}
              alt="Claude"
              style={{ width: '28px', height: '28px', objectFit: 'contain', transition: 'all 0.3s ease', marginBottom: '4px' }}
            />
            <h4 style={s.cardTitle}>Claude Code</h4>
            <p style={s.cardText}>Implémente les features depuis les maquettes.</p>
          </div>

          {/* Claude.md */}
          <div
            style={{
              ...s.blockCard,
              backgroundColor: hl('--neutral-50', '--blue-50', isChild('claudeMd')),
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('claudeMd'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <img
              src={isChild('claudeMd') ? claudeColored : claudeDark}
              alt="Claude"
              style={{ width: '28px', height: '28px', objectFit: 'contain', transition: 'all 0.3s ease', marginBottom: '4px' }}
            />
            <h4 style={s.cardTitle}>Claude.md</h4>
            <p style={s.cardText}>Référence le fichier Design-System.md</p>
          </div>
        </div>
      </div>

      {/* ── Depth spacer (no MCP tag for this card) ── */}
      <div style={{ height: `${D}px` }} />
    </motion.div>
  );
};

const s: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' },
  headerTitle: {
    fontFamily: "'Canela Deck', Georgia, serif",
    fontSize: '24px', fontWeight: 500,
    color: 'var(--neutral-800)', letterSpacing: '-1.2px', lineHeight: 1,
  },
  dashedCard: {
    borderRadius: '14px', padding: '16px',
    border: '1px dashed var(--neutral-500)',
    display: 'flex', flexDirection: 'column', gap: '4px',
    cursor: 'inherit',
  },
  blockCard: {
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '4px',
    cursor: 'inherit',
  },
  cardTitle: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '15px', fontWeight: 600,
    color: 'var(--neutral-800)', margin: '0 0 3px 0',
    letterSpacing: '-0.7px', lineHeight: 1.2,
  },
  cardText: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '11px', lineHeight: '1.4',
    color: 'var(--neutral-600)', margin: 0, letterSpacing: '-0.2px',
  },
  bulletList: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '11px', lineHeight: '1.6',
    color: 'var(--neutral-600)', margin: 0, letterSpacing: '-0.2px',
    paddingLeft: '16px', listStyle: 'disc',
  },
};

export default AppFinaleNode;
