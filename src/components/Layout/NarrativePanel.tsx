import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, ChevronRight, Wand2, Paintbrush, Cog, Wrench, X } from 'lucide-react';

// Typewriter hook
function useTypewriter(text: string, speed: number = 12) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

const NarrativePanel: React.FC = () => {
  const { mode, activeCardId, activeWorkflowId, currentStepIndex, cards, workflows, nextStep, prevStep, setMode } = useAppStore();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const el = timelineRef.current.querySelector('[data-active="true"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStepIndex, activeWorkflowId]);

  const renderBadge = (badgeType: string) => {
    let color = '#78716C', bg = '#FAFAF9', icon = null, label = '';
    switch (badgeType) {
      case 'manual-designer': color = 'var(--c-figma-file)'; bg = 'var(--c-figma-file-bg)'; icon = <Paintbrush size={10} />; label = 'Designer'; break;
      case 'manual-developer': color = 'var(--c-project)'; bg = 'var(--c-project-bg)'; icon = <Cog size={10} />; label = 'Développeur'; break;
      case 'automatic': color = 'var(--c-react-ds)'; bg = 'var(--c-react-ds-bg)'; icon = <Cog size={10} />; label = 'Auto'; break;
      case 'agent-ai': color = 'var(--c-agent)'; bg = 'var(--c-agent-bg)'; icon = <Wand2 size={10} />; label = 'Agent IA'; break;
      case 'setup': color = 'var(--c-codeconnect)'; bg = 'var(--c-codeconnect-bg)'; icon = <Wrench size={10} />; label = 'Setup'; break;
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: bg, color }}>
        {icon} {label}
      </span>
    );
  };

  // Zoom panel with typewriter
  const ZoomContent = ({ card }: { card: typeof cards[0] }) => {
    const fullText = card.narrative;
    const { displayed, done } = useTypewriter(fullText, 8);

    // Format with bold and code
    const formatText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-main);font-weight:600">$1</strong>')
        .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.04);padding:1px 5px;border-radius:4px;font-size:12px;font-family:\'SF Mono\',monospace">$1</code>');
    };

    const paragraphs = displayed.split('\n\n');

    return (
      <div style={styles.scrollContent} className="custom-scrollbar">
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: `linear-gradient(90deg, ${card.color.primary}, ${card.color.light})` }} />
            <button onClick={() => setMode('overview')} style={styles.closeBtn}><X size={16} /></button>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: card.color.primary, letterSpacing: '-0.03em', marginBottom: '4px' }}>{card.title}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{card.subtitle}</p>
        </div>

        <div style={{ fontFamily: 'var(--font-body)' }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={styles.paragraph} dangerouslySetInnerHTML={{ __html: formatText(p) }} />
          ))}
          {!done && <span className="typewriter-cursor">&nbsp;</span>}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (mode === 'zoom' && activeCardId) {
      const card = cards.find(c => c.id === activeCardId);
      if (!card) return null;
      return <ZoomContent key={activeCardId} card={card} />;
    }

    if (mode === 'workflow' && activeWorkflowId) {
      const wf = workflows.find(w => w.id === activeWorkflowId);
      if (!wf) return null;

      return (
        <div style={styles.workflowContainer}>
          <div style={styles.workflowHeader}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{wf.title}</h2>
              <button onClick={() => setMode('overview')} style={styles.closeBtn}><X size={16} /></button>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${((currentStepIndex + 1) / wf.steps.length) * 100}%` }} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, marginTop: '6px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
              Étape {currentStepIndex + 1} / {wf.steps.length}
            </p>
          </div>

          <div style={styles.timeline} className="custom-scrollbar" ref={timelineRef}>
            {wf.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <div key={step.id} data-active={isActive} style={{ display: 'flex', gap: '12px' }}>
                  {/* Dot track */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
                    <div style={{
                      width: isActive ? '10px' : '7px',
                      height: isActive ? '10px' : '7px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? 'var(--c-figma-ds)' : isPast ? 'var(--c-figma-ds-light)' : 'rgba(0,0,0,0.1)',
                      border: isActive ? '2px solid var(--c-figma-ds-bg)' : 'none',
                      boxShadow: isActive ? '0 0 0 2px var(--c-figma-ds)' : 'none',
                      marginTop: '5px', transition: 'all 0.3s', zIndex: 2,
                    }} />
                    {idx < wf.steps.length - 1 && (
                      <div style={{ width: '1.5px', flex: 1, margin: '4px 0', backgroundColor: isPast ? 'var(--c-figma-ds-light)' : 'rgba(0,0,0,0.05)', transition: 'background-color 0.3s' }} />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{
                    flex: 1,
                    paddingBottom: '18px',
                    opacity: isActive ? 1 : isPast ? 0.65 : 0.35,
                    transition: 'opacity 0.3s',
                  }}>
                    <div style={{ marginBottom: '5px' }}>{renderBadge(step.badge)}</div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, margin: '0 0 3px 0',
                      color: isActive ? 'var(--text-main)' : 'var(--text-secondary)', letterSpacing: '-0.01em',
                    }}>
                      {step.title}
                    </h3>
                    {(isActive || isPast) && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.navBar}>
            <button style={{ ...styles.navBtn, opacity: currentStepIndex === 0 ? 0.4 : 1 }} onClick={prevStep} disabled={currentStepIndex === 0}>
              <ChevronLeft size={14} /> Précédent
            </button>
            <button style={{ ...styles.navBtn, ...styles.navBtnPrimary, opacity: currentStepIndex === wf.steps.length - 1 ? 0.4 : 1 }} onClick={nextStep} disabled={currentStepIndex === wf.steps.length - 1}>
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={styles.container}>
      {renderContent()}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    padding: '28px 24px',
    flex: 1,
    overflowY: 'auto',
  },
  closeBtn: {
    width: '28px', height: '28px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'background 0.2s',
  },
  paragraph: {
    marginBottom: '14px',
    fontSize: '14px',
    lineHeight: 1.75,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.005em',
  },
  workflowContainer: { height: '100%', display: 'flex', flexDirection: 'column' },
  workflowHeader: { padding: '22px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  progressTrack: { width: '100%', height: '3px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, var(--c-figma-ds), var(--c-figma-ds-light))', borderRadius: '2px', transition: 'width 0.4s ease' },
  timeline: { flex: 1, overflowY: 'auto', padding: '20px 24px 10px' },
  navBar: { display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '12px 24px', borderTop: '1px solid rgba(0,0,0,0.05)' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '7px 14px', backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '10px', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-display)',
    transition: 'all 0.2s', color: 'var(--text-secondary)', cursor: 'pointer',
  },
  navBtnPrimary: { backgroundColor: 'var(--c-figma-ds)', color: 'white', border: '1px solid var(--c-figma-ds)' },
};

export default NarrativePanel;
