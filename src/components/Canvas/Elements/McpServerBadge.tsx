import React from 'react';
import type { McpServer } from '../../../data/schema';
import { Plug } from 'lucide-react';

interface Props {
  server: McpServer;
  color: string;
}

const McpServerBadge: React.FC<Props> = ({ server, color }) => {
  return (
    <div style={{
      ...styles.container,
      ...getPositionStyles(server.position)
    }}>
      <div style={{...styles.line, borderColor: color}} />
      <div style={{...styles.badge, backgroundColor: color}}>
        <Plug size={12} color="white" />
        <span style={{ color: 'white' }}>{server.name}</span>
      </div>
    </div>
  );
};

const getPositionStyles = (pos: string): React.CSSProperties => {
  switch (pos) {
    case 'top': return { bottom: '100%', left: '50%', transform: 'translate(-50%, 0)', flexDirection: 'column-reverse' };
    case 'bottom': return { top: '100%', left: '50%', transform: 'translate(-50%, 0)', flexDirection: 'column' };
    case 'left': return { right: '100%', top: '50%', transform: 'translate(0, -50%)', flexDirection: 'row-reverse' };
    case 'right': return { left: '100%', top: '50%', transform: 'translate(0, -50%)', flexDirection: 'row' };
    default: return {};
  }
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    zIndex: 20,
  },
  line: {
    width: '24px',
    height: '24px',
    border: '1px dashed',
    flexBasis: '24px',
    flexShrink: 0,
    borderWidth: '2px 0 0 0',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '24px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    boxShadow: 'var(--shadow-md)',
  }
};

export default McpServerBadge;
