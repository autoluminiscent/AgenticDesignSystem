import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FigmaNodeScreen from './FigmaNodeScreen';
import FigmaFilesNode from './FigmaFilesNode';
import ReactDSNode from './ReactDSNode';
import AppFinaleNode from './AppFinaleNode';
import CanvasConnections from './CanvasConnections';
import SidePanel, { PanelText, PanelStrong } from './SidePanel';
import figmaColored from '../../assets/figma-colored.svg';
import reactColored from '../../assets/react-colored.svg';

interface SpatialScrollyProps {
  step: number; // 1=Overview, 2=FigmaDS, 3=FigmaFiles, 4=ReactDS, 5=AppFinale
}

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 1.2;
const ZOOM_STEP = 0.08;

// Distance between card centers on the canvas
// NODE_DIST = actual node positions (compact for a nice overview)
// ZOOM_DIST = camera offsets for zoom steps (must match node positions)
const DIST_X = 1200;
const DIST_Y = 900;

// Node positions in the canvas
const NODE_POSITIONS = [
  { x: 0,      y: 0 },       // Figma DS (top-left)
  { x: DIST_X, y: 0 },       // Fichiers Design (top-right)
  { x: 0,      y: DIST_Y },  // React DS (bottom-left)
  { x: DIST_X, y: DIST_Y },  // App Finale (bottom-right)
];

// Camera config per step
// Panel width = 440px. Depth offset D = 24px (depth layers extend LEFT of main card).
// Left-panel steps: main card must be in [440px, viewport_w].
//   card_center = calc(50% + 208px)  → bg1_left = center−398 = 450px, bg1_right = center+422 = 1270px at 1280px ✓
// Right-panel steps: main card must be in [0, viewport_w−440px].
//   card_center = calc(50% − 232px)  → bg1_left = center−398 = 10px, bg1_right = center+422 = 830px at 1280px ✓
const STEP_CONFIG = [
  // Step 1: Overview — centered on grid, zoomed out
  { canvasLeft: '50%', offsetX: 0, offsetY: 0, panel: null as null, baseScale: 0.50 },
  // Step 2: Zoom Figma DS (top-left), panel left
  { canvasLeft: 'calc(50% + 208px)', offsetX: 0, offsetY: 0, panel: 'left' as const, baseScale: 1.0 },
  // Step 3: Zoom Fichiers Design (top-right), panel right
  { canvasLeft: 'calc(50% - 232px)', offsetX: -DIST_X, offsetY: 0, panel: 'right' as const, baseScale: 1.0 },
  // Step 4: Zoom React DS (bottom-left), panel left
  { canvasLeft: 'calc(50% + 208px)', offsetX: 0, offsetY: -DIST_Y, panel: 'left' as const, baseScale: 1.0 },
  // Step 5: Zoom App Finale (bottom-right), panel right
  { canvasLeft: 'calc(50% - 232px)', offsetX: -DIST_X, offsetY: -DIST_Y, panel: 'right' as const, baseScale: 1.0 },
];

const SpatialScrolly: React.FC<SpatialScrollyProps> = ({ step }) => {
  const stepIndex = step - 1; // 0-based
  const config = STEP_CONFIG[stepIndex] || STEP_CONFIG[0];

  // -- Zoom state --
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // -- Space+drag panning --
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Reset pan & zoom when step changes
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1.0);
  }, [step]);

  // -- Keyboard listeners for space bar --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpaceDown(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
        setIsDragging(false);
        dragStart.current = null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpaceDown) {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX: panOffset.x, panY: panOffset.y };
    }
  }, [isSpaceDown, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragStart.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPanOffset({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) { setIsDragging(false); dragStart.current = null; }
  }, [isDragging]);

  // -- Scroll zoom (Cmd/Ctrl + scroll) --
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        setZoomLevel((prev) => {
          const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
          return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta));
        });
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const effectiveScale = config.baseScale * zoomLevel;

  // For overview, offsets must be proportional to scale (CSS transform order)
  // screen_pos = css_pos + scale * canvas_point + translate
  // To center grid point (px,py) at screen center: translate = -scale * px
  let animateX: number, animateY: number;
  if (stepIndex === 0) {
    // Overview: center the grid
    animateX = -effectiveScale * DIST_X / 2 + panOffset.x;
    animateY = -effectiveScale * DIST_Y / 2 + panOffset.y;
  } else {
    animateX = config.offsetX + panOffset.x;
    animateY = config.offsetY + panOffset.y;
  }

  return (
    <div
      style={{
        ...styles.container,
        cursor: isSpaceDown ? (isDragging ? 'grabbing' : 'grab') : 'inherit',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* DARK NOISE BACKGROUND */}
      <motion.div
        key="spatial-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 40% 50%, #6b7178 0%, #4a5058 100%)',
          zIndex: -1,
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.12,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }} />
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* SPATIAL CANVAS */}
      <motion.div
        style={{ ...styles.canvas, left: config.canvasLeft }}
        animate={{
          x: animateX,
          y: animateY,
          scale: effectiveScale,
        }}
        transition={isDragging
          ? { type: 'tween', duration: 0 }
          : { type: 'spring', damping: 25, stiffness: 60, mass: 1 }
        }
      >
        {/* ── Connection arrows between nodes ── */}
        <CanvasConnections />

        {/* Node 1 — Figma Design System (top-left) */}
        <div style={{ ...styles.nodeContainer, left: `${NODE_POSITIONS[0].x}px`, top: `${NODE_POSITIONS[0].y}px` }}>
          <FigmaNodeScreen />
        </div>

        {/* Node 2 — Fichiers de Design Figma (top-right) */}
        <div style={{ ...styles.nodeContainer, left: `${NODE_POSITIONS[1].x}px`, top: `${NODE_POSITIONS[1].y}px` }}>
          <FigmaFilesNode />
        </div>

        {/* Node 3 — Librairie de composants React (bottom-left) */}
        <div style={{ ...styles.nodeContainer, left: `${NODE_POSITIONS[2].x}px`, top: `${NODE_POSITIONS[2].y}px` }}>
          <ReactDSNode />
        </div>

        {/* Node 4 — Application Finale (bottom-right) */}
        <div style={{ ...styles.nodeContainer, left: `${NODE_POSITIONS[3].x}px`, top: `${NODE_POSITIONS[3].y}px` }}>
          <AppFinaleNode />
        </div>
      </motion.div>

      {/* ── SIDE PANELS ── */}
      <AnimatePresence mode="wait">
        {step === 2 && (
          <SidePanel key="panel-2" side="left" title="Figma Design System"
            icon={<img src={figmaColored} alt="Figma" style={{ height: '28px', width: 'auto' }} />}>
            <PanelText>
              Le <PanelStrong>Design System Figma</PanelStrong> est la source de vérité pour tout le design. Les designers y créent les composants (Button, Input, Card, Modal...) avec leurs variants et propriétés, alimentés par un système de variables structurées.
            </PanelText>
            <PanelText>
              Les <PanelStrong>variables</PanelStrong> définissent les couleurs, espacements, typographies et tokens. Elles supportent plusieurs modes (light/dark, compact/spacious) pour changer de thème en un clic.
            </PanelText>
            <PanelText>
              <PanelStrong>Code Connect</PanelStrong> crée un pont entre le design et le code : les mappings sont publiés depuis le repo React vers les serveurs Figma, rattachés aux composants master.
            </PanelText>
            <PanelText>
              Le <PanelStrong>Figma MCP Server</PanelStrong> expose ce fichier aux agents IA, permettant de lire la structure des composants et récupérer les définitions de variables.
            </PanelText>
          </SidePanel>
        )}

        {step === 3 && (
          <SidePanel key="panel-3" side="right" title="Fichiers de Design"
            icon={<img src={figmaColored} alt="Figma" style={{ height: '28px', width: 'auto' }} />}>
            <PanelText align="right">
              Les <PanelStrong>fichiers de design Figma</PanelStrong> sont l'espace de travail quotidien des designers. Ils contiennent les maquettes organisées page par page, fonctionnalité par fonctionnalité.
            </PanelText>
            <PanelText align="right">
              Les designers peuvent utiliser <PanelStrong>Figma Make</PanelStrong> pour générer rapidement des prototypes interactifs en React via des agents IA (Claude, Gemini, GPT) — accélérant les cycles d'idéation et de tests avant de valider une direction de design.
            </PanelText>
            <PanelText align="right">
              Le <PanelStrong>Fichier de Design</PanelStrong> distingue les maquettes "token-compliant" qui implémentent les composants du DS, des designs temporaires créés rapidement sans instances.
            </PanelText>
            <PanelText align="right">
              Le <PanelStrong>Figma MCP Server</PanelStrong> expose également ces fichiers aux agents, qui peuvent lire les layouts, inspecter les composants utilisés et générer le code correspondant.
            </PanelText>
          </SidePanel>
        )}

        {step === 4 && (
          <SidePanel key="panel-4" side="left" title="Librairie React"
            icon={<img src={reactColored} alt="React" style={{ height: '28px', width: 'auto' }} />}>
            <PanelText>
              La <PanelStrong>librairie de composants React</PanelStrong> est le miroir code du Design System Figma. Chaque composant Figma a son équivalent React, avec les mêmes props et variants.
            </PanelText>
            <PanelText>
              <PanelStrong>Claude Code</PanelStrong> est l'agent principal : il développe les composants, génère les design tokens CSS, rédige les tests et les stories Storybook automatiquement.
            </PanelText>
            <PanelText>
              Les <PanelStrong>Design Tokens</PanelStrong> sont générés par Claude à partir des variables Figma, assurant une synchronisation parfaite entre design et code.
            </PanelText>
            <PanelText>
              Le <PanelStrong>Storybook MCP Server</PanelStrong> expose la documentation des composants aux agents IA, leur permettant de consulter les stories et les props disponibles.
            </PanelText>
            <PanelText>
              Le fichier <PanelStrong>Design-System.md</PanelStrong> documente l'ensemble du système — composants, tokens, conventions de nommage et règles d'usage. C'est la mémoire écrite du DS : référencé dans le <PanelStrong>CLAUDE.md</PanelStrong> de chaque projet, il garantit que les agents IA codent toujours dans le respect du système.
            </PanelText>
          </SidePanel>
        )}

        {step === 5 && (
          <SidePanel key="panel-5" side="right" title="Application finale"
            icon={<img src={reactColored} alt="React" style={{ height: '28px', width: 'auto' }} />}>
            <PanelText align="right">
              L'<PanelStrong>application finale</PanelStrong> consomme la librairie de composants React via un package npm. Elle bénéficie de tous les composants, tokens et de la documentation du Design System.
            </PanelText>
            <PanelText align="right">
              <PanelStrong>Claude Code</PanelStrong> implémente les features directement depuis les maquettes Figma, en utilisant les composants de la librairie et en respectant les design tokens.
            </PanelText>
            <PanelText align="right">
              Le fichier <PanelStrong>Claude.md</PanelStrong> référence le Design-System.md de la librairie, donnant à l'agent toutes les informations nécessaires pour coder dans le respect du système de design.
            </PanelText>
            <PanelText align="right">
              Ce circuit fermé — du design au code, piloté par des agents — constitue le <PanelStrong>Design System Agentique</PanelStrong> : un pipeline autonome et cohérent.
            </PanelText>
          </SidePanel>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute', inset: 0,
    width: '100vw', height: '100vh',
    overflow: 'hidden',
    display: 'flex', alignItems: 'center',
  },
  canvas: {
    position: 'absolute',
    top: '50%',
    transformOrigin: 'center center',
  },
  nodeContainer: {
    position: 'absolute',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: 'translate(-50%, -50%)',
  },
};

export default SpatialScrolly;
