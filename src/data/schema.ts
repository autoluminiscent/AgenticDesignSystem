export type BadgeType = 'manual-designer' | 'manual-developer' | 'automatic' | 'agent-ai' | 'setup';

export interface Card {
  id: string;
  title: string;
  subtitle: string;
  color: { primary: string; light: string; dark: string };
  icon: string;
  position: { x: number; y: number }; // Absolute coordinates in virtual canvas
  size: { w: number; h: number }; // Absolute sizing
  subBlocks: SubBlock[];
  mcpServers?: McpServer[];
  narrative: string; // Markdown text
  zoomConnections: Connection[];
}

export interface SubBlock {
  id: string;
  title: string;
  description: string;
  badge?: BadgeType;
  tags?: string[];
}

export interface Connection {
  id: string; // Unique ID for drawing/animating
  from: string;
  to: string;
  type: 'native' | 'mcp' | 'npm' | 'cli' | 'weak' | 'warning';
  label: string;
  via?: string;
  description: string;
}

export interface McpServer {
  id: string;
  name: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  badge: BadgeType;
  activeCards: string[];
  activeSubBlocks: string[];
  activeConnections: string[];
  cameraFocus: 'single' | 'dual' | 'overview';
  focusCards?: string[];
}

export interface Workflow {
  id: string;
  title: string;
  steps: WorkflowStep[];
}
