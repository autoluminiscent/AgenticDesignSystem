import { useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';
import { LayoutGrid, Cable, BookOpen } from 'lucide-react';
import claudeDark from '../../assets/claude-dark.svg';
import claudeColored from '../../assets/claude-colored.svg';
import mcpIcon from '../../assets/mcp.svg';
import reactDark2 from '../../assets/react-dark2.svg';
import reactColored from '../../assets/react-colored.svg';

type HoverTarget = null | 'mother' | 'claudeCode' | 'composants' | 'stories' | 'designTokens' | 'designSystemMd' | 'codeConnect' | 'mcp';

const CARD_W = 820;
const MCP_H = 46;
const MCP_W = 220;
const D = 24;

const ReactDSNode: React.FC = () => {
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

  const isMotherHighlighted = hover === 'mother' || hover === 'mcp';
  const isMcpHighlighted = hover === 'mother' || hover === 'mcp';
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
      initial={{ opacity: 0, x: 80 }}
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
          right: D, bottom: 0,
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
          right: D / 2, bottom: D / 2,
          borderRadius: '22px', zIndex: 1,
          backgroundColor: hl('--neutral-300', '--blue-300', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />

      {/* ── Card area wrapper — relative, determines height for MCP centering ── */}
      <div style={{ position: 'relative' }}>

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
          <span style={s.headerTitle}>Librairie de composants React</span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: hl('--neutral-300', '--blue-300', isMotherHighlighted),
          margin: '0 -32px 18px -32px',
          transition: 'background-color 0.4s ease',
        }} />

        {/* Content grid — 3 columns */}
        <div style={s.contentGrid}>

          {/* Claude Code — tall left column */}
          <div
            style={{
              ...s.tallCard,
              backgroundColor: hl('--neutral-300', '--blue-300', isChild('claudeCode')),
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('claudeCode'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <img
              src={isChild('claudeCode') ? claudeColored : claudeDark}
              alt="Claude"
              style={{ width: '28px', height: '28px', objectFit: 'contain', transition: 'all 0.3s ease', marginBottom: '8px' }}
            />
            <h3 style={s.cardTitle}>Claude Code</h3>
            <ul style={s.bulletList}>
              <li>Développe les composants</li>
              <li>Génère les tokens</li>
              <li>Rédige les tests</li>
              <li>Rédige les stories</li>
            </ul>
          </div>

          {/* Middle column: Composants + Stories */}
          <div style={s.colStack}>
            <div
              style={{
                ...s.smallCard,
                backgroundColor: hl('--neutral-50', '--blue-50', isChild('composants')),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHover('composants'); }}
              onMouseLeave={() => setHover('mother')}
            >
              <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--blue-200', isChild('composants')), transition: 'background-color 0.3s ease' }}>
                <LayoutGrid size={24} color="var(--neutral-800)" />
              </div>
              <h4 style={s.cardTitle}>Composants</h4>
              <p style={s.cardText}>Composants React et tests</p>
            </div>
            <div
              style={{
                ...s.smallCard,
                backgroundColor: hl('--neutral-50', '--blue-50', isChild('stories')),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHover('stories'); }}
              onMouseLeave={() => setHover('mother')}
            >
              <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--blue-200', isChild('stories')), transition: 'background-color 0.3s ease' }}>
                <BookOpen size={24} color="var(--neutral-800)" />
              </div>
              <h4 style={s.cardTitle}>Stories</h4>
              <p style={s.cardText}>Hébergées via Storybook</p>
            </div>
          </div>

          {/* Right column: Design Tokens + Design-System.md */}
          <div style={s.colStack}>
            <div
              style={{
                ...s.smallCard,
                backgroundColor: hl('--neutral-50', '--blue-50', isChild('designTokens')),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHover('designTokens'); }}
              onMouseLeave={() => setHover('mother')}
            >
              <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--blue-200', isChild('designTokens')), transition: 'background-color 0.3s ease' }}>
                <LayoutGrid size={24} color="var(--neutral-800)" />
              </div>
              <h4 style={s.cardTitle}>Design Tokens</h4>
              <p style={s.cardText}>Tokens CSS générés par Claude</p>
            </div>
            <div
              style={{
                ...s.smallCard,
                backgroundColor: hl('--neutral-50', '--blue-50', isChild('designSystemMd')),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHover('designSystemMd'); }}
              onMouseLeave={() => setHover('mother')}
            >
              <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--blue-200', isChild('designSystemMd')), transition: 'background-color 0.3s ease' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4z" stroke="var(--neutral-800)" strokeWidth="1.5" /><path d="M8 8h8M8 12h5" stroke="var(--neutral-800)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h4 style={s.cardTitle}>Design-System.md</h4>
              <p style={s.cardText}>Pour les agents consommateurs</p>
            </div>
          </div>
        </div>

        {/* Code Connect */}
        <div
          style={{
            ...s.codeConnect,
            borderColor: hl('--neutral-500', '--blue-500', isChild('codeConnect')),
            backgroundColor: isChild('codeConnect') ? 'var(--blue-50)' : 'transparent',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.stopPropagation(); setHover('codeConnect'); }}
          onMouseLeave={() => setHover('mother')}
        >
          <div style={{ ...s.iconBox, borderRadius: '20px', width: '38px', height: '38px', marginBottom: 0, backgroundColor: hl('--neutral-400', '--blue-400', isChild('codeConnect')), transition: 'background-color 0.3s ease' }}>
            <Cable size={22} color="var(--neutral-800)" />
          </div>
          <div>
            <h4 style={{ ...s.cardTitle, marginBottom: '1px', fontSize: '14px' }}>Code Connect</h4>
            <p style={{ ...s.cardText, margin: 0, fontSize: '11px' }}>Mapping entre les composants Figma et les composants React</p>
          </div>
        </div>
      </div>

        {/* ── Storybook MCP — absolute, vertical, right side ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            position: 'absolute',
            top: '55%',
            bottom: '5%',
            left: `${D + CARD_W}px`,
            width: `${MCP_H}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: `${MCP_W}px`,
              height: `${MCP_H}px`,
              transform: 'rotate(270deg)',
              flexShrink: 0,
              cursor: 'inherit',
            }}
            onMouseEnter={() => setHover('mcp')}
            onMouseLeave={() => setHover(null)}
          >
            <div style={{
              ...s.mcpTag,
              backgroundColor: hl('--neutral-600', '--blue-600', isMcpHighlighted),
              transition: 'background-color 0.4s ease',
            }}>
              <img src={mcpIcon} alt="MCP"
                style={{
                  width: '20px', height: '20px',
                  filter: isMcpHighlighted ? 'brightness(1.6) sepia(1) saturate(6) hue-rotate(-5deg)' : 'brightness(0.9)',
                  transition: 'filter 0.3s ease',
                }}
              />
              <span>STORYBOOK MCP</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Depth spacer ── */}
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
  contentGrid: { display: 'flex', gap: '12px', minHeight: 0 },
  tallCard: {
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column',
    width: '215px', flexShrink: 0, cursor: 'inherit',
  },
  colStack: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  smallCard: {
    borderRadius: '14px', padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: '2px',
    flex: 1, cursor: 'inherit',
  },
  iconBox: {
    width: '38px', height: '38px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '8px',
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
  codeConnect: {
    marginTop: '12px', borderRadius: '14px',
    border: '1px dashed var(--neutral-500)',
    padding: '13px 18px',
    display: 'flex', alignItems: 'center', gap: '14px',
    cursor: 'inherit', flexShrink: 0,
  },
  mcpTag: {
    borderRadius: '0 0 20px 20px',
    height: `${MCP_H}px`, width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', color: 'var(--neutral-100)',
    fontFamily: "'Graphik LCG', sans-serif",
    fontSize: '12px', fontWeight: 500, letterSpacing: '4px',
  },
};

export default ReactDSNode;
