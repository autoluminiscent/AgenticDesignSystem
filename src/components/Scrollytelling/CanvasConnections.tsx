import { motion } from 'framer-motion';

/*
  Inter-card connection arrows drawn in the canvas coordinate system.

  Node centers (from SpatialScrolly NODE_POSITIONS):
    Figma DS:       (0, 0)
    Fichiers Design:(1200, 0)
    React DS:       (0, 900)
    App Finale:     (1200, 900)

  Card dimensions are estimated from the node components to place
  arrow start/end points at visually correct positions.
*/

const CanvasConnections: React.FC = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // @ts-ignore
      transition={{ duration: 1.2, delay: 1.2 }}
      viewBox="-600 -500 2400 1800"
      style={{
        position: 'absolute',
        left: '-600px',
        top: '-500px',
        width: '2400px',
        height: '1800px',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        {/* Single neutral arrowhead marker */}
        <marker id="ah" viewBox="0 0 12 8" refX="11" refY="4"
          markerWidth="9" markerHeight="6" orient="auto-start-reverse">
          <path d="M1,1 L10,4 L1,7" fill="none" stroke="#AFB5BC" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Animated dash for MCP connections */}
      <style>{`
        .mcp-dash { animation: mcp-flow 1.2s linear infinite; }
        @keyframes mcp-flow { to { stroke-dashoffset: -16; } }
      `}</style>

      {/* ─────────────────────────────────────────────────────
          Arrow 1: Figma DS (right) → fork → Modèle IA + Maquettes finales
          Type: native (Figma library link)
         ───────────────────────────────────────────────────── */}
      <g>
        {/* Main stem */}
        <line x1="425" y1="0" x2="600" y2="0"
          stroke="rgba(175,181,188,0.75)" strokeWidth="2" />
        {/* Fork dot */}
        <circle cx="600" cy="0" r="3.5" fill="rgba(175,181,188,0.85)" />
        {/* Upper branch → Modèle IA */}
        <path d="M600,0 C680,0 720,-55 778,-55"
          fill="none" stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          markerEnd="url(#ah)" />
        {/* Lower branch → Maquettes finales */}
        <path d="M600,0 C680,0 720,85 778,85"
          fill="none" stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          markerEnd="url(#ah)" />
        {/* Label */}
        <text x="585" y="-14"
          fill="rgba(175,181,188,0.7)" fontSize="10"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="500"
          textAnchor="middle">
          Librairie Figma
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────
          Arrow 2: Figma DS (MCP) ↕ React DS — bidirectional
          Type: mcp (get_variable_defs ↓ / Code Connect publish ↑)
         ───────────────────────────────────────────────────── */}
      <g>
        <line x1="0" y1="385" x2="0" y2="690"
          stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          strokeDasharray="8 8" className="mcp-dash"
          markerStart="url(#ah)" markerEnd="url(#ah)" />
        {/* Labels */}
        <text x="14" y="520"
          fill="rgba(175,181,188,0.7)" fontSize="10"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="500"
          textAnchor="start">
          MCP
        </text>
        <text x="14" y="534"
          fill="rgba(175,181,188,0.55)" fontSize="9"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="400"
          textAnchor="start">
          Code Connect
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────
          Arrow 3: React DS card → App Finale "Package de la librairie"
          Type: npm (dependency)
         ───────────────────────────────────────────────────── */}
      <g>
        <path d="M425,780 C580,780 790,790 940,790"
          fill="none" stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          markerEnd="url(#ah)" />
        {/* Label */}
        <text x="680" y="768"
          fill="rgba(175,181,188,0.7)" fontSize="10"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="500"
          textAnchor="middle">
          npm
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────
          Arrow 4: Storybook MCP → App Finale
          Type: mcp (Storybook tools)
         ───────────────────────────────────────────────────── */}
      <g>
        <path d="M470,985 C620,985 790,945 940,945"
          fill="none" stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          strokeDasharray="8 8" className="mcp-dash"
          markerEnd="url(#ah)" />
        {/* Label */}
        <text x="700" y="978"
          fill="rgba(175,181,188,0.7)" fontSize="10"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="500"
          textAnchor="middle">
          Storybook MCP
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────
          Arrow 5: Fichiers Figma (MCP) → Application Finale
          Type: mcp (get_design_context)
         ───────────────────────────────────────────────────── */}
      <g>
        <line x1="1200" y1="260" x2="1200" y2="655"
          stroke="rgba(175,181,188,0.75)" strokeWidth="2"
          strokeDasharray="8 8" className="mcp-dash"
          markerEnd="url(#ah)" />
        {/* Label */}
        <text x="1214" y="445"
          fill="rgba(175,181,188,0.7)" fontSize="10"
          fontFamily="'Graphik LCG', sans-serif" fontWeight="500"
          textAnchor="start">
          Figma MCP
        </text>
      </g>
    </motion.svg>
  );
};

export default CanvasConnections;
