import { useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';
import { Braces, LayoutGrid, LayoutList, Type, Palette, Cable } from 'lucide-react';
import figmaDark2 from '../../assets/figma-dark2.svg';
import figmaColored from '../../assets/figma-colored.svg';
import mcpIcon from '../../assets/mcp.svg';

type HoverTarget = null | 'mother' | 'variables' | 'composants' | 'espacements' | 'typographie' | 'couleurs' | 'codeConnect' | 'mcp';

// ── Constants ──────────────────────────────────────────────
const CARD_W  = 820;
const CARD_H  = 660;
const MCP_H   = 46;
const MCP_W   = 420;
const D       = 24; // depth offset for bg2/bg3

const FigmaNodeScreen: React.FC = () => {
  const [hover, setHover] = useState<HoverTarget>(null);

  // ── Tilt spring ─────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 28 });
  const ry = useSpring(0, { stiffness: 180, damping: 28 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2); // -1 → +1
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2); // -1 → +1
    ry.set( x * 1.2);   // max ±1.2°
    rx.set(-y * 1.2);
  }, [rx, ry]);

  const handleMouseLeaveWrapper = useCallback(() => {
    rx.set(0);
    ry.set(0);
    setHover(null);
  }, [rx, ry]);

  // ── Hover helpers ───────────────────────────────────────
  const isMotherHighlighted = hover === 'mother' || hover === 'mcp';
  const isMcpHighlighted    = hover === 'mother' || hover === 'mcp';
  const isChild = (n: HoverTarget) => hover === n || hover === 'mother';

  const hl = (n: string, o: string, on: boolean) => on ? `var(${o})` : `var(${n})`;

  return (
    /*
      ONE motion.div wraps EVERYTHING:
      - entrance animation (x 80→0, opacity)
      - tilt (via spring transform)
      bg2, bg3, card body, and MCP tag all move together.
    */
    <motion.div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width:  `${CARD_W + D}px`,   // extra room for bg3 offset to left  
        height: `${CARD_H + MCP_H}px`,
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
      {/* ── Depth cards ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          position: 'absolute', top: D, left: 0,
          width: `${CARD_W}px`, height: `${CARD_H}px`,
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
          width: `${CARD_W}px`, height: `${CARD_H}px`,
          borderRadius: '22px', zIndex: 1,
          backgroundColor: hl('--neutral-300', '--orange-300', isMotherHighlighted),
          transition: 'background-color 0.4s ease',
        }}
      />

      {/* ── Main card (bg1) ───────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 0, left: D,
          width: `${CARD_W}px`, height: `${CARD_H}px`,
          borderRadius: '16px', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          padding: '28px 32px', boxSizing: 'border-box',
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          cursor: 'inherit',
          backgroundColor: hl('--neutral-100', '--orange-100', isMotherHighlighted),
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={() => setHover('mother')}
        // don't reset on leave — the wrapper's onMouseLeave handles full exit
      >
        {/* Header */}
        <div style={s.header}>
          <img
            src={isMotherHighlighted ? figmaColored : figmaDark2}
            alt="Figma"
            style={{ height: '32px', width: 'auto', transition: 'all 0.3s ease' }}
          />
          <span style={s.headerTitle}>Figma Design System</span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: hl('--neutral-300', '--orange-300', isMotherHighlighted),
          margin: '0 -32px 18px -32px',
          transition: 'background-color 0.4s ease',
        }} />

        {/* Content grid */}
        <div style={s.contentGrid}>

          {/* Variables */}
          <div
            style={{ ...s.varCard, backgroundColor: hl('--neutral-300', '--orange-300', isChild('variables')), transition: 'background-color 0.3s ease' }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('variables'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-400', '--orange-400', isChild('variables')), transition: 'background-color 0.3s ease' }}>
              <Braces size={24} color="var(--neutral-800)" />
            </div>
            <h3 style={s.cardTitle}>Variables</h3>
            <p style={s.cardText}>Centralise les tokens primaires de couleurs, typographies et espacements pour un contrôle global.</p>

            <div style={{ ...s.fauxInner, backgroundColor: hl('--neutral-200', '--orange-200', isChild('variables')), transition: 'background-color 0.3s ease' }}>
              {/* Neutral swatches */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {['#000', '#222529', '#353A40', '#4B5057', '#6E757C', '#AFB5BC', '#CFD4DA', '#DFE2E6', '#EAECEF', '#fff'].map((c, i) => (
                  <div key={i} style={{ width: '13px', height: '13px', borderRadius: '50%', background: c, border: c === '#fff' ? '1px solid #ddd' : 'none', flexShrink: 0 }} />
                ))}
              </div>
              {/* Orange swatches */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {['#A53B17', '#D54B1E', '#EB5321', '#F0754D', '#F5A991', '#F9CBBD', '#FEEEE9'].map((c, i) => (
                  <div key={i} style={{ width: '13px', height: '13px', borderRadius: '50%', background: c, flexShrink: 0 }} />
                ))}
              </div>
              {/* Font styles */}
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--neutral-500)', display: 'block', marginBottom: '4px' }}>Font styles</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--neutral-400)', paddingBottom: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px', fontWeight: 300, fontFamily: "'Canela Deck',serif", color: 'var(--neutral-800)' }}>Aa</span>
                <span style={{ fontSize: '15px', fontWeight: 400, color: 'var(--neutral-800)' }}>Aa</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-800)' }}>Aa</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--neutral-800)' }}>Aa</span>
              </div>
              {/* Spacing bars */}
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--neutral-500)', display: 'block', marginBottom: '4px' }}>Spacing</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                {[28, 22, 17, 12, 8, 5].map((h, i) => (
                  <div key={i} style={{ width: '15px', height: `${h}px`, background: 'var(--neutral-400)', borderRadius: '3px 3px 0 0' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Composants */}
          <div
            style={{ ...s.compCard, backgroundColor: hl('--neutral-50', '--orange-50', isChild('composants')), transition: 'background-color 0.3s ease' }}
            onMouseEnter={(e) => { e.stopPropagation(); setHover('composants'); }}
            onMouseLeave={() => setHover('mother')}
          >
            <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--orange-200', isChild('composants')), transition: 'background-color 0.3s ease' }}>
              <LayoutGrid size={24} color="var(--neutral-800)" />
            </div>
            <h3 style={s.cardTitle}>Composants</h3>
            <p style={s.cardText}>Regroupe les éléments interactifs. Chaque composant dispose de ses propriétés natives.</p>

            {/* No border on inner container */}
            <div style={{ ...s.fauxInner, backgroundColor: hl('--neutral-100', '--orange-100', isChild('composants')), transition: 'background-color 0.3s ease' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--neutral-500)', display: 'block', marginBottom: '5px' }}>Buttons</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '10px' }}>
                <div style={{ ...s.fauxBtn, background: 'var(--neutral-700)', color: 'white' }}>Default</div>
                <div style={{ ...s.fauxBtn, background: 'var(--neutral-800)', color: 'white' }}>Hover</div>
                <div style={{ ...s.fauxBtn, background: 'var(--neutral-200)', color: 'var(--neutral-400)' }}>Off</div>
                <div style={{ ...s.fauxBtn, background: 'transparent', border: '1px solid var(--neutral-600)', color: 'var(--neutral-700)' }}>Default</div>
                <div style={{ ...s.fauxBtn, background: 'var(--neutral-100)', border: '1px solid var(--neutral-700)', color: 'var(--neutral-800)' }}>Hover</div>
                <div style={{ ...s.fauxBtn, background: 'transparent', border: '1px solid var(--neutral-200)', color: 'var(--neutral-300)' }}>Off</div>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--neutral-500)', display: 'block', marginBottom: '5px' }}>Inputs</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ background: 'white', border: '1px solid var(--neutral-300)', height: '21px', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '7px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--neutral-400)' }}>Placeholder...</span>
                </div>
                <div style={{ background: 'white', border: '1.5px solid var(--neutral-700)', height: '21px', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '7px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--neutral-800)', fontWeight: 500 }}>Active input</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', height: '21px', borderRadius: '5px', flex: 2, display: 'flex', alignItems: 'center', paddingLeft: '7px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--neutral-300)' }}>Search...</span>
                  </div>
                  <div style={{ background: 'var(--neutral-700)', borderRadius: '5px', flex: 1, height: '21px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '8px', color: 'white', fontWeight: 600 }}>↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Espacements / Typographie / Couleurs */}
          <div style={s.othersCol}>
            {([
              { key: 'espacements', icon: <LayoutList size={24} color="var(--neutral-800)" />, label: 'Espacements', desc: 'Gestion standardisée des marges et grilles.' },
              { key: 'typographie', icon: <Type size={24} color="var(--neutral-800)" />,       label: 'Typographie', desc: 'Hiérarchie visuelle et styles textuels stricts.' },
              { key: 'couleurs',    icon: <Palette size={24} color="var(--neutral-800)" />,    label: 'Couleurs',    desc: 'Palettes de couleurs marque et feedback.' },
            ] as { key: HoverTarget; icon: React.ReactNode; label: string; desc: string }[]).map(({ key, icon, label, desc }) => (
              <div
                key={key as string}
                style={{ ...s.otherItem, backgroundColor: hl('--neutral-50', '--orange-50', isChild(key)), transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => { e.stopPropagation(); setHover(key); }}
                onMouseLeave={() => setHover('mother')}
              >
                <div style={{ ...s.iconBox, backgroundColor: hl('--neutral-200', '--orange-200', isChild(key)), transition: 'background-color 0.3s ease' }}>
                  {icon}
                </div>
                <h4 style={s.cardTitle}>{label}</h4>
                <p style={s.cardText}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Connect */}
        <div
          style={{
            ...s.codeConnect,
            borderColor:     hl('--neutral-500', '--orange-500', isChild('codeConnect')),
            backgroundColor: isChild('codeConnect') ? 'var(--orange-50)' : 'transparent',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.stopPropagation(); setHover('codeConnect'); }}
          onMouseLeave={() => setHover('mother')}
        >
          <div style={{ ...s.iconBox, borderRadius: '20px', width: '38px', height: '38px', marginBottom: 0, backgroundColor: hl('--neutral-400', '--orange-400', isChild('codeConnect')), transition: 'background-color 0.3s ease' }}>
            <Cable size={22} color="var(--neutral-800)" />
          </div>
          <div>
            <h4 style={{ ...s.cardTitle, marginBottom: '1px', fontSize: '14px' }}>Code Connect</h4>
            <p style={{ ...s.cardText, margin: 0, fontSize: '11px' }}>Mapping entre les composants Figma et les composants React</p>
          </div>
        </div>
      </div>

      {/* ── MCP Server tag ────────────────────────────────
          Positioned exactly at the bottom of bg1 (absolute from the wrapper).
          bg1 is at left: D = 24, width: CARD_W = 820.
          Center of bg1 = D + CARD_W/2 = 24 + 410 = 434.
          MCP left = 434 - MCP_W/2 = 434 - 210 = 224.
      */}
      <motion.div
        style={{
          position: 'absolute',
          top:    `${CARD_H + D}px`,
          left:   `${D + (CARD_W - MCP_W) / 2}px`,
          width:  `${MCP_W}px`,
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
          <img
            src={mcpIcon}
            alt="MCP"
            style={{
              width: '20px', height: '20px',
              filter: isMcpHighlighted
                ? 'brightness(1.6) sepia(1) saturate(6) hue-rotate(-5deg)'
                : 'brightness(0.9)',
              transition: 'filter 0.3s ease',
            }}
          />
          <span>FIGMA MCP SERVER</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Styles ────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' },
  headerTitle: {
    fontFamily: "'Canela Deck', Georgia, serif",
    fontSize: '24px', fontWeight: 500,
    color: 'var(--neutral-800)', letterSpacing: '-1.2px', lineHeight: 1,
  },
  contentGrid: { display: 'flex', gap: '12px', flex: 1, minHeight: 0 },
  varCard: {
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column',
    width: '215px', flexShrink: 0, cursor: 'inherit',
  },
  compCard: {
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column',
    width: '215px', flexShrink: 0, cursor: 'inherit',
  },
  othersCol: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  otherItem: {
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
  fauxInner: {
    marginTop: '12px', flex: 1,
    borderRadius: '10px', padding: '10px',
    display: 'flex', flexDirection: 'column',
  },
  fauxBtn: {
    borderRadius: '4px', padding: '4px 2px',
    fontSize: '8px', fontWeight: 600,
    textAlign: 'center',
    fontFamily: "'Graphik LCG', sans-serif",
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

export default FigmaNodeScreen;
