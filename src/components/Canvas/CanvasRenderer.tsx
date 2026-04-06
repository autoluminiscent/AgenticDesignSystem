import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import CardNode from './CardNode';
import ConnectionEdge from './ConnectionEdge';
import { motion, useAnimation } from 'framer-motion';

const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 1580;

const CanvasRenderer: React.FC = () => {
  const { cards, connections, mode, activeCardId, activeWorkflowId, workflows, currentStepIndex } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });
  const controls = useAnimation();

  // Manual pan/zoom state
  const [manualOffset, setManualOffset] = useState({ x: 0, y: 0 });
  const [manualScale, setManualScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const isManualMode = useRef(false);

  // Viewport tracking
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewport({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute auto camera target
  const getAutoCamera = useCallback(() => {
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;

    if (mode === 'overview') {
      const scaleX = viewport.w / CANVAS_WIDTH;
      const scaleY = viewport.h / CANVAS_HEIGHT;
      targetScale = Math.min(scaleX, scaleY) * 0.88;
      const scaledW = CANVAS_WIDTH * targetScale;
      const scaledH = CANVAS_HEIGHT * targetScale;
      targetX = (viewport.w - scaledW) / 2;
      targetY = (viewport.h - scaledH) / 2;
    } else {
      let cardsToFrame: typeof cards = [];
      if (mode === 'zoom' && activeCardId) {
        const found = cards.find(c => c.id === activeCardId);
        if (found) cardsToFrame = [found];
      } else if (mode === 'workflow' && activeWorkflowId) {
        const wf = workflows.find(w => w.id === activeWorkflowId);
        if (wf && wf.steps[currentStepIndex]) {
          const activeCardIds = wf.steps[currentStepIndex].activeCards;
          cardsToFrame = cards.filter(c => activeCardIds.includes(c.id));
        }
      }

      if (cardsToFrame.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        cardsToFrame.forEach(c => {
          minX = Math.min(minX, c.position.x);
          minY = Math.min(minY, c.position.y);
          maxX = Math.max(maxX, c.position.x + c.size.w);
          maxY = Math.max(maxY, c.position.y + c.size.h);
        });

        const padding = 160;
        const contentW = maxX - minX;
        const contentH = maxY - minY;
        const scaleX = (viewport.w - padding * 2) / Math.max(contentW, 1);
        const scaleY = (viewport.h - padding * 2) / Math.max(contentH, 1);
        targetScale = Math.min(scaleX, scaleY, 1.15);

        const cx = minX + contentW / 2;
        const cy = minY + contentH / 2;
        targetX = viewport.w / 2 - cx * targetScale;
        targetY = viewport.h / 2 - cy * targetScale;
      }
    }
    return { x: targetX, y: targetY, scale: targetScale };
  }, [mode, activeCardId, activeWorkflowId, currentStepIndex, viewport, cards, workflows]);

  // Auto-camera on mode changes
  useEffect(() => {
    isManualMode.current = false;
    const cam = getAutoCamera();
    setManualOffset({ x: cam.x, y: cam.y });
    setManualScale(cam.scale);
    controls.start({
      x: cam.x, y: cam.y, scale: cam.scale,
      transition: { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.65 }
    });
  }, [mode, activeCardId, activeWorkflowId, currentStepIndex, viewport, getAutoCamera, controls]);

  // Keyboard handlers for Figma-like navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpaceDown) {
        e.preventDefault();
        setIsSpaceDown(true);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      }
      // Cmd/Ctrl+0 = fit to view
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        isManualMode.current = false;
        const cam = getAutoCamera();
        setManualOffset({ x: cam.x, y: cam.y });
        setManualScale(cam.scale);
        controls.start({ x: cam.x, y: cam.y, scale: cam.scale, transition: { type: 'tween', duration: 0.4 } });
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
        setIsPanning(false);
        if (containerRef.current) containerRef.current.style.cursor = 'inherit';
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [isSpaceDown, getAutoCamera, controls]);

  // Mouse handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpaceDown || e.button === 1) { // Space+click or middle click
      e.preventDefault();
      setIsPanning(true);
      isManualMode.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, ox: manualOffset.x, oy: manualOffset.y };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    }
  }, [isSpaceDown, manualOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    const newX = panStart.current.ox + dx;
    const newY = panStart.current.oy + dy;
    setManualOffset({ x: newX, y: newY });
    controls.set({ x: newX, y: newY });
  }, [isPanning, controls]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      if (containerRef.current) containerRef.current.style.cursor = isSpaceDown ? 'grab' : 'default';
    }
  }, [isPanning, isSpaceDown]);

  // Wheel handler - must use native event listener to avoid passive listener issue
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      isManualMode.current = true;

      if (e.ctrlKey || e.metaKey) {
        // Pinch zoom / Cmd+Scroll = zoom
        const delta = -e.deltaY * 0.003;
        const newScale = Math.max(0.15, Math.min(3, manualScale * (1 + delta)));
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const ratio = newScale / manualScale;
        const newX = cx - (cx - manualOffset.x) * ratio;
        const newY = cy - (cy - manualOffset.y) * ratio;
        setManualScale(newScale);
        setManualOffset({ x: newX, y: newY });
        controls.set({ x: newX, y: newY, scale: newScale });
      } else {
        // Normal scroll = pan
        const newX = manualOffset.x - e.deltaX;
        const newY = manualOffset.y - e.deltaY;
        setManualOffset({ x: newX, y: newY });
        controls.set({ x: newX, y: newY });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [manualScale, manualOffset, controls]);

  // Connections to render
  let visibleConnections = connections;
  if (mode === 'zoom' && activeCardId) {
    const card = cards.find(c => c.id === activeCardId);
    visibleConnections = card?.zoomConnections || [];
  } else if (mode === 'workflow' && activeWorkflowId) {
    const wf = workflows.find(w => w.id === activeWorkflowId);
    if (wf && wf.steps[currentStepIndex]) {
      const activeConnIds = wf.steps[currentStepIndex].activeConnections;
      visibleConnections = connections.filter(c => activeConnIds.includes(c.id));
    }
  }

  // Compute parallel connection metadata (group by canonical node pair)
  const parallelMeta = new Map<string, { index: number; total: number }>();
  const groups = new Map<string, string[]>();
  visibleConnections.forEach(conn => {
    const key = [conn.from, conn.to].sort().join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(conn.id);
  });
  groups.forEach(ids => {
    ids.forEach((id, i) => parallelMeta.set(id, { index: i, total: ids.length }));
  });

  return (
    <div 
      ref={containerRef} 
      style={styles.container}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <motion.div 
        animate={controls}
        initial={{ x: 0, y: 0, scale: 0.5 }}
        style={{ ...styles.virtualCanvas, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {/* SVG edges layer */}
        <svg style={styles.svgLayer}>
          <defs>
            <marker id="arrow-native" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <path d="M 0 0 L 10 4 L 0 8 L 2 4 z" fill="var(--c-figma-ds)" opacity="0.8" />
            </marker>
            <marker id="arrow-npm" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <path d="M 0 0 L 10 4 L 0 8 L 2 4 z" fill="var(--c-project)" opacity="0.8" />
            </marker>
            <marker id="arrow-mcp" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <path d="M 0 0 L 10 4 L 0 8 L 2 4 z" fill="var(--c-agent)" opacity="0.8" />
            </marker>
            <marker id="arrow-cli" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <path d="M 0 0 L 10 4 L 0 8 L 2 4 z" fill="var(--c-codeconnect)" opacity="0.8" />
            </marker>
            <marker id="arrow-warning" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <path d="M 0 0 L 10 4 L 0 8 L 2 4 z" fill="var(--c-warning)" opacity="0.8" />
            </marker>
          </defs>
          {visibleConnections.map(conn => {
            const meta = parallelMeta.get(conn.id);
            return (
              <ConnectionEdge
                key={conn.id}
                connection={conn}
                mode={mode}
                parallelIndex={meta?.index ?? 0}
                parallelTotal={meta?.total ?? 1}
              />
            );
          })}
        </svg>

        {/* Card nodes */}
        {cards.map(card => {
          const isActiveZoom = mode === 'zoom' && activeCardId === card.id;
          const isFaded = mode === 'zoom' && !isActiveZoom;
          let isWorkflowActive = false;
          if (mode === 'workflow' && activeWorkflowId) {
            const wf = workflows.find(w => w.id === activeWorkflowId);
            if (wf && wf.steps[currentStepIndex]) {
              isWorkflowActive = wf.steps[currentStepIndex].activeCards.includes(card.id);
            }
          }
          const isWorkflowFaded = mode === 'workflow' && !isWorkflowActive;

          return (
            <div 
              key={card.id} 
              id={`node-${card.id}`} 
              style={{
                position: 'absolute',
                left: card.position.x,
                top: card.position.y,
                width: card.size.w,
                height: card.size.h,
                zIndex: isActiveZoom || isWorkflowActive ? 10 : 2,
                transition: 'opacity 0.4s ease',
                opacity: isFaded ? 0.25 : isWorkflowFaded ? 0.35 : 1,
              }}
            >
              <CardNode card={card} isActive={isActiveZoom || isWorkflowActive} />
            </div>
          );
        })}

        {/* Zone labels — visible in overview */}
        {mode === 'overview' && (
          <>
            {/* Divider line between design and code zones */}
            <div style={{
              position: 'absolute',
              left: 60, right: 60,
              top: 810,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent)',
              pointerEvents: 'none',
            }} />
            {/* Design zone label */}
            <div
              className="zone-label"
              style={{
                left: 30, top: 60,
                color: 'var(--c-figma-ds)',
                backgroundColor: 'var(--c-figma-ds-bg)',
                border: '1px solid rgba(124,58,237,0.1)',
              }}
            >
              🎨 Design · Figma
            </div>
            {/* Code zone label */}
            <div
              className="zone-label"
              style={{
                left: 30, top: 840,
                color: 'var(--c-react-ds)',
                backgroundColor: 'var(--c-react-ds-bg)',
                border: '1px solid rgba(5,150,105,0.1)',
              }}
            >
              ⚙️ Code · React
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  },
  virtualCanvas: {
    position: 'absolute',
    transformOrigin: '0 0',
  },
  svgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  }
};

export default CanvasRenderer;
