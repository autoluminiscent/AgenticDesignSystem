import React from 'react';
import type { SubBlock as SubBlockType } from '../../../data/schema';
import { Paintbrush, Cog, Wand2, Wrench } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface SubBlockProps {
  block: SubBlockType;
  size?: 'normal' | 'large';
  accentColor?: string;
}

const SubBlock: React.FC<SubBlockProps> = ({ block, size = 'normal', accentColor = '#6366F1' }) => {
  const { activeWorkflowId, currentStepIndex, workflows } = useAppStore();

  let isPulsing = false;
  if (activeWorkflowId) {
    const wf = workflows.find(w => w.id === activeWorkflowId);
    if (wf && wf.steps[currentStepIndex]) {
      if (wf.steps[currentStepIndex].activeSubBlocks.includes(block.id)) {
        isPulsing = true;
      }
    }
  }

  const getBadgeInfo = (type: string) => {
    switch (type) {
      case 'manual-designer': return { icon: <Paintbrush size={10} />, color: 'var(--c-figma-file)', bg: 'var(--c-figma-file-bg)' };
      case 'manual-developer': return { icon: <Cog size={10} />, color: 'var(--c-project)', bg: 'var(--c-project-bg)' };
      case 'automatic': return { icon: <Cog size={10} />, color: 'var(--c-react-ds)', bg: 'var(--c-react-ds-bg)' };
      case 'agent-ai': return { icon: <Wand2 size={10} />, color: 'var(--c-agent)', bg: 'var(--c-agent-bg)' };
      case 'setup': return { icon: <Wrench size={10} />, color: 'var(--c-codeconnect)', bg: 'var(--c-codeconnect-bg)' };
      default: return null;
    }
  };

  const badgeInfo = block.badge ? getBadgeInfo(block.badge) : null;

  return (
    <div
      style={{
        flex: size === 'large' ? 1 : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: size === 'large' ? 'center' : 'flex-start',
        alignItems: size === 'large' ? 'center' : 'flex-start',
        gap: '6px',
        padding: size === 'large' ? '16px 12px' : '10px 12px',
        borderRadius: '10px',
        backgroundColor: isPulsing ? `${accentColor}08` : 'rgba(0,0,0,0.02)',
        border: `1px solid ${isPulsing ? accentColor : 'rgba(0,0,0,0.05)'}`,
        boxShadow: isPulsing ? `0 0 0 2px ${accentColor}20` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: size === 'large' ? 'center' : 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
          {block.title}
        </span>
        {badgeInfo && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '20px', height: '20px', borderRadius: '6px',
            backgroundColor: badgeInfo.bg, color: badgeInfo.color,
            flexShrink: 0,
          }}>
            {badgeInfo.icon}
          </span>
        )}
      </div>
      {block.description && (
        <p style={{ 
          margin: 0, fontSize: '11px', lineHeight: 1.4, 
          color: 'var(--text-muted)',
          textAlign: size === 'large' ? 'center' : 'left',
        }}>
          {block.description}
        </p>
      )}
    </div>
  );
};

export default SubBlock;
