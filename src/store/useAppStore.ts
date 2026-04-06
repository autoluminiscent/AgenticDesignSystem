import { create } from 'zustand';
import { CARDS, WORKFLOWS, CONNECTIONS } from '../data/db';
import type { Card, Connection, Workflow } from '../data/schema';

interface AppState {
  mode: 'overview' | 'zoom' | 'workflow';
  activeCardId: string | null;
  activeWorkflowId: string | null;
  currentStepIndex: number;
  
  // Data access
  cards: Card[];
  workflows: Workflow[];
  connections: Connection[];

  // Actions
  setMode: (mode: 'overview' | 'zoom' | 'workflow') => void;
  zoomCard: (cardId: string) => void;
  startWorkflow: (workflowId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'overview',
  activeCardId: null,
  activeWorkflowId: null,
  currentStepIndex: 0,
  
  cards: CARDS,
  workflows: WORKFLOWS,
  connections: CONNECTIONS,

  setMode: (mode) => {
    set({ mode });
    if (mode === 'overview') {
      window.location.hash = '';
      set({ activeCardId: null, activeWorkflowId: null, currentStepIndex: 0 });
    }
  },
  
  zoomCard: (cardId) => {
    window.location.hash = `zoom-${cardId}`;
    set({ mode: 'zoom', activeCardId: cardId, activeWorkflowId: null });
  },

  startWorkflow: (workflowId) => {
    window.location.hash = `workflow-${workflowId}`;
    set({ mode: 'workflow', activeWorkflowId: workflowId, activeCardId: null, currentStepIndex: 0 });
  },

  nextStep: () => {
    const { activeWorkflowId, currentStepIndex, workflows } = get();
    if (!activeWorkflowId) return;
    const activeWf = workflows.find(w => w.id === activeWorkflowId);
    if (activeWf && currentStepIndex < activeWf.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  reset: () => {
    window.location.hash = '';
    set({ mode: 'overview', activeCardId: null, activeWorkflowId: null, currentStepIndex: 0 });
  }
}));

export const initRouting = () => {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('zoom-')) {
    useAppStore.getState().zoomCard(hash.replace('zoom-', ''));
  } else if (hash.startsWith('workflow-')) {
    useAppStore.getState().startWorkflow(hash.replace('workflow-', ''));
  }
};
