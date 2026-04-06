import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Eye, Zap, ChevronDown } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const { mode, activeCardId, activeWorkflowId, setMode, zoomCard, startWorkflow, cards, workflows } = useAppStore();

  return (
    <div style={styles.container} className="glass-panel">
      {/* Navigation */}
      <div style={styles.group}>
        <div style={styles.label}>
          <Eye size={13} strokeWidth={2.5} />
          <span>VUE</span>
        </div>
        <div style={styles.selectWrapper}>
          <select 
            style={styles.select}
            value={mode === 'zoom' ? activeCardId || 'overview' : 'overview'}
            onChange={(e) => {
              if (e.target.value === 'overview') setMode('overview');
              else zoomCard(e.target.value);
            }}
          >
            <option value="overview">Vue d'ensemble</option>
            {cards.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <ChevronDown size={14} style={styles.chevron} />
        </div>
      </div>

      <div style={styles.divider} />

      {/* Workflows */}
      <div style={styles.group}>
        <div style={styles.label}>
          <Zap size={13} strokeWidth={2.5} />
          <span>WORKFLOW</span>
        </div>
        <div style={styles.selectWrapper}>
          <select 
            style={styles.select}
            value={mode === 'workflow' ? activeWorkflowId || '' : ''}
            onChange={(e) => {
              if (e.target.value) startWorkflow(e.target.value);
            }}
          >
            <option value="">Choisir...</option>
            {workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.title}</option>)}
          </select>
          <ChevronDown size={14} style={styles.chevron} />
        </div>
      </div>

      {/* Keyboard hint */}
      <div style={styles.divider} />
      <div style={styles.hint}>
        <kbd style={styles.kbd}>Space</kbd>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Déplacer</span>
        <kbd style={styles.kbd}>⌘ Scroll</kbd>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Zoom</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '16px',
    padding: '8px 16px',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    appearance: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: '7px 28px 7px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-main)',
    cursor: 'pointer',
    outline: 'none',
    borderRadius: '8px',
    minWidth: '160px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  chevron: {
    position: 'absolute',
    right: '8px',
    pointerEvents: 'none',
    color: 'var(--text-muted)',
  } as React.CSSProperties,
  divider: {
    width: '1px',
    height: '28px',
    backgroundColor: 'rgba(0,0,0,0.08)',
    flexShrink: 0,
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  kbd: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.08)',
    color: 'var(--text-muted)',
    fontFamily: 'inherit',
  }
};

export default ControlPanel;
