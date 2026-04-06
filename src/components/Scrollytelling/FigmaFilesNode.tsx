import { useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';
import figmaDark2 from '../../assets/figma-dark2.svg';
import figmaColored from '../../assets/figma-colored.svg';
import mcpIcon from '../../assets/mcp.svg';
import openaiDark from '../../assets/openai-dark.svg';
import openaiColored from '../../assets/openai-colored.svg';
import geminiDark from '../../assets/gemini-dark.svg';
import geminiColored from '../../assets/gemini-colored.svg';
import claudeDark from '../../assets/claude-dark.svg';
import claudeColored from '../../assets/claude-colored.svg';
import reactDark from '../../assets/react-dark2.svg';
import reactColored from '../../assets/react-colored.svg';

type HoverTarget = null | 'mother' | 'figmaMake' | 'fichierDesign' | 'mcp';

const CARD_W = 820;
const MCP_H = 46;
const MCP_W = 420;
const D = 24;

const ArrowRight = ({ color = 'var(--neutral-500)' }) => (
  <svg width="52" height="10" viewBox="0 0 52 10" fill="none" style={{ flexShrink: 0 }}>
    <path d="M0 5H50M50 5L44 1M50 5L44 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowLeft = ({ color = 'var(--neutral-500)' }) => (
  <svg width="52" height="10" viewBox="0 0 52 10" fill="none" style={{ flexShrink: 0 }}>
    <path d="M52 5H2M2 5L8 1M2 5L8 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FigmaFilesNode: React.FC = () => {
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
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      // @ts-ignore
      transition={{ type: 'spring', damping: 28, stiffness: 70, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveWrapper}
    >
      {/* ── Depth cards (LEFT offset) — same as other cards ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          position: 'absolute', top: D, left: 0,
          right: D,
          bottom: MCP_H,
          borderRadius: '28px', zIndex: 0,
          backgroundColor: hl('--neutral-400', '--orange-400', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute', top: D / 2, left: D / 2,
          right: D / 2,
          bottom: MCP_H + D / 2,
          borderRadius: '22px', zIndex: 1,
          backgroundColor: hl('--neutral-300', '--orange-300', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />

      {/* ── Main card (bg1) — RELATIVE, determines height ── */}
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
          backgroundColor: hl('--neutral-100', '--orange-100', isMotherHighlighted),
          transition: 'background-color 0.3s ease',
          overflow: 'visible',
        }}
        onMouseEnter={() => setHover('mother')}
      >
        {/* Header */}
        <div style={s.header}>
          <img
            src={isMotherHighlighted ? figmaColored : figmaDark2}
            alt="Figma"
            style={{ height: '32px', width: 'auto', transition: 'all 0.3s ease' }}
          />
          <span style={s.headerTitle}>Fichiers de Design Figma</span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: hl('--neutral-300', '--orange-300', isMotherHighlighted),
          margin: '0 -32px 18px -32px',
          transition: 'background-color 0.4s ease',
        }} />

        {/* ── Content blocks ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ── FIGMA MAKE block ── */}
          <div
            style={{
              ...s.blockCard,
              backgroundColor: hl('--neutral-200', '--orange-200', isChild('figmaMake')),
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('figmaMake'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', padding: '0 4px' }}>
              <div style={{
                ...s.iconBox,
                backgroundColor: hl('--neutral-300', '--orange-300', isChild('figmaMake')),
                transition: 'background-color 0.3s ease',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke="var(--neutral-700)" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div style={s.cardTitle}>Figma Make</div>
                <div style={s.cardText}>Prototypage IA rapide</div>
              </div>
            </div>

            {/* Row: Modèle IA → Prototype interactif */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
              <div style={{
                ...s.innerCard,
                backgroundColor: hl('--neutral-100', '--orange-100', isChild('figmaMake')),
                transition: 'background-color 0.3s ease',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={s.innerTitle}>Modèle IA</div>
                  <div style={s.innerSubtitle}>Claude, Gemini, GPT</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  {[
                    { d: openaiDark, c: openaiColored, a: 'OpenAI' },
                    { d: geminiDark, c: geminiColored, a: 'Gemini' },
                    { d: claudeDark, c: claudeColored, a: 'Claude' },
                  ].map(({ d, c, a }) => (
                    <img key={a} src={isChild('figmaMake') ? c : d} alt={a}
                      style={{ width: '20px', height: '20px', objectFit: 'contain', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px' }}>
                <ArrowRight color={isChild('figmaMake') ? 'var(--orange-500)' : 'var(--neutral-500)'} />
              </div>

              <div style={{
                ...s.innerCard,
                backgroundColor: hl('--neutral-100', '--orange-100', isChild('figmaMake')),
                transition: 'background-color 0.3s ease',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={s.innerTitle}>Prototype interactif</div>
                  <div style={s.innerSubtitle}>Code généré en React</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <img src={isChild('figmaMake') ? reactColored : reactDark} alt="React"
                    style={{ width: '20px', height: '20px', objectFit: 'contain', transition: 'all 0.3s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Vertical arrow ── */}
          <div style={{ position: 'relative', height: 0, overflow: 'visible', marginTop: '-8px', marginBottom: '-8px' }}>
            <svg width="12" height="44" viewBox="0 0 12 44" fill="none"
              style={{ position: 'absolute', right: 'calc(25% - 6px)', top: '-14px' }}>
              <path d="M6 0V40M6 40L2 34M6 40L10 34"
                stroke="var(--neutral-500)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* ── FICHIER DE DESIGN block ── */}
          <div
            style={{
              ...s.blockCard,
              backgroundColor: hl('--neutral-50', '--orange-50', isChild('fichierDesign')),
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('fichierDesign'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', padding: '0 4px' }}>
              <div style={{
                ...s.iconBox,
                backgroundColor: hl('--neutral-200', '--orange-200', isChild('fichierDesign')),
                transition: 'background-color 0.3s ease',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="var(--neutral-700)" strokeWidth="1.5" strokeLinejoin="round" /><path d="M14 2v6h6M8 13h8M8 17h5" stroke="var(--neutral-700)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <div>
                <div style={s.cardTitle}>Fichier de Design</div>
                <div style={s.cardText}>Une page par fonctionnalité</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
              <div style={{
                ...s.innerCard,
                backgroundColor: hl('--neutral-300', '--orange-300', isChild('fichierDesign')),
                transition: 'background-color 0.3s ease',
                justifyContent: 'center', textAlign: 'center', alignItems: 'flex-start',
              }}>
                <div style={{ width: '100%' }}>
                  <div style={{ ...s.innerTitle, textAlign: 'center' }}>Maquettes finales</div>
                  <div style={{ ...s.innerSubtitle, textAlign: 'center' }}>Qui implémente les composants du DS</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px' }}>
                <ArrowLeft color={isChild('fichierDesign') ? 'var(--orange-500)' : 'var(--neutral-500)'} />
              </div>

              <div style={{
                flex: 1, padding: '14px 16px', borderRadius: '14px',
                border: `1px dashed ${isChild('fichierDesign') ? 'var(--orange-500)' : 'var(--neutral-500)'}`,
                transition: 'border-color 0.3s ease',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'flex-start', textAlign: 'center',
              }}>
                <div style={{ width: '100%' }}>
                  <div style={{ ...s.innerTitle, textAlign: 'center' }}>Design temporaire</div>
                  <div style={{ ...s.innerSubtitle, textAlign: 'center' }}>Qui n'utilise pas les composants Figma</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Depth spacer ── */}
      <div style={{ height: `${D}px` }} />

      {/* ── MCP Server tag ── */}
      <motion.div
        style={{
          position: 'relative',
          width: `${MCP_W}px`,
          marginLeft: `${D + (CARD_W - MCP_W) / 2}px`,
          zIndex: 10,
          cursor: 'inherit',
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 120 }}
        onMouseEnter={() => setHover('mcp')}
        onMouseLeave={() => setHover(null)}
      >
        <div style={{
          ...s.mcpTag,
          backgroundColor: hl('--neutral-600', '--orange-600', isMcpHighlighted),
          transition: 'background-color 0.4s ease',
        }}>
          <img src={mcpIcon} alt="MCP"
            style={{
              width: '20px', height: '20px',
              filter: isMcpHighlighted ? 'brightness(1.6) sepia(1) saturate(6) hue-rotate(-5deg)' : 'brightness(0.9)',
              transition: 'filter 0.3s ease',
            }}
          />
          <span>FIGMA MCP SERVER</span>
        </div>
      </motion.div>
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
  iconBox: {
    width: '38px', height: '38px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  blockCard: {
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column',
    cursor: 'inherit',
  },
  cardTitle: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '15px', fontWeight: 600,
    color: 'var(--neutral-800)', letterSpacing: '-0.7px', lineHeight: 1.2,
    margin: '0 0 3px 0',
  },
  cardText: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '11px', lineHeight: '1.4',
    color: 'var(--neutral-600)', margin: 0, letterSpacing: '-0.2px',
  },
  innerCard: {
    flex: 1, padding: '14px 16px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  innerTitle: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '15px', fontWeight: 600,
    color: 'var(--neutral-800)', letterSpacing: '-0.7px', lineHeight: 1.2,
    margin: '0 0 3px 0',
  },
  innerSubtitle: {
    fontFamily: "'Graphik LCG', -apple-system, sans-serif",
    fontSize: '11px', lineHeight: '1.4',
    color: 'var(--neutral-600)', margin: 0, letterSpacing: '-0.2px',
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

export default FigmaFilesNode;
