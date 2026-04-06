import type { Card, Connection, Workflow } from './schema';

export const CONNECTIONS: Connection[] = [
  // Overview connections
  { id: 'rel-figma-ds-file', from: 'figma-ds', to: 'figma-file', type: 'native', label: 'Librairie → Instances', description: 'Lien natif Figma' },
  { id: 'rel-figma-ds-make', from: 'figma-ds', to: 'figma-make', type: 'weak', label: 'Référence optionnelle', description: 'Inspiration visuelle' },
  { id: 'rel-figma-ds-react-ds-1', from: 'figma-ds', to: 'react-ds', type: 'mcp', label: 'get_variable_defs', via: 'Figma MCP Server', description: 'Via Figma MCP Server' },
  { id: 'rel-figma-ds-react-ds-2', from: 'figma-ds', to: 'react-ds', type: 'mcp', label: 'get_design_context', via: 'Figma MCP Server', description: 'Via Figma MCP Server' },
  { id: 'rel-react-ds-figma-ds', from: 'react-ds', to: 'figma-ds', type: 'cli', label: 'Code Connect publish', description: 'npx figma code connect publish' },
  { id: 'rel-figma-make-file', from: 'figma-make', to: 'figma-file', type: 'warning', label: 'Planches temporaires', description: 'Pas d\'instances DS' },
  { id: 'rel-react-ds-project-npm', from: 'react-ds', to: 'project', type: 'npm', label: 'Dépendance npm', description: 'Installé via npm/yarn' },
  { id: 'rel-react-ds-project-mcp', from: 'react-ds', to: 'project', type: 'mcp', label: 'Storybook tools', via: 'Storybook MCP Server', description: 'Via Storybook MCP Server' },
  { id: 'rel-figma-file-project', from: 'figma-file', to: 'project', type: 'mcp', label: 'get_design_context', via: 'Figma MCP Server', description: 'Structure + Code Connect' },
];

export const CARDS: Card[] = [
  {
    id: 'figma-ds',
    title: 'Figma Design System',
    subtitle: 'Source de vérité design',
    color: { primary: '#6C5CE7', light: '#A29BFE', dark: '#1E1635' },
    icon: 'palette',
    position: { x: 100, y: 100 },
    size: { w: 550, h: 650 },
    mcpServers: [{ id: 'figma-mcp-ds', name: 'Figma MCP Server', position: 'bottom' }],
    zoomConnections: [
      { id: 'z1', from: 'figma-ds', to: 'figma-file', type: 'native', label: 'Librairie Figma (instances)', description: '' },
      { id: 'z2', from: 'figma-ds', to: 'figma-make', type: 'weak', label: 'Peut être utilisé comme référence', description: '' },
      { id: 'z3', from: 'figma-ds', to: 'react-ds', type: 'mcp', label: 'get_variable_defs', via: 'Figma MCP', description: '' },
      { id: 'z4', from: 'figma-ds', to: 'react-ds', type: 'mcp', label: 'get_design_context', via: 'Figma MCP', description: '' },
      { id: 'z5', from: 'react-ds', to: 'figma-ds', type: 'cli', label: 'Code Connect publish (CLI)', description: '' },
    ],
    narrative: `Le Design System Figma est la source de vérité pour tout le design. Les designers y créent les composants (Button, Input, Card, Modal…) avec leurs variants et propriétés, alimentés par un système de variables Figma structurées en collections.\n\nLes variables définissent les couleurs, espacements, typographies et autres tokens. Elles supportent plusieurs modes (light/dark, compact/spacious) ce qui permet de changer de thème en un clic.\n\n**Code Connect** apparaît ici comme un pont : les mappings sont publiés depuis le repo React DS vers les serveurs Figma via \`npx figma code connect publish\`. Ils sont rattachés aux composants master. Quand un agent ou un développeur inspecte un composant en Dev Mode, il voit directement le snippet de code correspondant.\n\n**Le Figma MCP Server** expose ce fichier aux agents IA. Il permet de lire la structure des composants (\`get_design_context\`) et récupérer les définitions de variables (\`get_variable_defs\`).`,
    subBlocks: [
      { id: 'figma-variables', title: 'Figma Variables', description: 'Bloc central qui alimente tout. Contient : couleurs, espacements, typographies.' },
      { id: 'components', title: 'Components', description: 'Composants avec variants, props booléennes, slots.' },
      { id: 'spacing', title: 'Spacing', description: 'Sous-ensemble des variables dédié aux espacements.' },
      { id: 'typography', title: 'Typography', description: 'Styles de texte.' },
      { id: 'colors', title: 'Colors', description: 'Palettes de couleurs sémantiques et primitives.' },
      { id: 'code-connect-m', title: 'Code Connect', description: 'Mapping entre composants Figma et composants React (Fichiers publiés).', badge: 'setup' },
    ]
  },
  {
    id: 'figma-make',
    title: 'Figma Make',
    subtitle: 'Prototypage IA rapide',
    color: { primary: '#888780', light: '#B4B2A9', dark: '#1A1E2A' },
    icon: 'sparkles',
    position: { x: 900, y: 100 },
    size: { w: 550, h: 200 },
    zoomConnections: [
      { id: 'zm1', from: 'figma-make', to: 'figma-file', type: 'warning', label: 'Planches temporaires (pas d\'instances DS)', description: '' },
      { id: 'zm2', from: 'figma-ds', to: 'figma-make', type: 'weak', label: 'Référence optionnelle', description: '' },
    ],
    narrative: `Figma Make est un outil de prototypage IA intégré à Figma. Il permet de générer rapidement des écrans à partir d'un prompt. Il peut prendre le Design System en référence pour s'en inspirer visuellement.\n\n**Attention :** les écrans générés par Figma Make ne contiennent pas d'instances des composants du DS. Ce sont des formes "plates" — rectangles, textes, auto-layouts — qui simulent visuellement les composants sans être liés au DS.\n\nConséquence : si on copie ces planches dans le fichier de maquettes, l'agent IA (via Code Connect) ne pourra pas reconnaître les composants et faire le mapping automatique vers le code. L'output de Figma Make est un brouillon d'idéation, pas une source de vérité.`,
    subBlocks: [
      { id: 'ai-model', title: 'Modèle IA', description: 'Claude, Gemini, GPT. Moteur de génération depuis prompt.' },
      { id: 'generated-proto', title: 'Prototype généré', description: 'Code généré, visuellement correct mais "plat".' },
      { id: 'figma-conversion', title: 'Conversion Figma', description: 'Converti en formes Figma (pas d\'instances).' }
    ]
  },
  {
    id: 'figma-file',
    title: 'Maquettes Figma',
    subtitle: 'Maquettes des features',
    color: { primary: '#E84393', light: '#FD79A8', dark: '#2A1525' },
    icon: 'frame',
    position: { x: 900, y: 400 },
    size: { w: 550, h: 350 },
    mcpServers: [{ id: 'figma-mcp-file', name: 'Figma MCP Server', position: 'bottom' }],
    zoomConnections: [
      { id: 'zf1', from: 'figma-ds', to: 'figma-file', type: 'native', label: 'Instances de composants', description: '' },
      { id: 'zf2', from: 'figma-make', to: 'figma-file', type: 'warning', label: 'Planches temporaires importées', description: '' },
      { id: 'zf3', from: 'figma-file', to: 'project', type: 'mcp', label: 'get_design_context', via: 'Figma MCP', description: '' },
    ],
    narrative: `Le fichier de maquettes Figma contient les designs des features, composés par le designer en assemblant les composants du DS. Chaque composant utilisé est une **instance** liée au master dans le DS : si le DS évolue, les maquettes se mettent à jour.\n\nC'est ce fichier que l'agent IA lit via le **Figma MCP Server** quand il doit implémenter une feature. L'appel \`get_design_context\` retourne la structure de la maquette, et comme les éléments sont des instances du DS, Figma résout automatiquement les **Code Connect mappings**.\n\nLa zone "Planches Figma Make" est un espace de brouillon. Ces planches n'ont pas d'instances DS.`,
    subBlocks: [
      { id: 'feature-screens', title: 'Écrans de features', description: 'Maquettes principales avec composants DS et contenu.' },
      { id: 'ds-instances', title: 'Instances DS', description: 'Composants liés. Overrides autorisés.' },
      { id: 'prototypes', title: 'Prototypes & Interactions', description: 'Non lu par IA, utile validation UX.' },
      { id: 'draft-boards', title: 'Planches Figma Make', description: 'Brouillons sans instances.', badge: 'manual-designer' },
    ]
  },
  {
    id: 'react-ds',
    title: 'React Design System',
    subtitle: 'Librairie de composants React',
    color: { primary: '#00B894', light: '#55EFC4', dark: '#0D2A2A' },
    icon: 'package',
    position: { x: 100, y: 880 },
    size: { w: 550, h: 450 },
    mcpServers: [
      { id: 'storybook-mcp', name: 'Storybook MCP', position: 'right' }
    ],
    zoomConnections: [
      { id: 'zr1', from: 'figma-ds', to: 'react-ds', type: 'mcp', label: 'get_variable_defs, get_design_context', description: '' },
      { id: 'zr2', from: 'react-ds', to: 'figma-ds', type: 'cli', label: 'Code Connect publish', description: '' },
      { id: 'zr3', from: 'react-ds', to: 'project', type: 'npm', label: 'npm dependency', description: '' },
      { id: 'zr4', from: 'react-ds', to: 'project', type: 'mcp', label: 'Storybook MCP tools', description: '' },
    ],
    narrative: `Le repo React Design System est l'implémentation logicielle du DS Figma. C'est un package npm publié que les projets consomment comme dépendance.\n\n**Claude Code** est l'agent qui opère dans ce repo. Il génère les tokens, développe les composants, écrit les tests, et met à jour les liens Code Connect.\n\n**Le Design-System.md** est la documentation de contexte pour les agents IA distribuée dans le package npm.\n\n**Le Storybook MCP Server** expose le catalogue Storybook aux agents externes, permettant la découverte de composants dynamiques sans tout charger via le fichier Markdown.`,
    subBlocks: [
      { id: 'claude-ds', title: 'Claude Code', description: 'Génère tokens, composants, tests.', badge: 'agent-ai' },
      { id: 'react-components', title: 'Components', description: 'Composants React (Button.tsx, Input.tsx).' },
      { id: 'design-tokens', title: 'Design Tokens', description: 'Tokens CSS/TS générés par l\'agent.' },
      { id: 'stories', title: 'Stories', description: 'Hébergées via Storybook (.stories.tsx).' },
      { id: 'design-system-md', title: 'Design-System.md', description: 'Documentation pour les agents IA consommateurs.' },
      { id: 'code-connect-map', title: 'Code Connect Map', description: 'Fichiers .figma.tsx publiés.' },
      { id: 'tests-ci', title: 'Tests & CI/CD', description: 'VRT, a11y, npm publish.', badge: 'automatic' }
    ]
  },
  {
    id: 'project',
    title: 'Projet',
    subtitle: 'L\'application finale',
    color: { primary: '#0984E3', light: '#74B9FF', dark: '#0D1F35' },
    icon: 'rocket',
    position: { x: 900, y: 880 },
    size: { w: 550, h: 450 },
    zoomConnections: [
      { id: 'zp1', from: 'react-ds', to: 'project', type: 'npm', label: 'npm dependency', description: '' },
      { id: 'zp2', from: 'react-ds', to: 'project', type: 'mcp', label: 'Storybook tools', description: '' },
      { id: 'zp3', from: 'figma-file', to: 'project', type: 'mcp', label: 'get_design_context', description: '' },
    ],
    narrative: `Le projet applicatif est l'application finale qui consomme le Design System comme dépendance npm.\n\n**Claude Code** est l'agent qui implémente les features à partir des maquettes.\n\nPour une nouvelle feature, l'agent lit \`Design-System.md\`, appelle \`get_design_context\` via MCP sur la maquette Figma, et génère le code en utilisant les composants du DS reconnus via les mappings Code Connect.\n\nLa **logique métier** (state, API, business rules) reste principalement l'apanage du développeur humain qui valide la proposition de l'agent.`,
    subBlocks: [
      { id: 'claude-project', title: 'Claude Code', description: 'Implémente les features depuis les instructions et maquettes.', badge: 'agent-ai' },
      { id: 'node-modules', title: 'node_modules / DS', description: 'Package installé (Components, Docs).' },
      { id: 'pages-features', title: 'Pages & Features', description: 'Le code spécifique généré par Claude Code.' },
      { id: 'business-logic', title: 'Logique métier', description: 'State management, API. Principalement manuel.', badge: 'manual-developer' },
      { id: 'agent-config', title: 'Config agent', description: '.cursorrules, CLAUDE.md, refs Figma.', badge: 'setup' },
      { id: 'project-ci', title: 'Tests & CI/CD', description: 'Tests E2E, déploiements preview.', badge: 'automatic' },
    ]
  }
];

export const WORKFLOWS: Workflow[] = [
  {
    id: 'wf-new-component',
    title: 'Nouveau composant',
    steps: [
      {
        id: 'step1',
        title: 'Création du composant',
        description: 'Le designer construit le composant dans Figma avec toutes ses variantes.',
        badge: 'manual-designer',
        activeCards: ['figma-ds'],
        activeSubBlocks: ['components'],
        activeConnections: [],
        cameraFocus: 'single',
        focusCards: ['figma-ds']
      },
      {
        id: 'step2',
        title: 'Publication de la librairie',
        description: 'Le composant devient disponible pour toutes les maquettes.',
        badge: 'manual-designer',
        activeCards: ['figma-ds'],
        activeSubBlocks: [],
        activeConnections: [],
        cameraFocus: 'single',
        focusCards: ['figma-ds']
      },
      {
        id: 'step3',
        title: 'Propagation aux maquettes',
        description: 'Le composant est maintenant disponible en tant qu\'asset dans les fichiers de maquettes.',
        badge: 'automatic',
        activeCards: ['figma-ds', 'figma-file'],
        activeSubBlocks: ['ds-instances'],
        activeConnections: ['rel-figma-ds-file'],
        cameraFocus: 'dual',
        focusCards: ['figma-ds', 'figma-file']
      },
      {
        id: 'step4',
        title: 'Implémentation code',
        description: 'Claude Code lit la spec Figma via MCP et génère le composant React avec ses props et variantes.',
        badge: 'agent-ai',
        activeCards: ['figma-ds', 'react-ds'],
        activeSubBlocks: ['claude-ds', 'react-components'],
        activeConnections: ['rel-figma-ds-react-ds-2'],
        cameraFocus: 'dual',
        focusCards: ['figma-ds', 'react-ds']
      },
      {
        id: 'step5',
        title: 'Code Connect',
        description: 'Le mapping Figma ↔ React est créé et publié vers les serveurs Figma.',
        badge: 'setup',
        activeCards: ['react-ds', 'figma-ds'],
        activeSubBlocks: ['code-connect-map', 'code-connect-m'],
        activeConnections: ['rel-react-ds-figma-ds'],
        cameraFocus: 'dual',
        focusCards: ['react-ds', 'figma-ds']
      },
      {
        id: 'step6',
        title: 'Documentation agent',
        description: 'Le Design-System.md est mis à jour avec le nouveau composant et ses props.',
        badge: 'manual-developer',
        activeCards: ['react-ds'],
        activeSubBlocks: ['design-system-md'],
        activeConnections: [],
        cameraFocus: 'single',
        focusCards: ['react-ds']
      },
      {
        id: 'step7',
        title: 'Tests & publication',
        description: 'Le pipeline CI valide le composant puis publie une nouvelle version npm.',
        badge: 'automatic',
        activeCards: ['react-ds'],
        activeSubBlocks: ['tests-ci'],
        activeConnections: [],
        cameraFocus: 'single',
        focusCards: ['react-ds']
      },
      {
        id: 'step8',
        title: 'Disponible au projet',
        description: 'npm update : le composant est prêt à être utilisé dans l\'application.',
        badge: 'automatic',
        activeCards: ['react-ds', 'project'],
        activeSubBlocks: ['node-modules'],
        activeConnections: ['rel-react-ds-project-npm'],
        cameraFocus: 'dual',
        focusCards: ['react-ds', 'project']
      }
    ]
  },
  {
    id: 'wf-update-token',
    title: 'Mise à jour variable',
    steps: [
      {
        id: 'st-u1',
        title: 'Modification de la variable',
        description: 'Ex: `color/primary-500` passe de #3B82F6 à #2563EB.',
        badge: 'manual-designer',
        activeCards: ['figma-ds'],
        activeSubBlocks: ['figma-variables'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'st-u2',
        title: 'Propagation interne Figma',
        description: 'Tous les composants utilisant la variable se mettent à jour.',
        badge: 'automatic',
        activeCards: ['figma-ds'],
        activeSubBlocks: ['components'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'st-u3',
        title: 'Sync tokens → code',
        description: 'Claude Code lít les variables Figma et régénère `tokens.css`.',
        badge: 'agent-ai',
        activeCards: ['figma-ds', 'react-ds'],
        activeSubBlocks: ['design-tokens'],
        activeConnections: ['rel-figma-ds-react-ds-1'],
        cameraFocus: 'dual',
        focusCards: ['figma-ds', 'react-ds']
      },
      {
        id: 'st-u4',
        title: 'Propagation au projet',
        description: 'npm update : la nouvelle couleur est appliquée dans l\'app.',
        badge: 'automatic',
        activeCards: ['react-ds', 'project'],
        activeSubBlocks: ['node-modules'],
        activeConnections: ['rel-react-ds-project-npm'],
        cameraFocus: 'dual',
        focusCards: ['react-ds', 'project']
      }
    ]
  },
  {
    id: 'wf-update-component',
    title: 'Mise à jour composant',
    steps: [
      {
        id: 'upc1',
        title: 'Modification du composant',
        description: 'Ex: ajout d\'une prop `loading` au Button.',
        badge: 'manual-designer',
        activeCards: ['figma-ds'],
        activeSubBlocks: ['components'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'upc2',
        title: 'Vérification des maquettes',
        description: 'Les instances se mettent à jour. Les overrides cassés sont corrigés manuellement par le designer.',
        badge: 'manual-designer',
        activeCards: ['figma-ds', 'figma-file'],
        activeSubBlocks: ['ds-instances'],
        activeConnections: ['rel-figma-ds-file'],
        cameraFocus: 'dual',
        focusCards: ['figma-ds', 'figma-file']
      },
      {
        id: 'upc3',
        title: 'Mise à jour du code React',
        description: 'Claude Code adapte le composant React pour refléter les changements.',
        badge: 'agent-ai',
        activeCards: ['figma-ds', 'react-ds'],
        activeSubBlocks: ['claude-ds', 'react-components'],
        activeConnections: ['rel-figma-ds-react-ds-2'],
        cameraFocus: 'dual',
        focusCards: ['figma-ds', 'react-ds']
      },
      {
        id: 'upc4',
        title: 'Publication & Migration',
        description: 'Publication de la version. Le projet effectue une migration (avec l\'aide de l\'agent si breaking change).',
        badge: 'agent-ai',
        activeCards: ['react-ds', 'project'],
        activeSubBlocks: ['claude-project', 'node-modules'],
        activeConnections: ['rel-react-ds-project-npm'],
        cameraFocus: 'dual',
        focusCards: ['react-ds', 'project']
      }
    ]
  },
  {
    id: 'wf-new-feature',
    title: 'Nouvelle feature',
    steps: [
      {
        id: 'nf1',
        title: 'Design de la feature',
        description: 'Le designer compose les écrans en assemblant les instances du DS.',
        badge: 'manual-designer',
        activeCards: ['figma-file'],
        activeSubBlocks: ['feature-screens'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'nf2',
        title: 'Préparation agent',
        description: 'Vérifier que CLAUDE.md référence le bon fichier Figma MCP.',
        badge: 'setup',
        activeCards: ['project'],
        activeSubBlocks: ['agent-config'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'nf3',
        title: 'Lecture de la maquette',
        description: 'L\'agent lit le contexte de maquette. Les composants DS sont reconnus grâce à Code Connect.',
        badge: 'agent-ai',
        activeCards: ['figma-file', 'project'],
        activeSubBlocks: ['claude-project'],
        activeConnections: ['rel-figma-file-project'],
        cameraFocus: 'dual',
        focusCards: ['figma-file', 'project']
      },
      {
        id: 'nf4',
        title: 'Génération du code',
        description: 'L\'agent produit le code feature en utilisant les propriétés des composants DS.',
        badge: 'agent-ai',
        activeCards: ['project'],
        activeSubBlocks: ['pages-features'],
        activeConnections: [],
        cameraFocus: 'single'
      },
      {
        id: 'nf5',
        title: 'Logique métier',
        description: 'Le développeur implémente les hooks, la BDD, l\'état complexe.',
        badge: 'manual-developer',
        activeCards: ['project'],
        activeSubBlocks: ['business-logic'],
        activeConnections: [],
        cameraFocus: 'single'
      }
    ]
  }
];
