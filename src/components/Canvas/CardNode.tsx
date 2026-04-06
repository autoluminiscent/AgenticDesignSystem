import React from 'react';
import type { Card } from '../../data/schema';
import { Palette, Sparkles, AppWindow, Package, Rocket, ArrowRight } from 'lucide-react';
import SubBlock from './Elements/SubBlock';
import McpServerBadge from './Elements/McpServerBadge';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  card: Card;
  isActive: boolean;
}

const CardNode: React.FC<Props> = ({ card, isActive }) => {
  const { mode, zoomCard } = useAppStore();

  const getIcon = (iconName: string) => {
    const s = 18;
    switch (iconName) {
      case 'palette': return <Palette size={s} />;
      case 'sparkles': return <Sparkles size={s} />;
      case 'frame': return <AppWindow size={s} />;
      case 'package': return <Package size={s} />;
      case 'rocket': return <Rocket size={s} />;
      default: return null;
    }
  };

  const showDetails = mode !== 'overview';
  const isCodeBlock = card.id === 'react-ds' || card.id === 'project';

  // Internals per card
  const renderInternals = () => {
    if (card.id === 'figma-ds') {
      const vars = card.subBlocks.find(b => b.id.includes('var'));
      const others = card.subBlocks.filter(b => !b.id.includes('var'));
      return (
        <div style={{ display: 'flex', gap: '10px', flex: 1, marginTop: '14px' }}>
          {vars && (
            <div style={{ flex: '0 0 140px', display: 'flex' }}>
              <SubBlock block={vars} size="large" accentColor={card.color.primary} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', color: card.color.light, padding: '0 2px' }}>
            <ArrowRight size={14} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {others.map(b => <SubBlock key={b.id} block={b} accentColor={card.color.primary} />)}
          </div>
        </div>
      );
    }

    if (card.id === 'react-ds') {
      const claude = card.subBlocks.find(b => b.id === 'claude-ds');
      const rest = card.subBlocks.filter(b => b.id !== 'claude-ds');
      return (
        <div style={{ display: 'flex', gap: '10px', flex: 1, marginTop: '14px' }}>
          {claude && <div style={{ flex: '0 0 150px', display: 'flex' }}><SubBlock block={claude} size="large" accentColor={card.color.primary} /></div>}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {rest.map(b => <SubBlock key={b.id} block={b} accentColor={card.color.primary} />)}
          </div>
        </div>
      );
    }

    if (card.id === 'project') {
      return (
        <div style={{ marginTop: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {card.subBlocks.find(b => b.id === 'claude-project') && (
            <SubBlock block={card.subBlocks.find(b => b.id === 'claude-project')!} accentColor={card.color.primary} />
          )}
          <div style={{ border: `1.5px dashed ${card.color.light}`, borderRadius: '10px', padding: '10px', flex: 1 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-display)', color: card.color.primary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              node_modules / Design System
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {card.subBlocks.filter(b => b.id !== 'claude-project').map(b => <SubBlock key={b.id} block={b} accentColor={card.color.primary} />)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px', flex: 1 }}>
        {card.subBlocks.map(block => <SubBlock key={block.id} block={block} accentColor={card.color.primary} />)}
      </div>
    );
  };

  // Overview card with more visual interest
  const renderOverview = () => {
    const firstLine = card.narrative.split('\n\n')[0].slice(0, 100);
    return (
      <div style={styles.overviewBody}>
        {/* Decorative shape */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: `radial-gradient(circle, ${card.color.primary}08, transparent)`,
          pointerEvents: 'none',
        }} />
        
        <p style={{ ...styles.overviewDesc, fontFamily: 'var(--font-body)' }}>{firstLine}…</p>
        
        {/* Mini stat / tag line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ ...styles.entityTag, backgroundColor: `${card.color.primary}10`, color: card.color.primary }}>
            {card.subBlocks.length} éléments
          </span>
          {card.mcpServers && card.mcpServers.length > 0 && (
            <span style={{ ...styles.entityTag, backgroundColor: 'var(--c-agent-bg)', color: 'var(--c-agent)' }}>
              MCP Server
            </span>
          )}
        </div>

        <span style={{ ...styles.exploreHint, color: card.color.primary }}>
          Explorer →
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        ...styles.card,
        borderColor: isActive ? `${card.color.primary}40` : 'rgba(0,0,0,0.04)',
        boxShadow: isActive 
          ? `0 0 0 2px ${card.color.primary}25, var(--shadow-card-hover)` 
          : 'var(--shadow-card)',
        cursor: 'inherit',
        background: isCodeBlock
          ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(253,251,249,0.95) 100%)',
      }}
      onClick={() => { if (mode === 'overview') zoomCard(card.id); }}
    >
      {/* Accent bar */}
      <div style={{ ...styles.accentBar, background: `linear-gradient(90deg, ${card.color.primary}, ${card.color.light})` }} />

      <div style={styles.header}>
        <div style={{
          ...styles.iconWrapper,
          background: `linear-gradient(135deg, ${card.color.primary}15, ${card.color.light}20)`,
          color: card.color.primary,
        }}>
          {getIcon(card.icon)}
        </div>
        <div>
          <h3 style={{ ...styles.title, color: card.color.primary }}>{card.title}</h3>
          <p style={styles.subtitle}>{card.subtitle}</p>
        </div>
      </div>

      {showDetails ? renderInternals() : renderOverview()}

      {card.mcpServers?.map(server => (
        <McpServerBadge key={server.id} server={server} color={card.color.primary} />
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    paddingTop: '24px',
    overflow: 'hidden',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    backdropFilter: 'blur(8px)',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '3px',
    borderRadius: '16px 16px 0 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrapper: {
    width: '40px', height: '40px',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: 0,
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '1px',
  },
  overviewBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
    padding: '12px 8px',
    position: 'relative',
  },
  overviewDesc: {
    fontSize: '12.5px',
    lineHeight: 1.55,
    color: 'var(--text-muted)',
    maxWidth: '360px',
  },
  entityTag: {
    fontSize: '10px',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.01em',
  },
  exploreHint: {
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.01em',
    opacity: 0.8,
  },
};

export default CardNode;
