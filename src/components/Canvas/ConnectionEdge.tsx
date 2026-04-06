import React from 'react';
import type { Connection } from '../../data/schema';

interface Props {
  connection: Connection;
  mode: string;
  parallelIndex?: number;
  parallelTotal?: number;
}

const ConnectionEdge: React.FC<Props> = ({ connection, mode, parallelIndex = 0, parallelTotal = 1 }) => {
  const sourceEl = document.getElementById(`node-${connection.from}`);
  const targetEl = document.getElementById(`node-${connection.to}`);

  if (!sourceEl || !targetEl) return null;

  const sx = sourceEl.offsetLeft, sy = sourceEl.offsetTop;
  const sw = sourceEl.offsetWidth, sh = sourceEl.offsetHeight;
  const tx = targetEl.offsetLeft, ty = targetEl.offsetTop;
  const tw = targetEl.offsetWidth, th = targetEl.offsetHeight;

  const sCx = sx + sw / 2, sCy = sy + sh / 2;
  const tCx = tx + tw / 2, tCy = ty + th / 2;

  let x1: number, y1: number, x2: number, y2: number;

  if (Math.abs(tCx - sCx) > Math.abs(tCy - sCy)) {
    if (tCx > sCx) { x1 = sx + sw; y1 = sCy; x2 = tx; y2 = tCy; }
    else { x1 = sx; y1 = sCy; x2 = tx + tw; y2 = tCy; }
  } else {
    if (tCy > sCy) { x1 = sCx; y1 = sy + sh; x2 = tCx; y2 = ty; }
    else { x1 = sCx; y1 = sy; x2 = tCx; y2 = ty + th; }
  }

  // Apply perpendicular offset for parallel connections
  if (parallelTotal > 1) {
    const spacing = 22;
    const offset = (parallelIndex - (parallelTotal - 1) / 2) * spacing;
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) || 1;
    const perpX = -(y2 - y1) / len;
    const perpY = (x2 - x1) / len;
    x1 += perpX * offset;
    y1 += perpY * offset;
    x2 += perpX * offset;
    y2 += perpY * offset;
  }

  const style = getEdgeStyle(connection.type);
  const isWorkflow = mode === 'workflow';

  // Orthogonal routing
  const r = 14;
  const dx = x2 - x1, dy = y2 - y1;
  let pathData: string;

  if (Math.abs(dx) < 4 || Math.abs(dy) < 4) {
    pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
  } else {
    const midX = x1 + dx / 2;
    const dirX = dx > 0 ? 1 : -1;
    const dirY = dy > 0 ? 1 : -1;
    const cr = Math.min(r, Math.abs(dx) / 2, Math.abs(dy) / 2);
    pathData = `M ${x1} ${y1} L ${midX - cr * dirX} ${y1} Q ${midX} ${y1} ${midX} ${y1 + cr * dirY} L ${midX} ${y2 - cr * dirY} Q ${midX} ${y2} ${midX + cr * dirX} ${y2} L ${x2} ${y2}`;
  }

  return (
    <g>
      <circle cx={x1} cy={y1} r="3.5" fill={style.color} opacity="0.5" />
      <path
        d={pathData}
        fill="none"
        stroke={style.color}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.dash}
        className={isWorkflow ? style.animClass : ''}
        markerEnd={style.marker}
        opacity={mode === 'overview' ? 0.35 : 0.65}
      />
      <circle cx={x2} cy={y2} r="3.5" fill={style.color} opacity="0.5" />
      
      {mode !== 'overview' && (
        <g>
          <rect 
            x={(x1 + x2) / 2 - connection.label.length * 3.2 - 8} 
            y={Math.min(y1, y2) - 14} 
            width={connection.label.length * 6.4 + 16}
            height={18} rx="5"
            fill="white" fillOpacity="0.92"
            stroke={style.color} strokeWidth="0.5" strokeOpacity="0.3"
          />
          <text 
            x={(x1 + x2) / 2} y={Math.min(y1, y2) - 3}
            fill={style.color} fontSize="10" fontWeight="600"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            textAnchor="middle" dominantBaseline="middle"
          >
            {connection.label}
          </text>
        </g>
      )}
    </g>
  );
};

function getEdgeStyle(type: string) {
  switch (type) {
    case 'native':  return { color: '#7C3AED', strokeWidth: 2,   marker: 'url(#arrow-native)',  dash: 'none',  animClass: '' };
    case 'mcp':     return { color: '#EA580C', strokeWidth: 1.5, marker: 'url(#arrow-mcp)',     dash: '6 4',   animClass: 'animate-dash' };
    case 'npm':     return { color: '#2563EB', strokeWidth: 2.5, marker: 'url(#arrow-npm)',     dash: 'none',  animClass: '' };
    case 'cli':     return { color: '#D97706', strokeWidth: 1.5, marker: 'url(#arrow-cli)',     dash: '4 3',   animClass: '' };
    case 'weak':    return { color: '#A8A29E', strokeWidth: 1,   marker: '',                    dash: '3 3',   animClass: '' };
    case 'warning': return { color: '#E11D48', strokeWidth: 1.5, marker: 'url(#arrow-warning)', dash: '5 4',   animClass: '' };
    default:        return { color: '#A8A29E', strokeWidth: 1,   marker: '',                    dash: 'none',  animClass: '' };
  }
}

export default ConnectionEdge;
